// import { Button } from '../../dist/ChatUI.esm.js';
import './index.scss';
// import Button from '../../component/button/index';
// import Avatar from '../../component/avatar/index';
import { Button, Avatar } from '../../component/entry';
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
// import '../../dist/style.css';
import Provider from '../../module/store/Provider';
import { ConfigContext, ConfigProvider, ConfigConsumer } from '../../component/config/index';

import Input from '../../component/input';

import Loading from '../../component/loading';
import { Tooltip } from '../../component/tooltip/Tooltip';

import PinnedTextMessage from '../../module/pinnedTextMessage';

const TestButton = () => {
  return (
    <ConfigConsumer>
      {data => {
        console.log('data, value', data);
        return (
          <>
            <Input required close></Input>
            <Avatar>22</Avatar>
            <div className="loadingBox">
              <Loading size={24} visible={true}></Loading>
            </div>

            <div className="white">
              <Tooltip title="primary" trigger={'click'} arrow placement="left">
                <div style={{ width: '300px' }}>
                  <Button size={'large'} type="default" ripple>
                    default
                  </Button>
                </div>
              </Tooltip>
              <Tooltip title="primary" trigger={'hover'} placement="top" arrow>
                <div>
                  <Button size={'large'} type="primary" className="button" ripple>
                    primary
                  </Button>
                </div>
              </Tooltip>
              <Tooltip title="primary-disabled" trigger={'hover'}>
                <Button size={'large'} type="primary" disabled className="button">
                  primary-disabled
                </Button>
              </Tooltip>

              <Button size={'large'} type="ghost" className="button">
                ghost
              </Button>

              <Button size={'large'} type="primary" className="button" shape="round">
                round
              </Button>

              <Button type="primary" className="button" shape="round">
                round
              </Button>

              <Button size={'large'} type="primary" className="button" shape="circle">
                C
              </Button>
              <Button size={'small'} type="primary" className="button" shape="circle">
                Cs
              </Button>
              <Button type="primary" className="button" shape="circle">
                C
              </Button>
              <Button type="text" className="button">
                text
              </Button>
            </div>
            <div className="black">
              <Button size={'large'} type="default" className="button">
                default
              </Button>
              <Button size={'large'} type="primary" className="button">
                primary
              </Button>
              <Button size={'large'} type="primary" disabled className="button">
                primary-disabled
              </Button>

              <Button size={'large'} type="ghost" className="button">
                ghost
              </Button>

              <Button size={'large'} type="primary" className="button" shape="round">
                round
              </Button>

              <Button type="primary" className="button" shape="round">
                round
              </Button>

              <Button size={'large'} type="primary" className="button" shape="circle">
                C
              </Button>
              <Button size={'small'} type="primary" className="button" shape="circle">
                Cs
              </Button>
              <Button type="primary" className="button" shape="circle">
                C
              </Button>
              <Button type="text" className="button">
                text
              </Button>
            </div>
          </>
        );
      }}
    </ConfigConsumer>
  );
};

ReactDOM.createRoot(document.getElementById('buttonRoot') as Element).render(
  <div className="container">
    {/* <ConfigProvider
			value={{
				getPrefixCls: () => {
					return 'qqq';
				},
				iconPrefixCls: 'bamboo',
			}}
		> */}
    <Provider initConfig={{ appKey: 'easemob#easeim' }} theme={{ mode: 'dark' }}>
      <TestButton></TestButton>
    </Provider>
    {/* </ConfigProvider> */}
  </div>,
);
