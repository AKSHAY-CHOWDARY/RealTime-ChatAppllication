const exp = require('express');
const expressAsyncHandler = require('express-async-handler');
const { ObjectId } = require('mongodb');

const msgsApp = exp.Router()

let msgsCollection ;
msgsApp.use((req,res,next)=>{
    msgsCollection = req.app.get('msgsCollection');
    next();
})

//SEND MESSAGE
msgsApp.post('/send/:id',expressAsyncHandler(async(req,res)=>{
    console.log(req.body);
    let senderId = req.body._id;
    let receiverId = req.params.id;
    let text = req.body.text;
    let message = {senderId:senderId,receiverId:receiverId,text:text};
    
    await msgsCollection.insertOne(message);
    return res.send({message:"message sent"});
}))


//GET MESSAGES
msgsApp.post('/:id',expressAsyncHandler(async(req,res)=>{
    let senderId = req.body._id;
    let receiverId = req.params.id;
   
    const messages = await msgsCollection.find({$or:[{senderId:senderId,receiverId:receiverId},{senderId:receiverId,receiverId:senderId}]}).sort({ timestamp: 1 }).toArray();

    return res.send({message:"All messages", payload:messages});
}))


module.exports = msgsApp