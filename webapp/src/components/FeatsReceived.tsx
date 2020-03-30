import React from "react";
import {Award, PersonAccount, CreateFeatTypeTransaction, isPersonAccount} from "featchain-blockchain";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {getPath} from "../utils/router-paths";
import {Button, Card, Empty, Row, Table} from "antd";
import {fetchAccountDetailsWish} from "../features/featchain/actions/account";
import {connect} from "react-redux";
import { RootState } from 'FeatchainTypes';
import _ from "lodash";
import moment from "moment";
import {SyncOutlined} from "@ant-design/icons/lib";

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
        const data: Array<Award & { title: string }> = [];

        Object.values(account.asset.awardsReceived).forEach(entry => {
            const tx = this.props.transaction[entry.featTypeId] as CreateFeatTypeTransaction;

            if (tx) {
                data.push({
                    ...entry,
                    title: tx.asset.title,
                });
            }
        });

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

        return <Card
            title="Feats received"
            extra={<Button icon={<SyncOutlined spin={this.props.account.isLoading} />} onClick={this.refreshAccountDetails} />}
            className="uk-margin-small-top"
        >
            <Table columns={columns} dataSource={data} pagination={data.length > 10 ? {} : false}/>
        </Card>
    }
}

const mapStateToProps = (state: RootState) => ({
    account: state.featchain.account,
    transaction: state.featchain.transaction.entities,
});

const mapDispatchToProps = {
    fetchAccountDetails: fetchAccountDetailsWish,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FeatsReceived));
