import React from 'react';
import { FormattedMessage } from 'react-intl';
import {Typography, Button, Modal} from 'antd';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from "react-router-dom";
import { RootState, AccountDetails } from 'FeatchainTypes';
import {fetchAccountDetailsAsync} from "../features/featchain/actions/account";
import {getPath} from "../utils/router-paths";
import MainLayout from "../layouts/MainLayout";
import {isIssuerAccount} from "featchain-blockchain";
import FeatTypes from "../components/FeatTypes";
import FeatsReceived from '../components/FeatsReceived';
import AccountDetailsComponent from "../components/AccountDetails";
import QRCodeModal from "../components/QRCodeModal";
import { QrcodeOutlined } from '@ant-design/icons';
import _ from "lodash";

type State = {
  isModalOpen: boolean;
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

export class AccountScreen extends React.Component<Props, State> {

  readonly state = {
    isModalOpen: false,
  };

  componentDidMount() {
    if (!_.isString(this.props.account.entity.passphrase) || _.isEmpty(this.props.account.entity.passphrase)) {
      this.props.history.push(getPath("signIn"));
      return;
    }
  }

  navigateToBecomeAuthority = () => {
    this.props.history.push(getPath('becomeAuthority'));
  };

  toggleModal = () => {
    this.setState(state => ({
      isModalOpen: !state.isModalOpen,
    }));
  };

  onRefresh = () => {
    this.props.fetchAccountDetails(this.props.account.entity.address as string);
  };

  render() {

    const isIssuer = isIssuerAccount(this.props.account.entity.details);

    return <MainLayout>
      <div className="uk-flex uk-flex-column uk-height-1-1">
        <Typography.Title className={'uk-text-center'}>
          <FormattedMessage id="hi" defaultMessage={"Your account"}/>
        </Typography.Title>

        <Modal title="Verify your account" visible={this.state.isModalOpen} footer={[]} onCancel={this.toggleModal}>
          <QRCodeModal address={this.props.account.entity.address as string} />
        </Modal>

        <div className='uk-flex'>
          <div className="uk-flex-none">
            <Button type='primary' icon={<QrcodeOutlined />} onClick={this.toggleModal}>Download your QRCode</Button>
          </div>

          { !isIssuer && !this.props.account.waitingConversion ?
              <div className="uk-flex-none uk-margin-small-left">
                <Button type="ghost" onClick={this.navigateToBecomeAuthority} >
                  Become an authority
                </Button>
              </div> : null
          }
        </div>

        <AccountDetailsComponent />

        { isIssuer || this.props.account.waitingConversion ? <FeatTypes /> : null }
        { !isIssuer && !this.props.account.waitingConversion ? <FeatsReceived
            onRefresh={this.onRefresh}
            isLoading={this.props.account.isLoading || this.props.transaction.isLoading}
            account={this.props.account.entity.details as AccountDetails}
            transactions={this.props.transaction.entities}
        /> : null }

      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountScreen));
