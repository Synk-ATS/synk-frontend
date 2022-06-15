import React from 'react';
import { Block } from 'baseui/block';
import { HeadingMedium, ParagraphSmall } from 'baseui/typography';
import { Button } from 'baseui/button';
import {
  CameraSlash, FloppyDisk, Plus, X,
} from 'phosphor-react';
import { getSession } from 'next-auth/react';
import * as faceapi from 'face-api.js';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { gql, useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import Layout from '../components/layout';
import { detectFaces, drawResults, getFullFaceDescription } from '../lib/face-util';
import { selectAuth } from '../redux/slices/auth.slice';
import synkStore from '../redux/store';

const UpdateStudentPhoto = gql`
  mutation UpdateStudent($id: ID!, $photoData: String!, $faceDescriptor: String!) {
  updateStudent(id: $id, data: {
    photoData: $photoData,
    faceDescriptor: $faceDescriptor,
    }) {
      data {
        id
        attributes {
          email
          photoData
          faceDescriptor
        }
      }
    }
  }
`;

function Biometrics({ profiles }) {
  console.log(profiles);
  const { profile } = useSelector(selectAuth);
  const [camEnabled, setCamEnabled] = React.useState(false);

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

  const [updatePhotoCallback, { loading }] = useMutation(
    UpdateStudentPhoto,
    {
      onError(err) {
        console.log(err);
      },
    },
  );

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
          .withFaceExpressions()
          .withFaceDescriptor();
        //
        const resizedDetections = faceapi.resizeResults(detection, displaySize);
        //

        // const resizedDetections = await detectFaces(camRef.current);

        // const desc = await getFullFaceDescription(camRef.current, 512);

        setFullDesc(resizedDetections);
        setFaceDescriptor(resizedDetections?.descriptor);

        canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        canvasRef && canvasRef.current && faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        canvasRef && canvasRef.current && faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
      }
    }, 700);
  };

  const closeWebcam = () => {
    camRef.current.pause();
    camRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
    setModelsLoaded(false);
  };

  return (
    <Block>
      <Block paddingLeft={['20px', '20px', '40px', '40px']} paddingRight={['20px', '20px', '40px', '40px']}>
        <HeadingMedium>Biometrics Registration</HeadingMedium>
        <Block display="flex" justifyItems="flex-start" alignItems="flex-start" marginBottom="20px">
          {captureVideo && modelsLoaded
            ? (<Button onClick={closeWebcam} startEnhancer={(<CameraSlash />)}>Close Camera</Button>)
            : (<Button onClick={startVideo} startEnhancer={(<Plus />)}>Add Photo</Button>)}
          <Block marginLeft="20px">
            {faceDescriptor && faceDescriptor.length
              ? (
                <Button
                  startEnhancer={(<FloppyDisk />)}
                  onClick={async () => {
                    await updatePhotoCallback({
                      variables: {
                        id: profile.id,
                        photoData: 'yes',
                        faceDescriptor: faceDescriptor.toString(),
                      },
                    });
                  }}
                >
                  Save Photo
                </Button>
              )
              : null}
          </Block>
        </Block>
        <FlexGrid flexGridColumnCount={2} flexGridColumnGap="20px">
          <FlexGridItem>
            {captureVideo ? modelsLoaded ? (
              <Block position="relative" height="480px" width="480px">
                <video
                  muted
                  autoPlay
                  ref={camRef}
                  height={videoHeight}
                  width={videoWidth}
                  onPlay={handleVideoOnPlay}
                  style={{ borderRadius: '10px' }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    width: '480px',
                    height: '480px',
                    position: 'absolute',
                    left: 0,
                    zIndex: 10,
                  }}
                />
              </Block>
            ) : <div>Loading...</div> : null}
          </FlexGridItem>
          {camEnabled && (
          <FlexGridItem>
            <Block>
              <ParagraphSmall color="negative">*No face detected</ParagraphSmall>

              {previewImage && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <h3>Previous Capture: </h3>
                <img
                  src={previewImage}
                  alt="Capture"
                  style={{ width: '200px', height: '200px' }}
                />
                <div style={{ marginTop: '10px' }}>
                  <Button
                    type="primary"
                    disabled={(fullDesc && fullDesc.length !== 1)
                      || (faceDescriptor && faceDescriptor.length !== 128)}
                  >
                    Save
                  </Button>
                </div>
              </div>
              )}

            </Block>
          </FlexGridItem>
          )}
        </FlexGrid>
      </Block>
    </Block>
  );
}

Biometrics.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};

export default Biometrics;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const _store = synkStore();

  if (!session) {
    return {
      redirect: {
        source: '/auth/biometrics',
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const profile = _store.getState();

  return { props: { session, profiles: profile } };
}
