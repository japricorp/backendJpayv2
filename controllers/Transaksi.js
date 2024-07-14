const InsertDB = require('../utils/InsertTransaction')
const Flip = require('../utils/Flip');
const CekTagihan = require('../digiflazz/CekTagihan');
const Pulsa = require('../digiflazz/Pulsa');
const Bayar = require('../digiflazz/BayarTagihan');
const { messaging } = require('firebase-admin');
const { query } = require('../utils/database');
const fcm = require("../utils/firebase");

exports.TransferSaldo = async(req,res)=>{
	const {receiver_name, sender_name,amount, reff_receiver,phone_receiver,reff, phone, invoice} = req.body
	const pengiriman = InsertDB.PengirimanSaldo(receiver_name, amount, reff, phone, invoice)
	const penerimaan = InsertDB.PenerimaanSaldo(sender_name, amount, reff_receiver, phone_receiver, invoice)
	res.json({code:200,message:"Pengiriman Saldo berhasil dilakukan",data:null})
}

exports.TransferSaldoQRCode = async(req,res)=>{
	const {receiver_name, sender_name,amount, reff_receiver,phone_receiver,reff, phone, invoice} = req.body
	const pengiriman = InsertDB.PengirimanSaldoQRCode(receiver_name, amount, reff, phone, invoice)
	const penerimaan = InsertDB.PenerimaanSaldoQRCode(sender_name, amount, reff_receiver, phone_receiver, invoice)
	res.json({code:200,message:"Pengiriman Saldo berhasil dilakukan",data:null})
}


exports.IsiSaldo = async(req,res)=>{
	const {bank, amount, admin,reff, phone, invoice} = req.body
	const pengisian = InsertDB.IsiSaldo(bank, amount, admin,reff, phone, invoice)
	if (bank == "QRIS") {
		const url = await Flip.sendFlip(amount, invoice)
		res.json({code:200,message:"Silahkan lanjutkan proses",data:url})
	}else{
		res.json({code:200,message:"Silahkan lanjutkan proses",data:null})
	}
	
}
exports.CekPasca = async(req,res)=>{
	const {produk,number, invoice} = req.body
	try {
        const hasil = await CekTagihan.check(produk, number, invoice);
        res.json(hasil);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.beliPulsa = async(req,res)=>{
	const {product_name,produk,reff,number, amount,invoice} = req.body
	try {
        const hasil = await Pulsa.Beli(produk, number, invoice);
		const penerimaan = InsertDB.Prabayar(product_name,produk, amount, reff, number, invoice)
		console.log(hasil)
        res.json(hasil);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.cekPulsa = async(req,res)=>{
	const {produk,number, invoice} = req.body
	try {
        const hasil = await Pulsa.Beli(produk, number, invoice);
		const row = hasil.data
		if(row.rc == "00"){
			await query("UPDATE transaksi SET status = 1, sn = ? WHERE invoice = ?",[row.sn,row.ref_id])
		}
		
        res.json(hasil);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}


exports.cekTransaksi = async(req,res)=>{
	const {invoice} = req.body
	const hasil = await query("SELECT * FROM transaksi WHERE invoice = ?",[invoice])
	let status
	if(hasil[0].status == 0){
		status = "Masih diproses"
		res.json({code:203,message:"Transaksi "+invoice+" "+status,data:hasil[0].status});
	}else if (hasil[0].status == 1){
		status = "Berhasil"
		res.json({code:200,message:"Transaksi "+invoice+" "+status,data:hasil[0].status});
	}else{
		status = "Gagal"
		res.json({code:203,message:"Transaksi "+invoice+" "+status,data:hasil[0].status});
	}
	
}

exports.beliProduk = async(req,res)=>{
	const {product_name,produk,reff,number, amount,invoice} = req.body
	try {
		const penerimaan = await InsertDB.Prabayar(product_name,produk, amount, reff, number, invoice)
        res.json({code:200,message:"Pembelian Produk Digital Berhasil",data:null});
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

exports.bayarTagihan = async(req,res)=>{
	const {product_name,produk,reff,number, amount,invoice} = req.body
	try {
        const hasil = await Bayar.Bayar(produk, number, invoice);
		const penerimaan = InsertDB.Pascabayar(product_name,produk, amount, reff, number, invoice)
		await bonus.BonusPrabayar(reff,invoice)
        res.json(hasil);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}
const BonusTopUp = [
    { level: 1, amount: 700 },
    { level: 2, amount: 200 },
    { level: 3, amount: 100 },
    { level: 4, amount: 100 },
    { level: 5, amount: 100 }
];
exports.callbackFlip = async(req,res)=>{
	const {invoice} = req.body
	try {
        const trx = await query("SELECT * FROM transaksi WHERE invoice = ?",[invoice]);
		const users = await query("SELECT * FROM members WHERE reff = ?",[trx[0].members])
		await query("UPDATE transaksi SET status = 1 WHERE invoice = ?",[invoice])
		const newBalance = parseFloat(users[0].sososo) + parseFloat(trx[0].sale)
		await query("UPDATE members SET sososo = ?, trx_7 = ? WHERE reff= ?",[newBalance, trx[0].sale, trx[0].members])
		fcm.sendFCM(users[0].token, "2", invoice, "Pengisian Saldo", `Pengisian Saldo #${invoice}\nsebesar ${trx[0].sale} berhasil ditambahkan ke saldo anda`);
		for (let i = 1; i <= BonusTopUp.length; i++) {
            const uplineField = (i === 1) ? 'upline' : `upline_${i}`;
            const bonus = BonusTopUp.find(b => b.level === i);
            if (users[0][uplineField] > 0 && bonus) {
                await IsiBonus(title, bonus.amount, users[0][uplineField], invoice);
                await sendNotification(users[0][uplineField], invoice, title, users[0].name,bonus.amount);
            }
        }
        res.json(hasil);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

const sendNotification = async (upline, invoice, title, senderName,amount) => {
    try {
        const down = await query("SELECT * FROM members WHERE reff = ?", [upline]);
        if (down.length > 0) {
            fcm.sendFCM(down[0].token, "2", invoice, title, `Voucher #${invoice}\nAnda mendapatkan voucher sebesar ${amount} dari transaksi ${senderName}`);
        }
    } catch (fcmError) {
        console.error("Error sending FCM notification:", fcmError, { upline, invoice });
    }
};

const IsiBonus = async (title, amount, receiver, invoice) => {
    const deskripsi = `${title} sebesar ${formatRupiah(amount)}`;
    const sql = `
        INSERT INTO transaksi
        (date, invoice, members, product, customers, sale, price, \`desc\`, type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [dateNow, invoice, receiver, title, receiver, amount, amount, deskripsi, 6, 1];
    try {
        const insert = await query(sql, values);
        return insert;
    } catch (error) {
        console.error("Error executing query:", error, { values });
        throw error;
    }
};