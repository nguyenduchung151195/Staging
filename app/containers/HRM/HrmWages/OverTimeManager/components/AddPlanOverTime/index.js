import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, AppBar, Toolbar, IconButton, Button } from '@material-ui/core';
import React, { memo, useState, useCallback, useEffect } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import { AsyncAutocomplete } from 'components/LifetekUi';

import { API_TASK_PROJECT, API_HRM_EMPLOYEE } from 'config/urlConfig';
import CustomButton from 'components/Button/CustomButton';
import { SwipeableDrawer } from '../../../../../../components/LifetekUi';
import { Info, Close } from '@material-ui/icons';
import moment from 'moment';
import CustomAppBar from 'components/CustomAppBar';
import { mergeData as MergeData } from '../../../../../Dashboard/actions';
import CustomDatePicker from '../../../../../../components/CustomDatePicker';
import './style.css';
import { connect } from 'react-redux';
import CustomGroupInputField from '../../../../../../components/Input/CustomGroupInputField';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
function AddPlanOverTime(props) {
  const { onSave, reload, onClose, code, open, planOT, onMergeData, miniActive } = props;
  const [localState, setLocalState] = useState({
    taskId: {},
    join: [],
    startDate: new Date(),
    endDate: new Date(),
  });
  const [errorStartDateEndDate, setErrorStartDateEndDate] = useState(false);
  const [errorTextStartDate, setErrorTextStartDate] = useState('');
  const [errorTextEndDate, setErrorTextEndDate] = useState('');

  useEffect(
    () => {
      if (planOT && planOT.originItem) {
        setLocalState({ ...planOT.originItem, join: planOT.originItem.join ? planOT.originItem.join.map(j => j.hrmEmployeeId) : [] });
      }
    },
    [planOT],
  );
  useEffect(() => {
    return () => {
      setTimeout(() => {
        onMergeData({ hiddenHeader: false });
      }, 1);
    };
  }, []);

  const handleInputChange = (e, isStartDate) => {
    const name = isStartDate ? 'startDate' : 'endDate';
    // const value = isStartDate ? moment(e).format('YYYY-MM-DD ') : moment(e).format('YYYY-MM-DD');
    const value = e;
    const newFilter = { ...localState, [name]: value };

    if (!newFilter.startDate && newFilter.endDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('nhập thiếu: "Từ ngày"');
      setErrorTextEndDate('');
    } else if (newFilter.startDate && !newFilter.endDate) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('');
      setErrorTextEndDate('nhập thiếu: "Đến ngày"');
    } else if (newFilter.startDate && newFilter.endDate && new Date(newFilter.endDate) < new Date(newFilter.startDate)) {
      setErrorStartDateEndDate(true);
      setErrorTextStartDate('"Từ ngày" phải nhỏ hơn "Đến ngày"');
      setErrorTextEndDate('"Đến ngày" phải lớn hơn "Từ ngày"');
    } else {
      setErrorStartDateEndDate(false);
      setErrorTextStartDate('');
      setErrorTextEndDate('');
    }
    setLocalState(newFilter);
  };

  const handleChangeTask = value => {
    const { join } = value;

    setLocalState({
      ...localState,
      taskId: value,
      join: join || [],
    });
  };

  const handleChangeJoin = value => {
    setLocalState({
      ...localState,
      join: value || [],
    });
  };
  console.log('localState', localState.join);

  const handleOtherDataChange = useCallback(
    newOther => {
      setLocalState(state => ({ ...state, others: newOther }));
    },
    [localState],
  );

  const handleSave = () => {
    if (onSave) {
      onSave(localState);
    }
  };

  return (
    <React.Fragment>
      <SwipeableDrawer anchor="right" onClose={onClose} open={open} width={!miniActive ? window.innerWidth - 260 : window.innerWidth - 80}>
        <div style={{ padding: '15px', marginTop: '70px', width: !miniActive ? window.innerWidth - 260 : window.innerWidth - 80 }}>
          <Grid container spacing={16}>
            <CustomAppBar title={props.planOT === null ? 'THÊM MỚI Kế hoạch OT' : 'CẬP NHẬT Kế hoạch OT'} onGoBack={onClose} onSubmit={handleSave} />
            <Grid item xs={6}>
              {/* <CustomDatePicker name="startDate" label="Từ ngày" value={localState.startDate} onChange={e => handleInputChange(e, true)} />
               */}
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  label="Từ ngày"
                  value={localState.startDate}
                  name="startDate"
                  margin="dense"
                  variant="outlined"
                  onChange={e => handleInputChange(e, true)}
                  fullWidth
                />
              </MuiPickersUtilsProvider>
              {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextStartDate}</Typography> : null}
            </Grid>
            <Grid item xs={6}>
              {/* <CustomDatePicker name="endDate" label="Đến ngày" value={localState.endDate} onChange={e => handleInputChange(e, false)} /> */}
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  label="Đến ngày"
                  value={localState.endDate}
                  name="endDate"
                  margin="dense"
                  variant="outlined"
                  onChange={e => handleInputChange(e, false)}
                  fullWidth
                />
              </MuiPickersUtilsProvider>
              {errorStartDateEndDate ? <Typography style={{ color: 'red', fontSize: 11 }}>{errorTextEndDate}</Typography> : null}
            </Grid>
            <Grid item xs={12}>
              <AsyncAutocomplete
                label="Dự án"
                onChange={value => handleChangeTask(value)}
                value={localState.taskId}
                url={API_TASK_PROJECT}
                optionValue="_id"
                optionlabel="name"
              />
            </Grid>
            <Grid item xs={12}>
              <AsyncAutocomplete
                isMulti
                label="Nhân sự"
                value={localState.join}
                onChange={value => handleChangeJoin(value)}
                url={API_HRM_EMPLOYEE}
                optionValue="_id"
                optionlabel="name"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomGroupInputField code="HrmOverTime" columnPerRow={2} value={localState.others} onChange={handleOtherDataChange} />
            </Grid>
          </Grid>
        </div>
      </SwipeableDrawer>
    </React.Fragment>
  );
}
AddPlanOverTime.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = createStructuredSelector({});
function mapDispatchToProps(dispatch) {
  return {
    onMergeData: data => dispatch(MergeData(data)),
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
// export default memo(AddPlanOverTime);
export default compose(
  memo,
  withConnect,
)(AddPlanOverTime);
