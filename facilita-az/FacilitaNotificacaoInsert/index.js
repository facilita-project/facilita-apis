const {
    MongoClient
} = require('mongodb')
module.exports = run = function (context, req) {
    MongoClient.connect("mongodb://erickwendel:Erick123@ds153980.mlab.com:53980/hackthonciab").then(client => {
        const collection = client.db('hackthonciab').collection('notificação')

        context.log('JavaScript HTTP trigger function processed a request.');
        collection.insert(req.body).then(item => {
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