import fs from "fs";
import { setTimeout } from "timers/promises";

/*
    const field = {
        name: "name of field",
        label: "label of field",
        defaultValue: "default value of field",
        inputType: "type of input for this field, types: 'select|text|date|datetime|checkbox'",
        listField: "list of select input, ex.: for inputType 'select' will need the values to search, so for the field portfolio, need the field portfolioList"
    }
*/

export default function generatePage(pageName, filterFields, apiPath) {
  let fileContent = generateImports(filterFields);
  fileContent += generateClazz(pageName, filterFields, apiPath);

  return fileContent.replace(/"([^"]+)":/g, "$1:");
}

function generateImports(filterFields) {
  let imports = 'import { Component } from "react";\n';
  imports += 'import _ from "lodash";\n';
  imports += 'import AbAgGrid from "src/Components/table/AbAgGrid";\n';

  if (filterFields.length) {
    imports += 'import AbFormFilter from "src/Components/forms/AbFormFilter";\n';
    imports += 'import AbSubmit from "src/Components/buttons/AbSubmit";\n';
  }

  imports += 'import ExportButton from "src/Components/buttons/ExportButton";\n';

  const date = filterFields.find((field) => field.inputType === "date");
  const datetime = filterFields.find((field) => field.inputType === "datetime");
  if (date || datetime) {
    imports += 'import moment from "moment";\n';

    if (date) {
      imports += 'import AbDatePicker from "src/Components/inputs/AbDatePicker";\n';
    }

    if (datetime) {
      imports += 'import AbDateTimePicker from "src/Components/inputs/AbDateTimePicker";\n';
    }
  }

  const select = filterFields.find((field) => field.inputType === "select");
  if (select) {
    imports += 'import AbSelect from "src/Components/inputs/AbSelect";\n';
  }

  const text = filterFields.find((field) => field.inputType === "text");
  if (text) {
    imports += 'import AbTextInput from "src/Components/inputs/AbTextInput";\n';
  }

  imports += 'import tabs from "./tabs";\n';

  return imports;
}

function generateClazz(pageName, filterFields, apiPath) {
  let clazz = `
    export default class ${pageName} extends Component {
      ${generateConstructor(pageName, filterFields)}\n
      ${generateGetActualTabFunctions()}\n
      ${generateGetParams(apiPath)}\n
      ${generateGetReportData(pageName, apiPath)}\n
      ${generateGetXmlUrl(apiPath)}\n
      ${generateComponentDidMount()}\n
      ${generateRender(filterFields)}
    };
  `;

  return clazz;
}

function generateComponentDidMount() {
  return `componentDidMount() {
      this.getParams();
    }`;
}

function generateFilters(filterFields) {
  const filter = {};
  filterFields.forEach((field) => {
    filter[field.value] = field.defaultValue;
  });

  return filter;
}

function getUniqueKeysFromStr(str) {
  str = str.toString().match(/(?<=tabFunction, ).*?(?=\))/s, "") || [];
  str = str.join().replaceAll(" ", "").split(",");

  return [...new Set(str)];
}

function getTabsParameters(pageName) {
  const tabsContent = fs.readFileSync(`./target/${pageName}/tabs.js`).toString();

  const tabsParams = getUniqueKeysFromStr(tabsContent);
  tabsParams.forEach((tabParam) => {
    tabParam = `this.state.filter.${tabParam}`;
  });

  return tabsParams;
}

function generateConstructor(pageName, filterFields) {
  let tabsParams = getTabsParameters(pageName);
  tabsParams = tabsParams.length ? `, ${tabsParams.join(", ")}` : "";

  let state = () => ({
    data: {},
    loading: false,
    filter: filters,
    tabs: tabs(this.setActualTabstabsParams),
    actualTab: tabs(this.setActualTabstabsParams)[0],
    actualSubTab: tabs(this.setActualTabstabsParams)[0].subTabs[0],
  });

  state = state
    .toString()
    .replace("() => (", "")
    .replace("})", "}")
    .replace("filters", JSON.stringify(generateFilters(filterFields).valueOf()));

  const constructor = `
    constructor() {
      super();
      this.state = ${state}
    }`;

  return constructor.replaceAll("tabsParams", tabsParams);
}

function generateGetActualTabFunctions() {
  const getActualTabs = (values) => {
    values = values.split(".");
    const actualTab = _.find(this.state.tabs, (tab) => tab.value === values[0]);
    const actualSubTab = _.find(actualTab.subTabs, (subTab) => subTab.value === values[1]);
    return { actualTab, actualSubTab };
  };

  const setActualTabs = (values) => {
    this.setState(this.getActualTabs(values));
  };

  let functions = `getActualTabs = ${getActualTabs.toString()};

    setActualTabs = ${setActualTabs.toString()};`;

  return functions;
}

function generateGetReportData(pageName, apiPath) {
  let url = "`" + `${apiPath}` + "${this.getQueryParams()}`";
  let tabsParams = getTabsParameters(pageName);
  tabsParams = tabsParams.length ? `, ${tabsParams.join(", ")}` : "";

  const getReportData = async () => {
    try {
      this.setState({ loading: true, data: {} });
      const { data } = await get(url);
      this.setState({ data });
    } finally {
      this.setState({ tabs: tabs(this.setActualTabstabsParams) });

      setTimeout(() => {
        const values = `${this.state.actualTab.value}.${this.state.actualSubTab.value}`;
        this.setActualTabs(values);

        this.setState({ loading: false });
      }, 0.4);
    }
  };

  const functions = `getReportData = ${getReportData.valueOf()};`;

  return functions
    .replaceAll('"tabs(', "tabs(")
    .replaceAll('"', "")
    .replace("url", url)
    .replace("tabsParams", tabsParams);
}

function generateGetParams(apiPath) {
  const getParams = async () => {
    const { data } = await get("apiPath/parameters");
    this.setState({ filter: { ...this.state.filter, ...data } });
  };

  return `getParams = ${getParams.toString()};`.replace("apiPath", apiPath);
}

function generateGetXmlUrl(apiPath) {
  let url = "`" + `${apiPath}/xml` + "${this.getQueryParams()}&actualTab=${this.state.actualTab.value}`";

  const getXmlUrl = () => {
    return url;
  };

  return `getXmlUrl = ${getXmlUrl.valueOf()};`.replace("url", url);
}

function generateRender(filterFields) {
  const abFormFilter = filterFields.length ? generateAbFormFilter(filterFields) : "";
  const abAgGrid = generateAbAgGrid();

  const render = `render() {
    return (
      <>
        ${abFormFilter}
        ${abAgGrid}
      </>
    );
  }`;

  return render;
}

function generateAbFormFilter(filterFields) {
  let filterInputs = "";
  filterFields.forEach((field) => {
    filterInputs += `${generateInput(field)}\n`;
  });

  const abFormFilter = `<AbFormFilter onSubmit={this.getReportData}>
    ${filterInputs}
    <AbSubmit xs={6} sm={6} md={1} xl={1} label={"go"} />
    <ExportButton xs={6} sm={6} md={1} xl={1} label={"Export XML"} url={this.getXmlUrl()} />
  </AbFormFilter>`;

  return abFormFilter;
}

function generateInput(field) {
  switch (field.inputType) {
    case "text":
      return generateAbTextInput(field);
    case "select":
      return generateAbSelect(field);
    default:
      console.error(`the field not have inputType, or is not implemented yet '${JSON.stringify(field)}'`);
      return "";
  }
}

function generateAbAgGrid() {
  const abAgGrid = `<AbAgGrid>
    loading={this.state.loading}
    tabs={this.state.tabs}
    data={this.state.data[this.state.actualTab.value]}
    headers={this.state.actualSubTab.headers}
    grouper={this.state.actualSubTab.groupHeaders}
    sumHeaders={this.state.actualSubTab.sumHeaders}
    hiddenHeaders={this.state.actualSubTab.hiddenHeaders}
  </AbAgGrid>`;

  return abAgGrid;
}

function generateAbTextInput(field) {
  const abTextInput = `<AbTextInput
    xl={3} md={3} sm={12} xs={12}
    label={"${field.label}"}
    value={this.state.filter.${field.value}}
    onChange={(${field.value}) => this.setState({ filter: { ...this.state.filter, ${field.value} }})}
  />`;

  return abTextInput;
}

function generateAbSelect(field) {
  const abTextInput = `<AbSelect
    xl={3} md={3} sm={12} xs={12}
    label={"${field.label}"}
    value={this.state.filter.${field.value}}
    values={this.state.filter.${field.listField}}
    onChange={(e) => this.setState({ filter: { ...this.state.filter, ${field.value}: e.target.value }})}
  />`;

  return abTextInput;
}
