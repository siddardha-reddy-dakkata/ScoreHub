const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

require("dotenv").config();
app.use(express.json());

mongoose.connect("mongodb+srv://siddardhareddy2005:NZz6x5cPe4qtUzIk@scorehub.hd4oij5.mongodb.net/scorehub") .then(() => {
    console.log("Successfully connected to DB");
})
.catch((e) => {
  console.log("Error connecting to DB", e);
 });

const router = require("./routes/router");
app.use("/", router);
app.get('/', (req, res) => {
  res.send('Running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});