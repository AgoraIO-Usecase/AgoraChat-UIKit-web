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
      conversationId: "zd123",
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
					username="99994"
					agoraToken="007eJxTYOjbyKgufVXr+pHj2SVW9yvv8Ll+YjKfWsKmwyaj8vZ9da4CQ5phSrK5uUVSSkqymYlZYopFmpGZgaW5WXKiUYqBoWmysZl4koIMA0Psq8VTGRlYGRiBEMRXYUgzNUxKSksz0LU0NTbWNTRMTdZNtLSw1E0yNjVItDBJMU8ySwUAoVYlBg=="
					header={<div style={{ height: "100px" }}>TestHeader</div>}
				/>
			</div>
		</div>
	);
  }
}

render(<Demo />, document.querySelector("#demo"));
