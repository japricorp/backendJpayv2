require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.set('view engine', 'ejs');
const adb = require('adbkit');
const client = adb.createClient();
