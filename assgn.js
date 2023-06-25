const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 4000;
const url = 'mongodb+srv://b022110148:Rafiah@lymhyt.zvhvhpe.mongodb.net/';
const dbName = 'appointments';

app.use(express.json());

// Connect to MongoDB and assign the database to the db variable
async function connectToMongoDB() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Get all visitors
app.get('/visitor', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('visitor');
    const visitors = await collection.find({}).toArray();
    res.json(visitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read visitor by ID
app.get('/visitor/check/:_id', async (req, res) => {
  const visitorId = req.params._id;

  try {
    const db = await connectToMongoDB();
    const collection = db.collection('visitor');

    const visitor = await collection.findOne({ _id: new ObjectId(visitorId) });
    if (!visitor) {
      res.status(400).json({ error: 'Visitor not found' });
      return;
    }
    res.json(visitor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update visitor by ID
app.patch('/visitor/update/:_id', async (req, res) => {
  const visitorId = req.params._id;
  const updateData = req.body;

  try {
    const db = await connectToMongoDB();
    const collection = db.collection('visitor');

    const result = await collection.updateOne(
      { _id: new ObjectId(visitorId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      res.status(404).json({ error: 'Visitor not found' });
      return;
    }

    res.status(200).json({ message: 'Visitor information updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete visitor by ID
app.delete('/visitor/delete/:_id', async (req, res) => {
  const visitorId = req.params._id;

  try {
    const db = await connectToMongoDB();
    const collection = db.collection('visitor');

    const result = await collection.deleteOne({ _id: new ObjectId(visitorId) });

    if (result.deletedCount === 1) {
      res.json({ message: `Visitor with ID ${visitorId} has been deleted.` });
    } else {
      res.status(404).json({ error: 'Visitor not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the visitor.' });
  }
});

// Verify visitor
app.post('/update-verify', async (req, res) => {
  const { name, verify } = req.body;

  if (!name || !verify) {
    res.status(400).json({ error: 'Visitor name and verify status are required.' });
    return;
  }

  try {
    const db = await connectToMongoDB();
    const collection = db.collection('visitor');

    await collection.updateOne({ name }, { $set: { verify } });

    res.json({ message: 'Record updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
