import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { FormattedMessage } from 'react-intl';
import { Typography, Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import {Col, Row} from "antd/es";
import { Store } from 'rc-field-form/lib/interface';
import {connect} from 'react-redux';

type Props = {
};

type State = {
};

class AuthorityNew extends React.Component<Props, State> {

  onFinish = (values: Store) => {
    console.log(values);

  };

  render() {
    return <MainLayout>
      <Typography.Title className={'uk-text-center'}>
        <FormattedMessage id="hi" defaultMessage={"Becoming an authority"}/>
      </Typography.Title>

      <Typography.Paragraph className={'uk-text-center'}>
        The cost of becoming an authority is 5000 FC
      </Typography.Paragraph>

      <Row justify={'center'} className={'uk-margin-large-top'}>
          <Col xs={22} xl={11}>
            <Form name="normal_login"
                  className="login-form"
                  onFinish={this.onFinish}
            >
              <Form.Item
                  name="passphrase"
                  rules={[{ required: true, message: 'Please input your account passphrase' }]}
              >
                <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Passphrase" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Become an authority
                </Button>
              </Form.Item>
            </Form>
          </Col>
      </Row>

    </MainLayout>;
  }
}

export default AuthorityNew;
