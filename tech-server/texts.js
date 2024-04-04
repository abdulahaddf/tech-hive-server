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