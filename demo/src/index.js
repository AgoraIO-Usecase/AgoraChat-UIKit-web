import React, { Component } from "react";
import { render } from "react-dom";

import { EaseChat, EaseApp } from "../../src/index";
import WebIM from "./WebIM";
import val from "./comm";
import initListen from "./WebIMListen";
export default class Demo extends Component {
  state = {
    token: val,
  };
  // componentDidMount() {
  //   initListen();
  //   this.postData("https://a61.easemob.com/app/chat/user/login", {
  //     userAccount: "qw99",
  //     userNickname: "qqq",
  //   }).then((res) => {
  //     const { accessToken } = res;
  //     console.log("accessToken>>>", accessToken);
  //     let options = {
  //       user: "qw99",
  //       agoraToken: accessToken,
  //     };
  //     WebIM.conn.open(options);
  //   });
  // }

  postData = (url, data) => {
    return fetch(url, {
      body: JSON.stringify(data),
      cache: "no-cache",
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      mode: "cors",
      redirect: "follow",
      referrer: "no-referrer",
    }).then((response) => response.json());
  };

  onClickSession = () => {
    let session = {
      sessionType: "singleChat",
      sessionId: "qw12",
    };
    EaseApp.onClickSession(session);
    WebIM.conn.close('logout')

  };
  render() {
    console.log("this.state.token>>", this.state.token);
    return (
      <div>
          <button onClick={this.onClickSession}> 测试 </button>
        <h3>EaseApp</h3>
        <div>
          <EaseApp header={<div style={{ height: "100px" }}>222</div>} />
        </div>

      
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
