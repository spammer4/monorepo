import * as React from "react";
import * as Event from "./EventComponents";

interface IEvent {
    eventToShow: JSX.Element;
}

export default class DisplayComponent extends React.Component<any, IEvent> {
    constructor(props: {}) {
        super(props);
        this.state = {
            eventToShow: Event.EmptyEvent()
        };

        this.selectEvent = this.selectEvent.bind(this);
    }

    selectEvent(eventNumber: number) {

        Event.LazyDisplayEvent(eventNumber).then(event => this.setState({eventToShow: event}));

        //const event = Event.DisplayEvent(eventNumber);
        //this.setState({eventToShow: event});
    }

    render() {
        return (
            <React.Fragment>
                <p>
                    Please pick an event button to show:
                </p>
                <p>
                    <button value="1" onClick={() => this.selectEvent(1)}>Event 1</button>
                    <button value="2" onClick={() => this.selectEvent(2)}>Event 2</button>
                    <button value="3" onClick={() => this.selectEvent(3)}>Event 3</button>
                    <button value="4" onClick={() => this.selectEvent(4)}>Will be unknown</button>
                </p>
                { this.state.eventToShow }
            </React.Fragment>
        );
    }
}