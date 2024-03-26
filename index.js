const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
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
//get all phones
    app.get("/phones", async (req, res) => {
      const result = await phoneCollection
        .find()
        .sort({ createAt: -1 })
        .limit(20)
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


  //search phone
    app.get("/getphonesByText", async (req, res) => {
      console.log(req.query.name);
      let query = {};
      if (req.query?.name) {
        query = { name: req.query.name };
      }
      const result = await phoneCollection.find(query).toArray();
      res.send(result);
    });

//adding phone
    app.post("/phone", async (req, res) => {
      const newPhone = req.body;
    //   newPhone.price = parseFloat(req.body.price)
      newPhone.createAt = new Date();
      console.log(newPhone);
      const result = await phoneCollection.insertOne(newPhone);
      res.send(result);
    });


    // delete phone
    app.delete("/singlephone/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await phoneCollection.deleteOne(query);
      res.send(result);
    });



    // for updating phone details
    app.put("/updatephone/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const body = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            photo: body.photo,
            name: body.name,
            sellerName: body.sellerName,
            subCategory: body.subCategory,
            price: parseFloat(body.price),
            rating: body.rating,
            quantity: body.quantity,
            description: body.description,
          },
        };

        const result = await phoneCollection.updateOne(filter, updateDoc);
        if (result.modifiedCount > 0) {
          res.json({ message: "phone updated successfully" });
        } else {
          res.status(404).json({ message: "phone not found" });
        }
      } catch (error) {
        console.error("Error updating phone:", error);
        res.status(500).json({ message: "Internal server error" });
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

app.get("/", (req, res) => {
  res.send("phone server is running");
});

app.listen(port, () => {
  console.log(`phone Server is running on port: ${port}`);
});
