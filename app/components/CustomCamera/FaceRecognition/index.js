import React, { useEffect, useState, memo } from 'react';
import { compose } from 'redux';

import { FACE_RECONIZE_WS, APP_URL } from 'config/urlConfig';
import { Grid, Button } from '@material-ui/core';
import CustomInputBase from 'components/Input/CustomInputBase';
import io from 'socket.io-client';

const FaceRecognition = props => {
  // const { socket } = props;
  const REFRESH_TIME = 1000 / 8;

  const { onChangeSnackbar, onGetResult, onFaceCheckIn } = props;
  const [imageSrc, setImageSrc] = useState();
  const [isOpenCamera, setIsOpenCamera] = useState(1);
  const [user, setUser] = useState({
    username: 'admin',
    password: 'Lifetek2021',
    ip: '192.168.1.66',
  });
  const [socket, setSocket] = useState(null);
  const [results, setResults] = useState([]);
  const [valueUsername, setValueUsername] = useState('admin');
  const [valuePassword, setValuePassword] = useState('Lifetek2021');
  const [valueId, setValueId] = useState('192.168.1.66');
  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [idError, setIdError] = useState(false);

  useEffect(() => {
    // const newSocket = io('http://192.168.1.238:5001');
    // const newSocket = io('http://192.168.1.238:19981');
    const newSocket = io('https://g.lifetek.vn:226');
    newSocket.on('connect', () => {
      console.log('connected to ai server');
    });
    newSocket.on('stream-image', data => {
      console.log('stream-image', data);
      if (data && data.image) {
        setImageSrc(data.image);
      }
    });
    newSocket.on('result-image', data => {
      if (data && data.images) {
        const currResults = [...results];
        const newResults = [...data.images, currResults.slice(data.images.length)];
        setResults(newResults);
        data.images.forEach(item => {
          if (item.info && item.info.result !== 'unknown') {
            onFaceCheckIn({
              lat: 20.9978276,
              long: 105.795114,
              employeeId: item.info.result.split('_')[1],
              type: 'AUTO',
            });
          }
        });
        if (props.onResultsChanged) {
          props.onResultsChanged(newResults);
        }
      }
    });
    setSocket(newSocket);
    return () => {
      if (window.faceReconizeInterval) {
        clearInterval(window.faceReconizeInterval);
      }
      if (socket) {
        socket.removeListener('result-image');
      }
      stopStreamedVideo();
    };
  }, []);

  // useEffect(
  //   () => {
  //     if (socket) {
  //       onGetVideo();
  //     }
  //   },
  //   [socket],
  // );

  // const getCamera = type => {
  //   const video = document.getElementById('faceRecognitionElement');
  //   if (video) {
  //     if (type === 'webcam' && navigator.mediaDevices.getUserMedia) {
  //       return navigator.mediaDevices
  //         .getUserMedia({ video: true })
  //         .then(function(stream) {
  //           video.srcObject = stream;
  //           return stream;
  //         })
  //         .catch(function(err) {
  //           onChangeSnackbar && onChangeSnackbar({ status: true, message: 'Không tìm thấy camera!', variant: 'warning' });
  //         });
  //     }
  //     if (type === 'camera_ip') {
  //     }
  //   }
  // };

  // const getImage = () => {
  //   const video = document.getElementById('faceRecognitionElement');
  //   if (video) {
  //     const canvas = document.createElement('canvas');
  //     canvas.width = video.videoWidth;
  //     canvas.height = video.videoHeight;
  //     canvas.getContext('2d').drawImage(video, 0, 0);
  //     const src = canvas.toDataURL('image/webp');
  //     socket.emit('handle_single_image', { image: src });
  //   }
  // };

  const stopStreamedVideo = () => {
    const video = document.getElementById('faceRecognitionElement');
    if (video && video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(function(track) {
        track.stop();
      });

      video.srcObject = null;
    }
  };

  // useEffect(
  //   () => {
  //     if (socket) {
  //       if (isOpenCamera) {
  //         socket.on('on-result-image', data => {
  //           setImageSrc(data.image);
  //           onGetResult(data);
  //         });

  //         getCamera();
  //         window.faceReconizeInterval = setInterval(getImage, REFRESH_TIME);
  //       } else {
  //         socket.removeListener('on-result-image');

  //         stopStreamedVideo();
  //         if (window.faceReconizeInterval !== undefined && window.faceReconizeInterval !== 'undefined') {
  //           window.clearInterval(window.faceReconizeInterval);
  //         }
  //       }

  //       return () => {
  //         setIsOpenCamera(false);
  //       };
  //     }

  //   },
  //   [isOpenCamera],
  // );

  const handleConnect = () => {
    socket.emit('on_camera_register', { uri: `rtsp://${user.username}:${user.password}@${user.ip}/1` });
  };

  const onGetVideo = () => {
    // getCamera('camera_ip');
    setIsOpenCamera(true);
    // window.faceReconizeInterval = setInterval(getImage, REFRESH_TIME);
    // socket.on('on-result-image', data => {
    //   setImageSrc(data.image);
    //   if (onGetResult) {
    //     onGetResult(data);
    //   }
    //   // onGetResult(data);
    // });
  };

  const userChange = e => {
    let rex = /^[A-Za-z0-9_]+(?:[_][A-Za-z0-9]+)*$/;
    setUserError(!rex.test(e.target.value));
    setValueUsername(e.target.value);
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const passChange = e => {
    let rex = /^[A-Za-z0-9_]+(?:[_][A-Za-z0-9]+)*$/;
    setPassError(!rex.test(e.target.value));
    setValuePassword(e.target.value);
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const ipChange = e => {
    let rex = /^[z0-9.]+(?:[_][A-Za-z0-9]+)*$/;
    setIdError(!rex.test(e.target.value));
    setValueId(e.target.value);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Grid item md={9}>
        <CustomInputBase
          label="username"
          name="username"
          value={user.username}
          onChange={userChange}
          error={valueUsername === '' || valueUsername.length > 100 || userError}
          helperText={
            valueUsername === ''
              ? 'Không được để trống username'
              : userError
                ? 'username không được có ký tự đặc biệt'
                : valueUsername.length > 100
                  ? 'username không được quá 100 ký tự'
                  : ''
          }
        />
        <CustomInputBase
          label="password"
          name="password"
          value={user.password}
          onChange={passChange}
          error={valuePassword === '' || valuePassword.length > 100 || passError}
          helperText={
            valuePassword === ''
              ? 'Không được để trống password'
              : passError
                ? 'password không được có ký tự đặc biệt'
                : valuePassword.length > 100
                  ? 'password không được quá 100 ký tự'
                  : ''
          }
        />
        <CustomInputBase
          label="ip"
          name="ip"
          value={user.ip}
          onChange={ipChange}
          error={valueId === '' || valueId.length > 100 || idError}
          helperText={
            valueId === ''
              ? 'Không được để trống ID'
              : idError
                ? 'ID chỉ được chứa số và dấu "."'
                : valueId.length > 100
                  ? 'password không được quá 100 ký tự'
                  : ''
          }
        />
        <Button
          disabled={
            valueId === '' ||
            valueId.length > 100 ||
            idError ||
            valuePassword === '' ||
            valuePassword.length > 100 ||
            passError ||
            valueUsername === '' ||
            valueUsername.length > 100 ||
            userError
          }
          variant="contained"
          color="primary"
          onClick={handleConnect}
        >
          Kết nối
        </Button>
      </Grid>
      <Grid item md={9}>
        <img src={imageSrc} style={styles.video} />
      </Grid>
    </>
  );
};

export default compose(memo)(FaceRecognition);

const styles = {
  video: {
    width: '500px',
    height: '375px',
    backgroundColor: '#CCC',
  },
};
