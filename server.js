require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const webpushHandler = require("./routes/webpush");

const app = express();

// middleware
app.use(cors());
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
// app.use("/test", require('./routes/test'));
app.use("/", require('./routes/notification'));
app.post("/subscribe", webpushHandler.handlePushNotificationSubscription);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is running on port ${port}`));

