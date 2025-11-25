// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'localhost',
//   port:'3305',
//   user: 'root',
//   password: 'Neilsoft@100',
//   database: 'sample',
// });

// const pool = mysql.createPool({
//   connectionLimit : 10,
//   host: 'localhost',
//   port : '3305',
//   user: 'root',
//   password: 'Neilsoft@100',
//   database: 'sample',  
//   waitForConnections : true,
//   queueLimit: 0,
// }) 

// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     throw err; 
//   }

//   // Ping the database to check the connection
//   connection.ping((pingErr) => {
//     connection.release(); // Release the connection back to the pool

//     if (pingErr) {
//       console.error('Error pinging MySQL:', pingErr);
//       throw pingErr;
//     }

//     console.log('Connected to MySQL and ping successful!');
//   });
// });

// // connection.connect((err) => {
// //     // connection.ping(reconnect=true,attempts=1, delay = 0);
// //   if (err) {
// //     console.error('Error connecting to MySQL:', err);
// //     throw err;
// //   }
// //   console.log('Connected to MySQL!');
// // });

// module.exports = connection;
 
const mysql = require('mysql2');

// Connection pool setup
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'mysql',
  port: 3305,
  user: 'root',
  password: 'Neilsoft@100',
  database: 'sample',
  waitForConnections: true,
  queueLimit: 0,
});

// Testing connection from the pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error getting connection from pool:', err);
    return;
  }

  // Ping the database to check the connection
  connection.ping((pingErr) => {
    connection.release(); // Release the connection back to the pool

    if (pingErr) {
      console.error('Error pinging MySQL:', pingErr);
      return;
    }

    console.log('Connected to MySQL and ping successful!');
  });
});

module.exports = pool;
