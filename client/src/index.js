import React from "react";
import ReactDOM from "react-dom";

import Welcome from "./Welcome";
import App from "./App";

console.log("hi!");
// checking if user logged in
let elem;
if (window.location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = <App />;
}

ReactDOM.render(elem, document.getElementById('root'));