import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import CustomGroupInputField from 'components/Input/CustomGroupInputField';
import Department from 'components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigCheckForm } from 'utils/common';
import moment from 'moment';
import ListPage from 'components/List';
import { Paper, Typography, Swipe, Grid, FileUpload, AsyncAutocomplete } from 'components/LifetekUi';
import KanbanStepper from 'components/KanbanStepper';
import { Edit, Person, Info, Add } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { MenuItem, Button, Checkbox, Avatar } from '@material-ui/core';
import { API_ROUND_EXAM } from 'config/urlConfig';
import {
  createRecruitmentManagement,
  deleteRecruitmentManagement,
  getCountHrmByRole,
  getHumanResource,
  mergeData,
  updateRecruitmentManagement,
} from '../../../../HrmRecruitment/HrmRecruitmentManagement/actions';
import Buttons from 'components/CustomButtons/Button';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import reducer from '../../../../HrmRecruitment/HrmRecruitmentManagement/reducer';
import saga from '../../../../HrmRecruitment/HrmRecruitmentManagement/saga';
import { connect } from 'react-redux';
import { compose } from 'redux';
import './index.css';
import makeSelectRecruitmentManagementPage from '../../../../HrmRecruitment/HrmRecruitmentManagement/selectors';
// import reducer from './reducer';
// import saga from './saga';
// import makeSelectRecruitmentManagementPage from './selectors';

/* eslint-disable react/prefer-stateless-function */
function AddVacation(props) {
  const [localState, setLocalState] = useState({ code: '', name: '' });
  const {
    onSave,
    onClose,
    vacationData,
    mergeData,
    recruitmentManagementPage,
    onCreateRecruitmentManagement,
    onUpdateRecruitmentManagement,
    onDeleteRecruitmentManagement,
    id: getCountHrmByRole,
    getHumanResource,
    profile,
  } = props;
  const {
    createRecruitmentManagementSuccess,
    updateRecruitmentManagementSuccess,
    deleteRecruitmentManagementSuccess,
    tab,
    countEmployee,
    fieldRole,
    humanResource,
  } = recruitmentManagementPage;

  const [codeIsRequired, setCodeIsRequired] = useState(false);
  const [nameIsRequired, setNameIsRequired] = useState(false);
  const [roundExamsIsRequired, setRoundExamsIsRequired] = useState(false);

  useEffect(
    () => {
      if (localState.name !== '') {
        setCodeIsRequired(false);
      }
      if (localState.name !== '') {
        setCodeIsRequired(false);
      }
      if (localState.roundExams !== '' && localState.roundExams !== undefined) {
        setRoundExamsIsRequired(false);
      }
    },
    [localState],
  );
  useEffect(() => {
    getHumanResource();
  }, []);

  useEffect(
    () => {
      setLocalState({ ...localState, ...vacationData });
    },
    [vacationData],
  );

  useEffect(
    () => {
      if (localState.name !== '') {
        setNameIsRequired(false);
      }
      if (localState.code !== '') {
        setCodeIsRequired(false);
      }
    },
    [localState],
  );
  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );
  const handleRoundChanged = e => {
    setLocalState({ ...localState, roundExams: e });
  };

  const getValueFieldRole = value => {
    if (!value) return null;
    return fieldRole.find(it => it.code === value.code);
  };

  const handleOnSave = () => {
    if (localState.code === '') {
      setCodeIsRequired(true);
    } else {
      setCodeIsRequired(false);
    }
    if (localState.name === '') {
      setNameIsRequired(true);
    } else {
      setNameIsRequired(false);
    }
    if (localState.roundExams === undefined || localState.roundExams === null) {
      setRoundExamsIsRequired(true);
    } else {
      setRoundExamsIsRequired(false);
    }
    onSave(localState);
  };
  return (
    <Grid container spacing={16}>
      <Grid item md={6}>
        <CustomInputBase
          error={codeIsRequired}
          helperText={codeIsRequired ? 'Trường Mã vị trí là bắt buộc' : ''}
          className="CustomTextRequired"
          label="Mã vị trí*"
          name="code"
          value={localState.code}
          onChange={handleInputChange}
        />
      </Grid>

      <Grid item md={6}>
        <CustomInputBase
          error={nameIsRequired}
          helperText={nameIsRequired ? 'Trường Tên vị trí là bắt buộc' : ''}
          className="CustomTextRequired"
          label="Tên vị trí*"
          name="name"
          value={localState.name}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item md={6}>
        <CustomInputBase
          className="CustomText"
          select
          label="Chức vụ"
          name="position"
          value={getValueFieldRole(localState.position)}
          onChange={handleInputChange}
        >
          {Array.isArray(fieldRole) && fieldRole.length > 0 ? fieldRole.map(field => <MenuItem value={field}>{field.name}</MenuItem>) : null}
        </CustomInputBase>
      </Grid>
      <Grid item md={6}>
        <AsyncAutocomplete
          error={roundExamsIsRequired}
          helperText={roundExamsIsRequired ? 'Trường Mã vị trí là bắt buộc' : ''}
          className="CustomTextRequired"
          isMulti
          label={'Chọn vòng thi*'}
          name="roundExams"
          value={localState.roundExams}
          onChange={handleRoundChanged}
          url={API_ROUND_EXAM}
        />
      </Grid>

      <Grid item md={12}>
        <CustomInputBase className="CustomText" label="Mô tả" name="note" value={localState.note} onChange={handleInputChange} mutiline rows={5} />
      </Grid>

      <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton color="primary" onClick={e => handleOnSave(localState)}>
            Lưu
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={onClose}>
            hủy
          </CustomButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

AddVacation.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recruitmentManagementPage: makeSelectRecruitmentManagementPage(),
});

// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch,
//   };
// }
function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onCreateRecruitmentManagement: data => dispatch(createRecruitmentManagement(data)),
    onUpdateRecruitmentManagement: (hrmEmployeeId, data) => dispatch(updateRecruitmentManagement(hrmEmployeeId, data)),
    onDeleteRecruitmentManagement: (hrmEmployeeId, ids) => dispatch(deleteRecruitmentManagement(hrmEmployeeId, ids)),
    getCountHrmByRole: (roleCode, organizationUnit) => dispatch(getCountHrmByRole(roleCode, organizationUnit)),
    getHumanResource: () => dispatch(getHumanResource()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'recruitmentManagementPage', reducer });
const withSaga = injectSaga({ key: 'recruitmentManagementPage', saga });

export default compose(
  withConnect,
  withReducer,
  withSaga,
)(AddVacation);
