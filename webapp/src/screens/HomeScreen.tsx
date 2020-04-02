import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { FormattedMessage } from 'react-intl';
import { Typography } from 'antd';
import Logo from '../images/logo-full.jpg';

type Props = {
};

type State = {
};

class HomeScreen extends React.Component<Props, State> {

  render() {
    return <MainLayout>
      <Typography.Title className={'uk-text-center'}>
        <img src={Logo} height={300} alt="Featchain logo" />
      </Typography.Title>

      <Typography.Title className={'uk-text-center'} level={2}>
        <FormattedMessage id="hi" defaultMessage={"The achievement blockchain"}/>
      </Typography.Title>

      <Typography.Paragraph className={'uk-text-center'}>
        Featchain is the single source of truth for people achievement. <br/>
        Receive awards for your feats and provide tamper proof records to institutions or companies who want to check on you.
      </Typography.Paragraph>
    </MainLayout>
  }
}

export default HomeScreen;
