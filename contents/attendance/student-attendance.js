/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { HeadingMedium, ParagraphMedium, ParagraphSmall } from 'baseui/typography';
import PropTypes from 'prop-types';
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic';

function StudentAttendance({ student }) {
  const [css, theme] = useStyletron();

  const { courses } = student.attributes;

  const TABLE_DATA = courses.data.map((course, index) => {
    const { title, code, attendances } = course.attributes;

    let present;
    let absent;
    let percentage;
    let totalClasses;

    const attendanceRecord = student.attributes?.attendanceRecord;

    if (attendanceRecord) {
      const courseID = parseInt(course.id, 10);
      const courseIndex = attendanceRecord.findIndex((attR) => attR.course === courseID);

      totalClasses = attendances.data.length;

      const { daysPresent } = attendanceRecord[courseIndex];

      present = daysPresent;
      absent = totalClasses - attendanceRecord[courseIndex].daysPresent;
      percentage = ((daysPresent / totalClasses) * 100).toFixed();
    }

    return {
      sn: index + 1,
      course: title,
      courseCode: code,
      present: present ?? 0,
      absent: absent ?? 0,
      percentage: percentage ?? 0,
    };
  });

  return (
    <Block
      paddingLeft={['20px', '20px', '40px', '40px']}
      paddingRight={['20px', '20px', '40px', '40px']}
    >
      <HeadingMedium marginBottom={0}>Attendance Report</HeadingMedium>
      <Block marginTop="20px">
        <TableBuilder data={TABLE_DATA}>
          <TableBuilderColumn header="#">
            {(row) => <ParagraphSmall maxWidth="30px">{row.sn}</ParagraphSmall>}
          </TableBuilderColumn>
          <TableBuilderColumn header="COURSE">
            {(row) => (
              <Block>
                <ParagraphMedium margin={0} className={css({ fontWeight: '600' })}>
                  {row.course}
                </ParagraphMedium>
                <p style={{ margin: 0, letterSpacing: '1px', color: theme.colors.mono700 }}>
                  {row.courseCode}
                </p>
              </Block>
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
          <TableBuilderColumn header="PERCENTAGE" numeric sortable>
            {(row) => <ParagraphSmall>{`${row.percentage}%`}</ParagraphSmall>}
          </TableBuilderColumn>
        </TableBuilder>
      </Block>
    </Block>
  );
}

StudentAttendance.propTypes = {
  student: PropTypes.object.isRequired,
};

export default StudentAttendance;
