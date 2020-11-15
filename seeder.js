const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Models
const User = require('./models/User');

// Load env variables
dotenv.config({
  path: './config/config.env'
});

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const resources = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const importData = async () => {
  try {
    await User.create(resources);
    console.log('Data imported.');
    // process.exit(); // This line here is the reason why the averageCost wasn't being updated after importing the data through the seeder. I wonder why?
    // setTimeout?
    setTimeout(process.exit, 2000); // I need to refactor this! Read this: https://github.com/nodejs/node/issues/22088
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data deleted.');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const [, , command] = process.argv; // this is the same as process.argv[2]

if (command === 'import') {
  importData();
} else if (command === 'delete') {
  deleteData();
}
