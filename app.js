const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

const axios = require('axios');


require("dotenv").config();
app.use(express.json());


mongoose.connect(process.env.DB_STRING).then(() => {
  console.log("Successfully connected to DB");
})
  .catch((e) => {
    console.log("Error connecting to DB", e);
  });

const router = require("./routes/router");
app.use("/", router);


setInterval(async () => {
  await axios.get(process.env.SERVER_URL);
}, 10 * 10 * 1000);


app.get('/', (req, res) => {
  res.send('Running...');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});