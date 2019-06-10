import * as React from "react";
import * as constants from "@app/constants";
import "@app/styles/main.css";

export interface IHelloWorldProps {
  compiler: string;
  framework: string;
}

export class HelloWorld extends React.Component<IHelloWorldProps, {}> {
  render() {
    return (
      <React.Fragment>
        <h1>
          {this.props.compiler} and {this.props.framework}
        </h1>
        <p>This means that the config is working.</p>
        <p>{constants.DEFAULT_GREETING}</p>
        <div className="greentext">
          This text should be green and be brought in from the style sheet.
        </div>
      </React.Fragment>
    );
  }
}
