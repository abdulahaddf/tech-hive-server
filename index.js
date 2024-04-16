const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

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
    // Connect the client to the server	(optional starting in v4.7)
    // client.connect((err) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    // });

    const phoneCollection = client.db("phoneDB").collection("phones");

    //adding phone
    app.post("/addPhone", async (req, res) => {
      try {
        const newPhone = req.body;
        console.log(newPhone);
        if (Object.keys(newPhone).length > 2) {
          newPhone.createdAt = new Date();
          console.log(newPhone);
          const result = await phoneCollection.insertOne(newPhone);
          console.log(result);
          res.send({ acknowledged: true, message: "Phone added successfully" });
        }
        // res.send({ acknowledged: false, message: "Phone is not added" });
      } catch (error) {
        console.error("Error adding phone:", error);
        res.status(500).send("Error adding phone");
      }
    });
    
    //get all phones
    app.get("/phones", async (req, res) => {
      const result = await phoneCollection
        .find()
        .sort({ createAt: -1 })
        .toArray();
      res.send(result);
    });
    //get phone by ID
    app.get("/phone/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await phoneCollection.findOne(query);
      res.send(result);
    });

    //get by brand
    app.get("/phonesCategory/:brand", async (req, res) => {
      console.log(req.params.id);
      const result = await phoneCollection
        .find({
          brand: req.params.brand,
        })
        // .limit(6)
        .toArray();
      res.send(result);
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

app.get("/", (req, res) => {
  res.send("phone server is running");
});

app.listen(port, () => {
  console.log(`phone Server is running on port: ${port}`);
});
