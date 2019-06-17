import * as React from "react";
import * as Events from ".";

const displayEvent = (eventNumber: number): JSX.Element => {
    switch (eventNumber) {
        case 1: return (<React.Fragment><Events.Event1 /></React.Fragment>);
        case 2: return (<React.Fragment><Events.Event2 /></React.Fragment>);
        case 3: return (<React.Fragment><Events.Event3 /></React.Fragment>);
        default: return (<React.Fragment><Events.Unknown /></React.Fragment>);
    }
};

export { displayEvent as DisplayEvent };