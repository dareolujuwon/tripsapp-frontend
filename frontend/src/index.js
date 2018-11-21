import React from "react";
import ReactDOM from "react-dom";
// import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./index.css";
import Dashboard from "./Dashboard";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<Dashboard />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
