import React, { useState, useEffect } from "react";


export default function App(){
    const [user, setUser] = useState();

    useEffect(() => {
        fetch("/api/home")
            .then(response => {
              //console.log("response", response);
              return response.json();
            })
            .then((data) => {
                console.log("data", data.user);
                setUser(data.user);
            })
            .catch(err => {
              console.log(err);
              
            });
    }, []);


    console.log("user", user);
    if (user === undefined) {
        return (
            <div>
                ups
                <a href='/api/logout'>Log out</a>
            </div>
        );
    }
              
    return (
        <div>
            <h1>HELLO, {user.name}</h1>
            <a href='/api/logout'>Log out</a>
            
        </div>
        
    )
};