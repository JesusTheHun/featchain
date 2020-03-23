import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { FormattedMessage } from 'react-intl';
import {Row, Typography, Button, Col} from 'antd';
import {connect} from 'react-redux';
import lisk from '@liskhq/lisk-client';
import { SyncOutlined, LoginOutlined } from '@ant-design/icons';
import {setAccountCredentials} from "../features/featchain/actions/account";
import { AccountCredentials } from 'FeatchainTypes';
import {withRouter, RouteComponentProps} from "react-router-dom";
import {getPath} from "../utils/router-paths";

type State = {
  generatedAccount: AccountCredentials;
};

type Props = typeof mapDispatchToProps & RouteComponentProps<any>;

export class CreateAccount extends React.Component<Props, State> {

  readonly state = {
    generatedAccount: {
      passphrase: '',
      publicKey: '',
      address: '',
    },
  };

  generateNewAccount = () => {
    const passphrase = lisk.passphrase.Mnemonic.generateMnemonic();
    const { publicKey, address } = lisk.cryptography.getAddressAndPublicKeyFromPassphrase(passphrase);

    const generatedAccount = {
      passphrase,
      publicKey,
      address,
    };

    this.setState({ generatedAccount });
  };

  login = () => {
      this.props.setAccountCredentials(this.state.generatedAccount);
      this.props.history.push(getPath('account'));
  };

  componentDidMount(): void {
    this.generateNewAccount();
  }

  render() {

    return <MainLayout>
      <Typography.Title className={'uk-text-center'}>
        <FormattedMessage id="hi" defaultMessage={"Create an account"}/>
      </Typography.Title>

      <Typography.Paragraph className={'uk-text-center'}>
        Creating an account to become an issuer or start receiving awards
      </Typography.Paragraph>

      <Row justify='center'>
        <Button type="ghost" icon={<SyncOutlined />} onClick={this.generateNewAccount}>
          Generate a new account
        </Button>
      </Row>

      <Row justify="center" className='uk-margin-large-top'>
        <Col span={1} className='uk-text-right'>Passphrase</Col>
        <Col span={10} offset={1}>
          <Typography.Paragraph copyable code>
            { this.state.generatedAccount.passphrase }
          </Typography.Paragraph>
        </Col>
      </Row>

      <Row justify="center">
        <Col span={1} className='uk-text-right'>Address</Col>
        <Col span={10} offset={1}>
          <Typography.Paragraph copyable>
            { this.state.generatedAccount.address }
          </Typography.Paragraph>
        </Col>
      </Row>

      <Row justify='center' className='uk-margin-large-top'>
        <Button type="primary" icon={<LoginOutlined />} onClick={this.login}>
          Login with this account
        </Button>
      </Row>

    </MainLayout>;
  }
}

const mapStateToProps = () => {};
const mapDispatchToProps = {
  setAccountCredentials,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateAccount));
