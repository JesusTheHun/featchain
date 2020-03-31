import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { FormattedMessage } from 'react-intl';
import { Typography } from 'antd';

type Props = {
};

type State = {
};

class HomeScreen extends React.Component<Props, State> {

  render() {
    return <MainLayout>
      <Typography.Title className={'uk-text-center'}>
        <FormattedMessage id="hi" defaultMessage={"Featchain"}/>
      </Typography.Title>

      <Typography.Title className={'uk-text-center'} level={2}>
        <FormattedMessage id="hi" defaultMessage={"The achievement blockchain"}/>
      </Typography.Title>

      <Typography.Paragraph className={'uk-text-center'}>
        Something something
      </Typography.Paragraph>
    </MainLayout>
  }
}

export default HomeScreen;
