import { Avatar } from '@material-ui/core';
import React from 'react';
import './SidebarChat.css';
import axios from '../axios';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

function SidebarChat({addNewChat, id, name}) {

    const createChat = () => {
        const roomName = prompt("Please enter name for chat");
        if(roomName){
            axios.post("/rooms/new",{
                id: uuidv4(),
                name: roomName,
                timestamp: new Date().toUTCString()
            })
        }
    };

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
                <Avatar />
                <div className = "sidebarChat__info">
                    <h2>{name}</h2>
                    <p>This is the last message</p>
                </div>
            </div>
        </Link>
    ): (
        <div onClick={createChat} className="sidebarChat">
            <h2>Add New Chat</h2>
        </div>
    )
}

export default SidebarChat
