import React, { useContext } from "react";
import { Text, View } from "react-native";

import { AuthContext } from "../context/AuthContext";
import LoginScreen from "./LoginScreen";
import MessageScreen from "./MessageScreen";

export default function Main(){
    const authContext = useContext(AuthContext);

    if(!authContext || !authContext.user){
        return <LoginScreen/>
    }

    return <MessageScreen/>

    
}