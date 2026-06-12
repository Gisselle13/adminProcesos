const mysql = require('mysql');

const db = mysql.createConnection({
  host: '192.168.4.170',  
  user: 'shernand',
  password: 'chagus',
  database: 'BDCOMANDO',
  insecureAuth: true
});
db.connect(err => {
  if (err) throw err;
  console.log('✅ Conectado a servidor db');
});

module.exports = { db };
