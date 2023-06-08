require('dotenv').config()
const fs = require("fs");
const { GoogleSpreadsheet } = require('google-spreadsheet');

const config = {
  // ref: https://handsondataviz.org/google-sheets-api-key.html#google-sheets-api-key//
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  sheetUrl: process.env.sheetUrl,
  savePath: "./locales",
  fileType: "js", // fileType: json, js
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getSheetData = async (sheetUrl) => {
  const delayTime = 1200
  // https://docs.google.com/spreadsheets/d/<docID>/edit#gid=<sheetID>
  const docID = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)').exec(sheetUrl)[1]
  const doc = new GoogleSpreadsheet(docID);
  doc.useApiKey(config.GOOGLE_API_KEY);
  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);
  const result = []
  for (const sheet of Object.values(doc._rawSheets)) {
    const startTime = performance.now()
    const title = sheet._rawProperties.title
    try {
      const rows = await sheet.getRows()
      console.log('sheet name', title)
      result.push({
        name: title.toLowerCase(),
        data: rows.map(x => x._rawData)
      })
    } catch (error) {
      console.log(error.message);
    }
    const leftTime = (performance.now() - startTime)
    await sleep(leftTime > delayTime ? 0 : delayTime - leftTime)
    // break
  }
  return result
}


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

  // console.log(sheet.name);
  const sheetName = sheet.name;
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



const main = async () => {
  const { sheetUrl, savePath, fileType } = config
  // [lang]:{[sheetname]}:{[i18nkey]: value}
  const data = {}
  const sheets = await getSheetData(sheetUrl)

  sheets.forEach(sheet => parseSheet(sheet, data))
  // console.log(data)
  // fileType: json, js
  save(savePath,fileType, data)
}
main()