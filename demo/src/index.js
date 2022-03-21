import React, { Component } from "react";
import { render } from "react-dom";

import { EaseChat, EaseApp } from "../../src/index";
// import WebIM from "./WebIM";
import val from "./comm";
// import initListen from "./WebIMListen";
import EditThreadPanel from "../demo-comments/components/editThreadPanel";
import Dialog  from "../demo-comments/components/dialog";
import Members  from "../demo-comments/components/members";
import { times } from "lodash";
export default class Demo extends Component {
  state = {
    token: val,
    type:'',
    showMemberList: false,
    list:[
      { nickName: 'test000', role: 'GroupOwner' },
      { nickName: 'test111', role: 'Admin' },
      { nickName: 'test222', role: 'Admin' },
      { nickName: 'test333', role: 'member' },
      { nickName: 'test444', role: 'member' },
      { nickName: 'test444', role: 'member' },
      { nickName: 'test444', role: 'member' },
      { nickName: 'test444', role: 'member' },
      { nickName: 'test444', role: 'member' },
      { nickName: 'test444', role: 'member' },
      { nickName: 'test444', role: 'member' },
      { nickName: 'test444', role: 'member' },
      { nickName: 'test444', role: 'member' },
      { nickName: 'test444', role: 'member' },
  ],
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
  //test--start
  editThread = ()=>{
    let editTypes = ['Members', 'Notifications', 'FullView', 'EditThread', 'LeaveThread', 'DisbandThread']
    this.state.type = editTypes[0];
    switch (this.state.type) {
      case 'Members': {
          // WebIM.conn.getThreadMembers({threadId:'123',size:'1',pageSize:'50'}).then((res)=>{})//
          break;
      }
      case 'Notifications': {
          console.log('Notifications')
          break;
      }
      case 'FullView': { 
          console.log('FullView') 
          break;
      }
      case 'EditThread': { 
        // WebIM.conn.changeThreadName({threadId:'123',name:'newName',}).then((res)=>{})//
          break;
      }
      case 'LeaveThread': { 
          //WebIM.conn.leaveThread({threadId:'123'}).then((res)=>{})
          break;
      }
      case 'DisbandThread': { 
          //WebIM.conn.destroyThread({threadId:'123'}).then((res)=>{})
          break;
      }
      default:
          console.log("wrong type")
          break;
  }
  }
  //test--end


  render() {
    console.log("this.state.token>>", this.state.token);
    return (
      <div>
        <Dialog showDialog = 'false' title="dialog title" button1='Cancel' button2='save' input='true' />
        <Members list={this.state.list} isShow = {this.state.showMemberList} />
          <button onClick={this.addSessionItem}> 测试 </button>
          <button onClick={this.editThread}> 测试Edit </button>
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
            agoraToken="007eJxTYFA+KLF0bcqqKV93bTqhF5EoqB/Tt0zm3uWFIQ/0Hvya8/i6AkOaYUqyublFUkpKspmJWWKKRZqRmYGluVlyolGKgaFpsomiRZKCDAPDSumpmYwMrAyMQAjiqzCYGBonWhgbGOgmmlmm6hoapibrJpkbWupaGpsYm6alJZuamZsAAAKkJ3I="
            header={<div style={{ height: "100px" }}>TestHeader</div>} 
            />
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
