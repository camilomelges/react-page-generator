import generateHeaders from "../headers/index.js";
import generateTab from "../tabs/index.js";

/*
    const tab = {
        variableToConcatInLabel: "variable that concats on label, ex.: dateFrom",
        label: "label of tab to show on front-end",
        value: "value of tab that comes from back-end",
        headers: [header], //List of headers of the tab
        sumHeaders: [headerValues],
        groupHeaders: [headerValues],
        hiddenHeaders: [headerValues],
        subTabs: [tab], //"List of subtabs of the tab"
    }

    const header = {
        variableToConcatInLabel: "variable that concats on label, ex.: dateFrom",
        value: "value of header, the field that comes from back-end",
        label: "label of header, the label to show on ag-grid",
        format: "format of header"
    }
*/

function getTabsWithHeadersFromHtml() {
  let tabsAndHeaders = [];

  return tabsAndHeaders;
}

export default function generateTabsAndHeaders(tabs) {
  const targetTabs = [];
  let targetHeaders = {};

  tabs.forEach((tab) => {
    targetTabs.push(generateTab(tab, tab.value));
    targetHeaders = { ...generateHeaders(tab, tab.value), ...targetHeaders };
  });

  return {
    tabsContent: mountTabsContent(targetTabs, targetHeaders),
    headersContent: mountHeadersContent(targetHeaders),
  };
}

function getUniqueVariablesFromHeadersKeys(headersKeys) {
  headersKeys = headersKeys
    .toString()
    .match(/\(.*?\)/g, "")
    .join()
    .replaceAll(",()", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll(" ", "")
    .split(",");

  return [...new Set(headersKeys)];
}

function mountTabsContent(tabs, headers) {
  const headersKeys = getHeaderKeys(headers);
  const headersImport = headersKeys.toString().replaceAll(/=(.*?)\)/g, "");
  let variables = getUniqueVariablesFromHeadersKeys(headersKeys);
  variables = variables.length ? `, ${variables.join(',')}` : "";
  
  const tabsContent = `
    import {${headersImport}} from "./headers";

    const tabs = (tabFunction${variables}) => {
      return ${JSON.stringify(tabs)
        .replaceAll('"(', "(")
        .replaceAll(')"', ")")
        .replaceAll('headers":"', 'headers":')
        .replaceAll('.headers"', ".headers")
        .replaceAll('groupHeaders":"', 'groupHeaders":')
        .replaceAll('.groupHeaders"', ".groupHeaders")
        .replaceAll('sumHeaders":"', 'sumHeaders":')
        .replaceAll('.sumHeaders"', ".sumHeaders")
        .replaceAll('hiddenHeaders":"', 'hiddenHeaders":')
        .replaceAll('.hiddenHeaders"', ".hiddenHeaders")};
    }

    export default tabs;
  `;

  return tabsContent.replace(/"([^"]+)":/g, "$1:");
}

function mountHeadersContent(headers) {
  let headersContent = "";

  getHeaderKeys(headers).forEach((k, v) => {
    const headerData = JSON.stringify(headers[k].valueOf())
      .replaceAll('"`', "`")
      .replaceAll('`"', "`");
    headersContent += `
    export const ${k} => {
      return ${headerData};
    }
    `;
  });

  return headersContent.replace(/"([^"]+)":/g, "$1:");
}

function getHeaderKeys(headers) {
  return Object.keys(headers);
}
