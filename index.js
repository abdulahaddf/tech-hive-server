const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Set custom headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allow specified HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specified headers
  next();
});

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@phonedb.ap54ge1.mongodb.net/?retryWrites=true&w=majority&appName=PhoneDB`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    const phoneCollection = client.db("phoneDB").collection("phones");

    // Adding phone
    app.post("/addPhone", async (req, res) => {
      try {
        const newPhone = req.body;
        if (Object.keys(newPhone).length > 2) {
          newPhone.createdAt = new Date();
          const result = await phoneCollection.insertOne(newPhone);
          res.send({ acknowledged: true, message: "Phone added successfully" });
        }
      } catch (error) {
        console.error("Error adding phone:", error);
        res.status(500).send("Error adding phone");
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Define your routes here

// Start the server
app.listen(port, () => {
  console.log(`Phone server is running on port: ${port}`);
});
