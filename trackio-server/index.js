const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzggogk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const expenseCollection = client.db('TrackioDB').collection('expenses');

    // get expenses
    app.get('/expenses', async (req, res) => {
        const cursor = expenseCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // send expenses
    app.post('/expenses', async (req, res) => {
        const newExpense = req.body;
        const result = await expenseCollection.insertOne(newExpense);
        res.send(result);
    })
  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Trackio server is running')
})

app.listen(port, () => {
    console.log(`Trackio is running on port: ${port}`)
})