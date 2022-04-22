/*
    const tab = {
        variableToConcatInLabel: "variable that concats on label, ex.: dateFrom",
        label: "label of tab to show on front-end",
        value: "value of tab that comes from back-end",
        headers: [header], //List of headers of the tab
        subTabs: [tab], //"List of subtabs of the tab"
    }
*/

import { getConcatVariables } from "../utils/headerUtils.js";
import getTabValueSeparatedByDot, { toCamelCase } from "../utils/tabUtils.js";

function getLabel(tab) {
  return !tab.variableToConcatInLabel ? tab.label : `${tab.variableToConcatInLabel} ${tab.label}`;
}

export default function generateTab(tab, value) {
  const valueForFunction = getTabValueSeparatedByDot({ ...tab }, value);

  const tabContent = {
    label: `${getLabel(tab)}`,
    value: `${tab.value}`,
    onClick: `() => tabFunction('${valueForFunction}')`,
  };

  if (tab.subTabs && tab.subTabs.length) {
    tabContent.subTabs = [];
    tab.subTabs.forEach((subTab) => {
      tabContent.subTabs.push(generateTab(subTab, `${value}.${subTab.value}`));
    });
  }

  if (tab.headers && tab.headers.length) {

    const camelValueForFunction = toCamelCase(valueForFunction);

    const concatVariables = getConcatVariables(tab.headers).join(", ");
    tabContent.headers = `${camelValueForFunction}(${concatVariables}).headers`;
    tabContent.groupHeaders = `${camelValueForFunction}(${concatVariables}).groupHeaders`;
    tabContent.sumHeaders = `${camelValueForFunction}(${concatVariables}).sumHeaders`;
    tabContent.hiddenHeaders = `${camelValueForFunction}(${concatVariables}).hiddenHeaders`;
  }

  return tabContent;
}