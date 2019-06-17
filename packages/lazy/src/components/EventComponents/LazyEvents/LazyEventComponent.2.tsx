import * as React from "react";

// Look at the LazyDisplayEvent.tsx, it uses "default" so it must be exported as default
export default class Event2 extends React.Component<any, any> {
    render() {
        return (
            <React.Fragment>
                I am a lazy event number #2
            </React.Fragment>
            );
        }
}