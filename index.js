const fs = require("fs");
const xlsx = require("node-xlsx");

const removeEndEmpty = (arr) => {
  const isNoData = (x) => !x || (Array.isArray(x) && x.length === 0);
  let len = arr.length;
  while (isNoData(arr[len])) len--;
  return arr.slice(0, len + 1);
};

const parseSheet = (sheet, data) => {
  const config = {
    keyword: {
      text: "$i18nKey",
      cellIndex: null,
      rowIndex: null,
    },
  };

  console.log(sheet.name);
  const sheetName = sheet.name.toLowerCase();
  const rows = removeEndEmpty(sheet.data);
  // key: cellIndex, value: lang code
  let indexLangCodeMap = {};

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
        if (!data[cell]) {
          data[cell] = {}
        }
        data[cell][sheetName] = {}
        indexLangCodeMap[cellIndex] = cell;
      }
      const isValue =
        cellIndex > config.keyword.cellIndex &&
        rowIndex > config.keyword.rowIndex;
      if (i18nKey && isValue) {
        const langCode = indexLangCodeMap[cellIndex];
        data[langCode][sheetName][i18nKey] = cell;
      }
    });
  });
};


const save = (path, fileType, data) => {
  const filePrefix = {
    json: '',
    js: 'export default '
  }[fileType]

  Object.keys(data).forEach(lang => {
    const value = data[lang]
    fs.writeFile(
      `${path}/${lang}.${fileType}`,
      `${filePrefix}${JSON.stringify(value, null, 2)}`,
      function (err,data) {
        if (err) {
          return console.log(err);
        }
      }
    );
  })
}



const main = (filePath, savePath, fileType) => {
  // [lang]:{[sheetname]}:{[i18nkey]: value}
  const data = {}
  const sheets = xlsx.parse(filePath)
  sheets.forEach(sheet => parseSheet(sheet, data))
  // console.log(data)
  // fileType: json, js
  save(savePath,fileType, data)
}

module.exports = main