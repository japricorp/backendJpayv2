const {query} = require("../utils/database")

const moment = require('moment-timezone')
const jakartaTime = moment.tz("Asia/Jakarta")
const dateTimeNow = jakartaTime.format("YYYY-MM-DD HH:mm:ss")
const dateNow = jakartaTime.format("YYYY-MM-DD")

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number).replace(/\u00A0/, ' ').replace('Rp', 'Rp.');
};


exports.PenerimaanSaldo = async (sender_name, amount, reff_receiver, phone_receiver, invoice) => {
  const deskripsi = `Penerimaan Saldo dari ${sender_name} sebesar ${formatRupiah(amount)}`;
  const sql = `
    INSERT INTO transaksi
    (date, invoice, members, product, customers, sale, price, \`desc\`, type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [dateNow,invoice,reff_receiver,'Penerimaan saldo dari mitra Japri Pay',phone_receiver,amount,amount,deskripsi,7,1 ];
  try {
    const insert = await query(sql, values);
    const users = await query("SELECT * FROM members WHERE reff = ? ",[reff_receiver])
    const newBalance = parseFloat(users[0].sososo) + parseFloat(amount)
    const newTrx = parseFloat(users[0].trx_7) + parseFloat(amount)
    const update = await query("UPDATE members SET sososo = ?, trx_7 = ? WHERE reff= ?",[newBalance,newTrx,reff_receiver])
    return insert;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.PengirimanSaldo = async (receiver_name, amount, reff, phone, invoice) => {
  const deskripsi = `Pengiriman Saldo kepada ${receiver_name} sebesar ${formatRupiah(amount)}`;
  const sql = `
    INSERT INTO transaksi
    (date, invoice, members, product, customers, sale, price, \`desc\`, type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [dateNow,invoice,reff,'Pengiriman saldo dari mitra Japri Pay',phone,amount,amount,deskripsi,8,1 ];
  try {
    const insert = await query(sql, values);
    const users = await query("SELECT * FROM members WHERE reff = ? ",[reff])
    const newBalance = parseFloat(users[0].sososo) - parseFloat(amount)
    const newTrx = parseFloat(users[0].trx_8) + parseFloat(amount)
    const update = await query("UPDATE members SET sososo = ?, trx_8 = ? WHERE reff= ?",[newBalance, newTrx, reff])
    return insert;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};


exports.PenerimaanSaldoQRCode = async (sender_name, amount, reff_receiver, phone_receiver, invoice) => {
  const deskripsi = `Penerimaan Pembayaran QR Japri Pay dari ${sender_name} sebesar ${formatRupiah(amount)}`;
  const sql = `
    INSERT INTO transaksi
    (date, invoice, members, product, customers, sale, price, \`desc\`, type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [dateNow,invoice,reff_receiver,'Penerimaan Pembayaran QR Japri Pay',phone_receiver,amount,amount,deskripsi,7,1 ];
  try {
    const insert = await query(sql, values);
    const users = await query("SELECT * FROM members WHERE reff = ? ",[reff_receiver])
    const newBalance = parseFloat(users[0].sososo) + parseFloat(amount)
    const newTrx = parseFloat(users[0].trx_7) + parseFloat(amount)
    const update = await query("UPDATE members SET sososo = ?, trx_7 = ? WHERE reff= ?",[newBalance,newTrx,reff_receiver])
    return insert;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.PengirimanSaldoQRCode = async (receiver_name, amount, reff, phone, invoice) => {
  const deskripsi = `Pembayaran QR Japri Pay kepada ${receiver_name} sebesar ${formatRupiah(amount)}`;
  const sql = `
    INSERT INTO transaksi
    (date, invoice, members, product, customers, sale, price, \`desc\`, type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [dateNow,invoice,reff,'Pembayaran QR Japri Pay',phone,amount,amount,deskripsi,8,1 ];
  try {
    const insert = await query(sql, values);
    const users = await query("SELECT * FROM members WHERE reff = ? ",[reff])
    const newBalance = parseFloat(users[0].sososo) - parseFloat(amount)
    const newTrx = parseFloat(users[0].trx_8) + parseFloat(amount)
    const update = await query("UPDATE members SET sososo = ?, trx_8 = ? WHERE reff= ?",[newBalance, newTrx, reff])
    return insert;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};