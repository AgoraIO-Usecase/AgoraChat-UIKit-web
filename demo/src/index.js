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

  // addSessionItem = () => {
  //   let session = {
  //     conversationType: "singleChat",
  //     conversationId: "qw12",
  //   };
  //   EaseApp.addConversationItem(session);
  //   WebIM.conn.close('logout')

  // };

  // getSdk = () =>{
  //   EaseApp.getSdk({appkey:'41117440#383391'})
  // }

  test = (res) =>{
    console.log('test登录成功',res);
  }
  test2 = (err) =>{
    console.log('登录失败',err)
  }
  render() {
    console.log("this.state.token>>", this.state.token);
    return (
      <div>
          <button onClick={this.getSdk}> 测试 </button>
        <h3>EaseApp</h3>
        <div>
          <EaseApp
            successLoginCallback={this.test}
            failCallback={this.test2}
            
            // appkey= "41117440#383391"
            // username="38"
            // agoraToken="007eJxTYPgi6rikq32jpnppza4u3wWtE7k+3Z92j0/Pmc+dndduAqcCQ5phSrK5uUVSSkqymYlZYopFmpGZgaW5WXKiUYqBoWny2f+XExVkGBi2VnJ6MjKwMjACIYivwmCUapZokWZooGuWYpisa2iYmqxrYZhooWuelmqQaJhsYGFobgIAtdYlNg=="
            header={<div style={{ height: "100px" }}>TestHeader</div>} />
        </div>

      
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
