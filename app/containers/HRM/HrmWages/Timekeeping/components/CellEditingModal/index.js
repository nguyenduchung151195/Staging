/**
 *
 * AdvanceSearch
 *
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import { compose } from 'redux';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid,
  FormControlLabel,
  Checkbox,
  MenuItem,
  TextField,
  InputLabel,
} from '@material-ui/core';
import PropTypes, { symbol } from 'prop-types';
import { injectIntl } from 'react-intl';
import CustomButton from '../../../../../../components/Button/CustomButton';
import moment from 'moment';
import TimekeepLog from '../TimekeepLog';
import CustomInputBase from '../../../../../../components/Input/CustomInputBase';

function CellEditingModal(props) {
  const { onSave, cellData, symbols = [] } = props;
  const [localState, setLocalState] = useState({
    day: {},
  });
  const [openTimekeepLog, setOpenTimekeepLog] = useState(false);
  const [shifts, setShifts] = useState([]);

  useEffect(
    () => {
      const newState = {
        ...localState,
        ...cellData,
      };
      setLocalState(newState);
      if (newState && newState.row && newState.row.hrmEmployeeId) {
        const shifts = [...(newState.row.hrmEmployeeId.codeShift || [])];
        setShifts(shifts);
        if (newState.day && (!newState.day.shifts || (newState.day.shifts && !newState.day.shifts.name))) {
          const defaultShift = Array.isArray(shifts) && shifts.length && shifts[0];
          const { name, data, startTimeOT, endTimeOT } = defaultShift;
          const newData =
            Array.isArray(data) &&
            data.length &&
            data.map(item => ({ title: item.title, startTime: item.startTime, endTime: item.endTime, _id: item._id }));
          setLocalState({ ...newState, day: { ...newState.day, shifts: { name, data: newData, OTTime: { startTimeOT, endTimeOT } } } });
        }
      }
    },
    [cellData],
  );

  const handleChange = useCallback(
    e => {
      const newState = { ...localState, day: { ...localState.day, [e.target.name]: e.target.value } };
      setLocalState(newState);
    },
    [localState],
  );

  const handleChangeShifts = useCallback(
    e => {
      const {
        target: { value },
      } = e;
      const { name, data, startTimeOT, endTimeOT } = value;
      const newState = {
        ...localState,
        day: {
          ...localState.day,
          shifts: {
            name,
            data,
            OTTime: {
              startTimeOT,
              endTimeOT,
            },
          },
        },
      };
      setLocalState(newState);
    },
    [localState],
  );

  const handleChangeOT = useCallback(e => {
    const {
      target: { value, name },
    } = e;
    const newState = {
      ...localState,
      day: { ...localState.day, shifts: { ...localState.day.shifts, OTTime: { ...localState.day.shifts.OTTime, [name]: value } } },
    };
    setLocalState(newState);
  });

  const handleChangeChecked = e => {
    setLocalState({ ...localState, day: { ...localState.day, shifts: { ...localState.day.shifts, [e.target.name]: e.target.checked } } });
  };

  const handleSave = () => {
    setLocalState({
      day: {},
    });
    if (onSave) {
      onSave(localState);
    }
  };

  const handleClose = () => {
    props.onClose();
    setOpenTimekeepLog(false);
  };

  const handleChangeInOut = (e, index) => {
    const {
      day: { shifts },
    } = localState;
    const { data } = shifts;
    if (e.target.checked) {
      data[index] = {
        ...data[index],
        [e.target.name]: e.target.checked,
      };
    } else {
      data[index] = {
        ...data[index],
        [e.target.name]: e.target.value,
      };
    }
    const newState = {
      ...localState,
      day: {
        ...localState.day,
        shifts: {
          ...localState.day.shifts,
          data,
        },
      },
    };
    setLocalState(newState);
  };

  const getValue = val => {
    if (!val) return null;
    return shifts.find(item => item.name === val.name);
  };
  return (
    <>
      <Dialog fullWidth open={props.open} onClose={props.onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          Chấm công ngày{' '}
          {localState.day &&
            moment(localState.day.date)
              .subtract(1, 'd')
              .format('DD/MM')}
        </DialogTitle>
        <DialogContent>
          {cellData && cellData.day && (!cellData.day.faceTk || !cellData.day.faceTk.length) ? (
            <>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <TextField
                    label="Ký hiệu công"
                    select
                    value={localState.day.symbol}
                    fullWidth
                    variant="outlined"
                    name="symbol"
                    onChange={handleChange}
                  >
                    {symbols.map(
                      symbol =>
                        symbol.usedBy === 'user' && (
                          <MenuItem key={symbol._id} value={symbol.symbol}>
                            {symbol.symbol}
                          </MenuItem>
                        ),
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <CustomInputBase select label="Ca làm việc" onChange={handleChangeShifts} name="shifts" value={getValue(localState.day.shifts)}>
                    {Array.isArray(shifts) && shifts.length > 0 ? shifts.map(shift => <MenuItem value={shift}>{shift.name}</MenuItem>) : ''}
                  </CustomInputBase>
                </Grid>
                {localState.day.shifts && Array.isArray(localState.day.shifts.data) && localState.day.shifts.data.length > 0 ? (
                  <React.Fragment>
                    {localState.day.shifts.data.map((item, index) => (
                      <Grid item xs={12}>
                        <Grid container spacing={8}>
                          <Grid item xs={12}>
                            <InputLabel>{item.title}</InputLabel>
                          </Grid>
                          <Grid item xs={5}>
                            <CustomInputBase
                              label="Giờ vào"
                              value={item.startTime}
                              name="startTime"
                              type="time"
                              onChange={e => handleChangeInOut(e, index)}
                            />
                          </Grid>
                          <Grid item xs={5}>
                            <CustomInputBase
                              label="Giờ ra"
                              value={item.endTime}
                              name="endTime"
                              type="time"
                              onChange={e => handleChangeInOut(e, index)}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <Checkbox name="checkedTime" color="secondary" onChange={e => handleChangeInOut(e, index)} checked={item.checkedTime} />
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="checkedOT"
                            color="secondary"
                            onChange={handleChangeChecked}
                            checked={localState.day.shifts && localState.day.shifts.checkedOT}
                          />
                        }
                        label="Thời gian OT"
                      />
                    </Grid>
                    {localState.day.shifts && localState.day.shifts.checkedOT ? (
                      <React.Fragment>
                        <Grid item xs={6}>
                          <CustomInputBase
                            type="time"
                            name="startTimeOT"
                            label="Bắt đầu OT"
                            value={localState.day.shifts.OTTime.startTimeOT}
                            onChange={handleChangeOT}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CustomInputBase
                            type="time"
                            name="endTimeOT"
                            label="Kết thúc OT"
                            value={localState.day.shifts.OTTime.endTimeOT}
                            onChange={handleChangeOT}
                          />
                        </Grid>
                      </React.Fragment>
                    ) : null}
                  </React.Fragment>
                ) : (
                  ''
                )}

                <Grid item xs={12} className="mt-2">
                  {openTimekeepLog && <TimekeepLog cellData={localState} />}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              {cellData &&
                cellData.day &&
                cellData.day.faceTk.map(item => {
                  if (typeof item.in === 'string') {
                    return (
                      <div>
                        <div>
                          <span style={{ fontWeight: 'bold' }}>Giờ vào: </span>
                          <span>{item.in}</span>
                        </div>
                        <div>
                          <span style={{ fontWeight: 'bold' }}>Tọa độ: </span>
                          <span>
                            {item.lat}
                            (lat) {item.long}
                            (long)
                          </span>
                        </div>
                        {item.link ? (
                          <div style={{ margin: 'auto', width: '70%', paddingTop: '10px' }}>
                            <img src={item.link} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                          </div>
                        ) : null}
                        <hr />
                      </div>
                    );
                  }
                  if (typeof item.out === 'string') {
                    return (
                      <div>
                        <div>
                          <span style={{ fontWeight: 'bold' }}>Giờ ra: </span>
                          <span>{item.out}</span>
                        </div>
                        <div>
                          <span style={{ fontWeight: 'bold' }}>Tọa độ: </span>
                          <span>
                            {item.lat}
                            (lat) {item.long}
                            (long)
                          </span>
                        </div>
                        {item.link ? (
                          <div style={{ margin: 'auto', width: '70%', paddingTop: '10px' }}>
                            <img src={item.link} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                          </div>
                        ) : null}
                        <hr />
                      </div>
                    );
                  }
                  return null;
                })}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => setOpenTimekeepLog(!openTimekeepLog)} color="primary">
            Xem lịch sử
          </CustomButton>
          <CustomButton onClick={handleSave} color="primary">
            Lưu
          </CustomButton>
          <CustomButton onClick={handleClose} color="default">
            Trở về
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

CellEditingModal.propTypes = {
  title: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  handleSave: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default compose(
  memo,
  injectIntl,
)(CellEditingModal);
