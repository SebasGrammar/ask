const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Models
const User = require('./models/User');
const Thread = require('./models/Thread');
const Answer = require('./models/Answer');

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

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const threads = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/threads.json`, 'utf-8')
);

const answers = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/answers.json`, 'utf-8')
);

const importData = async () => {
  try {
    await User.syncIndexes();
    await User.create(users); // Refactor this! :D
    await Thread.create(threads);
    await Answer.create(answers);
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
    await Thread.deleteMany();
    await Answer.deleteMany();
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
