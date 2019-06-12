import * as React from "react";
import * as ReactDOM from "react-dom";

import { HelloWorld } from "@common/lib/HelloWorld";
import DashVersion from "./components/DashVersion";

ReactDOM.render(
  <React.Fragment>
      <HelloWorld application="app1" />
      <DashVersion />
  </React.Fragment>,
  document.getElementById("app")
);