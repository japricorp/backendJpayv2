const { query } = require("../utils/database");
const moment = require('moment-timezone');
const fcm = require("./firebase");

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

const BonusPraPasca = [
    { level: 1, amount: 100 },
    { level: 2, amount: 100 },
    { level: 3, amount: 50 },
    { level: 4, amount: 100 },
    { level: 5, amount: 50 },
    { level: 6, amount: 50 },
    { level: 7, amount: 50 },
    { level: 8, amount: 50 },
    { level: 9, amount: 100 },
];

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

const distributeBonus = async (reff, invoice, title) => {
    try {
        const users = await query("SELECT * FROM members WHERE reff = ?", [reff]);
        if (users.length === 0) {
            console.error("No users found with the provided reference:", reff);
            return;
        }
        for (let i = 1; i <= BonusPraPasca.length; i++) {
            const uplineField = (i === 1) ? 'upline' : `upline_${i}`;
            const bonus = BonusPraPasca.find(b => b.level === i);
            if (users[0][uplineField] > 0 && bonus) {
                await IsiBonus(title, bonus.amount, users[0][uplineField], invoice);
                await sendNotification(users[0][uplineField], invoice, title, users[0].name,bonus.amount);
            }
        }
    } catch (error) {
        console.error(`Error in ${title} function:`, error, { reff, invoice });
        throw error;
    }
};

exports.BonusPrabayar = async (reff, invoice) => {
    await distributeBonus(reff, invoice, "Voucher Prabayar");
};

exports.BonusPascabayar = async (reff, invoice) => {
    await distributeBonus(reff, invoice, "Voucher Pascabayar");
};
