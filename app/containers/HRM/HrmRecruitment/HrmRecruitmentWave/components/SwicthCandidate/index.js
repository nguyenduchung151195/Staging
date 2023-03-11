import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import { Paper, Typography, Swipe, Grid, FileUpload, AsyncAutocomplete } from 'components/LifetekUi';
import { FormControl, Grid as GridUI, InputLabel, MenuItem, Select, OutlinedInput } from '@material-ui/core';
import CustomDatePicker from '../../../../../../components/CustomDatePicker';
import moment from 'moment';
import { API_USERS } from 'config/urlConfig';

/* eslint-disable react/prefer-stateless-function */
function SwicthCandidate(props) {
  const [localState, setLocalState] = useState({});

  const {
    onSave,
    onClose,
    switchData,
    ids,
    onChangeSelect,
    typeExams,
    template,
    idTemplate,
    dateExams,
    address,
    onChangeDate,
    handleChangeInchargeUsers,
    inChargeUsers,
    moduleCode,
    name,
  } = props;

  useEffect(
    () => {
      setLocalState({ ...switchData });
    },
    [switchData],
  );

  const handleInputChange = useCallback(
    e => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
    },
    [localState],
  );

  const handleQuestionListChanged = e => {
    setLocalState({ ...localState, question: e });
  };

  return (
    <Grid container spacing={16}>
      {ids.length === 0 ? (
        <Grid item md={6}>
          <CustomInputBase label="Số lượng" name="count" type="number" value={localState.count} onChange={handleInputChange} />
        </Grid>
      ) : (
        <Grid item md={12}>
          <CustomInputBase label="Hình thức thi" name="typeExams" select value={typeExams} onChange={e => onChangeSelect(e)}>
            <MenuItem value={0}>Thi trực tuyến</MenuItem>
            <MenuItem value={1}>Thi trực tiếp</MenuItem>
          </CustomInputBase>
        </Grid>
      )}

      {ids.length !== 0 &&
        typeExams === 1 && (
          <>
            <Grid item md={6}>
              <AsyncAutocomplete
                isMulti
                name="Nhân sự phụ trách"
                label={'Nhân sự phụ trách'}
                required={true}
                checkedShowForm={true}
                onChange={handleChangeInchargeUsers}
                url={API_USERS}
                value={inChargeUsers}
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase
                label="Chọn biểu mẫu"
                select
                name="idTemplate"
                value={idTemplate}
                onChange={e => {
                  onChangeSelect(e);
                }}
              >
                {Array.isArray(template) &&
                  template.length > 0 &&
                  template.map((item, index) => {
                    return <MenuItem value={item}>{item.title}</MenuItem>;
                  })}
              </CustomInputBase>
            </Grid>
            <Grid item md={6}>
              <CustomDatePicker
                label="Ngày hẹn"
                disablePast
                minDate={moment().format('DD/MM/YYYY')}
                value={dateExams && dateExams}
                onChange={e => onChangeDate(e)}
              />
            </Grid>
            <Grid item md={6}>
              <CustomInputBase label="Địa điểm" name="address" value={address} onChange={e => onChangeSelect(e)} />
            </Grid>
          </>
        )}

      {/* <Grid item md={3}>
        <CustomInputBase label="Thang điểm" name="scoreScale" value={localState.scoreScale} onChange={handleInputChange} />
      </Grid> */}
      {/* <Grid item md={6}>
              <CustomInputBase label="Nhận xét" name="comment" value={comment} onChange={e => onChangeSelect(e)} />
      </Grid>
      <Grid item md={6}>
              <CustomInputBase label="Đánh giá" name="evaluate" value={evaluate} onChange={e => onChangeSelect(e)} />
      </Grid>
      <Grid item md={6}>
              <CustomInputBase label="Mô tả" name="description" value={description} onChange={e => onChangeSelect(e)} />
            </Grid> */}
      

      {!props.disableScores && (
        <Grid item md={6}>
          <CustomInputBase label="Điểm cần đạt" name="scores" type="number" value={localState.scores} onChange={handleInputChange} />
        </Grid>
      )}

      <GridUI style={{ marginTop: 10 }} container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton color="primary" onClick={e => onSave(localState)}>
            {ids.length === 0 ? 'Lưu' : 'Gửi'}
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={onClose}>
            hủy
          </CustomButton>
        </Grid>
      </GridUI>
    </Grid>
  );
}

export default memo(SwicthCandidate);
