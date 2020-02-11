const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
app.use(bodyParser())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATH, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})


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

app.get("/users", (req, res) => {
    const sql = "select * from users"
    conexao().query(sql, (erro, ln, cl) => {
        res.json(ln)
    })
})

app.post('/users', (req, res) => {
    var name_user = req.body.name_user
    var qdt_marmita = req.body.qdt_marmita
    var entrega = req.body.entrega
    var endereco = req.body.endereco
    const sql = "INSERT INTO users (name_user, qdt_marmita, entrega, endereco) VALUES ( ?, ?, ?, ?);"
    conexao().query(sql, [name_user, qdt_marmita, entrega, endereco], (erro, result, fields) => {
        if (erro) {
            res.sendStatus(500)
            return
        }
    })
    res.end()
})

app.get("/entrega", (req, res) => {
    const sql = "select * from users where entrega = 'Entrega residêncial'"
    conexao().query(sql, (erro, ln, cl) => {
        res.json(ln)
    })
})

app.get("/retirada", (req, res) => {
    const sql = "select * from users where entrega = 'Retirada igreja'"
    conexao().query(sql, (erro, ln, cl) => {
        res.json(ln)
    })
})