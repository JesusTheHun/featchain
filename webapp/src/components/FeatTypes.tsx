import React from "react";
import {isIssuerAccount} from "featchain-transactions/dist/utils/type-utils";
import {FeatType, IssuerAccount} from "../../../blockchain/typings/featchain";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {getPath} from "../utils/router-paths";
import {Button, Card, Empty, Row, Table} from "antd";
import {fetchAccountDetailsAsync} from "../features/featchain/actions/account";
import {connect} from "react-redux";
import {SyncOutlined} from "@ant-design/icons";
import { RootState } from 'FeatchainTypes';
import _ from "lodash";

type State = {
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

export class FeatTypes extends React.Component<Props, State> {

    refreshAccountDetails = () => {
        if (!_.isString(this.props.account.entity.address) || _.isEmpty(this.props.account.entity.address)) {
            this.props.history.push(getPath("signIn"));
            return;
        }

        this.props.fetchAccountDetails(this.props.account.entity.address)
    };

    navigateToCreateFeatType = () => {
        this.props.history.push(getPath('createFeatType'));
    };

    renderEmptyFeatTypes = () => {
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

    render() {
        if (!isIssuerAccount(this.props.account.entity.details)) return null;

        const account = this.props.account.entity.details as IssuerAccount;
        const data = Object.values(account.asset.featTypes);

        if (data.length === 0) {
            return this.renderEmptyFeatTypes();
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
                render: (value: any, item: FeatType) => (
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
    }
}

const mapStateToProps = (state: RootState) => ({
    account: state.featchain.account,
});

const mapDispatchToProps = {
    fetchAccountDetails: fetchAccountDetailsAsync.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FeatTypes));
