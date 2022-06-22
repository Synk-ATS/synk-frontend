/* eslint-disable react/forbid-prop-types,no-unused-expressions,no-multi-assign */

import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { getSession, useSession } from 'next-auth/react';
import PropTypes from 'prop-types';
import { Block } from 'baseui/block';
import {
  HeadingLarge, HeadingXSmall, ParagraphLarge, ParagraphMedium,
} from 'baseui/typography';
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic';
import { ButtonGroup, MODE } from 'baseui/button-group';
import { Button } from 'baseui/button';
import {
  ArrowBendUpLeft, Camera, Check, X,
} from 'phosphor-react';
import { useStyletron } from 'baseui';
import { useDispatch } from 'react-redux';
import {
  Modal, ModalBody, ModalButton, ModalFooter, ModalHeader, ROLE, SIZE,
} from 'baseui/modal';
import * as faceapi from 'face-api.js';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import { setToast } from '../../redux/slices/global.slice';
import Loading from '../../components/atoms/loading';
import { fetchAPI } from '../../lib/api';

const UpdateAttendanceQuery = gql`
    mutation UpdateAttendance($id: ID!, $record: JSON!) {
      updateAttendance(id: $id, data: { content: $record }) {        
        data {
          id
          attributes {
            date
            open
            timer
            content
          }
        }
      }
    }
`;

function Code({ course, attendance }) {
  const router = useRouter();
  const [css] = useStyletron();
  const { data: { jwt } } = useSession();
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);

  const camRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const [modelsLoaded, setModelsLoaded] = React.useState(false);

  const videoHeight = 480;
  const videoWidth = 480;

  const [updateAttendance, { loading }] = useMutation(UpdateAttendanceQuery, {
    context: { headers: { Authorization: `Bearer ${jwt}` } },
  });

  const startVideo = () => {
    setModalOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 480, height: 480 } })
      .then((stream) => {
        const video = camRef.current;

        video.srcObject = stream;
        video.play();
      });
  };

  const closeWebcam = () => {
    camRef?.current?.pause();
    camRef?.current?.srcObject?.getTracks()[0]?.stop();
    setModelsLoaded(false);
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

        if (!detection) {
          return;
        }

        const resizedDetections = faceapi.resizeResults(detection, displaySize);
        const referenceDescriptor = resizedDetections?.descriptor;

        const { uid, firstName, lastName } = course.attributes.students.data[0].attributes;
        const label = `${firstName} ${lastName} ${uid}`;

        const d = new faceapi.draw.DrawBox(resizedDetections.detection.box, { label });

        const labeledReferenceDescriptor = new faceapi.LabeledFaceDescriptors(
          label,
          [referenceDescriptor],
        );

        // const faceMatcher = new faceapi.FaceMatcher(resizedDetections);
        const faceMatcher = new faceapi.FaceMatcher(labeledReferenceDescriptor, 0.6);

        const externalAvatar = await faceapi.fetchImage(
          course.attributes.students.data[0].attributes.avatar.data.attributes.url,
        );

        const queryResult = await faceapi
          .detectSingleFace(externalAvatar)
          .withFaceLandmarks()
          .withFaceDescriptor();

        const bestMatch = faceMatcher.findBestMatch(queryResult.descriptor);

        const content = attendance?.attributes?.content;

        const studentIndex = content.findIndex((x) => x.uid === uid);

        if (bestMatch.label === 'unknown' && bestMatch.distance > 0.6) {
          closeWebcam();
          setModalOpen(false);
          setInfoModalOpen(true);
        }

        if (bestMatch.label !== 'unknown' && bestMatch.distance <= 0.6) {
          content[studentIndex].status = true;

          updateAttendance({
            variables: { id: attendance?.id, record: JSON.stringify(content) },
          }).then((value) => {
            if (value.data) {
              router.reload();
            }
          });
        }

        canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        canvasRef && canvasRef.current && faceapi.draw.drawDetections(
          canvasRef.current,
          resizedDetections,
        );
        canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(
          canvasRef.current,
          resizedDetections,
        );
        canvasRef && canvasRef.current && d.draw(canvasRef.current);
      }
    }, 700);
  };

  const {
    designation, firstName, lastName,
  } = course.attributes.faculty.data.attributes;
  const faculty = `${designation} ${firstName} ${lastName}`;

  const DATA = course.attributes.attendances.data.map((att) => {
    const { content } = att.attributes;
    const { uid } = course.attributes.students.data[0].attributes;
    const index = content.findIndex((x) => x.uid === uid);

    return {
      id: att.id,
      date: att.attributes.date,
      faculty,
      status: content[index]?.status,
    };
  });

  React.useEffect(() => {
    if (attendance?.attributes?.open) {
      dispatch(setToast(`The attendance for ${course.attributes.code} 
      has been opened by ${faculty}. Go and capture now.`));
    }
  }, [attendance, attendance?.attributes?.open]);

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

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <Block
      paddingLeft={['20px', '20px', '40px', '40px']}
      paddingRight={['20px', '20px', '40px', '40px']}
    >
      <Modal
        onClose={() => setInfoModalOpen(false)}
        closeable
        isOpen={infoModalOpen}
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.alertdialog}
      >
        <ModalHeader>Face ID Unknown</ModalHeader>
        <ModalBody>The face ID does not match the reference ID. Please try again.</ModalBody>
        <ModalFooter>
          <ModalButton onClick={() => setInfoModalOpen(false)}>Close</ModalButton>
        </ModalFooter>
      </Modal>
      <Modal
        onClose={() => {
          closeWebcam();
          setModalOpen(false);
        }}
        closeable
        isOpen={modalOpen}
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        overrides={{
          Dialog: { style: ({ height: '480x', width: '480px' }) },
          Close: { style: ({ zIndex: 3, backgroundColor: 'white' }) },
        }}
      >
        <Block position="relative" height={`${videoHeight}px`} width={`${videoWidth}px`}>
          <video
            muted
            autoPlay
            ref={camRef}
            height={videoHeight}
            width={videoWidth}
            onPlay={handleVideoOnPlay}
            style={{ borderRadius: '10px', zIndex: 1 }}
          />
          <canvas
            ref={canvasRef}
            style={{
              width: videoWidth,
              height: videoHeight,
              position: 'absolute',
              left: 0,
              zIndex: 2,
            }}
          />
        </Block>
      </Modal>
      <Block display="flex" alignItems="center" justifyContent="space-between">

        <Block marginTop="20px">
          <Button
            startEnhancer={(<ArrowBendUpLeft />)}
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          <HeadingLarge marginTop="10px" marginBottom={0}>{course.attributes.title}</HeadingLarge>
          <HeadingXSmall marginTop="10px" marginBottom={0}>{course.attributes.code}</HeadingXSmall>
          <ParagraphMedium marginTop="10px">{course.attributes.description}</ParagraphMedium>
        </Block>
        <Block display={attendance?.attributes?.open ? 'block' : 'none'}>
          <Button
            onClick={() => startVideo()}
            overrides={{
              BaseButton: {
                style: ({
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  maxHeight: '8rem',
                  maxWidth: '8rem',
                  height: '100%',
                  width: '100%',
                  aspectRatio: '1/1',
                  fontSize: '1rem',
                }),
              },
            }}
          >
            <Camera size="1.7rem" style={{ marginBottom: '5px' }} />
            Capture Attendance
          </Button>
        </Block>
      </Block>
      <Block marginTop="20px" display="block">
        <TableBuilder data={DATA}>
          <TableBuilderColumn header="#">
            {(row) => <ParagraphMedium maxWidth="30px">{row.id}</ParagraphMedium>}
          </TableBuilderColumn>
          <TableBuilderColumn header="DATE">
            {(row) => (
              <Block>
                <ParagraphLarge>{row.date}</ParagraphLarge>
              </Block>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="FACULTY NAME">
            {(row) => (
              <Block>
                <ParagraphLarge className={css({ fontWeight: '600' })}>
                  {row.faculty}
                </ParagraphLarge>
              </Block>
            )}
          </TableBuilderColumn>
          <TableBuilderColumn header="STATUS">
            {(row) => (
              <Block maxWidth="400px" backgroundColor="pink">
                <ButtonGroup
                  mode={MODE.radio}
                  selected={row.status}
                >
                  <Button
                    startEnhancer={(<Check />)}
                    isSelected={row.status}
                    overrides={{
                      BaseButton: {
                        style: ({ $theme, $isSelected }) => ({
                          width: '100%',
                          backgroundColor: ($isSelected)
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
                    isSelected={!row.status}
                    overrides={{
                      BaseButton: {
                        style: ({ $theme, $isSelected }) => ({
                          width: '100%',
                          backgroundColor: ($isSelected)
                            ? $theme.colors.negative
                            : $theme.colors.mono300,

                        }),
                      },
                    }}
                  >
                    ABSENT
                  </Button>
                </ButtonGroup>
              </Block>
            )}
          </TableBuilderColumn>
        </TableBuilder>
      </Block>
    </Block>
  );
}

export default Code;

Code.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};

Code.propTypes = {
  course: PropTypes.object.isRequired,
  attendance: PropTypes.object.isRequired,
};

const CourseQuery = gql`
  query Course($code: String!, $id: ID!) {
    courses(filters: { code: { eq: $code } }) {
      data {
        id
        attributes {
          title
          code
          description
          attendances {
            data {
              id
              attributes {
                date
                open
                content
              }
            }
          }
          students(filters: { id: { eq: $id } }) {
            data {
              id
              attributes {
                firstName
                lastName
                uid
                avatar {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
          faculty {
            data {
              attributes {
                firstName
                lastName
                designation
              }
            }
          }
        }
      }
    }
  }
`;

const AttendanceQuery = gql`
  query Attendance($date: Date, $code: String!) {
    attendances(
      filters: {
        date: { eq: $date }
        open: { eq: true }
        course: { code: { eq: $code } }
      }
    ) {
      data {
        id
        attributes {
          date
          open
          timer
          content
          course {
            data {
              attributes {
                code
                faculty {
                  data {
                    id
                    attributes {
                      firstName
                      lastName
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        source: '/courses/[code]',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const { jwt, user } = session;
  const { studentID } = user;

  const { data } = await fetchAPI({
    query: CourseQuery,
    variables: { code: context.params.code, id: studentID },
    token: jwt,
  });

  const { data: { attendances } } = await fetchAPI({
    query: AttendanceQuery,
    variables: { code: context.params.code },
    // variables: { code: context.params.code, date: new Date().toLocaleDateString('en-CA') },
    token: jwt,
  });

  return {
    props: {
      session,
      course: data.courses.data[0],
      attendance: attendances.data[0] ?? {},
    },
  };
}
