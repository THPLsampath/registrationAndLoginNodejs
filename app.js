const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');

const config = require('./config/database');
const user = require('./routes/users');

const app = express();
const PORT = 4000;
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
require('./config/pasport')(passport);


const connection = mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
if (connection) {
    console.log("database is connected");
} else {
    console.log("database is not connected");
}


app.use(express.static(path.join(__dirname, "public")));

app.use('/user', user);

app.get('/', (req, res) => {
    res.send("hello world");
})

app.listen(PORT, () => {
    console.log("server stating in port " + PORT);
});