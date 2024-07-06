const axios = require('axios');
const crypto = require('crypto');

function createMD5Hash(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

async function check(produk, number, invoice) {
    try {
        const signature = createMD5Hash("yomonuDAGO0g1b8eece2-d7ca-5edb-abff-b197746f1134" + invoice);
        let data = JSON.stringify({
            "commands": "inq-pasca",
            "username": "yomonuDAGO0g",
            "buyer_sku_code": produk,
            "customer_no": number,
            "ref_id": invoice,
            "sign": signature
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.digiflazz.com/v1/transaction',
            headers: { 
              'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return error.request;
        } else {
            return error.message;
        }
    }
}

module.exports = { check };
