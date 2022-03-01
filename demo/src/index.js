import React, { Component } from "react";
import { render } from "react-dom";

import { EaseChat, EaseApp } from "../../src/index";
// import WebIM from "./WebIM";
import val from "./comm";
// import initListen from "./WebIMListen";
export default class Demo extends Component {
  state = {
    token: val,
  };

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
    addSessionItem = () => {
    let session = {
		conversationType: "singleChat",
		conversationId: "test0001",
	};
    EaseApp.addConversationItem(session);

  };
  test = (res) =>{
    console.log('test登录成功',res);
  }
  test2 = (err) =>{
    console.log('登录失败',err)
  }
  test3 = (res) =>{
    console.log('res>>',res);
  }
  render() {
    console.log("this.state.token>>", this.state.token);
    return (
		<div>
			<button onClick={this.addSessionItem}> 测试 </button>
			<h3>EaseApp</h3>
			<div>
				<EaseApp
					successLoginCallback={this.test}
					failCallback={this.test2}
					onAvatarChange={this.test3}
					appkey="41117440#383391"
					username="99996"
					agoraToken="007eJxTYGjJUauR+s6S3FW83aLdn2eauc2M2g0mBzsYnxo+yTh3X02BIc0wJdnc3CIpJSXZzMQsMcUizcjMwNLcLDnRKMXA0DT5xyfZJAUZBgbjLCttRgZWBkYgBPFVGAxSTAwN0iwNdC3NDE11DQ1Tk3UTU02MdFOTTIzTjE1TLA0tEgG4ziUI"
					header={<div style={{ height: "100px" }}>TestHeader</div>}
				/>
			</div>
		</div>
	);
  }
}

render(<Demo />, document.querySelector("#demo"));
