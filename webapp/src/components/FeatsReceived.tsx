import React from "react";
import {Award, PersonAccount, CreateFeatTypeTransaction, isPersonAccount} from "featchain-blockchain";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {Button, Card, Empty, List, Row, Table} from "antd";
import {connect} from "react-redux";
import { RootState, AccountDetails } from 'FeatchainTypes';
import moment from "moment";
import {SyncOutlined} from "@ant-design/icons/lib";
import {TransactionState} from "../features/featchain/reducers/transaction";
import {getPath} from "../utils/router-paths";

type State = {
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any> & {
    onRefresh?: () => void;
    isLoading?: boolean;
    account: AccountDetails;
    transactions: TransactionState["entities"];
};

export class FeatsReceived extends React.Component<Props, State> {

    static defaultProps = {
        isLoading: false,
    };

    refreshAccountDetails = () => {
        if (this.props.onRefresh) {
            this.props.onRefresh();
        }
    };

    renderEmptyFeatList = () => {
        return <Row align="middle" justify="center" className="uk-flex-1">
            <Empty description="No feat received yet" />
        </Row>
    };

    render() {
        if (!isPersonAccount(this.props.account)) return this.renderEmptyFeatList();
        if (!this.props.account.asset.awardsReceived) return this.renderEmptyFeatList();

        const account = this.props.account as PersonAccount;
        const data: Array<Award & { title: string }> = [];

        Object.values(account.asset.awardsReceived).forEach(entry => {
            const tx = this.props.transactions[entry.featTypeId] as CreateFeatTypeTransaction;

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
                render: (value: string, item: Award) => <Link to={getPath('featType', item.featTypeId)} >{value}</Link>,
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
            extra={this.props.onRefresh ? <Button icon={<SyncOutlined spin={this.props.isLoading} />} onClick={this.refreshAccountDetails} /> : null}
            className="uk-margin-small-top"
        >
            <Table columns={columns} dataSource={data} pagination={data.length > 10 ? {} : false} tableLayout='fixed' className="uk-visible@m"/>
            <List
                className="uk-hidden@m"
                dataSource={data}
                renderItem={item => <List.Item>
                        <List.Item.Meta
                            title={`${item.title} - ${moment(item.date).calendar()}`}
                            description={item.comment}
                        />
                    </List.Item>
                }
            />
        </Card>
    }
}

const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FeatsReceived));
