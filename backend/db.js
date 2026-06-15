const mysql = require('mysql');

const db = mysql.createConnection({
  host: '192.168.4.170',  
  user: 'shernand',
  password: 'chagus',
  database: 'BDCOMANDO',
  insecureAuth: true
});
db.connect(err => {
  if (err) {
    console.error('Error MySQL:', err);
    return;
  }
  console.log('✅ Conectado a servidor db');
});

module.exports = { db };
