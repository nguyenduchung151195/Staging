import { Grid, Tabs, Typography, Tab, MenuItem, FormGroup, Checkbox, FormControlLabel, TextField, Button, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Fab } from 'components/LifetekUi';
import React, { memo, useEffect, useState } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import { Add, Close, Edit, Info } from '@material-ui/icons';
import Department from 'components/Filter/DepartmentAndEmployee';
import GeneralDeclaration from '../GeneralDeclaration/Loadable';
import CustomButton from 'components/Button/CustomButton';
import OtherTimingParam from '../OtherTimingParam/Loadable';
// import MultiSelect from "react-multi-select-component";
import Select, { components } from 'react-select';
import './index.css'

function DialogShiftPage(props) {
  const {
    localData,
    handleChange,
    handeChangeDepartment,
    handleSetTab,
    tab,
    handleSave,
    handleCloseDialog,
    symbols,
    handleAddShift,
    handleDeleteShift,
    handleChangeTime,
    handleChangeWorkingDay,
    handleChangeSymboyDay,
    profile,
  } = props;

  const [timing, setTiming] = useState([]);
  const [data, setData] = useState([]);
  const [openEditTitle, setOpenEditTitle] = useState(false);
  useEffect(() => {
    const viewConfig = JSON.parse(localStorage.getItem('hrmSource')) || null;
    const viewCofigCode = viewConfig ? viewConfig.find(s => s.code === 'S20') : null;
    const data = viewCofigCode ? viewCofigCode.data : [];
    setTiming(data);
  }, []);

  const getSelectedValue = val => {
    if (!val) return null;
    return timing.find(i => i._id === val._id);
  };

  const suggest = [
    {
      label: 'Thứ 2',
      value: 'Monday',
    },
    {
      label: 'Thứ 3',
      value: 'Tuesday',
    },
    {
      label: 'Thứ 4',
      value: 'Wednesday',
    },
    {
      label: 'Thứ 5',
      value: 'Thursday',
    },
    {
      label: 'Thứ 6',
      value: 'Friday',
    },
    {
      label: 'Thứ 7',
      value: 'Saturday',
    },
    {
      label: 'Chủ nhật',
      value: 'Sunday',
    },
  ];

  const MultiValue = props => {
    return (
      <components.MultiValue {...props}>
        <span>{props.data.label}</span>
      </components.MultiValue>
    );
  };

  const Option = props => {
    return (
      <div style={{ backgroundColor: '#FFFFFF', zIndex: 9999 }}>
        <components.Option {...props}>
          <input type="checkbox" checked={props.isSelected} onChange={e => null} /> <label>{props.label} </label>
        </components.Option>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Grid container spacing={16} style={{ marginTop: 70, width: "calc(100vw - 260px)" }} >
        <AppBar className="HearderappBarDialogShift">
          <Toolbar>
            <IconButton
              // className={id !== 'add' ? '' : ''}
              className="BTNDialogShift"
              color="inherit"
              variant="contained"
              onClick={handleCloseDialog}
              aria-label="Close"
            >
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
              {props.localData.name === '' ? `Thêm mới` : `cập nhật`}
            </Typography>
            {/* {showButtonEx()} */}

            <Button
              variant="outlined"
              color="inherit"
              onClick={handleSave}
            >
              LƯU
            </Button>
          </Toolbar>
        </AppBar>
        <Grid item xs={12} container style={{ marginTop: "-20px", height: "calc(100vh - 90px) ", overflow: "auto" }}>
          <Grid item xs={12}>
            <Typography variant="h5" color="primary">
              <Info />
              {localData && localData._id ? 'Cập nhật ca làm việc' : 'Thêm mới ca làm việc'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <CustomInputBase label="Mã ca" type="text" value={localData.code} onChange={handleChange} name="code" />
              </Grid>
              <Grid item xs={6}>
                <CustomInputBase label="Tên" type="text" value={localData.name} onChange={handleChange} name="name" />
              </Grid>
              <Grid item xs={6}>
                <Department
                  disableEmployee
                  onChange={handeChangeDepartment}
                  department={localData.organizationUnit}
                  profile={profile}
                  moduleCode="hrm"
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInputBase select onChange={handleChange} value={localData.symbol} label="Ký hiệu chấm công" name="symbol">
                  {Array.isArray(symbols) && symbols.length && symbols.map(item => <MenuItem value={item.symbol}>{item.symbol}</MenuItem>)}
                </CustomInputBase>
              </Grid>
              <Grid item xs={6}>
                <CustomInputBase label="Cách tính thời gian" name="type" select value={getSelectedValue(localData.type)} onChange={handleChange}>
                  {timing && timing.length && timing.map(item => <MenuItem value={item}>{item.title}</MenuItem>)}
                </CustomInputBase>
              </Grid>

              {/* Ca chấm công cũ */}
              {/* <Tabs value={tab} onChange={(e, value) => handleSetTab(value)}>
              <Tab value={0} label="Khai báo chung" />
              <Tab value={1} label="Tham số tính giờ khác" />
            </Tabs>

            {tab === 0 && (
              <Grid item xs={12}>
                <GeneralDeclaration onChange={handleChange} localData={localData} />
              </Grid>
            )}
            {tab === 1 && (
              <Grid item xs={12}>
                <OtherTimingParam onChange={handleChange} localData={localData} />
              </Grid>
            )} */}

              {/* cấu hình chấm công mới */}
              <Grid item xs={12}>
                <Grid container spacing={16}>
                  <Grid item xs={12}>
                    <Grid container spacing={16} direction="row" justify="space-between">
                      <Grid item>
                        <Typography color="primary">
                          <Info />
                          Thời gian xác định ca làm việc
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Fab onClick={handleAddShift}>
                          <Add />
                        </Fab>
                      </Grid>
                    </Grid>
                  </Grid>
                  {Array.isArray(localData.data) && localData.data.length
                    ? localData.data.map((item, index) => (
                      <React.Fragment>
                        <Grid item xs={12}>
                          <Grid container spacing={16} justify="space-between" alignItems="center">
                            <Grid item>
                              {openEditTitle ? (
                                <Typography color="primary">
                                  <Info />{' '}
                                  <TextField
                                    type="text"
                                    value={item.title}
                                    name="title"
                                    onChange={e => handleChangeTime(e, index)}
                                    onBlur={() => setOpenEditTitle(false)}
                                  />
                                </Typography>
                              ) : (
                                <Typography color="primary">
                                  <Info />
                                  {item.title}
                                </Typography>
                              )}
                            </Grid>
                            <Grid item>
                              <Edit onClick={e => setOpenEditTitle(true)} />
                              <Close onClick={e => handleDeleteShift(e, index)} />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <CustomInputBase
                            type="time"
                            value={item.startTime}
                            name="startTime"
                            onChange={e => handleChangeTime(e, index)}
                            label="Thời gian bắt đầu"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CustomInputBase
                            type="time"
                            value={item.endTime}
                            name="endTime"
                            onChange={e => handleChangeTime(e, index)}
                            label="Kết thúc"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <CustomInputBase
                            type="time"
                            value={item.timeOutToDetermineTheWord}
                            name="timeOutToDetermineTheWord"
                            onChange={e => handleChangeTime(e, index)}
                            label="Thời gian ra xác định từ"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CustomInputBase
                            type="time"
                            value={item.timeOutDetermineToCome}
                            name="timeOutDetermineToCome"
                            onChange={e => handleChangeTime(e, index)}
                            label="Thời gian ra xác định tới"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          {/* <MultiSelect
                        name='workingDay'
                        style={{ zIndex: 999 }}
                        options={suggest}
                        value={item.workingDay ? item.workingDay : []}
                        onChange={e => handleChangeWorkingDay(e, index)}
                        labelledBy={"Chọn ngày làm việc"}
                        hasSelectAll={false}
                      /> */}
                          <Select
                            style={{ height: 50 }}
                            closeMenuOnSelect={false}
                            isMulti
                            components={{ Option, MultiValue }}
                            value={item.workingDay ? item.workingDay : []}
                            options={suggest}
                            onChange={e => handleChangeWorkingDay(e, index)}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CustomInputBase select onChange={e => handleChangeSymboyDay(e, index)} value={item.symbol} label="Ký hiệu chấm công" name="symbol">
                            {Array.isArray(symbols) && symbols.length && symbols.map(item => <MenuItem value={item.symbol}>{item.symbol}</MenuItem>)}
                          </CustomInputBase>
                        </Grid>
                      </React.Fragment>
                    ))
                    : ''}

                  {/* Thời gian tính OT */}
                  <Grid item xs={12}>
                    <Typography color="primary">
                      <Info />
                      Thời gian tính OT
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase type="time" value={localData.startTimeOT} name="startTimeOT" onChange={handleChange} label="Thời gian bắt đầu" />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase type="time" value={localData.endTimeOT} name="endTimeOT" onChange={handleChange} label="Kết thúc" />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography color="primary">
                      <Info />
                      Thời gian nửa thông số khác
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase
                      type="number"
                      value={localData.breakTime}
                      name="breakTime"
                      onChange={handleChange}
                      label="Thời gian nghỉ giữa ca (phút)"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Checkbox name="hoursDeducted" color="primary" onChange={handleChange} checked={localData.hoursDeducted} />}
                      label="Ra ngoài bị trừ giờ"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase
                      type="number"
                      value={localData.finishSoon}
                      name="finishSoon"
                      onChange={handleChange}
                      label="Cho phép về sớm (phút)"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase type="number" value={localData.late} name="late" onChange={handleChange} label="Cho phép đi muộn (phút)" />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase
                      type="number"
                      value={localData.minOtBeforeShift}
                      name="minOtBeforeShift"
                      onChange={handleChange}
                      label="Làm thêm tối thiểu trước ca (phút)"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase
                      type="number"
                      value={localData.minOtAfterShift}
                      name="minOtAfterShift"
                      onChange={handleChange}
                      label="Làm thêm tối đa trước ca (phút)"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase
                      type="number"
                      value={localData.maxOtBeforeShift}
                      name="maxOtBeforeShift"
                      onChange={handleChange}
                      label="Làm thêm tối thiểu sau ca (phút)"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase
                      type="number"
                      value={localData.maxOtAfterShift}
                      name="maxOtAfterShift"
                      onChange={handleChange}
                      label="Làm thêm tối đa sau ca (phút)"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase
                      type="time"
                      value={localData.startTimeOtBefore}
                      name="startTimeOtBefore"
                      onChange={handleChange}
                      label="TG làm thêm trước ca xác định từ"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase
                      type="time"
                      value={localData.startTimeOtAfter}
                      name="startTimeOtAfter"
                      onChange={handleChange}
                      label="TG làm thêm sau ca xác định tới"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputBase
                      type="number"
                      value={localData.blockTimes}
                      name="blockTimes"
                      onChange={handleChange}
                      label="Block tính giờ (phút)"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Checkbox name="addBreakTime" color="primary" onChange={handleChange} checked={localData.addBreakTime} />}
                      label="Cộng nghỉ giữa ca vào thời gian làm việc"
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* kết thúc cấu hình chấm công mới */}
              {/* 
            <Grid item xs={12}>
              <Grid container spacing={16} direction="row" justify="flex-end">
                <Grid item>
                  <CustomButton onClick={handleSave} variant="outlined" color="primary">
                    {localData && localData._id ? 'Cập nhật' : 'Thêm mới'}
                  </CustomButton>
                </Grid>
                <Grid item>
                  <CustomButton
                    onClick={handleCloseDialog}
                    variant="outlined"
                    color="secondary"
                    // autoFocus
                  >
                    Hủy
                  </CustomButton>
                </Grid>
              </Grid>
            </Grid> */}
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </React.Fragment>
  );
}

export default memo(DialogShiftPage);
