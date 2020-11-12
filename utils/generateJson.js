const fs = require('fs');

const path = '../_data/data.json';

function generateData(fields, iterator) {
    const data = []
    for (let start = 0; start < iterator; start ++) {
        data.push(fields)
    }
}

try {
  if (fs.existsSync(path)) {
    //file exists
  } else {
    fs.writeFile(path, data, (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
  }
} catch (err) {
  console.error(err);
}
