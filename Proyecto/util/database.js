// const sql = require('mssql');

//  const pool = new sql.ConnectionPool('mssql://Equip01:hihokeyo@10.25.18.106:10433/Equip01'); 

// // const poolPromise =  sql.connect('mssql://Equip01:hihokeyo@10.25.18.106:10433/Equip01')


// // poolPromise.then((consulta) => {
// //     return sql.query(consulta)
// //   }).then(result => {
// //     console.log(result)
// //   })
  
// //   // when your application exits
// //   poolPromise.then(() => {
// //     return sql.close()
// //   })


// module.exports = pool

const sql = require('mssql')

async function prueba(consulta){
    try {
        // make sure that any items are correctly URL encoded in the connection string
        console.log("Conectando...");
        await sql.connect('mssql://Equip01:hihokeyo@10.25.18.106:10433/Equip01')
        console.log("Conectado!");
        // await sql.connect(
        //   {
        //     user: 'Equip01',
        //     password: 'hihokeyo', 
        //     server: '10.25.18.106',
        //     port: 10433,
        //     database: 'Equip01',
        //   }
        // )
        const result = await sql.query(consulta);
        console.log("Result de la consulta-");
        console.log(result)
        sql.close();
        console.log("SQL Close");
        return result;
    } catch (err) {
        console.log (err)
    }
}
module.exports = prueba;