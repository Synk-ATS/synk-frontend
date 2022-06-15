import React from 'react';
import { Block } from 'baseui/block';
import {
  HeadingMedium, ParagraphLarge, ParagraphMedium,
} from 'baseui/typography';
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic';
import { Datepicker } from 'baseui/datepicker';
import { Button } from 'baseui/button';
import {
  Camera,
  CaretRight, Check, Clock, Plus, X,
} from 'phosphor-react';
import { useSelector } from 'react-redux';
import { useStyletron } from 'baseui';
import { getSession, useSession } from 'next-auth/react';
import { Avatar } from 'baseui/avatar';
import { ButtonGroup, MODE } from 'baseui/button-group';
import { useMutation } from '@apollo/client';
import * as faceapi from 'face-api.js';
import { Modal, ROLE, SIZE } from 'baseui/modal';
import Layout from '../components/layout';
import { selectAuth } from '../redux/slices/auth.slice';
import { fetchAPI } from './_app';
import synkStore from '../redux/store';
import { StudsByCourseQuery, StudsByCourseVars } from '../graphql/queries/students-by-courses.query';
import TeacherAttendance from '../contents/attendance/teacher-attendance';

function Attendance({ result }) {
  const [css, theme] = useStyletron();
  const { data: { user: { role } } } = useSession();

  const {
    profile: {
      attributes: {
        course: {
          data: {
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

  const [date, setDate] = React.useState(null);
  const today = new Date('YYYY-MM-DD');
  const [selected, setSelected] = React.useState();

  const [camEnabled, setCamEnabled] = React.useState(false);
  const [isModalOpen, setModalOpen] = React.useState(false);

  const camRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);

  const [previewImage, setPreviewImage] = React.useState('');
  const [faces, setFaces] = React.useState([]);
  const [fullDesc, setFullDesc] = React.useState([]);
  const [faceDescriptor, setFaceDescriptor] = React.useState([]);

  const videoHeight = 480;
  const videoWidth = 480;

  React.useEffect(() => {
    const loadFaceAPIModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.load(MODEL_URL),
        faceapi.nets.faceLandmark68Net.load(MODEL_URL),
        faceapi.nets.faceRecognitionNet.load(MODEL_URL),
        faceapi.nets.faceExpressionNet.load(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.load(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.load(MODEL_URL),
      ]).then(() => setModelsLoaded(true));
    };
    loadFaceAPIModels();
  }, [modelsLoaded]);

  const startVideo = () => {
    setCaptureVideo(true);
    setModalOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 480, height: 480 } })
      .then((stream) => {
        const video = camRef.current;

        video.srcObject = stream;
        video.play();
      })
      .catch((err) => console.error('error:', err));
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        // canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(camRef.current);
        canvasRef.current.innerHTML = faceapi.createCanvas(camRef.current);

        const displaySize = { width: videoWidth, height: videoHeight };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detection = await faceapi.detectSingleFace(
          camRef.current,
          new faceapi.TinyFaceDetectorOptions(),
        ).withFaceLandmarks()
          .withFaceDescriptor();
        //
        if (detection) {
          const resizedDetections = faceapi.resizeResults(detection, displaySize);
          //

          // const resizedDetections = await detectFaces(camRef.current);

          // const desc = await getFullFaceDescription(camRef.current, 512);

          setFullDesc(resizedDetections);
          setFaceDescriptor(resizedDetections?.descriptor);

          // const faceMatcher = new faceapi.FaceMatcher(detection);

          canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
          canvasRef && canvasRef.current && faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        }
      }
    }, 700);
  };

  const closeWebcam = () => {
    camRef.current.pause();
    camRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
    setModelsLoaded(false);
  };

  const DATA = result.data.map((student, i) => ({
    id: student.id,
    uid: student.attributes.uid,
    avatar: student.attributes.avatar.data.attributes.url,
    name: `${student.attributes.lastName}, ${student.attributes.firstName} ${student.attributes.middleName}`,
    status: true,
    capture: () => {},
  }));

  if (role === 'student') {
    return (
      <Block paddingLeft={['20px', '20px', '40px', '40px']} paddingRight={['20px', '20px', '40px', '40px']}>
        <HeadingMedium marginBottom={0}>Your Attendance</HeadingMedium>
      </Block>
    );
  }

  if (role === 'faculty') {
    return (<TeacherAttendance students={result.data} />);
  }
}

Attendance.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};

export default Attendance;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const _store = synkStore();

  if (!session) {
    return {
      redirect: {
        source: '/auth/profile',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  const { role, email, jwt } = session.user;

  let result;

  switch (role) {
    case 'faculty': {
      const { data } = await fetchAPI({
        query: StudsByCourseQuery,
        variables: StudsByCourseVars({ params: { email } }),
        token: jwt,
      });
      result = data.courses.data[0].attributes.students;
      break;
    }
    case 'student': {
      const { profile } = _store.getState().auth;
      // const { data } = await fetchAPI({
      //   query: CoursesByStudent,
      //   variables: CoursesByStudentVars({ params: { id: profile.id } }),
      //   token: jwt,
      // });
      // result = data.courses;
      result = {};
      break;
    }
    default: {
      result = {};
    }
  }

  return { props: { session, result } };
}
