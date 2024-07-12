require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const routes = require('./routes')
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.set('view engine', 'ejs');
const adb = require('adbkit');
const client = adb.createClient();
app.use('/api', routes);


const {query} = require('./utils/database')
const fcm = require("./utils/firebase")
const bonus = require("./utils/bonus")

app.post("/digiflazz",async(req,res)=>{
  const {data} = req.body
  const trx_id = data.trx_id;
  const ref_id = data.ref_id;
  const customer_no = data.customer_no;
  const buyer_sku_code = data.buyer_sku_code;
  const message = data.message;
  const status = data.status;
  const rc = data.rc;
  const buyer_last_saldo = data.buyer_last_saldo;
  const sn = data.sn;
  const price = data.price;
  const tele = data.tele;
  const wa = data.wa;
  const transaksi = await query("SELECT * FROM transaksi WHERE invoice = ?",[ref_id])
  const users = await query("SELECT * FROM members WHERE reff = ?",[transaksi[0].members])
  
  if(rc == "00"){
    await query("UPDATE transaksi SET status=1,sn= ? WHERE invoice = ?",[sn,ref_id])
    let type = transaksi[0].type+"";
    fcm.sendFCM(users[0].token,type,ref_id,"Transaksi Berhasil","Transaksi #"+ref_id+"\n"+transaksi[0].desc+" berhasil")
    await bonus.BonusPrabayar(transaksi[0].members,ref_id)
  }
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

const initializeSocket = require('./utils/socket');
const server = http.createServer(app);
const PORTS = process.env.PORTSOCKET
initializeSocket(server);
server.listen(PORTS, () => {
    console.log(`Server is running on port ${PORTS}`);
});