import React, { memo } from 'react'
import { Icon, Button } from '@material-ui/core';
function Reacoder() {

    return (
        <div>
            <div className="recorderWraper">
                <Modal
                    width={300}
                    title={null}
                    visible={recoderVisible}
                    centered
                    closable={false}
                    onCancel={this.hide}
                    footer={null}>
                    <div className="tipText">按住开始录音</div>
                    <div className="sound-waves">
                        {this.state.randomheight.map((iheight, index) => {
                            return <div
                                key={index}
                                className="wavesItem"
                                style={{ height: `${iheight}px` }}
                            ></div>
                        })}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            className="holdBtn"
                            onTouchStart={this.mouseStart}
                            onTouchEnd={this.mouseEnd('audio')}
                            onMouseDown={this.mouseStart}
                            onMouseUp={this.mouseEnd('audio')}
                        >
                            <svg className="icon microphone" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M714 605.9v-338c0-111.4-90.6-202-202-202s-202 90.6-202 202v338c0 104.6 80 190.9 182 201v111.2H379c-11 0-20 9-20 20s9 20 20 20h266c11 0 20-9 20-20s-9-20-20-20H532V806.9c102-10.1 182-96.4 182-201z m-202-500c89.3 0 162 72.7 162 162v318H350v-318c0-89.4 72.7-162 162-162z m-160.8 520h321.5c-9.9 79.9-78.2 142-160.8 142s-150.8-62.1-160.7-142z" fill="#565656"></path><path d="M455.4 193.8m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656"></path><path d="M455.4 303.5m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656"></path><path d="M455.4 413.2m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M455.4 522.9m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M398.9 248.7m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M398.9 358.4m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M398.9 468.1m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M512 248.7m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M512 358.4m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M512 468.1m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M568.6 193.8m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M568.6 303.5m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M568.6 413.2m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M568.6 522.9m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M625.1 248.7m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M625.1 358.4m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path><path d="M625.1 468.1m-18.4 0a18.4 18.4 0 1 0 36.8 0 18.4 18.4 0 1 0-36.8 0Z" fill="#565656" ></path></svg>
                        </Button>
                    </div>
                </Modal>

                <div
                    onClick={this.show}>
                    <Icon className="iconfont icon-yuyin"></Icon>
                </div>

            </div>
        </div>
    )
}

export default memo(Reacoder)