const {query} = require("../utils/database")

const moment = require('moment-timezone')
const jakartaTime = moment.tz("Asia/Jakarta")
const dateTimeNow = jakartaTime.format("YYYY-MM-DD HH:mm:ss")

let response

exports.Login = async(req,res)=>{
	const {phone,password} = req.body
	const checkphone = await query("SELECT * FROM members WHERE phone = ?",[phone])
	if (checkphone.length > 0) {
		if (password == checkphone[0].password) {
			if(checkphone[0].login_status == 0){
				await query("UPDATE members SET login_status = 1, date_login = ? WHERE phone = ?",[dateTimeNow,phone])
				const up = await query("SELECT * FROM members WHERE reff = ? ",[checkphone[0].upline])
				if (up.length > 0) {
					response = {code:200,message:"Anda berhasil login",data:checkphone[0],upline:up[0].phone}	
				}else{
					response = {code:200,message:"Anda berhasil login",data:checkphone[0],upline:null}
				}
			}else{
				response = {code:204,message:"Akun anda sedang dipergunakan diperangkat lain",data:null}
			}
			
			
		}else{
			response = {code:203,message:"Password yang anda masukan tidak sesuai",data:null}	
		}
	}else{
		response = {code:203,message:"No. Handphone tidak terdaftar",data:null}
	}
	res.json(response)
}

exports.Logout = async(req,res)=>{
	const{phone} = req.body
	await query("UPDATE members SET login_status=0,date_login=NULL,date_logout=? WHERE phone = ?",[dateTimeNow,phone])
	response = {code:200,message:"Anda berhasil logout",data:null}
	res.json(response)
}

const codeOTP = require('../utils/generateAndCheckOTP');
const WhatsappSender = require("../utils/WhatsappSender");

exports.GetOtp = async(req,res)=>{
	const{phone} = req.body
	const code = await codeOTP.generateAndCheckOTP();
	let message = "Masukan kode OTP berikut *"+code+"*"
	const whatsappSender = new WhatsappSender(process.env.APIKEY_WA);
	const send = await whatsappSender.sendMessage(phone, message)
	const insert = await query("INSERT INTO otp (phone,code,type) VALUES (?,?,?)",[phone,code,"Reset Password"])
	response = {code:200,message:"Kode berhasil di kirim",data:null}
	res.json(response)
}

exports.ValidateOtp = async(req,res)=>{
	const{phone,code} = req.body
	const check = await query("SELECT * FROM otp WHERE phone = ? AND code = ?",[phone,code])
	if(check.length > 0){
		await query("UPDATE otp SET status = 1 WHERE phone = ? AND code = ? ",[phone,code])
		response = {code:200,message:"Kode yang anda masukan sesuai",data:null}
	}else{
		response = {code:203,message:"Kode yang anda masukan salah",data:null}
	}
	res.json(response)
}

exports.resetPassword = async(req,res)=>{
	const{phone,password,type} = req.body
	if(type == 1){
		await query("UPDATE members SET password = ?, login_status=0, date_login=NULL WHERE phone = ?",[password,phone])
		response = {code:200,message:"Password berhasil diperbaharui",data:null}
	}else{
		await query("UPDATE members SET password = ? WHERE phone = ?",[password,phone])
		response = {code:200,message:"Password berhasil diperbaharui",data:null}
	}
	res.json(response)
}

exports.GetOtpBlock = async(req,res)=>{
	const{phone} = req.body
	const code = await codeOTP.generateAndCheckOTP();
	let message = "Masukan kode OTP berikut *"+code+"*"
	const whatsappSender = new WhatsappSender(process.env.APIKEY_WA);
	const send = await whatsappSender.sendMessage(phone, message)
	const insert = await query("INSERT INTO otp (phone,code,type) VALUES (?,?,?)",[phone,code,"Reset Password Unblock"])
	response = {code:200,message:"Kode berhasil di kirim",data:null}
	res.json(response)
}