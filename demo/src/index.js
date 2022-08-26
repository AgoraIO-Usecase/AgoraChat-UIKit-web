import React, { Component, useState } from "react";
import { render } from "react-dom";
import { EaseChat, EaseApp } from "../../src/index";
import axios from 'axios'
// import WebIM from "./WebIM";
import val from "./comm";
// import initListen from "./WebIMListen";
export default class Demo extends Component {
  state = {
    token: val,
  };

  getRtctoken(params) {
    const { channel, agoraId, username } = params;
    const url = `https://a41.easemob.com/token/rtc/channel/${channel}/agorauid/${agoraId}?userAccount=${username}`
    return axios
      .get(url)
      .then(function (response) {
        console.log('getRtctoken', response)
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getConfDetail = (username, channelName) => {
    const url = `https://a41.easemob.com/agora/channel/mapper?channelName=${channelName}&userAccount=${username}`

    return axios.get(url)
      .then(function (response) {
        let members = response.data.result
        return members
      })
      .catch(function (error) {
        console.log(error);
      });
  }

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
    EaseApp.changePresenceStatus({ [session.conversationId]: 'Online' })
    EaseApp.thread.setShowThread(true)
    // EaseApp.thread.closeThreadPanel()
    // EaseApp.thread.setHasThreadEditPanel(true)
  };
  test = (res) => {
    console.log('test登录成功', res);
  }
  test2 = (err) => {
    console.log('登录失败', err)
  }
  test3 = (res) => {
    console.log('res>>', res);
  }
  test4 = (val) => {
    console.log('val', val);
  }
  handleGetToken = async (data) => {
    let token = ''
    console.log('data', data)

    // zd3 token
    token = await this.getRtctoken({ channel: data.channel, agoraId: '527268238', username: data.username })
    return {
      agoraUid: '527268238',
      accessToken: token.accessToken
    }
  }

  handleGetIdMap = async (data) => {
    let member = {}
    member = await this.getConfDetail(data.userId, data.channel)
    return member
  }

  test5 = (val1, val2) => {
    console.log('val', val1, val2)
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
            appkey="41117440#383391"
            username="zd3"
            // password="1"
            agoraToken="007eJxTYHjAyRq9/uNezSP37kybrdpm+mL97eRWPfmA+S7urvnmRScVGNIMU5LNzS2SUlKSzUzMElMs0ozMDCzNzZITjVIMDE2TTSbeSlKQYWB48kXEn5GBlYERCEF8FQYLy5TkJHNjA10zI5MUXUPD1GRdyzQTQ11jYwsLw9RE06TUJCMAl70nXg=="
            header={<div style={{ height: "100px" }}>TestHeader</div>} />
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
