const {
    MongoClient
} = require('mongodb')
module.exports = run = function (context, req) {
    MongoClient.connect("mongodb://erickwendel:Erick123@ds153980.mlab.com:53980/hackthonciab").then(client => {
        // console.log('client', client.db('hackathonciab').collection('notas-fiscais'))
        const collection = client.db('hackthonciab').collection('empresas')

        context.log('JavaScript HTTP trigger function processed a request.');
        collection.find({
            nome_fantasia: 'ART LOGIC'
        }).toArray().then(item => {
            console.log('item', item)
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

// run({
//     res: {},
//     log: console.log,
//     done: () => console.log(this.res)
// })