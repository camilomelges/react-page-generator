/*
    const tab = {
        variableToConcatInLabel: "variable that concats on label, ex.: dateFrom",
        label: "label of tab to show on front-end",
        value: "value of tab that comes from back-end",
        headers: [header], //List of headers of the tab
        subTabs: [tab], //"List of subtabs of the tab"
    }

    const header = {
        variableToConcatInLabel: "variable that concats on label, ex.: dateFrom",
        value: "value of header, the field that comes from back-end",
        label: "label of header, the label to show on ag-grid",
        format: "format of header"
    }
*/

import { getConcatVariables } from "../utils/headerUtils.js";
import getTabValueSeparatedByDot, { toCamelCase } from "../utils/tabUtils.js";

function getLabel(header) {
  return !header.variableToConcatInLabel
    ? header.label
    : `\`\${${header.variableToConcatInLabel}} ${header.label}\``;
}

export default function generateHeaders(tab, value) {
  return generateHeadersObject(tab, value);
}

function generateHeadersObject(tab, value) {
  let data = {};
  
  if (tab.headers && tab.headers.length) {
    let headers = {};
    tab.headers.forEach((header) => {
      headers[header.value] = generateHeaderObject(header, `${value}.${tab.value}`);
    });

    data[`${toCamelCase(value)} = (${getConcatVariables(tab.headers).join(", ")})`] = { 
      headers,
      groupHeaders: tab.groupHeaders,
      sumHeaders: tab.sumHeaders,
      hiddenHeaders: tab.hiddenHeaders
    }

    return data;
  }

  if (tab.subTabs && tab.subTabs.length) {
    tab.subTabs.forEach((subTab) => {
      data = { ...data, ...generateHeadersObject(subTab, `${value}.${subTab.value}`) };
    });
  }

  return data;
}

function generateHeaderObject(header) {
  const headerConent = {
    label: getLabel(header),
  };

  if (header.format) {
    headerConent.format = `${header.format}`;
  }

  return headerConent;
}
