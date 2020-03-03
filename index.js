const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
app.use(bodyParser())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://marmitaccb.netlify.com/');
    //res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATH, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

var db_config = {
    host: 'us-cdbr-iron-east-04.cleardb.net',
    port: '3306',
    user: 'b12178564d0ebd',
    password: 'a099b921',
    database: 'heroku_d03b6e012609670'
}
var conexao

connect = () => {

    conexao = mysql.createConnection(db_config)

    conexao.connect((err) => {
        if (err) {
            console.log('erro na conexão no banco');
            setTimeout(() => {
                connect()
            }, 10);
        }
    })

    conexao.on('error', (err) => {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect()
        } else {
            throw err
        }
    })
}

connect();

app.listen(process.env.PORT || 2222, () => {
    console.log('Servidor funcionando !')
})

app.get("/users", (req, res) => {
    const sql = "select * from users"
    conexao.query(sql, (erro, ln, cl) => {
        let resultMarmita = ln.reduce((t, v) => t + v.qdt_marmita, 0)
        let resultTotal = ln.reduce((t, v) => t + v.total, 0)
        const marmita = 300
        const marmitaAtual = marmita - resultMarmita
        const totalMoney = resultTotal
        res.json({
            dados: {
                totalMarmitas: marmita,
                totalMarmitasAtual: marmitaAtual,
                totalDinheiro: totalMoney
            },
            data: ln
        })
    })
})


app.get("/entrega", (req, res) => {
    const sql = "select * from users where entrega = 'Entrega residêncial'"
    conexao.query(sql, (erro, ln, cl) => {
        let resultMarmita = ln.reduce((t, v) => t + v.qdt_marmita, 0)
        res.json({
            dados: {
                totalMarmitas: resultMarmita,
            },
            data: ln
        })
    })
})

app.get("/retirada", (req, res) => {
    const sql = "select * from users where entrega = 'Retirada igreja'"
    conexao.query(sql, (erro, ln, cl) => {
        let resultMarmita = ln.reduce((t, v) => t + v.qdt_marmita, 0)
        res.json({
            dados: {
                totalMarmitas: resultMarmita,
            },
            data: ln
        })
    })
})

app.get("/doacao", (req, res) => {
    const sql = "select * from doacao"
    conexao.query(sql, (erro, ln, cl) => {
        let doacao = ln.reduce((t, v) => t + v.valor, 0)
        res.json({
            total: doacao
        })
    })
})

app.get("/relatorio", (req, res) => {
    const sql = "select * from users"
    conexao.query(sql, (erro, ln, cl) => {
        let resultMarmita = ln.reduce((t, v) => t + v.total, 0)
        res.json({
            dados: {
                totalMarmitas: resultMarmita,
            },
            data: ln
        })
    })
})


app.delete('/users/:id', (req, res) => {
    const id = req.params.id
    const sql = 'DELETE FROM users WHERE idusers = ?'
    conexao.query(sql, id, (err, results) => {
        if (err) throw err;
    });
    res.end()
});

app.get("/users/entregue", (req, res) => {
    const sql = "select * from entregas"
    conexao.query(sql, (erro, ln, cl) => {
        res.json(ln)
    })
})

app.post('/users/entregue/:id', (req, res) => {
    var id = req.params.id
    const sql = "INSERT INTO entregas (id_ok) VALUES (?);"
    conexao.query(sql, [id], (erro, result, fields) => {
    })
    res.end()
})

app.post('/users', (req, res) => {
    var name_user = req.body.name_user
    var qdt_marmita = req.body.qdt_marmita
    var entrega = req.body.entrega
    var endereco = req.body.endereco
    var total = req.body.total // calcular pelo front
    const sql = "INSERT INTO users (name_user, qdt_marmita, entrega, endereco, total) VALUES ( ?, ?, ?, ?, ?);"
    conexao.query(sql, [name_user, qdt_marmita, entrega, endereco, total], (erro, result, fields) => {
        if (erro) {
            res.sendStatus(500)
            return
        }
    })
    res.end()
})


app.post('/doacao', (req, res) => {
    var valor = req.body.valor
    const sql = "INSERT INTO doacao (valor) VALUES (?);"
    conexao.query(sql, [valor], (erro, result, fields) => {
    })
    res.end()
})

app.get("/users/entregue/motoboy", (req, res) => {
    const sql = "select * from entregaMotoboy"
    conexao.query(sql, (erro, ln, cl) => {
        res.json(ln)
    })
})

app.post('/users/entregue/motoboy/:id', (req, res) => {
    var id = req.params.id
    const sql = "INSERT INTO entregaMotoboy (id_ok) VALUES (?);"
    conexao.query(sql, [id], (erro, result, fields) => {
    })
    res.end()
})