const {
    MongoClient
} = require('mongodb')
module.exports = run = function (context, req) {
    return MongoClient.connect("mongodb://erickwendel:Erick123@ds153980.mlab.com:53980/hackthonciab").then(client => {
        const collection = client.db('hackthonciab').collection('caixa')

        context.log('JavaScript HTTP trigger function processed a request.');
        return collection.insert([{
                "CAIXA": "CATEGORIAS",
                "Previsto": "Total",
                "Realizado": "Total"
            },
            {
                "CAIXA": "Saldo do M�s Anterior (totalizador)",
                "Previsto": "-",
                "Realizado": "-"
            },
            {
                "CAIXA": "Total de Recebimentos",
                "Previsto": "175.946,58",
                "Realizado": "57.530,85"
            },
            {
                "CAIXA": "Receitas de Vendas",
                "Previsto": "175.946,58",
                "Realizado": "57.530,85"
            },
            {
                "CAIXA": "Vendas",
                "Previsto": "175.946,58",
                "Realizado": "57.530,85"
            },
            {
                "CAIXA": "Saldo Inicial",
                "Previsto": "-",
                "Realizado": "-"
            },
            {
                "CAIXA": "Total de Pagamentos",
                "Previsto": "84.925,00",
                "Realizado": "34.827,00"
            },
            {
                "CAIXA": "Despesas de Produtos Vendidos",
                "Previsto": "-",
                "Realizado": "-"
            },
            {
                "CAIXA": "Fornecedor",
                "Previsto": "-",
                "Realizado": "-"
            },
            {
                "CAIXA": "Gera��o de Caixa do Per�odo (totalizador)",
                "Previsto": "175.946,58",
                "Realizado": "57.530,85"
            },
            {
                "CAIXA": "Total de Transfer�ncias",
                "Previsto": "-",
                "Realizado": "-"
            },
            {
                "CAIXA": "Saldo Final de Caixa (totalizador)",
                "Previsto": "358.737,42",
                "Realizado": "266.711,45"
            }
        ]).then(item => {
            context.res = {
                body: JSON.stringify(item)
            }

            context.done();
        })
    }).catch(error => {
        context.res = {
            status: 500,
            body: error
        };
        context.done();
    })
};

run({
    res: {},
    log: console.log,
    done: () => console.log(this.res)
})