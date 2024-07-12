const { query } = require("../utils/database");
const moment = require('moment-timezone');

const jakartaTime = moment.tz("Asia/Jakarta");
const dateTimeNow = jakartaTime.format("YYYY-MM-DD HH:mm:ss");
const dateNow = jakartaTime.format("YYYY-MM-DD");

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number).replace(/\u00A0/, ' ').replace('Rp', 'Rp ');
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
const fcm = require("./firebase")

exports.BonusPrabayar = async (reff, invoice) => {
    try {
        const users = await query("SELECT * FROM members WHERE reff = ?", [reff]);
        if (users.length === 0) {
            console.error("No users found with the provided reference:", reff);
            return;
        }

        for (let i = 1; i < 6; i++) {
            let uplineField = `upline_${i}`;
            if (users[0][uplineField] > 0) {
                await IsiBonus("Voucher Prabayar", 50, users[0][uplineField], invoice);
                const down = await query("SELECT * FROM members WHERE reff = ?", [users[0][uplineField]]);
                fcm.sendFCM(down[0].token,"2",invoice,"Voucher Prabayar","Voucher #"+invoice+"\n anda mendapatkan voucher sebesar 50 dari transaksi "+users[0].name)
            }
        }
    } catch (error) {
        console.error("Error in BonusPrabayar function:", error, { reff, invoice });
        throw error;
    }
};
