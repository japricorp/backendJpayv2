const express = require('express');
const router = express.Router();
const { firewalls } = require('./utils/firewall');
const Auth = require("./controllers/Auth")
const Users = require("./controllers/Users")
const Transaksi = require("./controllers/Transaksi")

//auth
router.post('/auth', firewalls,  Auth.Login);
router.post('/logout', firewalls,  Auth.Logout);
router.post('/get-otp', firewalls,  Auth.GetOtp);
router.post('/validate-otp', firewalls,  Auth.ValidateOtp);
router.post('/reset-password', firewalls,  Auth.resetPassword);
router.post('/get-otp-block', firewalls,  Auth.GetOtpBlock);

//users
router.post('/get-data', firewalls,  Users.GetData);
router.post('/sync-data', firewalls,  Users.SyncData);
router.post('/get-upline', firewalls,  Users.GetUpline);

//transaksi
router.post('/transfer-saldo', firewalls,  Transaksi.TransferSaldo);
router.post('/qrcode-saldo', firewalls,  Transaksi.TransferSaldoQRCode);
router.post('/topup', firewalls,  Transaksi.IsiSaldo);
router.post('/cek-tagihan', firewalls,  Transaksi.CekPasca);
router.post('/beli-pulsa', firewalls,  Transaksi.beliPulsa);
router.post('/cek-transaksi', firewalls,  Transaksi.cekTransaksi);
router.post('/cek-prabayar', firewalls,  Transaksi.cekPulsa);
router.post('/beli-produk', firewalls,  Transaksi.beliProduk);
router.post('/bayar-tagihan', firewalls,  Transaksi.bayarTagihan);

module.exports = router;