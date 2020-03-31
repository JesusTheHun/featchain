import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { FormattedMessage } from 'react-intl';
import {Typography, Form, Input, notification} from 'antd';
import {Col, Row} from "antd/es";
import {connect} from 'react-redux';
import { RootState, AccountDetails } from 'FeatchainTypes';
import {RouteComponentProps, withRouter} from "react-router-dom";
import {fetchAccountDetailsAsync} from "../features/featchain/actions/account";
import {FormInstance} from "antd/es/form";
import FeatsReceived from "../components/FeatsReceived";
import {fetchFeatsReceived, FeatsReceived as FeatsReceivedType} from "../services/featchain";
import {getPath} from "../utils/router-paths";

type State = {
  account: AccountDetails;
  featsReceived: FeatsReceivedType;
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

export class VerifyAccountScreen extends React.Component<Props, State> {
  readonly formRef = React.createRef<FormInstance>();

  readonly state = {
    account: {} as AccountDetails,
    featsReceived: {},
  };

  componentDidMount() {
    this.loadData(this.props.match.params.address);
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (prevProps.match.params.address !== this.props.match.params.address) {
      this.loadData(this.props.match.params.address);
    }
  }

  loadData = (address: string) => {
    if (address && this.isAddressValid(address)) {
      if (this.formRef && this.formRef.current) {
        this.formRef.current.setFieldsValue({ address });

        fetchFeatsReceived(address).then(({account, featsReceived}) => {
          this.setState({ account, featsReceived })
        }).catch(err => notification.error({
          message: "API error",
          description: err.message,
          placement: "bottomRight",
        }));
      }
    }
  };

  isAddressValid = (address: string) => address.substr(-1) === 'L';

  onFormChange = (changedValues: any, {address}: any) => {
    if (this.isAddressValid(address)) {
      this.props.history.push(getPath('verifyAccount', address));
    }
  };

  render() {

    return <MainLayout>
      <Typography.Title className={'uk-text-center'}>
        <FormattedMessage id="hi" defaultMessage={"Verify an account"}/>
      </Typography.Title>

      <Row justify={'center'} className={'uk-margin-large-top'}>
          <Col xs={22}>
            <Form
                ref={this.formRef}
                name="normal_login"
                className="login-form"
                onValuesChange={this.onFormChange}
            >

              <Form.Item name="address">
                <Input placeholder={"Address"} />
              </Form.Item>

            </Form>

            { this.state.account.address ? <FeatsReceived
                account={this.state.account as AccountDetails}
                transactions={this.state.featsReceived}
            /> : null }

          </Col>
      </Row>

    </MainLayout>;
  }
}

const mapStateToProps = (state: RootState) => ({
  account: state.featchain.account,
  transaction: state.featchain.transaction,
});

const mapDispatchToProps = {
  fetchAccountDetails: fetchAccountDetailsAsync.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VerifyAccountScreen));
