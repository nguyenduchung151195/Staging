import { Checkbox, FormControlLabel, Grid, Typography } from '@material-ui/core';
import React, { memo } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';

function OtherTimingParam(props) {
  const { onChange, localData } = props;
  return (
    <React.Fragment>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Typography>Tham số tính giờ qua đêm</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={16} direction="row" alignItems="center" justify="center">
            <FormControlLabel control={<Checkbox name="checkedSeparateTheDayAndNight" onChange={onChange} value={localData.checkedSeparateTheDayAndNight} />} label="Tách thời gian làm ngày và đêm" />

          </Grid>
          <Grid container spacing={16} direction="row" alignItems="center" justify="center">
            <Grid item xs={3}>
              <CustomInputBase label="Ngưỡng ngày" type="time" onChange={onChange} name="thresholdDay" value={localData.thresholdDay} />
            </Grid>
            <Grid item xs={3}>
              <CustomInputBase label="Ngưỡng đêm" type="time" onChange={onChange} name="thresholdNight" value={localData.thresholdNight} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel control={<Checkbox name="checkedDontCountGoLate" onChange={onChange} checked={localData.checkedDontCountGoLate} />} label="Không tính đi muộn" />
        </Grid>
        <Grid item xs={8}>
          <CustomInputBase label="Số phút nghỉ trước khi làm thêm" type="time" name="minutesBeforeOverTime" onChange={onChange} checked={localData.minutesBeforeOverTime} />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel control={<Checkbox name="checkedDontCountGoEarly" onChange={onChange} checked={localData.checkedDontCountGoEarly} />} label="Không tính đi sớm" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel control={<Checkbox name="checkedIncentivesOnShift" onChange={onChange} checked={localData.checkedIncentivesOnShift} />} label="Ưu đãi vào ca" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel control={<Checkbox name="checkedOverTimeShift" onChange={onChange} checked={localData.checkedOverTimeShift} />} label="Là ca làm thêm" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel control={<Checkbox name="checkedCompensateOvertimeOvertime" onChange={onChange} checked={localData.checkedCompensateOvertimeOvertime} />} label="Bù thời gian làm thêm vào thời gian làm" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel control={<Checkbox name="checkedIncentivesToLeave" onChange={onChange} checked={localData.checkedIncentivesToLeave} />} label="Ưu đãi ra về" />
        </Grid>

        <Grid item xs={12}>
          <CustomInputBase label="Ghi chú" rows={5} multiline onChange={onChange} name="note" value={localData.note} />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default memo(OtherTimingParam);