import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { FormattedMessage } from 'react-intl';
import {Row, Typography, Button, Col, Form, Input, DatePicker} from 'antd';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps, match} from "react-router-dom";
import {fees, FeatTypeId, IssuerAccount, isIssuerAccount} from "featchain-blockchain";
import {utils} from "@liskhq/lisk-transactions";
import {awardFeatAsync} from "../features/featchain/actions/issuer";
import { RootState } from 'FeatchainTypes';
import {getPath} from "../utils/router-paths";
import _ from "lodash";
import {FormInstance} from "antd/es/form";
import moment from "moment";

type State = {
  personCount: number;
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any> & {
  match: match<{ featTypeId: FeatTypeId }>;
}

export class AwardFeat extends React.Component<Props, State> {

  readonly state = {
    personCount: 0,
  };

  readonly formRef = React.createRef<FormInstance>();

  componentDidMount(): void {
    if (!isIssuerAccount(this.props.account.details)) {
      this.props.history.push(getPath("account"));
      return;
    }
  }

  onFinish = (values: any) => {
    const addresses = this.getAddresses(values.addresses);
    const cost = Number(fees.awardFeat) * addresses.length;
    const dateValue = values.date instanceof moment ? values.date.valueOf() : undefined;

    this.props.awardFeat({
      featTypeId: this.props.match.params.featTypeId,
      addresses,
      date: dateValue,
      comment: values.comment,
      passphrase: this.props.account.passphrase as string,
      amount: cost.toString(),
    });

    this.props.history.push(getPath('account'));
  };

  getAddresses = (txt: string) => {
    if (!_.isString(txt)) return [];

    return _.uniq(txt.split("\n").filter(entry => entry.length > 0));
  };

  onChange = (changedValues: any, allValues: any) => {
    const personCount = this.getAddresses(allValues.addresses).length;
    const cost = Number(fees.awardFeat) * personCount;

    this.setState({ personCount });

    if (this.formRef && this.formRef.current) {
      this.formRef.current.setFieldsValue({ cost: utils.convertBeddowsToLSK(cost.toString()) });
    }
  };

  render() {

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

    const account = this.props.account.details as IssuerAccount;
    const featType = account.asset.featTypes[this.props.match.params.featTypeId];

    return <MainLayout>
      <Typography.Title className={'uk-text-center'}>
        <FormattedMessage id="hi" defaultMessage={"Award your members"}/>
      </Typography.Title>

      <Typography.Paragraph className={'uk-text-center'}>
        Awards cost {utils.convertBeddowsToLSK(fees.createFeatType)} FC per person.
      </Typography.Paragraph>

      <Row justify={'center'} className={'uk-margin-large-top'}>
        <Col xs={22} xl={11}>
          <Form
              ref={this.formRef}
              name="normal_login"
              {...layout}
              className="login-form"
              onFinish={this.onFinish}
              onValuesChange={this.onChange}
          >
            <Form.Item
                label="Feat type"
                name="featType"
            >
              <Input defaultValue={featType.title} disabled />
            </Form.Item>

            <Form.Item
                label="Account balance"
                name="balance"
            >
              <Input defaultValue={this.props.account.details ? utils.convertBeddowsToLSK(this.props.account.details.balance) : 0} disabled />
            </Form.Item>

            <Form.Item
                label="Cost"
                name="cost"
            >
              <Input defaultValue={0} disabled />
            </Form.Item>

            <Form.Item name="date" label="DatePicker" rules={[{ type: 'object', required: false, message: 'Please select a date' }]}>
              <DatePicker />
            </Form.Item>

            <Form.Item
                label="Comment"
                name="comment"
            >
              <Input.TextArea />
            </Form.Item>


            <Form.Item
                label="List of addresses, one per line"
                name="addresses"
                rules={[{ type: 'string', required: true, message: 'Enter one address per line' }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" disabled={this.state.personCount === 0}>
                { this.state.personCount === 0 ? "Enter at least one address" : `Award ${this.state.personCount} persons`}
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
  awardFeat: awardFeatAsync.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AwardFeat));
