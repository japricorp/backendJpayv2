const express = require('express');
const router = express.Router();
const { firewalls } = require('./utils/firewall');
const Auth = require("./controllers/Auth")

router.post('/auth', firewalls,  Auth.Login);

module.exports = router;