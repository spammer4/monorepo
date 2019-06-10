import * as React from "react";
import * as ReactDOM from "react-dom";

import { HelloWorld } from "@components/HelloWorld";

ReactDOM.render(
  <HelloWorld compiler="Typescript" framework="ReactJS" />,
  document.getElementById("app")
);
