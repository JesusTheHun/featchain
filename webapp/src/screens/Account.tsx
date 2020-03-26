import React from 'react';
import { FormattedMessage } from 'react-intl';
import {Empty, Typography, Row, Button, Card, Table} from 'antd';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps, Link} from "react-router-dom";
import { RootState } from 'FeatchainTypes';
import {fetchAccountDetailsAsync} from "../features/featchain/actions/account";
import {getPath} from "../utils/router-paths";
import MainLayout from "../layouts/MainLayout";
import _ from "lodash";
import {SyncOutlined} from "@ant-design/icons";
import {utils} from "@liskhq/lisk-transactions";
import {isIssuerAccount} from "featchain-transactions/dist/utils/type-utils";
import {FeatType, IssuerAccount} from "../../../blockchain/typings/featchain";

type State = {
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

export class Account extends React.Component<Props, State> {

  interval: NodeJS.Timeout;

  constructor(props: Props, context: any) {
    super(props, context);

    this.interval = setInterval(() => this.refreshAccountDetails(), 10 * 1000)
  }

  componentDidMount() {
    this.refreshAccountDetails();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  refreshAccountDetails = () => {
    if (!_.isString(this.props.account.entity.address) || _.isEmpty(this.props.account.entity.address)) {
      this.props.history.push(getPath("signIn"));
      return;
    }

    this.props.fetchAccountDetails(this.props.account.entity.address)
  };

  navigateToBecomeAuthority = () => {
    this.props.history.push(getPath('becomeAuthority'));
  };

  navigateToCreateFeatType = () => {
    this.props.history.push(getPath('createFeatType'));
  };

  renderEmptyFeatTypesCard = () => {
    return <Card
        title="Feat types"
        extra={<Button icon={<SyncOutlined spin={this.props.account.isLoading} />} onClick={this.refreshAccountDetails} />}
        className="uk-margin-small-top"
        loading={this.props.account.waitingConversion}
    >
      <Row align="middle" justify="center" className="uk-flex-1">
            <Empty description="No feat type yet" image={Empty.PRESENTED_IMAGE_SIMPLE}>
              <Button type="primary" onClick={this.navigateToCreateFeatType}>Create Now</Button>
            </Empty>
      </Row>
    </Card>
  };

  renderFeatTypesCard = () => {

    if (!isIssuerAccount(this.props.account.entity.details)) return null;

    const account = this.props.account.entity.details as IssuerAccount;
    const data = Object.values(account.asset.featTypes);

    if (data.length === 0) {
      return this.renderEmptyFeatTypesCard();
    }

    const columns = [
      {
        title: "Title",
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: "Description",
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: "Award count",
        dataIndex: 'awardCount',
        key: 'awardCount',
      },
      {
        title: "",
        key: "actions",
        render: (text: any, item: FeatType) => (
            <span>
              <Link to={getPath('award', item.id)} >Award people</Link>
            </span>
        )
      },
    ];

    return <Card
        title="Feat types"
        extra={<Button icon={<SyncOutlined spin={this.props.account.isLoading} />} onClick={this.refreshAccountDetails} />}
        className="uk-margin-small-top"
        loading={this.props.account.waitingConversion}
    >

      <Table columns={columns} dataSource={data} pagination={data.length > 10 ? {} : false}/>
    </Card>
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

        <Card
            title="Account details"
            extra={<Button icon={<SyncOutlined spin={this.props.account.isLoading} />} onClick={this.refreshAccountDetails} />}
            className="uk-margin-small-top"
        >
          <div>
            <strong>Address</strong> :  <Typography.Text copyable>
            {this.props.account.entity.address}
          </Typography.Text>
          </div>
          <div>
            <strong>Balance</strong> : {this.props.account.entity.details ? utils.convertBeddowsToLSK(this.props.account.entity.details.balance) : 0} FC
          </div>
        </Card>

        { isIssuer || this.props.account.waitingConversion ? this.renderFeatTypesCard() : null }

        { !isIssuerAccount(this.props.account.entity.details) && !this.props.account.waitingConversion ?
            <Row align="middle" justify="center" className="uk-flex-1">
              <Empty description="No feat received yet" />
            </Row>
            : null
        }

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
