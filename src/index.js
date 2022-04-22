import fs from "fs";
import prettier from "prettier";
import generatePage from "./pages/index.js";
import generateTabsAndHeaders from "./generator/tabsHeaderGenerator.js";
import { apiPath, fields, pageName, tabs } from "./payloads/objects.js";

function getTabsWithHeadersFromHtml() {
  return tabs;
}

function getFormFieldsFromHtml() {
  return fields;
}

function getApiPath() {
  return apiPath;
}

function getPageName() {
  return pageName;
}

function start() {
  const pageName = getPageName();
  recreateDir(pageName);

  const tabs = getTabsWithHeadersFromHtml();
  const { tabsContent, headersContent } = generateTabsAndHeaders(tabs);
  
  const options = prettier.resolveConfig.sync(".prettierrc");

  writeFile(
    `${pageName}/headers.js`,
    prettier.format(headersContent, options)
  );
  writeFile(
    `${pageName}/tabs.js`,
    prettier.format(tabsContent, options)
  );

  const filterFields = getFormFieldsFromHtml();
  const apiPath = getApiPath();
  setTimeout(() => {
    const pageContent = generatePage(pageName, filterFields, apiPath);
    writeFile(
      `${pageName}/index.jsx`,
      prettier.format(pageContent, options)
    );
  }, 1000);
}

function createDir(dirName) {
  fs.mkdirSync(`./target/${dirName}`);
}

function deleteDir(dirName) {
  fs.rmSync(`./target/${dirName}`, { recursive: true });
}

function recreateDir(dirName) {
  try {
    createDir(dirName);
  } catch {
    deleteDir(dirName);
    createDir(dirName);
  }
}

function writeFile(fileName, content) {
  fs.writeFile(`./target/${fileName}`, content, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

start();
