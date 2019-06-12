import * as React from "react";
import "@common/styles/main.css";

export interface IHelloWorldProps {
  application: string;
}

export class HelloWorld extends React.Component<IHelloWorldProps, {}> {
  render() {
    return (
      <React.Fragment>
        <h1>
          {this.props.application}
        </h1>
        <p>This means that the monorepo is working!</p>
        <div className="greentext">
          This text should be green and be brought in from the style sheet.
        </div>
      </React.Fragment>
    );
  }
}
