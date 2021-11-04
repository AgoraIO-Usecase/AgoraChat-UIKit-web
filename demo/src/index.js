import React, { Component } from "react";
import { render } from "react-dom";

import { EaseChat } from "../../src/index";

export default class Demo extends Component {
  render() {
    return (
      <div>
        <h1>es-uikit Demo</h1>
        <div style={{width:'700px',height:'700px'}}>
        <EaseChat />
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
