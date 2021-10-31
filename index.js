const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cmkkz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello Tourist. Welcome to De-tour!!!");
});
client.connect((err) => {
  const servicesCollection = client.db("de-tour").collection("service");
  const ordersCollection = client.db("de-tour").collection("orders");

  //  make route and get data
  app.get("/services", (req, res) => {
    servicesCollection.find({}).toArray((err, results) => {
      res.send(results);
    });
  });

  // get single service

  app.get("/singleService/:id", (req, res) => {
    console.log(req.params.id);
    servicesCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, results) => {
        res.send(results[0]);
      });
  });


  //Add a Service

  app.post("/add-service", (req, res) => {
    console.log(req.body);
    servicesCollection.insertOne(req.body).then((documents) => {
      res.send(documents.insertedId);
    });
  });

  //delete product from the database
  app.delete("/deleteOrder/:id", async (req, res) => {
    console.log(req.params.id);

    ordersCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result);
      });
  });


  //add order in database

  app.post("/add-orders", (req, res) => {
    ordersCollection.insertOne(req.body).then((result) => {
      res.send(result);
    });
  });


  // Email based data
  app.get("/login-orders", (req, res) => {
    ordersCollection.find({}).toArray((err, results) => {
    res.send(results);
    });
  });

  // get all order by email query
  app.get("/my-orders/:email", (req, res) => {
    console.log(req.params);
    ordersCollection
      .find({ email: req.params.email })
      .toArray((err, results) => {
        res.send(results);
      });
  });
});

app.listen(process.env.PORT || port);