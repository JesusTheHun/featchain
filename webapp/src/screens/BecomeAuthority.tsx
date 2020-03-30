import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { FormattedMessage } from 'react-intl';
import { Typography, Form, Input, Button } from 'antd';
import {Col, Row} from "antd/es";
import {connect} from 'react-redux';
import { RootState } from 'FeatchainTypes';
import {getPath} from "../utils/router-paths";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {fees, isIssuerAccount} from "featchain-blockchain";
import {utils} from "@liskhq/lisk-transactions";
import {createIssuerAsync} from "../features/featchain/actions/issuer";

type State = {
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

export class BecomeAuthority extends React.Component<Props, State> {

  componentDidMount(): void {
    if (isIssuerAccount(this.props.account.details)) {
      this.props.history.push(getPath("account"));
      return;
    }
  }

  onFinish = (values: any) => {
    this.props.createIssuer({
      ...values,
      passphrase: this.props.account.passphrase,
    });

    this.props.history.push(getPath('account'));
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
        The cost of becoming an authority is {fees.createIssuer} FC
      </Typography.Paragraph>

      <Row justify={'center'} className={'uk-margin-large-top'}>
          <Col xs={22} xl={11}>
            <Form
                  name="normal_login"
                  {...layout}
                  className="login-form"
                  onFinish={this.onFinish}
            >
              <Form.Item
                  label="Account balance"
                  name="balance"
              >
                <Input type="in" defaultValue={this.props.account.details ? utils.convertBeddowsToLSK(this.props.account.details.balance) : 0} disabled />
              </Form.Item>
              <Form.Item
                  label="Cost"
                  name="cost"
              >
                <Input type="in" defaultValue={utils.convertBeddowsToLSK(fees.createIssuer) || 0} disabled />
              </Form.Item>

              <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: 'Please name your organization' }]}
              >
                <Input />
              </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                  <Input.TextArea />
              </Form.Item>

              <Form.Item
                  label="URL"
                  name="authorityUrl"
              >
                <Input />
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

const mapStateToProps = (state: RootState) => ({
  account: state.featchain.account.entity,
});

const mapDispatchToProps = {
  createIssuer: createIssuerAsync.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BecomeAuthority));
