import * as React from "react";
import { HelloWorld } from "./HelloWorld";

describe("Simple hello world test", () => {
  it("renders without crashing", async () => (
    <React.Fragment>
      <HelloWorld compiler="Typescript" framework="ReactJS" />
    </React.Fragment>
  ));
});
