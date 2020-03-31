import React from 'react';
import MainLayout from '../layouts/MainLayout';
import {Typography, notification, List, Empty, Col, Row} from 'antd';
import {connect} from 'react-redux';
import { RootState } from 'FeatchainTypes';
import {RouteComponentProps} from "react-router-dom";
import {fetchAccountDetails} from "../services/featchain";
import {IssuerAccount} from 'featchain-blockchain';
import { FormattedMessage } from 'react-intl';

type State = {
  issuer: IssuerAccount;
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & RouteComponentProps<any>;

export class IssuerScreen extends React.Component<Props, State> {

  readonly state = {
    issuer: {} as IssuerAccount,
  };

  componentDidMount() {
    this.loadData(this.props.match.params.issuerId);
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (prevProps.match.params.issuerId !== this.props.match.params.issuerId) {
      this.loadData(this.props.match.params.issuerId);
    }
  }

  loadData = (issuerId: string) => {
    fetchAccountDetails<IssuerAccount>(issuerId).then(issuer => {
      this.setState({ issuer });
    }).catch(err => notification.error({
      message: "API error",
      description: err.message,
      placement: "bottomRight",
    }));
  };

  render() {
    if (!this.state.issuer.address) return null;

    const issuer = this.state.issuer.asset;

    return <MainLayout>
      <Typography.Title className={'uk-text-center'}>
        {issuer.title}
      </Typography.Title>

      { issuer.authorityUrl ?
          <Typography.Paragraph className={'uk-text-center'}>
            <a href={issuer.authorityUrl}>
              <FormattedMessage id='visitWebsite' defaultMessage="Visit their website" />
            </a>
          </Typography.Paragraph> : null
      }

      <Typography.Paragraph className={'uk-text-center'}>
        {issuer.description}
      </Typography.Paragraph>

      <Typography.Title className={'uk-text-center'} level={4}>
        Feat types registered
      </Typography.Title>

      { Object.values(issuer.featTypes).length > 0 ?
          <Row justify={'center'} className={'uk-margin-large-top'}>
            <Col xs={24} md={16}>
              <List
                  dataSource={Object.values(issuer.featTypes)}
                  renderItem={item => <List.Item>
                    <List.Item.Meta
                        title={<FormattedMessage
                            id='awardCount'
                            defaultMessage="{title} - Awarded {count} time(s)"
                            values={{
                              title: item.title,
                              count: item.awardCount,
                            }}
                        />}
                        description={item.description}
                    />
                  </List.Item>
                  }
              />
            </Col>
          </Row> : <Empty />
      }

    </MainLayout>;
  }
}

const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(IssuerScreen);
