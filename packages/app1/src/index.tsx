import * as React from "react";
import * as ReactDOM from "react-dom";

import DashVersion from "./components/DashVersion";
import { HelloWorld } from "@common/lib/HelloWorld";

ReactDOM.render(
  <React.Fragment>
      <HelloWorld application="app1" />
      <DashVersion />
  </React.Fragment>,
  document.getElementById("app")
);