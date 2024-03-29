# excel-i18n-tool

main(filePath: string, savePath: string, fileType: string)

- filePath: excel path
- savePath: save folder
- fileType: 'json' | 'js'

### excel format

- $i18nKey: before this row & col can write any notes
- $i18nKey: row are locale
- $i18nKey: col are i18n key

| $i18nKey | en  | cn  |
| :------: | :-: | :-: |
|  test1   | en1 | cn1 |
|  test2   | en2 | cn2 |
|  test3   | en3 | cn3 |
|  test4   | en4 | cn4 |

### install

npm install git+${git url}#branch

```
npm install --save git+https://github.com/Blankchen/excel-i18n-tool#main
```

### use

create index.js file and node index.js

```
// index.js
tool = require('excel-i18n-tool')
// js format
tool('./source.xlsx', './', 'js')
// json format
tool('./source.xlsx', './', 'json')
```

### Google sheet api
https://github.com/theoephraim/node-google-spreadsheet  
npm i google-spreadsheet --save  
update config.GOOGLE_API_KEY & .configsheetUrl  
```
const config = {
  // ref: https://handsondataviz.org/google-sheets-api-key.html#google-sheets-api-key//
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  sheetUrl: process.env.sheetUrl,
  savePath: "./locales",
  fileType: "js", // fileType: json, js
}
```
 node googleSheet.js