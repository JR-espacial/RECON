// const sql = require('mssql');

// const pool = new sql.ConnectionPool({
//     user: 'Equip01',
//     password: 'hihokeyo', 
//     server: '10.25.18.106',
//     database: 'Equip01',
// }); 

// const poolPromise= pool.connect();


// poolPromise.then(() => {
//     return sql.query('SELECT * FROM Empleado')
//   }).then(result => {
//     console.dir(result)
//   })
  
//   // when your application exits
//   poolPromise.then(() => {
//     return sql.close()
//   })


//module.exports = poolConnect

const sql = require('mssql')

async function prueba(){
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect('mssql://Equip01:hihokeyo@10.25.18.106:10433/Equip01')
        // await sql.connect(
        //   {
        //     user: 'Equip01',
        //     password: 'hihokeyo', 
        //     server: '10.25.18.106',
        //     database: 'Equip01',
        //   }
        // )
        const result = await sql.query`select * from Empleado `
        console.log(result)
    } catch (err) {
        console.log (err)
    }
}
module.exports = prueba();