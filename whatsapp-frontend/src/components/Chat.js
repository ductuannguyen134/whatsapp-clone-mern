import { Avatar, IconButton } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './Chat.css';
import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoodIcon from '@material-ui/icons/Mood';
import MicIcon from '@material-ui/icons/Mic';
import axios from '../axios';
import { useStateValue } from '../StateProvider';
import { useParams } from 'react-router-dom';
import Pusher from 'pusher-js';

function Chat() {

    const [input,setInput] = useState("");
    const [{user},dispatch] = useStateValue();
    const {roomID} = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(()=>{
        if(roomID){
            axios.get("/rooms/sync/"+roomID).then(response=>{
                setRoomName(response.data.name);
                setMessages(response.data.messages);
            })
        }
    },[roomID])

    useEffect(()=>{
        //run once when component is loaded
        const pusher = new Pusher('c90e895913fcc495cdaa', {
          cluster: 'eu'
        });
    
        const channel = pusher.subscribe('rooms');
        channel.bind('updated', function(newMessages) {
          setMessages([...messages, newMessages]);
        });
    
        return ()=>{
          channel.unbind_all();
          channel.unsubscribe();
        }
    
      },[messages])

    const sendMessage = async (e) => {
        e.preventDefault();
        await axios.post('/rooms/send/'+roomID,{
            message: input,
            name: user.displayName,
            timestamp: new Date().toUTCString(),
            received: true
        })
        setInput("");
    }

    return (
        <div className="chat">
            <div className="chat__header">

                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen at...</p>
                </div>
                
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                {messages.map((message)=>(
                    <p className={`chat__message ${message.name == user.displayName && "chat__receiver"}`}>
                        <span className="chat__name">{message.name}</span>
                            {message.message}

                        <span className="chat__timestamp">
                            {message.timestamp}
                        </span>
                    </p>
                ))}
            
            </div>
            
            <div className="chat__footer">
                <MoodIcon />
                <form>
                    <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message" type="text" />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
