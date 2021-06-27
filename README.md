# excel-i18n-tool
main(filePath: string, savePath: string, fileType: string)
filePath: excel path
savePath: save folder
fileTypeL json | js

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

