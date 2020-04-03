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
import {Location, UnregisterCallback} from "history";

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

type State = {
    activeKeys: string[];
};

export class Navbar extends React.Component<Props, State> {

    unsubscribe!: UnregisterCallback;

    readonly state = {
      activeKeys: [],
    };

    componentDidMount() {
        this.unsubscribe = this.props.history.listen(location => this.setState({ activeKeys: this.getActiveMenuKeys(location) }));

        this.setState({ activeKeys: this.getActiveMenuKeys(this.props.location) });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    getActiveMenuKeys = (location: Location): string[] => {

        switch (true) {
            case location.pathname.substr(0, getPath('verifyAccount').length) === getPath('verifyAccount'): return ['verifyAccount'];
            case location.pathname === getPath('createAccount'): return ['createAccount'];
            case location.pathname === getPath('signIn'): return ['signIn'];
            case location.pathname === getPath('account'): return ['account'];

            default: return ['home'];
        }
    };

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
            <Menu.Item key='createAccount'>
                <UserAddOutlined/>
                <Link to={getPath('createAccount')}>Create an account</Link>
            </Menu.Item>
            <Menu.Item key='signIn'>
                <LoginOutlined/>
                <Link to={getPath('signIn')}>Sign in</Link>
            </Menu.Item>
        </SubMenu>
    };

    renderConnectedAccountMenu = () => {
        return <SubMenu
            key="account"
            onTitleClick={() => this.props.history.push(getPath('account'))}
            title={
                <span><UserOutlined/> Account</span>
            }
        >
            <Menu.Item key='signIn'>
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
            selectedKeys={this.state.activeKeys}
            forceSubMenuRender={true}
        >
            <Menu.Item key="home"><Link to={getPath('home')}>Featchain</Link></Menu.Item>
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
