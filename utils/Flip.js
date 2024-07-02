const axios = require('axios');

async function sendFlip(amount, invoice) {
    try {
        const response = await axios.post('https://japrichat.com/flip/inquiry', 
            new URLSearchParams({
                server: 1,
                amount: amount,
                invoice: invoice,
                desc: 'Pengisian Saldo Japri Pay'
            }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = { sendFlip };
