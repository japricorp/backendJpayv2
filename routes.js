const express = require('express');
const router = express.Router();
const { firewalls } = require('./utils/firewall');
const Auth = require("./controllers/Auth")
const Users = require("./controllers/Users")
const Transaksi = require("./controllers/Transaksi")

//auth
router.post('/auth', firewalls,  Auth.Login);
router.post('/logout', firewalls,  Auth.Logout);

//users
router.post('/get-data', firewalls,  Users.GetData);
router.post('/sync-data', firewalls,  Users.SyncData);


//transaksi
router.post('/transfer-saldo', firewalls,  Transaksi.TransferSaldo);
router.post('/qrcode-saldo', firewalls,  Transaksi.TransferSaldoQRCode);
module.exports = router;