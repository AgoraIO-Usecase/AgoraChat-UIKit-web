import React, { Component,useState } from "react";
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
      conversationId: "zd132",
    };
    EaseApp.addConversationItem(session);
    EaseApp.changePresenceStatus({[session.conversationId] : 'Online'})
    EaseApp.thread.setShowThread(true)
    // EaseApp.thread.closeThreadPanel()
    // EaseApp.thread.setHasThreadEditPanel(true)
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
          <EaseApp
            // customMessageList={ [{name: 'report', value: 'report', position: 'others'}]}
            isShowReaction
            successLoginCallback={this.test}
            failCallback={this.test2}
            onAvatarChange={this.test3}
            onChatAvatarClick={this.test4}
            onEditThreadPanel={this.test5}
            appkey= "5101220107132865#test"
            username="wy2"
            password="1"
            // agoraToken="007eJxTYAiTXhXwV2WKwARx+Xxlv3x9dZfw6xXTdT42T5v7PqsuNUeBIc0wJdnc3CIpJSXZzMQsMcUizcjMwNLcLDnRKMXA0DSZ48XUJAUZBoZZ35YHMDKwMjACIYivwpBkYGaSmGJmoGtmZJKka2iYmqxrkWpopGuaZGRikWRgapGWZAkAkzwlRw=="
            header={<div style={{ height: "100px" }}>TestHeader</div>}/>
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
