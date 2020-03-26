import React from 'react';

import {Layout, Menu} from 'antd';
import Navbar from "./Navbar";
import {getPath} from "../utils/router-paths";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {fetchAccountDetailsAsync} from "../features/featchain/actions/account";
import {connect} from "react-redux";
import { RootState } from 'FeatchainTypes';

const { Header, Content, Footer, Sider } = Layout;

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

type State = {
};

export class AccountLayout extends React.Component<Props, State> {

  readonly state = {
    locale: navigator.language,
  };


  render() {
    return <Layout className='uk-height-1-1'>
      <Header>
        <Navbar />
      </Header>
      <Layout>
        <Sider theme="light" width={300}>

          <Menu>
            <Menu.Item key="accountDetails"><Link to={getPath('account')}>My account</Link></Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content className='uk-height-1-1 uk-padding-small'>
            { this.props.children }
          </Content>
          <Footer className='uk-text-center'>FeatChain ©2020 Created by <a href="https://jesusthehun.com">JesusTheHun</a></Footer>
        </Layout>
      </Layout>
    </Layout>;
  }
}

const mapStateToProps = (state: RootState) => ({
  account: state.featchain.account.entity,
});

const mapDispatchToProps = {
  fetchAccountDetails: fetchAccountDetailsAsync.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountLayout));
