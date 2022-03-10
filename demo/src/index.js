import React, { Component } from "react";
import { render } from "react-dom";
import { EaseChat, EaseApp, EasePresence } from "../../src/index";
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
  test4 = (val) =>{
    console.log('val',val);
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
            onChatAvatarClick={this.test4}
            appkey="5101220107132865#test"
            username="lu1"
            password="1"
            // appkey= "41117440#383391"
            // username="test0001"
            // agoraToken="007eJxTYNDx92Fqf35CjT194rFDe+x+bT0dcN3yJM+05l13Nx7Z/V5RgSHNMCXZ3NwiKSUl2czELDHFIs3IzMDS3Cw50SjFwNA0+d6GL4kKMgwM8t933WJkYGVgBEIQX4XB3DDRwswwzUDXwiDJUNfQMDVZNzHZNFHXMs3Y2MLU2NDQxNAMAGn7Ka8="
            header={<div style={{ height: "100px", position: 'relative' }}>TestHeader <EasePresence style={{position: 'absolute', top: '0px', left: '90px'}}  /></div>} />
        </div>

      
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
