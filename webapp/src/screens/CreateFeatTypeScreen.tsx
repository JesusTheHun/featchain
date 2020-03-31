import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { FormattedMessage } from 'react-intl';
import {Row, Typography, Button, Col, Form, Input} from 'antd';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from "react-router-dom";
import {fees} from "featchain-blockchain";
import {utils} from "@liskhq/lisk-transactions";
import {createFeatTypeAsync} from "../features/featchain/actions/issuer";
import { RootState } from 'FeatchainTypes';
import {getPath} from "../utils/router-paths";

type State = {
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

export class CreateFeatTypeScreen extends React.Component<Props, State> {

  onFinish = (values: any) => {
    this.props.createFeatType({
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
        <FormattedMessage id="hi" defaultMessage={"Create a feat type to award your members"}/>
      </Typography.Title>

      <Typography.Paragraph className={'uk-text-center'}>
        Creating a feat type cost {utils.convertBeddowsToLSK(fees.createFeatType)} FC. You pay this fee only once per type.
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
              <Input type="in" defaultValue={utils.convertBeddowsToLSK(fees.createFeatType) || 0} disabled />
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

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Create feat type
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
  createFeatType: createFeatTypeAsync.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateFeatTypeScreen));
