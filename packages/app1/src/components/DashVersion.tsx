import * as React from "react";
import * as lodash from "lodash";
import "@common/styles/main.css";

const ver = lodash.VERSION;

export default () => (
    <React.Fragment>
        <p className="redtext">The lodash version is {ver}</p>
        <p>This is a local component to app1 and will not appear in the common bundle</p>
    </React.Fragment>
);