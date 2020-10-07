import React, { useState } from 'react';
import './Login.css';
import {auth, provider} from '../../src/firebase';
import { useStateValue } from '../StateProvider';
import { actionTypes } from '../reducer';

function Login() {
    const [{},dispatch] = useStateValue();

    const signIn = () => {
        auth
        .signInWithPopup(provider)
        .then((result)=>{
            console.log(result.user);
            dispatch({
                type: actionTypes.SET_USER,
                user: result.user
            })
        })
        .catch((error)=>alert(error.message));
    }

    return (
        <div className="login">
            <div className="login__container">
                <img src="https://e7.pngegg.com/pngimages/672/164/png-clipart-whatsapp-icon-whatsapp-logo-computer-icons-zubees-halal-foods-whatsapp-text-circle.png" alt="whatsapp-icon" />
                <div className="login__text">
                    <h1>Sign in to Whatsapp</h1>
                </div>
                <button onClick={signIn}>Sign in with Google</button>
            </div>
        </div>
    )
}

export default Login
