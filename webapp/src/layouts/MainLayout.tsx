import React from 'react';

import { Layout, Menu } from 'antd';
import {Link} from "react-router-dom";
import {getPath} from "../utils/router-paths";

const { Header, Content, Footer } = Layout;

type Props = {
};

type State = {
};

export class MainLayout extends React.Component<Props, State> {

  readonly state = {
    locale: navigator.language,
  };

  render() {
    return <Layout className="layout uk-height-1-1">
      <Header>
        <div className="logo" />
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px', float: 'right' }}
        >
          <Menu.Item key="1"><Link to={getPath('home')}>Featchain</Link></Menu.Item>
          <Menu.Item key="2"><Link to={getPath('authority')}>Become an authority</Link></Menu.Item>
          <Menu.Item key="3"><Link to={getPath('verify')}>Verify an account</Link></Menu.Item>
        </Menu>
      </Header>
      <Content className={'uk-padding-small'}>
        <div className="uk-height-1-1" style={{background: '#fff'}}>
          { this.props.children }
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>FeatChain ©2020 Created by JesusTheHun</Footer>
    </Layout>;
  }
}

export default MainLayout;
