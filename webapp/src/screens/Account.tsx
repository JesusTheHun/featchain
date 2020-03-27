import React from 'react';
import { FormattedMessage } from 'react-intl';
import {Typography, Button} from 'antd';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from "react-router-dom";
import { RootState } from 'FeatchainTypes';
import {fetchAccountDetailsAsync} from "../features/featchain/actions/account";
import {getPath} from "../utils/router-paths";
import MainLayout from "../layouts/MainLayout";
import {isIssuerAccount} from "featchain-transactions/dist/utils/type-utils";
import FeatTypes from "../components/FeatTypes";
import FeatsReceived from '../components/FeatsReceived';
import AccountDetails from "../components/AccountDetails";

type State = {
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

export class Account extends React.Component<Props, State> {

  navigateToBecomeAuthority = () => {
    this.props.history.push(getPath('becomeAuthority'));
  };

  render() {

    const isIssuer = isIssuerAccount(this.props.account.entity.details);

    return <MainLayout>
      <div className="uk-flex uk-flex-column uk-height-1-1">
        <Typography.Title className={'uk-text-center'}>
          <FormattedMessage id="hi" defaultMessage={"Your account"}/>
        </Typography.Title>

        { !isIssuer && !this.props.account.waitingConversion ?
          <div className="uk-flex-none">
            <Button type="ghost" onClick={this.navigateToBecomeAuthority} >
              Become an authority
            </Button>
          </div> : null
        }

        <AccountDetails />

        { isIssuer || this.props.account.waitingConversion ? <FeatTypes /> : null }
        { !isIssuer && !this.props.account.waitingConversion ? <FeatsReceived /> : null }

      </div>
    </MainLayout>;
  }
}

const mapStateToProps = (state: RootState) => ({
  account: state.featchain.account,
});

const mapDispatchToProps = {
  fetchAccountDetails: fetchAccountDetailsAsync.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Account));
