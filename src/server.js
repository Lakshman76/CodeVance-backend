require("dotenv").config();
const app = require("./app");
const connectToDB = require("./config/db");

const PORT = process.env.PORT || 5001;
connectToDB()
  .then(() => {
    console.log("Connected to databse");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database", err);
  });
