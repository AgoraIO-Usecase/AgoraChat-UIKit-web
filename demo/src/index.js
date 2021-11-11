import React, { Component } from "react";
import { render } from "react-dom";

// import { EaseChat, EaseApp } from "../../src/index";

export default class Demo extends Component {
  onClickSession = () => {
    let session = {
      sessionType: "singleChat",
      sessionId: "qw10",
    };
    EaseApp.onClickSession(session);
  };
  render() {
    return (
      <div>
        <h3>EaseApp</h3>
        <div style={{ width: "100%", height: "500px" }}>
          {/* <EaseApp/> */}
        </div>
        <button onClick={this.onClickSession}>1111</button>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
