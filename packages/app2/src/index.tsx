import * as React from "react";
import * as ReactDOM from "react-dom";

import { HelloWorld } from "@common/lib/HelloWorld";

declare var _DEFAULT_GREETING: string;

ReactDOM.render(
  <React.Fragment>
      <HelloWorld application="app2" />
      <p>{_DEFAULT_GREETING}</p>
  </React.Fragment>,
  document.getElementById("app")
);
