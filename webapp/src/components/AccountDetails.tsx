import React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {getPath} from "../utils/router-paths";
import {Button, Card, Typography} from "antd";
import {fetchAccountDetailsAsync} from "../features/featchain/actions/account";
import {connect} from "react-redux";
import {SyncOutlined} from "@ant-design/icons";
import { RootState } from 'FeatchainTypes';
import _ from "lodash";
import {utils} from "@liskhq/lisk-transactions";

type State = {
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

export class AccountDetails extends React.Component<Props, State> {

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

    render() {
        return <Card
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
    }
}

const mapStateToProps = (state: RootState) => ({
    account: state.featchain.account,
});

const mapDispatchToProps = {
    fetchAccountDetails: fetchAccountDetailsAsync.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountDetails));
