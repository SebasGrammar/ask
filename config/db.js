const mongoose = require('mongoose');

// In case you want to switch to another mongodb port, here's how: https://www.configserverfirewall.com/mongodb/change-mongodb-default-port/#:~:text=Change%20MongoDB%20Port%20on%20Windows&text=When%20connecting%20to%20the%20mongo,option%20of%20the%20mongo%20command

const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  console.log(
    `Connection with MongoDB established: ${connection.connection.host}`
  );
};

module.exports = connectDB;
