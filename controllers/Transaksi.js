const InsertDB = require('../utils/InsertTransaction')
const Flip = require('../utils/Flip');
const CekTagihan = require('../digiflazz/CekTagihan');
const Pulsa = require('../digiflazz/Pulsa');

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
	const {bank, amount, reff, phone, invoice} = req.body
	const pengisian = InsertDB.IsiSaldo(bank, amount, reff, phone, invoice)
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
        res.json(hasil);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}