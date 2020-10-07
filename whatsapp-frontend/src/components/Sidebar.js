import React, { useState, useEffect } from 'react';
import "./Sidebar.css";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import { Avatar, IconButton } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import SidebarChat from "./SidebarChat";
import { useStateValue } from '../StateProvider';
import axios from '../axios';
import Pusher from 'pusher-js';

function Sidebar() {
    const [{user},dispatch] = useStateValue();
    const [rooms,setRooms] = useState([]);

    useEffect(() => {
        axios.get("/rooms/sync").then(response=>{
            setRooms(response.data);
        })
    }, [])

    useEffect(()=>{
        const pusher = new Pusher('c90e895913fcc495cdaa', {
            cluster: 'eu'
        });
      
        const channel = pusher.subscribe('rooms');
        channel.bind('inserted', function(newRooms) {
            setRooms([...rooms, newRooms]);
        });
      
        return ()=>{
            channel.unbind_all();
            channel.unsubscribe();
        }

    },[rooms])

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user.photoURL} alt="profile_pic"/>
                <h3>{user.displayName}</h3>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchIcon />
                    <input placeholder="Search or start a new chat" type="text" />
                </div>
            </div>

            <div className="sidebar__chats">
                <SidebarChat addNewChat/>
                {rooms.map(room=>(
                    <SidebarChat key={room.id} id={room.id} name={room.name}/>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
