//imports
import express from 'express';
import mongoose from 'mongoose';
import {messageModel,roomModel} from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';

//app config
const app = express();
const port = process.env.PORT || 9000;

//middleware
app.use(express.json());
app.use(cors());

const pusher = new Pusher({
  appId: '1076209',
  key: 'c90e895913fcc495cdaa',
  secret: '04cc77458c6799d3901b',
  cluster: 'eu',
  useTLS: true
});

//DB config
const connection_url = 'mongodb+srv://admin:DakXqeFRPdnFt3s4@cluster0.zxxwl.mongodb.net/whatsappdb?retryWrites=true&w=majority';

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open',()=>{
    console.log('DB is connected');

    const msgCollection = db.collection("rooms");
    // const changeStream = msgCollection.watch();
    const changeStream= msgCollection.watch({fullDocument: 'updateLookup'});

    changeStream.on('change', next =>{
        const len = next.fullDocument.messages.length;
        const messageDetails = next.fullDocument.messages[len-1];
        if(next.operationType === 'update'){
            pusher.trigger('rooms','updated',{
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp
            })
        } else if(next.operationType === 'insert'){
            pusher.trigger('rooms', 'inserted',{
                id: next.fullDocument.id,
                name: next.fullDocument.name,
            })
        } else {
            console.log("Error triggering Pusher");
        }
    })
});


//???

//api routes
app.get("/",function(req,res){
    res.status(200).send("hello world!");
})

app.get("/messages/sync", (req,res)=>{
    messageModel.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(data);
        }
    })
})

app.post("/rooms/new",(req,res)=>{
    const dbRoom = req.body

    roomModel.create(dbRoom,(err,data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(201).send(data);
        }
    })
})

app.get("/rooms/sync/:roomID",(req,res)=>{
    roomModel.findOne({id: req.params.roomID},(err,data)=>{
        if(err){
            res.send(err);
        }else{
            res.send(data);
        }
    })
})

app.get("/rooms/sync",(req,res)=>{
    roomModel.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.status(200).send(data);
        }
    })
})

app.post("/rooms/send/:roomID",(req,res)=>{
    const newMessage = req.body;

    roomModel.findOne({id: req.params.roomID},(err,data)=>{
        if(err){
            res.send(err);
        }else{
            if(data){
                data.messages.push(newMessage);
                data.save((err)=>{
                    if(err){
                        console.log(err);
                    }
                })
                res.send("Success!");
            }else{
                res.send("room not found!");
            }
        }
    })
})

//listen
app.listen(port,function(){
    console.log(`Listening on port: ${port}`);
})