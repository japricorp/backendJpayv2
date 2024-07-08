const {query} = require("../utils/database")
const fcm = require("../utils/firebase")
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
    fcm.sendFCM(users[0].token,"2",invoice,"Penerimaan Saldo","Penerimaan saldo #"+invoice+"\nPenerimaan saldo sebesar "+amount+" berhasil")
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


exports.IsiSaldo = async (bank, amount, reff, phone, invoice) => {
  const deskripsi = `Pengisian saldo sebesar ${formatRupiah(amount)} melalui ${bank}`;
  const sql = `
    INSERT INTO transaksi
    (date, invoice, members, product, customers, sale, price, \`desc\`, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [dateNow,invoice,reff,'Pengisian Saldo',phone,amount,amount,deskripsi,7 ];
  try {
    const insert = await query(sql, values);
    return insert;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};


exports.Prabayar = async (product_name, produk,amount, reff, customer, invoice) => {
  const deskripsi = `Pembelian ${product_name}`;
  const sql = `
    INSERT INTO transaksi
    (date, invoice, members, product, customers, sale, price, \`desc\`, type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [dateNow,invoice,reff,produk,customer,amount,amount,deskripsi,1,0 ];
  try {
    const insert = await query(sql, values);
    const users = await query("SELECT * FROM members WHERE reff = ? ",[reff])
    const newBalance = parseFloat(users[0].sososo) - parseFloat(amount)
    const newTrx = parseFloat(users[0].trx_1) + parseFloat(amount)
    const update = await query("UPDATE members SET sososo = ?, trx_1 = ? WHERE reff= ?",[newBalance, newTrx, reff])
    return insert;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};


exports.Prabayar = async (product_name, produk,amount, reff, customer, invoice) => {
  const deskripsi = `Pembelian ${product_name}`;
  const sql = `
    INSERT INTO transaksi
    (date, invoice, members, product, customers, sale, price, \`desc\`, type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [dateNow,invoice,reff,produk,customer,amount,amount,deskripsi,1,0 ];
  try {
    const insert = await query(sql, values);
    const users = await query("SELECT * FROM members WHERE reff = ? ",[reff])
    const newBalance = parseFloat(users[0].sososo) - parseFloat(amount)
    const newTrx = parseFloat(users[0].trx_1) + parseFloat(amount)
    const update = await query("UPDATE members SET sososo = ?, trx_1 = ? WHERE reff= ?",[newBalance, newTrx, reff])
    return insert;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

exports.Pascabayar = async (product_name, produk,amount, reff, customer, invoice) => {
  const deskripsi = `Pembayaran ${product_name}`;
  const sql = `
    INSERT INTO transaksi
    (date, invoice, members, product, customers, sale, price, \`desc\`, type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [dateNow,invoice,reff,produk,customer,amount,amount,deskripsi,2,1 ];
  try {
    const insert = await query(sql, values);
    const users = await query("SELECT * FROM members WHERE reff = ? ",[reff])
    const newBalance = parseFloat(users[0].sososo) - parseFloat(amount)
    const newTrx = parseFloat(users[0].trx_1) + parseFloat(amount)
    const update = await query("UPDATE members SET sososo = ?, trx_1 = ? WHERE reff= ?",[newBalance, newTrx, reff])
    return insert;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};


exports.Produk = async (product_name, produk,amount, reff, customer, invoice) => {
  const deskripsi = `Pembelian ${product_name}`;
  const sql = `
    INSERT INTO transaksi
    (date, invoice, members, product, customers, sale, price, \`desc\`, type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [dateNow,invoice,reff,produk,customer,amount,amount,deskripsi,3,1 ];
  try {
    const insert = await query(sql, values);
    const users = await query("SELECT * FROM members WHERE reff = ? ",[reff])
    const newBalance = parseFloat(users[0].sososo) - parseFloat(amount)
    const newTrx = parseFloat(users[0].trx_3) + parseFloat(amount)
    const update = await query("UPDATE members SET sososo = ?, trx_3 = ?, type = 1 WHERE reff= ?",[newBalance, newTrx, reff])
    return insert;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};
