'use strict'
const {
    MongoClient
} = require('mongodb')
const regression = require('regression')

class PredictionService {
    /**
     * @param {Object}  storage    Storages instances.
     * @param {Object}  repository Repositories instances.
     */

    static findByCNPJ(cnpj) {
        return MongoClient.connect("mongodb://erickwendel:Erick123@ds153980.mlab.com:53980/hackthonciab").then(client => {
            const collection = client.db('hackthonciab').collection('notas-fiscais')
            return collection.aggregate([{
                $match: {
                    'NF.nome': {
                        $regex: cnpj
                    }
                }
            }]).toArray()

        })
        // return this.$model.find({ 'NF.CNPJ': cnpj })
        //                   .lean()
    }
    static predict(cnpj, value) {
        return this.findByCNPJ(cnpj).then(history => {


            const dataset = history.map(item => {
                const date = item.NF.data.split('/')
                return [parseInt(date[1]), parseFloat(item.NF.valor)]
            })

            console.log(dataset)
            const model = regression.linear(dataset)
            // sorry, hight level gambiarra here
            const prediction = model.predict(dataset.length)
            const prediction1 = model.predict(dataset.length + 1)
            const prediction2 = model.predict(dataset.length + 2)

            const values = history.map(item => {
                return [item.NF.valor]
            })

            values.push([0])
            values.push([0])
            values.push([0])


            //[prediction[1], prediction[2], prediction[3]]
            const x = []
            for (var i = 0; i <= values.length - 3; i++) {
                x.push([0])
            }
            x.push([prediction[1]])
            x.push([prediction1[1]])
            x.push([prediction2[1]])


            return {
                datasets: [{
                        label: 'Original',
                        data: values
                    },
                    {
                        label: 'Predicted',
                        data: x
                    }
                ]
            }
        })

    }
}

const run = function (context, req) {
    PredictionService.predict(req.body.nome).then(result => {
        context.res = {
            body: JSON.stringify(result)
        }

        context.done();

    }).catch(error => {
        context.res = {
            status: 500,
            body: error
        };
        context.done();
    })
};

// run({

//     log: console.log,
//     done: () => console.log(this.res)
// }, {
//     body: {
//         nome: 'teste'
//     }
// })

module.exports = run;