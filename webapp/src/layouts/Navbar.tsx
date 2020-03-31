import {Menu} from "antd";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {getPath} from "../utils/router-paths";
import SubMenu from "antd/es/menu/SubMenu";
import React from "react";
import {UserAddOutlined} from '@ant-design/icons';
import {LoginOutlined, UserOutlined} from "@ant-design/icons/lib";
import {
    deleteAccountCredentials,
    fetchAccountDetailsAsync,
} from "../features/featchain/actions/account";
import {connect} from "react-redux";
import { RootState } from 'FeatchainTypes';

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

type State = {
};

export class Navbar extends React.Component<Props, State> {

    logout = (e: React.MouseEvent) => {
        e.preventDefault();

        this.props.deleteAccountCredentials();
        this.props.history.push(getPath("signIn"));
    };

    renderAnonymousAccountMenu = () => {
        return <SubMenu
            key="account"
            title={
            <span>
                <UserOutlined/>
                <span>Account</span>
                </span>
            }
        >
            <Menu.Item>
                <UserAddOutlined/>
                <Link to={getPath('createAccount')}>Create an account</Link>
            </Menu.Item>
            <Menu.Item>
                <LoginOutlined/>
                <Link to={getPath('signIn')}>Sign in</Link>
            </Menu.Item>
        </SubMenu>
    };

    renderConnectedAccountMenu = () => {
        return <SubMenu
            key="account"
            title={
                <Link to={getPath('account')}><UserOutlined/> Account</Link>
            }
        >
            <Menu.Item>
                <LoginOutlined/>
                <a href={getPath('signIn')} onClick={this.logout}>Logout</a>
            </Menu.Item>
        </SubMenu>
    };

    render() {
        return <Menu
            theme="dark"
            mode="horizontal"
            style={{lineHeight: '64px', float: 'right'}}
            defaultSelectedKeys={["home"]}
        >
            <Menu.Item key="home"><Link to={getPath('home')}>Featchain</Link></Menu.Item>
            <Menu.Item key="authority"><Link to={getPath('becomeAuthority')}>Become an authority</Link></Menu.Item>
            <Menu.Item key="verifyAccount"><Link to={getPath('verifyAccount')}>Verify an account</Link></Menu.Item>
            {this.props.account.passphrase ? this.renderConnectedAccountMenu() : this.renderAnonymousAccountMenu()}
        </Menu>
    }
}

const mapStateToProps = (state: RootState) => ({
    account: state.featchain.account.entity,
});

const mapDispatchToProps = {
    deleteAccountCredentials,
    fetchAccountDetails: fetchAccountDetailsAsync.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));
