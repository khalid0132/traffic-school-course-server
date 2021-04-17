const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require ('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// console.log(process.env.DB_USER);

app.use(cors());
app.use(bodyParser.json());


const port =  process.env.PORT || 7200;

app.get('/', (req, res) => {
  res.send('Hello SWEDEN!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2l8hb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const courseCollection = client.db("trafficSchool").collection("courses");
  const reviewCollection = client.db("trafficSchool").collection("reviews");

  // Reviews
  app.get('/reviews', (req, res)=>{
      reviewCollection.find()
      .toArray((err, items)=>{
          res.send(items)
          console.log('from database', items)
      })
  })


  app.post('/addReviews', (req,res)=>{
      const newReview = req.body;
      console.log(newReview);
      reviewCollection.insertOne(newReview)
      .then(result=>{
          console.log('inserted count',result.insertedCount)
          res.send(result.insertedCount>0)
      })
  })

  // Courses
  app.get('/course', (req,res)=>{
    courseCollection.find()
    .toArray((error, items)=>{
        res.send(items)
      //   console.log('from', items)
    })
})

app.post('/addCourse', (req,res)=>{
   const newCourse = req.body;
   console.log('add course',newCourse)
   courseCollection.insertOne(newCourse)
   .then(result =>{
       console.log('inserted count', result)
       res.send(result.insertedCount>0)
   })
})

});

app.listen(process.env.PORT || port)
