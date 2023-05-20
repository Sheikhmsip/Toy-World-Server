const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 1000 ;


// middleware 
app.use(cors());
app.use(express.json());

// MongoDB Start 


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.vvvwsgj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const productsCollection = client.db('toysWorld').collection('products');

const toyCollection = client.db('toysWorld').collection('toys')

app.get('/products', async(req, res) =>{
  const cursor = productsCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})




// Add toy 
app.post('/toys', async(req, res) => {
  const toy = req.body;
  console.log(toy);
  const result = await toyCollection.insertOne(toy);
  res.send(result);
})


// Get toy
app.get('/toys', async(req, res) =>{
  const cursor = toyCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

// get update toy 

app.get('/toys/:id', async(req, res) =>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await toyCollection.findOne(query);
  res.send(result);
})

// Update Toy 

app.put('/toys/:id', async (req, res) => {

  const id = req.params.id;
  const filter = {_id: new ObjectId(id)};
  const options = { upsert: true};
  const updateToy = req.body;
  const toy = {
    $set: {
      title: updateToy.title,
      quantity: updateToy.quantity,
      price: updateToy.price,
      description: updateToy.description,
      photo: updateToy.photo,
      date: updateToy.date
    }
  }
  const result = await toyCollection.updateOne(filter, toy, options);
  res.send(result);
})

// Delete Toy 

app.delete('/toys/:id', async(req, res) =>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await toyCollection.deleteOne(query)
  res.send(result);
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// mongoDB End


app.get('/', (req, res) => {
    res.send('toys is running')
})

app.listen(port, () => {
    console.log(`toys server is running on port ${port}`)
})