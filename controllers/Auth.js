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
			await query("UPDATE members SET login_status = 1, date_login = ? WHERE phone = ?",[dateTimeNow,phone])
			const up = await query("SELECT * FROM members WHERE reff = ? ",[checkphone[0].upline])
			if (up.length > 0) {
				response = {code:200,message:"Anda berhasil login",data:checkphone[0],upline:up[0].phone}	
			}else{
				response = {code:200,message:"Anda berhasil login",data:checkphone[0],upline:"6281220729369"}
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