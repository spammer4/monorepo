import * as React from "react";
import { HelloWorld } from "common/lib/HelloWorld";

describe("Simple hello world test", () => {
  it("renders without crashing", async () => (
    <React.Fragment>
      <HelloWorld application="test" />
    </React.Fragment>
  ));
});
