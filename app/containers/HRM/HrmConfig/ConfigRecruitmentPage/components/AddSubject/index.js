import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';
import { Paper, Typography, Swipe, Grid, FileUpload, AsyncAutocomplete } from 'components/LifetekUi';
import CustomAppBar from 'components/CustomAppBar';
import { API_QUESTION } from 'config/urlConfig';
import './index.css';
/* eslint-disable react/prefer-stateless-function */
function AddSubject(props) {
  const [localState, setLocalState] = useState({ code: '', name: '' });

  const { onSave, onClose, subjectData } = props;
  const [isRequired, setIsRequired] = useState(false);
  const [nameIsRequired, setNameIsRequired] = useState(false);

  useEffect(
    () => {
      setLocalState({ ...localState, ...subjectData });
    },
    [subjectData],
  );
  useEffect(
    () => {
      if (localState.code !== '') {
        setIsRequired(false);
      }
      if (localState.name !== '') {
        setNameIsRequired(false);
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

  const handleQuestionListChanged = e => {
    setLocalState({ ...localState, question: e });
  };
  const handleOnSave = () => {
    if (localState.code === '') {
      setIsRequired(true);
    } else {
      setIsRequired(false);
    }
    if (localState.name === '') {
      setNameIsRequired(true);
    } else {
      setNameIsRequired(false);
    }
    onSave(localState);
  };

  return (
    <>
      <CustomAppBar title={'Thiết lập môn thi'} onGoBack={() => onClose()} onSubmit={e => handleOnSave(localState)} />
      <Grid container spacing={16} style={{ padding: '100px 20px' }}>
        <Grid item md={6}>
          <CustomInputBase
            error={isRequired}
            helperText={isRequired ? 'Trường Mã môn thi là bắt buộc' : ''}
            className="CustomTextRequired"
            label="Mã môn thi"
            name="code"
            required
            value={localState.code}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item md={6} className="CustomTextRequired">
          <CustomInputBase
            error={nameIsRequired}
            helperText={nameIsRequired ? 'Trường Tên môn thi là bắt buộc' : ''}
            label="Tên môn thi"
            name="name"
            required
            value={localState.name}
            onChange={handleInputChange}
          />
        </Grid>

        {/* <Grid item md={3}>
      <CustomInputBase label="Thang điểm" name="scoreScale" value={localState.scoreScale} onChange={handleInputChange} />
    </Grid> */}

        <Grid item md={4}>
          <CustomInputBase className="CustomText" label="Điểm cần đạt" name="scored" value={localState.scored} onChange={handleInputChange} />
        </Grid>

        <Grid item md={4}>
          <CustomInputBase className="CustomText" label="Thứ tự" name="num" value={localState.num} onChange={handleInputChange} />
        </Grid>

        <Grid item md={4}>
          <CustomInputBase className="CustomText" label="Số lượng câu hỏi" value={localState.question && localState.question.length} disabled />
        </Grid>

        <Grid item md={12}>
          <AsyncAutocomplete
            className="CustomText"
            isMulti
            closeMenuOnSelect={false}
            label={'Chọn câu hỏi'}
            name="question"
            value={localState.question}
            onChange={handleQuestionListChanged}
            url={API_QUESTION}
          />
        </Grid>

        <Grid item md={12}>
          <CustomInputBase className="CustomText" label="Mô tả" name="note" value={localState.note} onChange={handleInputChange} mutiline rows={5} />
        </Grid>
      </Grid>
    </>
  );
}

export default memo(AddSubject);
