import React from "react";
import {PersonAccount} from "../../../blockchain/typings/featchain";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {getPath} from "../utils/router-paths";
import {Empty, Row, Table} from "antd";
import {fetchAccountDetailsWish} from "../features/featchain/actions/account";
import {connect} from "react-redux";
import { RootState } from 'FeatchainTypes';
import _ from "lodash";
import moment from "moment";
import {isPersonAccount} from "featchain-transactions/dist/utils/type-utils";
import {fetchTransactionsAsync} from "../features/featchain/actions/transaction";

type State = {
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

export class FeatsReceived extends React.Component<Props, State> {

    componentDidMount() {
        this.refreshAccountDetails();
    }

    refreshAccountDetails = () => {
        if (!_.isString(this.props.account.entity.address) || _.isEmpty(this.props.account.entity.address)) {
            this.props.history.push(getPath("signIn"));
            return;
        }

        this.props.fetchAccountDetails(this.props.account.entity.address)
    };

    renderEmptyFeatList = () => {
        return <Row align="middle" justify="center" className="uk-flex-1">
            <Empty description="No feat received yet" />
        </Row>
    };

    render() {
        if (!isPersonAccount(this.props.account.entity.details)) return null;

        const account = this.props.account.entity.details as PersonAccount;
        const data = Object.values(account.asset.awardsReceived);

        if (data.length === 0) return this.renderEmptyFeatList();

        const columns = [
            {
                title: "Title",
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: "Comment",
                dataIndex: 'comment',
                key: 'comment',
            },
            {
                title: "Date",
                dataIndex: 'date',
                key: 'date',
                render: (value: number) => moment(value).calendar(),
            },
        ];

        return <Table columns={columns} dataSource={data} pagination={data.length > 10 ? {} : false}/>;
    }
}

const mapStateToProps = (state: RootState) => ({
    account: state.featchain.account,
});

const mapDispatchToProps = {
    fetchAccountDetails: fetchAccountDetailsWish,
    fetchTransactions: fetchTransactionsAsync.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FeatsReceived));
