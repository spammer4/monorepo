import * as React from "react";
import * as ReactDOM from "react-dom";

import "common/styles/main.css";
import { HelloWorld } from "common/lib/HelloWorld";

ReactDOM.render(
  <HelloWorld application="app3" />,
  document.getElementById("app")
);
