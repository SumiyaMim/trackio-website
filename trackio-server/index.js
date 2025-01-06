const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Database Connection
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

    // Get expenses
    app.get('/expenses', async (req, res) => {
        const cursor = expenseCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // Add a new expense
    app.post('/expenses', async (req, res) => {
        const expenseData = req.body;
        const result = await expenseCollection.insertOne(expenseData);
        res.send(result);
    })

   // Update an existing expense
    app.patch('/expenses/:id', async (req, res) => {
        const { id } = req.params;
        const updatedFields = req.body;  

        // Get the current time
        const currentDateTime = new Date();
        const hours = currentDateTime.getHours();
        const minutes = currentDateTime.getMinutes();
        const suffix = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 === 0 ? 12 : hours % 12;
        const formattedTime = `${hours12}:${minutes < 10 ? "0" + minutes : minutes} ${suffix}`;

        // Prepare updated data with new time
        const updatedData = {
            ...updatedFields,
            time: formattedTime, 
        };

        // Update the expense in the database
        const result = await expenseCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );

        res.send(result);
    });
    
    // Delete expense list
    app.delete('/expenses/:id', async (req, res) => {
      const { id } = req.params;
    
      const expense = await expenseCollection.findOne({ "list._id": id });
    
      if (!expense) {
        return res.status(404).send({ message: 'Expense not found' });
      }
    
      // Remove the specific item from the list
      const updatedResult = await expenseCollection.updateOne(
        { _id: expense._id },
        { $pull: { list: { _id: id } } }
      );
    
      const updatedExpense = await expenseCollection.findOne({ _id: expense._id });
    
      // Check if the list is empty
      if (updatedExpense.list.length === 0) {
        await expenseCollection.deleteOne({ _id: expense._id });
        return res.send({ message: "Expense deleted as the list is now empty" });
      }
    
      // Recalculate the total amount after deletion
      const updatedTotalAmount = updatedExpense.list.reduce(
        (total, item) => total + item.amount,
        0
      );
    
      await expenseCollection.updateOne(
        { _id: updatedExpense._id },
        { $set: { totalAmount: updatedTotalAmount } }
      );
    
      res.send(updatedResult);
    });      

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