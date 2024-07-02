const {query} = require("../utils/database")

const moment = require('moment-timezone')
const jakartaTime = moment.tz("Asia/Jakarta")
const dateTimeNow = jakartaTime.format("YYYY-MM-DD HH:mm:ss")

let response

exports.GetData = async (req,res)=>{
	const{phone} = req.body
	const check = await query("SELECT * FROM members WHERE phone = ?",[phone])
	if (check.length >0) {
		response = {code:200,message:"Data ditemukan",data:check[0]}
	}else{
		response = {code:203,message:"Dta tidak ditemukan",data:null}
	}
	res.json(response)
}

async function updateUplineLevels(memberId, currentReff, level) {
    if (level > 15 || !currentReff) {
        return;
    }
    try {
        const currentUpline = await query("SELECT * FROM members WHERE reff = ?", [currentReff]);
        if (currentUpline.length > 0) {
            let uplineField = `upline_${level}`;
            await query(`UPDATE members SET ${uplineField} = ? WHERE reff = ?`, [currentUpline[0].upline, memberId]);
            await updateUplineLevels(memberId, currentUpline[0].upline, level + 1);
        }
    } catch (error) {
        console.error('Error updating upline levels:', error);
    }
}

exports.SyncData = async (req,res)=>{
	const{phone} = req.body
	const check = await query("SELECT * FROM members WHERE phone = ?",[phone])
	if (check.length >0) {
		await updateUplineLevels(check[0].reff, check[0].upline, 2);
		response = {code:200,message:"Data ditemukan",data:check[0]}
	}else{
		response = {code:203,message:"No. Handphone tidak terdaftar",data:null}
	}
	res.json(response)
}

exports.GetUpline = async (req,res)=>{
	const{phone} = req.body
	const check = await query("SELECT * FROM members WHERE phone = ?",[phone])
	if (check.length >0) {
		const upline = await query("SELECT * FROM members WHERE reff = ? ",[check[0].upline]);
		response = {code:200,message:"Success",data:upline[0].phone}
	}else{
		response = {code:203,message:"Dta tidak ditemukan",data:null}
	}
	res.json(response)
}