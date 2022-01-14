const express = require("express");
const {MongoClient} = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = 7000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mydb2:mydb2@tourism.6wsqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// --------------**--------------

async function run() {
  try {
    await client.connect();
    const database = client.db("mydb2");
    const usersCollection2 = database.collection("users2");

    // const doc = {
    //   name: "ety",
    //   email: "ety143@gmail.com",
    //   phone: "01738003344",
    // };
    // const result = await usersCollection2.insertOne(doc);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);

    // Get api
    app.get("/users", async (req, res) => {
      const cursor = usersCollection2.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // --------------**--------------

    // get specifiq id
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const user = await usersCollection2.findOne(query);
      console.log("load user with id", id);
      res.send(user);
    });

    // --------------**--------------

    // post api

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection2.insertOne(newUser);
      console.log("hitting the post", req?.body);
      console.log("added user", result);
      res.json(result);

      // --------------**--------------

      // UPDATE API
      app.put("/users/:id", async (req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = {_id: ObjectId(id)};
        const options = {upsert: true};
        const updateDoc = {
          $set: {
            name: updatedUser.name,
            email: updatedUser.email,
          },
        };
        const result = await usersCollection2.updateOne(
          filter,
          updateDoc,
          options
        );
        console.log("updating user", req);
        res.json(result);
      });

      // --------------**--------------

      // DELETE API
      app.delete("/users/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await usersCollection2.deleteOne(query);
        console.log("delete user with id", result);
        res.json(result);
      });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// const uri =
//   "mongodb+srv://mydb1:mydb1@mydb1.yooxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// async function run() {
//   try {
//     await client.connect();
//     const database = client.db("mydb2");
//     const usersCollection2 = database.collection("users2");
//     // create a document to insert
//     const users2 = {
//       name: "ata",
//       email: "ata143@gmail.com",
//       phone: "01738003344",
//     };
//     const result = await usersCollection2.insertOne(users2);
//     console.log(`A document was inserted with the _id: ${result.insertedId}`);
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);

// --------------**--------------

app.get("/", (req, res) => {
  res.send("CRUD operation running");
});

// --------------**--------------

// username= mydb2
// pw=mydb2

app.listen(port, () => {
  console.log("Running server on port", port);
});

// --------------**--------------
