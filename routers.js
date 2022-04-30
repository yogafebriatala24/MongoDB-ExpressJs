const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router()
const connection = require('./connection')

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get('/users', async (req, res) =>{
    try {
        if (connection.connect()){
            const db = connection.db('db_latihan')
            const users = await db.collection('users').find().toArray()
            res.send({data:users})
        }else {
            res.send({message:'Gagal'})
        }
    } catch (err) {
        res.send({message: err.message || "internal server error"})
    }
})

router.post("/users", async (req, res) => {
  try {
    if (connection.connect()) {
    const {name, age, status} = req.body
      const db = connection.db("db_latihan");
      const users = await db.collection("users").insertOne({
          name,
          age,
          status
      })
      console.log("users>>")
      console.log(users)
      res.send({ message:"berhasil ditambahkan" });
    } else {
      res.send({ message: "Gagal" });
    }
  } catch (err) {
    res.send({ message: err.message || "internal server error" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    if (connection.connect()) {
    const {id} = req.params
      const { name, age, status } = req.body;
      const db = connection.db("db_latihan");
      const users = await db.collection("users").updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            name,
            age,
            status,
          }
        }
      )
      if(users.modifiedCount === 1) {
          res.send({ message: "berhasil diedit" })
      } else {
          res.send({ message: "Gagal edit user" })
      }
    } else {
      res.send({ message: "Gagal" });
    }
  } catch (err) {
    res.send({ message: err.message || "internal server error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    if (connection.connect()) {
      const { id } = req.params;
      const db = connection.db("db_latihan");
      const users = await db.collection("users").deleteOne(
        { _id: ObjectId(id) });
      if (users.deletedCount === 1) {
        res.send({ message: "berhasil dihapus" });
      } else {
        res.send({ message: "Gagal hapus user" });
      }
    } else {
      res.send({ message: "Gagal" });
    }
  } catch (err) {
    res.send({ message: err.message || "internal server error" });
  }
});

module.exports = router