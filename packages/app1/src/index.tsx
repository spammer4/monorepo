import * as React from "react";
import * as ReactDOM from "react-dom";
import DashVersion from "./components/DashVersion";
import { HelloWorld } from "common/lib/HelloWorld";
import "common/styles/main.css";

/*const DashVersion = () => (
  <React.Fragment>
      <p className="redtext">The lodash version is {1234}</p>
      <p>This is a local component to app1 and will not appear in the common bundle</p>
  </React.Fragment>
);*/

ReactDOM.render(
  <React.Fragment>
      <HelloWorld application="app1" />
      <DashVersion />
  </React.Fragment>,
  document.getElementById("app")
);