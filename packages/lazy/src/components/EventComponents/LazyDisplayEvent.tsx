import * as React from "react";
import { Unknown } from "./UnknownEvent";
import shortid from "shortid";

const lazyDisplayEvent = (eventNumber: number): Promise<JSX.Element> => {
    return new Promise((resolve: any) => {
        switch (eventNumber) {
            case 1: import(/* webpackChunkName: "lazyevents" */"./LazyEvents/LazyEventComponent.1").then(Component => resolve(<Component.default key={shortid.generate()} />)); break;
            case 2: import(/* webpackChunkName: "lazyevents" */ "./LazyEvents/LazyEventComponent.2").then(Component => resolve(<Component.default key={shortid.generate()} />)); break;
            case 3: import(/* webpackChunkName: "lazyevents" */ "./LazyEvents/LazyEventComponent.3").then(Component => resolve(<Component.default key={shortid.generate()} />)); break;
            default: resolve(<Unknown />);
        }
    });
};

export { lazyDisplayEvent as LazyDisplayEvent };