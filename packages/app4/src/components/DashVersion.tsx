import * as React from "react";
// import * as Dom from "react-dom";

import * as lodash from "lodash";

const ver = lodash.VERSION;
// console.error(Dom);
export default () => (
    <React.Fragment>
        <p className="redtext">The lodash version is {ver}</p>
        <p>This is a local component to app1 and will not appear in the common bundle</p>
    </React.Fragment>
);