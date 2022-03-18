import React, { Component } from "react";
import { render } from "react-dom";

import { EaseChat, EaseApp } from "../../src/index";
// import WebIM from "./WebIM";
import val from "./comm";
// import initListen from "./WebIMListen";
import EditThreadPanel from "../demo-comments/components/editThreadPanel";
import Dialog  from "../demo-comments/components/dialog";
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
      conversationId: "zd132",
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
  test4 = (val) =>{
    console.log('val',val);
  }
  test5 = () =>{
    console.log('test5');
  }
  render() {
    console.log("this.state.token>>", this.state.token);
    return (
      <div>
        <Dialog title="dialog title" button1='Cancel' button2='save' input='true' />
          <button onClick={this.addSessionItem}> 测试 </button>
        <h3>EaseApp</h3>
        <div>
          <EaseApp
            successLoginCallback={this.test}
            failCallback={this.test2}
            onAvatarChange={this.test3}
            onChatAvatarClick={this.test4}
            appkey= "41117440#383391"
            username="zd129"
            editThreadPanel={<EditThreadPanel/>}
            agoraToken="007eJxTYLi/O/OPTf3/t+aOgaly7a/v//B1XOJ8pPOel8b2Y58ET2gpMKQZpiSbm1skpaQkm5mYJaZYpBmZGViamyUnGqUYGJom31pukqQgw8AQozvbhpGBlYERCEF8FQYTQ+NEC2MDA91EM8tUXUPD1GTdJHNDS11LYxNj07S0ZFMzcxMAT6soJw=="
            header={<div style={{ height: "100px" }}>TestHeader</div>} 
            />
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
