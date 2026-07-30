const { default: mongoose } = require("mongoose");

exports.dbConfig = () => {
  mongoose
    .connect(process.env.DB_HOST)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.error(err.message);
    });
};
