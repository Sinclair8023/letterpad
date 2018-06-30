import React from "react";
import classnames from "classnames";
import { cloneElement } from "../helper/clone";

/* eslint-disable react/prop-types */
export default ({ children, style, className, ...rest }) => (
    <div className={classnames("toolbar", className)} style={style}>
        {cloneElement(children, rest)}
    </div>
);
