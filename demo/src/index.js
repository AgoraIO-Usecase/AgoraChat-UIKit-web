import React, { Component } from "react";
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

  test5 = (res) =>{
    console.log('val>>',res);
  }
  render() {
    console.log("this.state.token>>", this.state.token);
    return (
      <div>
          <button onClick={this.addSessionItem}> 测试 </button>
        <h3>EaseApp</h3>
        <div>
          {/* <EaseApp
            successLoginCallback={this.test}
            failCallback={this.test2}
            onAvatarChange={this.test3}
            onChatAvatarClick={this.test4}

            closeChat={this.test5}
            
            appkey= "41117440#383391"
            username="test003"
            agoraToken="007eJxTYIjT9z78Mq5gIWvimQDLneH87z8mcLoZzdrmUPg6jftWyD0FhjTDlGRzc4uklJRkMxOzxBSLNCMzA0tzs+REoxQDQ9Pk2FluSQoyDAy57Vv2MDKwMjACIYivwmCeYmFkZm5qoGuZlGiqa2iYmqxraW6eqptinmxpZpRmbGFqaQYAH2EmCg=="
            header={<div style={{ height: "100px" }}>TestHeader</div>}
             /> */}

             <div style={{height:'500px'}}>
             <EaseLivestream
                  appkey= "41117440#383391"
                  username="test003"
                  agoraToken="007eJxTYDg62UPmqKCrFOtXE/5FW1ewhLL9MlMKrDCSe3bk3uvzV7YqMKQZpiSbm1skpaQkm5mYJaZYpBmZGViamyUnGqUYGJomu213S1KQYWBQzUtyYGRgZWAEQhBfhcE8xcLIzNzUQNcyKdFU19AwNVnX0tw8VTfFPNnSzCjN2MLU0gwAs7UkrA=="
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
