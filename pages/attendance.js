import React from 'react';
import { Block } from 'baseui/block';
import { HeadingMedium } from 'baseui/typography';
import { Table } from 'baseui/table';
import Layout from '../components/layout';

function Attendance() {
  return (
    <Block paddingLeft={['20px', '20px', '40px', '40px']} paddingRight={['20px', '20px', '40px', '40px']}>
      <HeadingMedium>Class Attendance</HeadingMedium>
      <Table
        columns={['#', 'Name', 'Age', 'Address']}
        data={[
          [
            '1',
            'Sarah Brown',
            31,
            '100 Broadway St., New York City, New York',
          ],
          [
            '2',
            'Jane Smith',
            32,
            '100 Market St., San Francisco, California',
          ],
        ]}
      />
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
