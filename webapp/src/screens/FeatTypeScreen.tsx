import React from 'react';
import MainLayout from '../layouts/MainLayout';
import {Typography, notification} from 'antd';
import {connect} from 'react-redux';
import { RootState } from 'FeatchainTypes';
import {Link, RouteComponentProps} from "react-router-dom";
import {fetchFeatTypeIssuer} from "../services/featchain";
import {IssuerAccount} from 'featchain-blockchain';
import { FormattedMessage } from 'react-intl';
import {getPath} from "../utils/router-paths";

type State = {
  featTypeIssuer: IssuerAccount;
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

export class FeatTypeScreen extends React.Component<Props, State> {

  readonly state = {
    featTypeIssuer: {} as IssuerAccount,
  };

  componentDidMount() {
    this.loadData(this.props.match.params.featTypeId);
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (prevProps.match.params.featTypeId !== this.props.match.params.featTypeId) {
      this.loadData(this.props.match.params.featTypeId);
    }
  }

  loadData = (featTypeId: string) => {
    fetchFeatTypeIssuer(featTypeId).then(featTypeIssuer => {
      this.setState({ featTypeIssuer });
    }).catch(err => notification.error({
      message: "API error",
      description: err.message,
      placement: "bottomRight",
    }));
  };

  render() {
    if (!this.state.featTypeIssuer.address) return null;

    const {featTypeId} = this.props.match.params;
    const featType = this.state.featTypeIssuer.asset.featTypes[featTypeId];

    return <MainLayout>
      <Typography.Title className={'uk-text-center'}>
        {featType.title}
      </Typography.Title>

      <Typography.Title className={'uk-text-center'} level={4}>
        <FormattedMessage
            id='awardCount'
            defaultMessage="Awarded {count} time(s) by {link}"
            values={{
              count: featType.awardCount,
              link: <Link to={getPath('authority', this.state.featTypeIssuer.address)}>{this.state.featTypeIssuer.asset.title}</Link>,
            }}
        />
      </Typography.Title>

      <Typography.Paragraph className={'uk-text-center'}>
        {featType.description}
      </Typography.Paragraph>

    </MainLayout>;
  }
}

const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(FeatTypeScreen);
