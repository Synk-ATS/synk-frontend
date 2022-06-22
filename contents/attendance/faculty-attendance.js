import React from 'react';
import { useStyletron } from 'baseui';
import PropTypes from 'prop-types';
import { Block } from 'baseui/block';
import { HeadingMedium, ParagraphMedium, ParagraphXSmall } from 'baseui/typography';
import { CaretRight, Plus, Table } from 'phosphor-react';
import { Datepicker } from 'baseui/datepicker';
import { Button, SIZE } from 'baseui/button';
import { useSession } from 'next-auth/react';
import { useMutation } from '@apollo/client';
import { Input } from 'baseui/input';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { useRouter } from 'next/router';
import CreateAttendanceMutation from '../../graphql/mutations/create-attendance.mutation';

function FacultyAttendance({ faculty }) {
  const { program, course } = faculty.attributes;

  const [css, theme] = useStyletron();
  const router = useRouter();

  const { data: { jwt } } = useSession();

  const [timer, setTimer] = React.useState(60);
  const [date, setDate] = React.useState([]);
  const [dateString, setDateString] = React.useState(null);

  const [createAttendance] = useMutation(CreateAttendanceMutation, {
    context: { headers: { Authorization: `Bearer ${jwt}` } },
  });

  return (
    <Block
      paddingLeft={['20px', '20px', '40px', '40px']}
      paddingRight={['20px', '20px', '40px', '40px']}
    >
      <Block marginTop="30px" display="flex" justifyContent="space-between" alignItems="center">
        <HeadingMedium marginTop={0} marginBottom={0}>Class Attendances</HeadingMedium>
      </Block>
      <Block display="flex" alignItems="center">
        <p style={{ color: theme.colors.mono700 }}>{program.data.attributes.name}</p>
        <CaretRight style={{ marginInline: '10px' }} />
        <p style={{ color: theme.colors.mono1000 }}>{course.data.attributes.title}</p>
      </Block>

      <Block display="flex" alignItems="center" marginTop="10px">
        <Block>
          <Input
            size={SIZE.compact}
            value={timer}
            onChange={(e) => setTimer(e.target.value)}
            placeholder="Timer"
            type="number"
            clearOnEscape
            min={60}
            max={120}
            overrides={{ Root: { style: ({ width: '100px' }) } }}
          />
        </Block>
        <Block marginLeft="20px">
          <Datepicker
            size={SIZE.compact}
            aria-label="Select a date"
            value={date}
            onChange={({ date }) => {
              setDate(Array.isArray(date) ? date : [date]);
              setDateString(date?.toLocaleString());
            }}
            formatString="yyyy-MM-dd"
            placeholder="Select class date"
            mask="9999-99-99"
            minDate={new Date()}
            // maxDate={new Date()}
          />
        </Block>
        <Block marginLeft="20px">
          <Button
            size={SIZE.compact}
            startEnhancer={(<Plus />)}
            disabled={dateString === undefined || dateString === null || !timer}
            onClick={() => {
              if (date.length !== 0) {
                const newContent = course.data.attributes.students.data.map((st) => ({
                  id: st.id,
                  uid: st.attributes.uid,
                  name: `${st.attributes.lastName}, ${st.attributes.firstName} ${st.attributes.middleName}`,
                  avatar: st.attributes.avatar.data.attributes.url,
                  status: false,
                }));

                createAttendance({
                  variables: {
                    courseID: faculty.attributes.course.data.id,
                    facultyID: faculty.id,
                    date: date[0].toLocaleDateString('en-CA'),
                    content: JSON.stringify(newContent),
                    open: false,
                    timer: parseInt(timer.toString(), 10),
                    students: course.data.attributes.students.data.map((st) => st.id),
                  },
                }).then(async (result) => {
                  await router.push({
                    pathname: '/attendances/[id]',
                    query: { id: result.data.createAttendance.data.id },
                  });
                });
              }
            }}
          >
            Add Attendance
          </Button>
        </Block>
        <Block marginLeft="20px">
          <Button
            size={SIZE.compact}
            startEnhancer={(<Table />)}
            onClick={() => router.push('/attendances/report')}
          >
            Report
          </Button>
        </Block>
      </Block>
      <Block marginTop="4px">
        <ParagraphXSmall
          color="negative"
          className={css({
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontSize: '0.76rem',
          })}
        >
          MIN: 60 secs;
          <span style={{ marginLeft: '12px' }}>MAX: 120 secs.</span>
        </ParagraphXSmall>
      </Block>
      <Block marginTop="30px">
        <FlexGrid
          flexGridColumnCount={5}
          flexGridColumnGap="2px"
          flexGridRowGap="2px"
          flexWrap
        >
          {faculty.attributes.course.data.attributes.attendances.data.map((att) => {
            const { content } = att.attributes;

            return (
              <FlexGridItem
                key={att.id}
                onClick={async () => {
                  await router.push({
                    pathname: '/attendances/[id]',
                    query: { id: att.id },
                  });
                }}
                backgroundColor={att.attributes.open ? 'positive' : 'mono900'}
                overrides={{
                  Block: {
                    style: ({
                      aspectRatio: '1 / 1',
                      paddingTop: '1.2rem',
                      paddingRight: '1.2rem',
                      paddingBottom: '1.2rem',
                      paddingLeft: '1.2rem',
                      cursor: 'pointer',
                      display: 'grid',
                      alignItems: 'center',
                      transitionProperty: 'all',
                      transitionDuration: theme.animation.timing900,
                      ':hover': {
                        backgroundColor: 'rgba(242,61,79)',
                      },
                    }),
                  },
                }}
              >
                <Block display="flex" justifyContent="space-between" alignItems="center">
                  <ParagraphXSmall className={css({
                    margin: 0,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '1.2px',
                    color: theme.colors.mono600,
                  })}
                  >
                    Attendance
                  </ParagraphXSmall>
                  <ParagraphXSmall className={css({
                    margin: 0,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '1.2px',
                    color: theme.colors.mono600,
                  })}
                  >
                    {att.id}
                  </ParagraphXSmall>
                </Block>
                <Block
                  overrides={{
                    Block: {
                      style: ({
                        marginTop: 0,
                        marginBottom: 0,
                        maxHeight: '4rem',
                        height: '4rem',
                        display: 'grid',
                        alignItems: 'flex-end',
                      }),
                    },
                  }}
                >
                  <ParagraphMedium
                    overrides={{
                      Block: {
                        style: ({
                          marginTop: 0,
                          marginBottom: 0,
                          fontWeight: '600',
                          fontSize: '1.6rem',
                          lineHeight: '1.6rem',
                          color: theme.colors.mono100,
                        }),
                      },
                    }}
                  >
                    {att.attributes.date}
                  </ParagraphMedium>
                  <ParagraphXSmall className={css({
                    fontStyle: 'italic',
                    color: theme.colors.mono600,
                    margin: 0,
                    fontSize: '0.7rem',
                    letterSpacing: '1.2px',
                  })}
                  >
                    {`${content.length} STUDENTS`}
                  </ParagraphXSmall>
                </Block>
              </FlexGridItem>
            );
          })}
        </FlexGrid>
      </Block>
    </Block>
  );
}

FacultyAttendance.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  faculty: PropTypes.any.isRequired,
};

export default FacultyAttendance;
