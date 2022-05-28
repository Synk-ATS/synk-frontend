import React from 'react';
import { Block } from 'baseui/block';
import { HeadingMedium } from 'baseui/typography';
import Layout from '../components/layout';

function Attendance() {
  return (
    <Block>
      <HeadingMedium>Class Attendance</HeadingMedium>
    </Block>
  );
}

Attendance.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};

export default Attendance;
