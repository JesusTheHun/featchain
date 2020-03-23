import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { FormattedMessage } from 'react-intl';
import { Typography, Form, Input, Button } from 'antd';
import {Col, Row} from "antd/es";
import { Store } from 'rc-field-form/lib/interface';
import {connect} from 'react-redux';
import { RootState } from 'FeatchainTypes';

type Props = {
};

type State = {
};

export class AuthorityNew extends React.Component<Props, State> {

  onFinish = (values: Store) => {
    console.log(values);

  };

  render() {

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

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
                  {...layout}
                  className="login-form"
                  onFinish={this.onFinish}
            >
              <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: 'Please input the name of your organization' }]}
              >
                <Input />
              </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please describe your organization' }]}
                >
                  <Input />
              </Form.Item>

              <Form.Item
                  label="Passphrase"
                  name="passphrase"
                  rules={[{ required: true, message: 'Please input your account passphrase' }]}
              >
                <Input.Password placeholder="Passphrase" />
              </Form.Item>

              <Form.Item {...tailLayout}>
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

export default connect((state: RootState) => ({

}))(AuthorityNew);
