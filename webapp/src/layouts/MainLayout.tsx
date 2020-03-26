import React from 'react';

import { Layout } from 'antd';
import Navbar from "./Navbar";

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
    return <Layout className='uk-height-1-1'>
      <Header>
        <Navbar />
      </Header>
      <Content className='uk-padding-small'>
          { this.props.children }
      </Content>
      <Footer className='uk-text-center'>FeatChain ©2020 Created by <a href="https://jesusthehun.com">JesusTheHun</a></Footer>
    </Layout>;
  }
}

export default MainLayout;
