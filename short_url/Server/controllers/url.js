
var nanoId = require('nano-id');
const URL = require('../models/url')

async function generateNewShortURL(req,res){
    const body = req.body;
    console.log("Request Body:", body); 

    if(!body.url) return res.status(400).json({error: 'url is required'});
  const shortId = nanoId(8);

  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    userEmail: body.email,
    visitHistory:[]
  })
 return res.json({status:'ok',id: shortId});
}

module.exports = {
    generateNewShortURL
};