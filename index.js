const fs = require("fs");
const xlsx = require("node-xlsx");

const removeEndEmpty = (arr) => {
  const isNoData = (x) => !x || (Array.isArray(x) && x.length === 0);
  let len = arr.length;
  while (isNoData(arr[len])) len--;
  return arr.slice(0, len + 1);
};

const sheets = (filePath) => {
  return xlsx.parse(filePath);
};

const parseSheet = (sheet) => {
  const config = {
    keyword: {
      text: "$i18nKey",
      cellIndex: null,
      rowIndex: null,
    },
    // data[sheetName][langCode][i18nKey]
    data: {},
  };

  console.log(sheet.name);
  const sheetName = sheet.name.toLowerCase();
  const rows = removeEndEmpty(sheet.data);
  // key: cellIndex, value: lang code
  let indexLangCodeMap = {};

  config.data[sheetName] = {};
  rows.forEach((row, rowIndex) => {
    const i18nKey = row[config.keyword.cellIndex];

    row.forEach((cell, cellIndex) => {
      if (cell === config.keyword.text) {
        config.keyword.cellIndex = cellIndex;
        config.keyword.rowIndex = rowIndex;
      }
      const isLangCode =
        cellIndex > config.keyword.cellIndex &&
        rowIndex === config.keyword.rowIndex;
      if (isLangCode) {
        config.data[sheetName][cell] = {};
        indexLangCodeMap[cellIndex] = cell;
      }
      const isValue =
        cellIndex > config.keyword.cellIndex &&
        rowIndex > config.keyword.rowIndex;
      if (i18nKey && isValue) {
        const langCode = indexLangCodeMap[cellIndex];
        config.data[sheetName][langCode][i18nKey] = cell;
      }
    });
  });
};

for (let i = 1; i < 8; i++) {
  fs.writeFile(
    "./" + temp[i] + ".js",
    "export default" + JSON.stringify(result[temp[i]]),
    function (err) {
      if (err) {
        throw err;
      }

      console.log("Saved.");
    }
  );
}
