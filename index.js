const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
//const uri =
//"mongodb+srv://root:12345@malesh.jgchm3j.mongodb.net/?retryWrites=true&w=majority";

const uri =
  process.env.MONGO_URI ||
  "mongodb://fitki-db:tK0vaMQjgNIBKs5bULcqR2A28bxc6sLtfTRPAjzHMCB74aCJcWxkZLElmgWrIVSUWDZLW2xo2938ACDbPxzqwA==@fitki-db.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@fitki-db@";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function main() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    let db = client.db("db");
    let userCol = db.collection("users");

    console.log("Database connected !");

    const addDoc = async (data) => {
      try {
        let feedback = await userCol.insertOne({ ...data });
        console.log(feedback);

        return feedback;
      } catch (e) {
        console.log("Error While adding the doc in the collection : ", e);
      }
    };

    const getDocs = async (email) => {
      try {
        if (email) {
          let feedback = await userCol.find({ email: email }).toArray();
          return feedback;
        } else {
          let feedback = await userCol.find().toArray();
          console.log("Feedback :", feedback);
          return feedback;
        }
      } catch (e) {
        console.log("Error While finding the doc in the collection : ", e);
      }
    };

    app.get("/", (req, res) => {
      res.json({ message: "Server is running!" });
    });

    // POST
    app.post("/e/add", async (req, res) => {
      console.log(req.body);
      const name = req.body.eName;
      const number = req.body.eRep;

      let result = await addDoc(req.body);
      res.json({ message: "Adding the excersie", result });
    });

    app.get("/e/all", async (req, res) => {
      let result = await getDocs();
      console.log("The DB Response : ", result);
      res.json({ message: "finding all docs", result });
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (e) {
    console.log(`Error Occured : `, e);
  }
}

main();
