/* eslint-disable react/forbid-prop-types,react/jsx-boolean-value */
import React from 'react';
import { getSession } from 'next-auth/react';
import { useMutation } from '@apollo/client';
import { Block } from 'baseui/block';
import {
  HeadingLarge, HeadingXSmall, ParagraphLarge, ParagraphMedium,
} from 'baseui/typography';
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic';
import { Avatar } from 'baseui/avatar';
import { Button, SIZE } from 'baseui/button';
import { ArrowBendUpLeft, Check, X } from 'phosphor-react';
import { useStyletron } from 'baseui';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Countdown from 'react-countdown';
import Layout from '../../components/layout';
import { AttendanceQuery } from '../../graphql/queries/attendance.query';
import UpdateAttendanceMutation from '../../graphql/mutations/update-attendance.mutation';
import DeleteAttendanceMutation from '../../graphql/mutations/delete-attendance.mutation';
import { fetchAPI } from '../../lib/api';

function Attendance({ attendance, session }) {
  const [css, theme] = useStyletron();
  const router = useRouter();

  const {
    course, date, content, open, timer,
  } = attendance.data.attributes;

  const DATA = content?.map((c, index) => ({
    id: index + 1,
    uid: c.uid,
    avatar: c.avatar,
    name: c.name,
    status: c.status,
  }));

  const [updateAttendance] = useMutation(UpdateAttendanceMutation, {
    context: { headers: { Authorization: `Bearer ${session.jwt}` } },
  });

  const [deleteAttendance] = useMutation(DeleteAttendanceMutation, {
    variables: { id: attendance.data.id },
    context: { headers: { Authorization: `Bearer ${session.jwt}` } },
  });

  const renderer = ({ minutes, seconds }) => (
    <HeadingXSmall marginTop={0} marginBottom={0}>
      {`${minutes}:${seconds}`}
    </HeadingXSmall>
  );

  const manuallyUpdate = async (value, uid) => {
    const studentIndex = content.findIndex((x) => x.uid === uid);
    content[studentIndex].status = value;

    await updateAttendance({
      variables: { id: attendance.data.id, content: JSON.stringify(content) },
    });
  };

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        router.reload();
      }, timer * 1000);
    }
  }, [open]);

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
        <Block display="flex" alignItems="center" justifyContent="space-between" marginTop="10px" marginBottom="30px">
          <HeadingLarge margin={0}>{`Attendance for ${date}`}</HeadingLarge>
          <Block display="flex" alignItems="center">
            {open && (
            <Countdown
              autoStart={open}
              date={Date.now() + (timer * 1000)}
              renderer={renderer}
            />
            )}
            <ParagraphMedium
              color={open ? 'mono100' : 'mono800'}
              className={css({
                fontSize: '0.8rem',
                backgroundColor: open ? theme.colors.positive : theme.colors.mono300,
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: '20px',
                paddingTop: '4px',
                paddingRight: '10px',
                paddingBottom: '4px',
                paddingLeft: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1.4px',
              })}
            >
              {open ? 'Open' : 'Closed'}
            </ParagraphMedium>
          </Block>
        </Block>
        <Block marginTop="10px" marginBottom="30px" display="flex" alignItems="center" justifyContent="space-between">
          <HeadingXSmall marginTop={0} marginBottom={0}>
            {course.data.attributes.title}
          </HeadingXSmall>

          <Block display="flex" alignItems="center">
            <Block>
              <Button
                size={SIZE.mini}
                onClick={() => {
                  deleteAttendance().then(async (value) => {
                    if (value.data) {
                      await router.replace('/attendances');
                    }
                  });
                }}
              >
                Delete
              </Button>
            </Block>
            <Block marginLeft="20px">
              <Button
                disabled={open}
                size={SIZE.mini}
                onClick={() => {
                  updateAttendance({
                    variables: { id: attendance.data.id, open: true },
                  }).then((value) => {
                    if (value.data) {
                      router.reload();
                    }
                  });
                }}
              >
                Open
              </Button>
            </Block>
            {open && (
            <Block marginLeft="20px">
              <Button
                size={SIZE.mini}
                onClick={() => {
                  updateAttendance({
                    variables: { id: attendance.data.id, open: false },
                  }).then((value) => {
                    if (value.data) {
                      router.reload();
                    }
                  });
                }}
              >
                Close
              </Button>
            </Block>
            )}
          </Block>
        </Block>
      </Block>

      <Block marginTop="20px">
        <TableBuilder data={DATA}>
          <TableBuilderColumn header="#">
            {(row) => <ParagraphMedium maxWidth="30px">{row.id}</ParagraphMedium>}
          </TableBuilderColumn>
          <TableBuilderColumn header="AVATAR">
            {(row) => (
              <Block maxWidth="50px">
                <Avatar size="48px" src={row.avatar} name="" />
              </Block>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="STUDENT NAME">
            {(row) => (
              <Block>
                <ParagraphLarge margin={0} className={css({ fontWeight: '600' })}>
                  {row.name}
                </ParagraphLarge>
                <p style={{ margin: 0, letterSpacing: '1px', color: theme.colors.mono700 }}>{row.uid}</p>
              </Block>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="STATUS">
            {(row) => (
              <Block display="flex" alignItems="center" height="100%">
                <Button
                  startEnhancer={(<Check />)}
                  value={true}
                  isSelected={row.status}
                  onClick={() => manuallyUpdate(true, row.uid)}
                  overrides={{
                    BaseButton: {
                      style: ({ $theme, $isSelected }) => ({
                        width: '100%',
                        color: $isSelected ? $theme.colors.white : $theme.colors.mono700,
                        backgroundColor: $isSelected
                          ? $theme.colors.positive
                          : $theme.colors.mono300,
                        ':hover': {
                          backgroundColor: $isSelected
                            ? $theme.colors.positive
                            : $theme.colors.mono500,
                        },
                      }),
                    },
                  }}
                >
                  PRESENT
                </Button>
                <Button
                  startEnhancer={(<X />)}
                  value={false}
                  isSelected={!row.status}
                  onClick={() => manuallyUpdate(false, row.uid)}
                  overrides={{
                    BaseButton: {
                      style: ({ $theme, $isSelected }) => ({
                        width: '100%',
                        color: $isSelected ? $theme.colors.white : $theme.colors.mono700,
                        backgroundColor: ($isSelected)
                          ? $theme.colors.negative
                          : $theme.colors.mono300,
                        ':hover': {
                          backgroundColor: $isSelected
                            ? $theme.colors.negative
                            : $theme.colors.mono500,
                        },
                      }),
                    },
                  }}
                >
                  ABSENT
                </Button>
              </Block>
            )}
          </TableBuilderColumn>
        </TableBuilder>
      </Block>
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

Attendance.propTypes = {
  attendance: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
};

export default Attendance;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        source: '/attendances/[id]',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const { jwt } = session;

  const { data: { attendance } } = await fetchAPI({
    query: AttendanceQuery, variables: { id: context.params.id }, token: jwt,
  });

  return { props: { session, attendance } };
}
