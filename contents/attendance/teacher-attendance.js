import React from 'react';
import { useStyletron } from 'baseui';
import PropTypes from 'prop-types';
import { Block } from 'baseui/block';
import { HeadingMedium, ParagraphLarge, ParagraphMedium } from 'baseui/typography';
import {
  Camera, CaretRight, Check, Clock, Plus, X,
} from 'phosphor-react';
import { Datepicker } from 'baseui/datepicker';
import { Button } from 'baseui/button';
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic';
import { Avatar } from 'baseui/avatar';
import { ButtonGroup, MODE } from 'baseui/button-group';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { selectAuth } from '../../redux/slices/auth.slice';

function TeacherAttendance({ students }) {
  const {
    profile: {
      id: facultyID,
      attributes: {
        course: {
          data: {
            id: courseID,
            attributes: {
              title: course,
            },
          },
        },
        program: {
          data: {
            attributes: {
              name: program,
            },
          },
        },
      },
    },
  } = useSelector(selectAuth);

  const [css, theme] = useStyletron();

  const { data: { jwt } } = useSession();

  const [selected, setSelected] = React.useState();

  const [date, setDate] = React.useState(null);
  const [isReady, setIsReady] = React.useState(false);

  const today = new Date('YYYY-MM-DD');

  const DATA = students.map((student, i) => ({
    id: student.id,
    uid: student.attributes.uid,
    avatar: student.attributes.avatar.data.attributes.url,
    name: `${student.attributes.lastName}, ${student.attributes.firstName} ${student.attributes.middleName}`,
    status: true,
    capture: () => { },
  }));

  return (
    <Block
      paddingLeft={['20px', '20px', '40px', '40px']}
      paddingRight={['20px', '20px', '40px', '40px']}
    >
      <HeadingMedium marginBottom={0}>Class Attendance</HeadingMedium>
      <Block display="flex" alignItems="center">
        <p style={{ color: theme.colors.mono700 }}>{program}</p>
        <CaretRight style={{ marginInline: '10px' }} />
        <p style={{ color: theme.colors.mono1000 }}>{course}</p>
      </Block>
      <Block display="flex" alignItems="center" marginTop="20px">
        <Block>
          <Datepicker
            aria-label="Select a date"
            value={date}
            onChange={({ date }) => setDate(Array.isArray(date) ? date : [date])}
            formatString="yyyy-MM-dd"
            placeholder="Select class date"
            mask="9999-99-99"
            minDate={today.getDate()}
          />
        </Block>
        <Block marginLeft="20px">
          <Button
            startEnhancer={(<Plus />)}
            onClick={async () => {
              const result = await axios.post('http://localhost:1337/api/attendances', {
                data: {
                  course: courseID,
                  faculty: facultyID,
                  date: new Date(),
                  content: '',
                },
                config: {
                  headers: {
                    Authorization: `Bearer ${jwt}`,
                  },
                },
              });

              if (result.data) {
                setIsReady(true);
              }
            }}
          >
            Add Attendance
          </Button>
        </Block>
      </Block>
      <Block marginTop="20px" display={isReady ? 'block' : 'none'}>
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
              <Block maxWidth="400px" backgroundColor="pink">
                {row.status}
                <ButtonGroup
                  mode={MODE.radio}
                  selected={selected}
                  onClick={(event, index) => {
                    setSelected(index);
                  }}
                >
                  <Button
                    startEnhancer={(<Check />)}
                    overrides={{
                      BaseButton: {
                        style: ({ $theme, $isSelected }) => ({
                          width: '100%',
                          backgroundColor: (selected === 0 && $isSelected)
                            ? $theme.colors.positive
                            : $theme.colors.mono300,
                        }),
                      },
                    }}
                  >
                    PRESENT
                  </Button>
                  <Button
                    startEnhancer={(<X />)}
                    overrides={{
                      BaseButton: {
                        style: ({ $theme, $isSelected }) => ({
                          width: '100%',
                          backgroundColor: (selected === 1 && $isSelected)
                            ? $theme.colors.negative
                            : $theme.colors.mono300,

                        }),
                      },
                    }}
                  >
                    ABSENT
                  </Button>
                  <Button
                    startEnhancer={(<Clock />)}
                    overrides={{
                      BaseButton: {
                        style: ({ $theme, $isSelected }) => ({
                          width: '100%',
                          backgroundColor: (selected === 2 && $isSelected)
                            ? $theme.colors.warning
                            : $theme.colors.mono300,

                        }),
                      },
                    }}
                  >
                    LATE
                  </Button>
                </ButtonGroup>
              </Block>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="CAPTURE">
            {(row) => (
              <Block>
                {row.capture}
                <Button><Camera /></Button>
              </Block>
            )}
          </TableBuilderColumn>
        </TableBuilder>
      </Block>
    </Block>
  );
}

TeacherAttendance.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  students: PropTypes.any.isRequired,
};

export default TeacherAttendance;
