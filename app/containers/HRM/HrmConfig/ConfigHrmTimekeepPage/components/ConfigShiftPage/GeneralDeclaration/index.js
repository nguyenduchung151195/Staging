import { Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@material-ui/core';
import CustomInputBase from 'components/Input/CustomInputBase';
import React, { memo } from 'react';
import { compose } from 'redux';

function GeneralDeclaration(props) {
  const { onChange, localData } = props
  return (
    <Grid container column spacing={16}>
      <Grid xs={12} item ><Typography>Thời gian làm việc</Typography></Grid>
      <Grid xs={6} item >

        {/* Bắt đầu làm việc */}
        <CustomInputBase
          label={'Bắt đầu làm việc'}
          name="timeStart"
          type="time"
          onChange={onChange}
          value={localData.timeStart}
        />

        {/* Bắt đầu vào ca */}
        <CustomInputBase
          label={'Bắt đầu vào ca'}
          name="shiftStart"
          type="time"
          onChange={onChange}
          value={localData.shiftStart}
        />

        {/* Bắt đầu ra về */}
        <CustomInputBase
          label={'Bắt đầu ra về'}
          onChange={onChange}
          type="time"
          name="goHomeTimeStart"
          value={localData.goHomeTimeStart}

        />

        {/* Bắt đầu nghỉ giữa ca */}
        <CustomInputBase
          label={'Bắt đầu nghỉ giữa ca'}
          name="midShiftStart"
          type="time"
          onChange={onChange}
          value={localData.midShiftStart}
        />

      </Grid>

      {/* ------------- Cột 2 --------------*/}
      <Grid xs={6} item>
        {/* Kết thúc làm việc */}
        <CustomInputBase
          label={'Kết thúc làm việc'}
          name="timeEnd"
          // value={this.state.tags}
          type="time"
          onChange={onChange}
          value={localData.timeEnd}
        />

        {/* Kết thúc vào ca*/}
        <CustomInputBase
          label="Kết thúc vào ca"
          name="shiftEnd"
          // value={this.state.deliveryTime}
          type="time"
          onChange={onChange}
          value={localData.shiftEnd}
        />

        {/* Kết thúc ra về */}
        <CustomInputBase
          label={'Kết thúc ra về'}
          name="goHomeTimeEnd"
          // value={this.state.note}
          onChange={onChange}
          type="time"
          value={localData.goHomeTimeEnd}
        />

        {/* Kết thúc nghỉ giữa ca*/}
        <CustomInputBase
          label="Kết thúc nghỉ giữa ca"
          name="midShiftEnd"
          // value={this.state.priceEUR}
          onChange={onChange}
          type="time"
          value={localData.midShiftEnd}
        />

      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography>Thông số tính giờ</Typography>
          </Grid>
          <Grid item xs={6}>
            <CustomInputBase onChange={onChange} value={localData.minimunOverTimeBeforeShift} name="minimunOverTimeBeforeShift" label="Làm thêm tối thiểu trước ca" type="number" />
            <CustomInputBase onChange={onChange} value={localData.minimunOverTimeAfterShift} name="minimunOverTimeAfterShift" label="Làm thêm tối thiểu sau ca" type="number" />
            <CustomInputBase onChange={onChange} value={localData.letGoLate} name="letGoLate" label="Cho phép đi muộn" type="number" />
            <CustomInputBase onChange={onChange} value={localData.leaveEarly} name="leaveEarly" label="Cho phép về sớm" type="number" />
            <CustomInputBase onChange={onChange} value={localData.roundUnit} name="roundUnit" label="Đơn vị làm tròn" type="number" />
            <CustomInputBase onChange={onChange} value={localData.workFactor} name="workFactor" label="Hệ số công" type="number" />
          </Grid>
          <Grid item xs={6}>
            <FormGroup>
              <FormControlLabel control={<Checkbox name="checkedOverTimeBeforeShift" color="primary" onChange={onChange} checked={localData.checkedOverTimeBeforeShift} />} label="Tính làm thêm trước ca" />
              <FormControlLabel control={<Checkbox name="checkedOverTimeAfterShift" color="primary" onChange={onChange} checked={localData.checkedOverTimeAfterShift} />} label="Tính làm thêm sau ca" />
              <FormControlLabel control={<Checkbox name="checkedSubtractLateTimeGoWorkTime" color="primary" onChange={onChange} checked={localData.checkedSubtractLateTimeGoWorkTime} />} label="Trừ thời gian đi muộn vào thời gian làm" />
              <FormControlLabel control={<Checkbox name="checkedSubtractEarlyTimeGoWorkTime" color="primary" onChange={onChange} checked={localData.checkedSubtractEarlyTimeGoWorkTime} />} label="Trừ thời gian về sớm vào thời gian làm" />
              <FormControlLabel control={<Checkbox name="checkedNoTimeRequiredForShift" color="primary" onChange={onChange} checked={localData.checkedNoTimeRequiredForShift} />} label="Không cần chấm công vào ca" />
              <FormControlLabel control={<Checkbox name="checkedNoTimeRequiredAboutShift" color="primary" onChange={onChange} checked={localData.checkedNoTimeRequiredAboutShift} />} label="Không cần chấm công ra về" />
            </FormGroup>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default compose(memo)(GeneralDeclaration)