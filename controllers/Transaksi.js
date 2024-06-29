const InsertDB = require('../utils/InsertTransaction')
const Flip = require('../utils/Flip');

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
	}
	
}