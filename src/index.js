import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import spriteImg from "./sprite";

const css = document.createElement("style");
const styles = `.card--front { background-image: url("${spriteImg}"); }`;
css.appendChild(document.createTextNode(styles));
document.head.appendChild(css);

ReactDOM.render(<App />, document.getElementById("root"));
