/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { getSession, useSession } from 'next-auth/react';
import PropTypes from 'prop-types';
import Layout from '../../components/layout';
import FacultyAttendance from '../../contents/attendance/faculty-attendance';
import StudentAttendance from '../../contents/attendance/student-attendance';
import { AttendanceFacultyQuery, AttendanceStudentQuery } from '../../graphql/queries/attendance-page.query';
import Loading from '../../components/atoms/loading';
import { fetchAPI } from '../../lib/api';

function Attendances({ result }) {
  const { data: { user: { role } } } = useSession();

  switch (role) {
    case 'faculty':
      return (<FacultyAttendance faculty={result} />);
    case 'student':
      return (<StudentAttendance student={result} />);
    default:
      return (<Loading loading />);
  }
}

Attendances.getLayout = function getLayout(page) {
  return (<Layout>{page}</Layout>);
};

Attendances.propTypes = {
  result: PropTypes.object.isRequired,
};

export default Attendances;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        source: '/attendances',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  const { user: { role }, jwt } = session;

  let result;

  switch (role) {
    case 'faculty': {
      const { facultyID } = session.user;
      const { data } = await fetchAPI({
        query: AttendanceFacultyQuery,
        variables: { id: facultyID },
        token: jwt,
      });
      result = data.faculty.data;
      break;
    }
    case 'student': {
      const { studentID } = session.user;
      const { data } = await fetchAPI({
        query: AttendanceStudentQuery,
        variables: { id: studentID },
        token: jwt,
      });

      result = data.student.data;
      break;
    }
    default: {
      result = {};
    }
  }

  return { props: { session, result } };
}
