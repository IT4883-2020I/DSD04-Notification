require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect(process.env.mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(`error: ${err}`));

// routes
app.use("/", require('./routes/test'));
app.use("/", require('./routes/notification'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is running on port ${port}`));

