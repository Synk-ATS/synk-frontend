import * as faceapi from 'face-api.js';

export const loadModels = () => Promise.all([
  faceapi.nets.faceLandmark68Net.loadFromUri('http://localhost:3000/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('http://localhost:3000/models'),
]);

export const detectFaces = async (image) => {
  if (!image) {
    return;
  }

  const imgSize = image.getBoundingClientRect();
  const displaySize = { width: imgSize.width, height: imgSize.height };
  if (displaySize.height === 0) {
    return;
  }

  const faces = await faceapi
    .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions({ inputSize: 480 }))
    .withFaceLandmarks()
    .withFaceExpressions();

  // const faces = await faceapi
  //   .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }))
  //   .withFaceLandmarks()
  //   .withFaceExpressions()
  //   .withAgeAndGender();

  // eslint-disable-next-line consistent-return
  return faceapi.resizeResults(faces, displaySize);
};

export const drawResults = async (image, canvas, results, type) => {
  if (image && canvas && results) {
    const imgSize = image.getBoundingClientRect();
    const displaySize = { width: imgSize.width, height: imgSize.height };
    faceapi.matchDimensions(canvas, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    const resizedDetections = faceapi.resizeResults(results, displaySize);

    switch (type) {
      case 'landmarks':
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        break;
      case 'expressions':
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        break;
      case 'box':
        faceapi.draw.drawDetections(canvas, resizedDetections);
        break;
      case 'boxLandmarks':
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        break;
      default:
        break;
    }
  }
};

// export async function loadModels(
//   setLoadingMessage,
//   setLoadingMessageError,
// ) {
//   const MODEL_URL = `${process.env.PUBLIC_URL}/models`;
//
//   try {
//     setLoadingMessage('Loading Face Detector');
//     await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
//
//     setLoadingMessage('Loading 68 Facial Landmark Detector');
//     await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
//
//     setLoadingMessage('Loading Feature Extractor');
//     await faceapi.loadFaceRecognitionModel(MODEL_URL);
//   } catch (err) {
//     setLoadingMessageError(
//       'Model loading failed. Please contact me about the bug:attendlytical@gmail.com',
//     );
//   }
// }

export async function getFullFaceDescription(blob, inputSize = 512) {
  // tiny_face_detector options
  const scoreThreshold = 0.8;
  const OPTION = new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold,
  });
  const useTinyModel = true;

  // fetch image to api
  // const img = await faceapi.fetchImage(blob);

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  const fullDesc = await faceapi
    .detectAllFaces(blob, OPTION)
    .withFaceLandmarks(useTinyModel)
    .withFaceDescriptors();
  return fullDesc;
}

export async function createMatcher(faceProfile, maxDescriptorDistance) {
  // Create labeled descriptors of member from profile
  const labeledDescriptors = faceProfile.map(
    (profile) => new faceapi.LabeledFaceDescriptors(
      profile.student._id,
      profile.facePhotos.map(
        (photo) => new Float32Array(photo.faceDescriptor.match(/-?\d+(?:\.\d+)?/g).map(Number)),
      ),
    ),
  );

  // Create face matcher (maximum descriptor distance is 0.5)
  const faceMatcher = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDescriptorDistance,
  );

  return faceMatcher;
}

export function isFaceDetectionModelLoaded() {
  return !!faceapi.nets.ssdMobilenetv1.params;
}

export function isFeatureExtractionModelLoaded() {
  return !!faceapi.nets.faceRecognitionNet.params;
}

export function isFacialLandmarkDetectionModelLoaded() {
  return !!faceapi.nets.faceLandmark68TinyNet.params;
}
