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
router.post('/get-upline', firewalls,  Users.GetUpline);

//transaksi
router.post('/transfer-saldo', firewalls,  Transaksi.TransferSaldo);
router.post('/qrcode-saldo', firewalls,  Transaksi.TransferSaldoQRCode);
router.post('/topup', firewalls,  Transaksi.IsiSaldo);

module.exports = router;