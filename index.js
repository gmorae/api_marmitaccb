const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')


function conexao() {
    return mysql.createConnection({
        host: 'us-cdbr-iron-east-04.cleardb.net',
        port: '3306',
        user: 'b12178564d0ebd',
        password: 'a099b921',
        database: 'heroku_d03b6e012609670'
    })
}

app.listen(process.env.PORT || 8080, () => {
    console.log('Servidor funcionando !')
})

app.get("/", (req, res) => {
    const sql = "select * from users"
    conexao().query(sql, (erro, ln, cl) => {
        console.log("Listagem")
        res.json(ln)

    })
})

