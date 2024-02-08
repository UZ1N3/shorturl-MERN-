const express = require("express");
const router = express.Router();
const{connectToMongoDb} = require('../Server/connect');
const { MongoClient } = require('mongodb');
const URL = require('../Server/models/url');
const urlRoute = require('../Server/routes/url');
const cors = require('cors');
const User = require('../Server/models/user_model');
const jwt = require('jsonwebtoken');

connectToMongoDb("mongodb://localhost:27017/short-url").then(() => console.log("mongodb Connected"));

const PORT = 8002;

const app = express();

app.use(cors());
app.use(express.json());


//  url shortening

app.use("/url",urlRoute);



// register endpoint

app.post('/api/register', async(req,res)=>{
 console.log(req.body);
 try{
    const user = User.create({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    });
    res.json({status:'ok'});
 }catch(err){
    res.json({status:'error',error:'Duplicate Email'})
    console.log(err);
 }
 
})

// login endpoint

app.post('/api/login', async(req,res)=>{
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    })

    if(user){
        const token = jwt.sign({

            username: user.username,
            email: user.email

        }, 'secretUz1n3')
        return res.json({status:'ok', user: token})
    }else{
        return res.json({status:'error', user: false})
    }

   })


//    url-redirection

app.get("/:shortId", async(req,res) => {

    const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory: {
                timestamp :Date.now()
            }
        }
    });
        res.redirect(entry.redirectURL);    

});



// Analytics endpoint

app.post('/analytics', async(req,res) => {
    
    const body = req.body
    console.log("Request Body:", body); 

    const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

    // const analytics_data = URL.find({userEmail:req.body.email})
    await client.connect();

    const database = client.db('short-url');
    const collection = database.collection('urls');

    // Find documents that contain the specified email
    const cursor = collection.find({ userEmail: body.email});

    // Convert the cursor to an array of documents
    const result = await cursor.toArray();

    // return res.json({status:"ok",result})
   return res.json(result);
    
})

// dashboard endpoint

app.post('/delete/url', async (req, res) => {
    try {
      const { id } = req.body; // Get the record ID from the request body
      if (!id) {
        return res.status(400).json({ error: 'Record ID is required' });
      }
      const deletedRecord = await URL.findByIdAndDelete(id);
      if (!deletedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }
      res.json({ message: 'Record deleted successfully' });
    } catch (error) {
      console.error('Error deleting record:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // edit shortId appi

  app.post('/edit/url', async (req, res) => {
    try {
      const { id, shortId } = req.body; // Get the record ID and new shortId from the request body
      if (!id || !shortId) {
        return res.status(400).json({ error: 'Record ID and shortId are required' });
      }
      const updatedRecord = await URL.findByIdAndUpdate(id, { shortId }, { new: true });
      if (!updatedRecord) {
        return res.status(404).json({ error: 'Record not found' });
      }
      res.json({ message: 'Record updated successfully', updatedRecord });
    } catch (error) {
      console.error('Error updating record:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.listen(PORT, ()=> console.log('Server started on PORT'));

