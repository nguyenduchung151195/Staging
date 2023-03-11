import React, { useEffect, useState } from 'react';
import { Grid, Paper, withStyles, CardMedia, TextField, MenuItem, Button, Checkbox, Avatar } from '@material-ui/core';
import { Edit, Person } from '@material-ui/icons';
import { Typography } from 'components/LifetekUi';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomDatePicker from '../../components/CustomDatePicker';
import { getImage } from './actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import reducer from './reducer';
import saga from './saga';
import makeSelectFaceRecognition from './selectors';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getInfo, fetchFaceInfoSaga, timeKeeping } from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import { viewConfigName2Title, viewConfigCheckForm, viewConfigCheckRequired } from 'utils/common';
import Video from 'components/CustomCamera/FaceRecognition/Loadable';
import moment from 'moment';

const FaceRecognition = props => {
  const { getInfo, faceRecognition, onChangeSnackbar, code = 'hrm', timeKeeping, onFaceCheckIn } = props;
  const { userData, timekeepingData, timekeepingSuccess } = faceRecognition;
  const [name2Title, setName2Title] = useState({});
  const [latitude, setLatitude] = useState('1');
  const [longitude, setLongitude] = useState('1');
  const [info, setInfo] = useState({ others: {} });
  const [results, setResults] = useState([]);
  useEffect(() => {
    const newName2Title = viewConfigName2Title(code);
    setName2Title(newName2Title);
    getLocation();
  }, []);
  useEffect(
    () => {
      if (timekeepingSuccess) {
        // setEmployeeId();
      }
    },
    [timekeepingSuccess],
  );

  const onGetVideoResult = data => {
    // const { employeeId: id } = data;
    // if (id && id !== 'unknown') {
    //   getLocation();
    //   timeKeeping({
    //     employeeId: id,
    //     lat: latitude,
    //     long: longitude,
    //   });
    // }
    if (data && data.employeeId) {
      setInfo(data);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        // setLatitude(position.coords.latitude);
        // setLongitude(position.coords.longitude);
      });
    }
  };

  const handleInputChange = (e, isDate) => {
    if (isDate) {
      const name = 'birth';
      const value = moment(e).format('YYYY-MM-DD');
      setInfo({ ...info, [name]: value });
    } else {
      setInfo({ ...info, [e.target.name]: e.target.value });
    }
  };
  console.log(info);
  return (
    <React.Fragment>
      <Grid container spacing={16} style={{ height: '100vh' }}>
        <Grid item md={6}>
          <Grid container spacing={16}>
            <Grid item md={12}>
              <Typography component="p" style={{ fontWeight: 550, fontSize: '18px' }}>
                <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin cá nhân
                <span style={{ color: '#A4A4A4', fontStyle: 'italic', fontWeight: 500 }} />
              </Typography>
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="TÊN NHÂN VIÊN" name="name" type="text" value={info.name} onChange={handleInputChange} />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="MÃ NHÂN VIÊN" name="code" value={info.code} onChange={handleInputChange} />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase select label="GIỚI TÍNH" name="gender" value={info.gender} onChange={handleInputChange}>
                {' '}
                <MenuItem key="0" value={0}>
                  Nam
                </MenuItem>
                <MenuItem key="1" value={1}>
                  Nữ
                </MenuItem>
              </CustomInputBase>
            </Grid>
            <Grid item md={6}>
              <CustomDatePicker label="NGÀY SINH" value={info.birth} name="endDate" onChange={e => handleInputChange(e, true)} />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="EMAIL" name="email" type="email" value={info.email} onChange={handleInputChange} />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="SỐ ĐIỆN THOẠI" name="phoneNumber" type="number" value={info.phoneNumber} onChange={handleInputChange} />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="SỐ CMND" name="identityCardNumber" type="number" value={info.identityCardNumber} onChange={handleInputChange} />
            </Grid>
            {results.map(result => (
              <Grid item>
                <img
                  src={result.image}
                  onClick={() => {
                    setInfo(result.info);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item md={6} container style={{ marginTop: 80 }} justify="center">
          <Video
            onResultsChanged={newResults => {
              setResults(newResults);
            }}
            onFaceCheckIn={onFaceCheckIn}
            onChangeSnackbar={onChangeSnackbar}
            onGetResult={onGetVideoResult}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  faceRecognition: makeSelectFaceRecognition(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getInfo: () => dispatch(getInfo()),
    getFaceInfo: data => dispatch(fetchFaceInfoSaga(data)),
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),
    onFaceCheckIn: data => dispatch(timeKeeping(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'faceRecognition', reducer });
const withSaga = injectSaga({ key: 'faceRecognition', saga });

// export default FaceRecognition;
export default compose(
  withReducer,
  withSaga,
  withConnect,
)(FaceRecognition);
