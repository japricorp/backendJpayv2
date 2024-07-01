const {query} = require("./database")

async function generateAndCheckOTP() {
    let otp = generateRandomOTP();
    let queryStr = `SELECT * FROM otp WHERE code = ? AND status = 0`;
    
    try {
      let results = await query(queryStr, [otp]);
      while (results.length > 0) {
        otp = generateRandomOTP();
        results = await query(queryStr, [otp]);
      }
  
      // Jika OTP belum ada (results.length === 0), return OTP
      return otp;
    } catch (error) {
      throw error;
    }
  }
  
  function generateRandomOTP() {
    return Math.floor(10000 + Math.random() * 90000);
  }
  
  module.exports = {
    generateAndCheckOTP
  };