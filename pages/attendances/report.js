/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { HeadingMedium, ParagraphMedium, ParagraphSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { getSession } from 'next-auth/react';
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic';
import { useStyletron } from 'baseui';
import { ArrowBendUpLeft } from 'phosphor-react';
import { Button, SIZE } from 'baseui/button';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import ReportQuery from '../../graphql/queries/report.query';
import { fetchAPI } from '../../lib/api';

function Report({ faculty }) {
  const [css, theme] = useStyletron();
  const router = useRouter();

  const { course: { data: { attributes: { code, students, attendances } } } } = faculty.attributes;

  const TABLE_DATA = students.data.map((student, index) => {
    const {
      uid, firstName, middleName, lastName,
    } = student.attributes;

    const classes = attendances.data.length;

    const present = student.attributes.attendances.data.map((st) => {
      const { content } = st.attributes;
      return content.filter((c) => c.id === student.id && c.status === true).length;
    }).reduce((p, c) => p + c, 0);

    const absent = student.attributes.attendances.data.map((st) => {
      const { content } = st.attributes;
      return content.filter((c) => c.id === student.id && c.status === false).length;
    }).reduce((p, c) => p + c, 0);

    const presentValue = parseInt(present, 10);
    const classesValue = parseInt(classes, 10);
    const percent = ((presentValue / classesValue) * 100);

    return {
      sn: index + 1,
      student: `${lastName}, ${firstName} ${middleName}`,
      studentUID: uid,
      classes: classes || 0,
      present: present || 0,
      absent: absent || 0,
      percentage: percent || 0,
    };
  });

  return (
    <Block
      paddingLeft={['20px', '20px', '40px', '40px']}
      paddingRight={['20px', '20px', '40px', '40px']}
    >
      <Block marginTop="20px">
        <Button
          startEnhancer={(<ArrowBendUpLeft />)}
          onClick={() => router.back()}
          size={SIZE.compact}
        >
          Go Back
        </Button>
      </Block>
      <Block marginTop="20px" display="flex" justifyContent="space-between" alignItems="center">
        <HeadingMedium marginTop={0} marginBottom={0}>
          {`${code} Attendance Report`}
        </HeadingMedium>
      </Block>
      <Block marginTop="20px">
        <TableBuilder data={TABLE_DATA}>
          <TableBuilderColumn header="#">
            {(row) => <ParagraphSmall maxWidth="30px">{row.sn}</ParagraphSmall>}
          </TableBuilderColumn>
          <TableBuilderColumn header="STUDENT">
            {(row) => (
              <Block>
                <ParagraphMedium margin={0} className={css({ fontWeight: '600' })}>
                  {row.student}
                </ParagraphMedium>
                <p style={{ margin: 0, letterSpacing: '1px', color: theme.colors.mono700 }}>
                  {row.studentUID}
                </p>
              </Block>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="CLASSES">
            {(row) => (
              <ParagraphSmall>
                {row.classes !== 1 ? `${row.classes} classes` : `${row.classes} class`}
              </ParagraphSmall>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="PRESENT">
            {(row) => (
              <ParagraphSmall>
                {row.present !== 1 ? `${row.present} classes` : `${row.present} class`}
              </ParagraphSmall>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="ABSENT">
            {(row) => (
              <ParagraphSmall>
                {row.absent !== 1 ? `${row.absent} classes` : `${row.absent} class`}
              </ParagraphSmall>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="TOTAL %" numeric sortable>
            {(row) => <ParagraphSmall>{`${row.percentage}%`}</ParagraphSmall>}
          </TableBuilderColumn>
        </TableBuilder>
      </Block>
    </Block>
  );
}

Report.propTypes = {
  faculty: PropTypes.object.isRequired,
};

Report.getLayout = function getLayout(page) {
  return (<Layout>{page}</Layout>);
};

export default Report;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        source: '/attendances/report',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const { user: { facultyID }, jwt } = session;

  const { data } = await fetchAPI({
    query: ReportQuery,
    variables: { id: facultyID },
    token: jwt,
  });

  return { props: { session, faculty: data.faculty.data } };
}
