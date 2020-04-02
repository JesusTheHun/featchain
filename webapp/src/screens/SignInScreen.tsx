import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { FormattedMessage } from 'react-intl';
import { Typography, Form, Input, Button } from 'antd';
import {Col, Row} from "antd/es";
import {connect} from 'react-redux';
import {setAccountCredentials} from "../features/featchain/actions/account";
import lisk from '@liskhq/lisk-client';
import {withRouter, RouteComponentProps} from "react-router-dom";
import {getPath} from "../utils/router-paths";

type State = {
};

type Props = typeof mapDispatchToProps & RouteComponentProps<any>;

export class AuthorityNew extends React.Component<Props, State> {

  onFinish = (values: any) => {
    const { publicKey, address } = lisk.cryptography.getAddressAndPublicKeyFromPassphrase(values.passphrase);

    this.props.setAccountCredentials({
      passphrase: values.passphrase,
      publicKey,
      address,
    });

    this.props.history.push(getPath('account'));
  };

  render() {

    return <MainLayout>
      <Typography.Title className={'uk-text-center'}>
        <FormattedMessage id="hi" defaultMessage={"Sign In"}/>
      </Typography.Title>

      <Row justify={'center'} className={'uk-margin-large-top'}>
          <Col xs={22} xl={11}>
            <Form name="normal_login"
                  className="login-form"
                  onFinish={this.onFinish}
            >
              <Form.Item
                  name="passphrase"
                  rules={[
                    { validator: (_, value) => lisk.passphrase.Mnemonic.validateMnemonic(value) ? Promise.resolve() : Promise.reject('Invalid passphrase') },
                  ]}
              >
                <Input.Password placeholder="Passphrase" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>

            </Form>
          </Col>
      </Row>

    </MainLayout>;
  }
}

const mapStateToProps = () => {};
const mapDispatchToProps = {
  setAccountCredentials,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AuthorityNew));
