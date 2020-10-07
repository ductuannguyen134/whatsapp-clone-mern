import mongoose from 'mongoose';

const whatsappSchema = mongoose.Schema({
    id: String,
    message: String,
    name: String,
    timestamp: String,
    received: Boolean
});

const roomSchema = mongoose.Schema({
    id: String,
    name: String,
    timestamp: String,
    messages: [whatsappSchema]
})

const messageModel = mongoose.model('messagecontent',whatsappSchema);
const roomModel = mongoose.model('room',roomSchema);

export {messageModel, roomModel};