import React, { Component,useState } from "react";
import { render } from "react-dom";

import { EaseChat, EaseApp,EaseLivestream } from "../../src/index";
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
      conversationId: "qwk003",
    };
    EaseLivestream.addConversationItem(session);

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
  test4 = (val) =>{
    console.log('val',val);
  }
  test5 = (val1,val2) => {
    console.log('val',val1,val2)
  }
  render() {
    console.log("this.state.token>>", this.state.token);
    return (
      <div>
          <button onClick={this.addSessionItem}> 测试 </button>
        <h3>EaseApp</h3>
        <div>
             <div style={{height:'500px'}}>
             <EaseLivestream
                  appkey= "41117440#383391"
                  username="test004"
                  agoraToken="007eJxTYJihkLVHfmaA+Yb9LtN+7NZ4GdWX6tL7MG5ma+fKEh6mdDUFhjTDlGRzc4uklJRkMxOzxBSLNCMzA0tzs+REoxQDQ9PkJv26JAUZBob7KvP9GRlYGRiBEMRXYUhOTUsyM0o20E1OSU3WNTQEEkkpSSa6RuZAsywSU8wSDc0BOP4nVg=="
                  to="qwk003"
                  chatType="singleChat"
            />
             </div>
           
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
