import * as React from "react";

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
        <p>This means that the monorepo is working correctly!</p>
        <div className="greentext">
          This text should be green and be brought in from the style sheet.
        </div>
      </React.Fragment>
    );
  }
}
