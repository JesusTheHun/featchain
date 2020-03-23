import React from 'react';

import { Layout, Menu } from 'antd';
import {Link} from "react-router-dom";
import {getPath} from "../utils/router-paths";
import SubMenu from "antd/es/menu/SubMenu";
import {UserOutlined, UserAddOutlined, LoginOutlined} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

type Props = {
};

type State = {
};

export class MainLayout extends React.Component<Props, State> {

  readonly state = {
    locale: navigator.language,
  };

  renderAccountSubmenu = () => {
    return <span>
      <UserOutlined />
      <span>Account</span>
    </span>
  };

  render() {
    return <Layout className='uk-height-1-1'>
      <Header>
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px', float: 'right' }}
        >
          <Menu.Item key="home"><Link to={getPath('home')}>Featchain</Link></Menu.Item>
          <Menu.Item key="authority"><Link to={getPath('authority')}>Become an authority</Link></Menu.Item>
          <Menu.Item key="verify"><Link to={getPath('verify')}>Verify an account</Link></Menu.Item>
          <SubMenu key="account" title={this.renderAccountSubmenu()}>
            <Menu.Item>
              <UserAddOutlined />
              <Link to={getPath('createAccount')}>Create an account</Link>
            </Menu.Item>
            <Menu.Item>
              <LoginOutlined />
              <Link to={getPath('signIn')}>Sign in</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Header>
      <Content className='uk-height-1-1 uk-padding-small'>
          { this.props.children }
      </Content>
      <Footer className='uk-text-center'>FeatChain ©2020 Created by <a href="https://jesusthehun.com">JesusTheHun</a></Footer>
    </Layout>;
  }
}

export default MainLayout;
