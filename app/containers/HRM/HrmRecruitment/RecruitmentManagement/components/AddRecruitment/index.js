/**
 *
 * AddRecruitment
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import { Grid, Typography } from '../../../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../../../components/Input/CustomGroupInputField';
import { viewConfigName2Title } from 'utils/common';
/* eslint-disable react/prefer-stateless-function */
function AddRecruitment(props) {
  const { hrmEmployeeId, recruitment, onSave, onClose, code } = props;
  const [localState, setLocalState] = useState({
    hrmEmployeeId,
    others: {},
  });
  const [name2Title, setName2Title] = useState({});

  useEffect(() => {
    const newNam2Title = viewConfigName2Title(code);
    setName2Title(newNam2Title);
  }, []);

  useEffect(
    () => {
      if (recruitment) {
        setLocalState({ ...recruitment });
      }
    },
    [recruitment],
  );

  const handleInputChange = e => {
    const newLocalState = {
      ...localState,
      [e.target.name]: e.target.value,
    };
    setLocalState(newLocalState);
  };

  const handleOtherDataChange = useCallback(newOther => {
    const newLocalState = {
      ...localState,
      others: newOther,
    };
    setLocalState(newLocalState);
  }, []);

  return (
    <>
      <Grid container>
        <Typography variant="h5" color="primary">
          <Info />
          Thông tin diễn biến lương
        </Typography>
      </Grid>

      <Grid container spacing={8}>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.decisionNumber} value={localState.decisionNumber} name="decisionNumber" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="date"
            label={name2Title.enjoymentDate}
            name="enjoymentDate"
            value={localState.enjoymentDate}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase
            type="date"
            label={name2Title.decisionDate}
            value={localState.decisionDate}
            name="decisionDate"
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.workPlace} value={localState.workPlace} name="workPlace" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase type="date" label={name2Title.procedure} value={localState.procedure} name="procedure" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.position} value={localState.position} name="position" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={4}>
          <CustomInputBase label={name2Title.reason} value={localState.reason} name="reason" onChange={handleInputChange} />
        </Grid>
        <Grid item xs={8}>
          <CustomInputBase select label={name2Title.organizationUnit} name="organizationUnit" value={localState.organizationUnit} />
        </Grid>
        <Grid item xs={12}>
          <CustomInputBase label={name2Title.note} value={localState.note} name="note" onChange={handleInputChange} />
        </Grid>
      </Grid>
      <CustomGroupInputField code="RecruitmentDevelopments" columnPerRow={3} value={localState.others} onChange={handleOtherDataChange} />
      <Grid container spacing={8} justify="flex-end">
        <Grid item>
          <CustomButton
            color="primary"
            onClick={e => {
              onSave(localState);
            }}
          >
            Lưu
          </CustomButton>
        </Grid>
        <Grid item>
          <CustomButton color="secondary" onClick={e => onClose()}>
          hủy
          </CustomButton>
        </Grid>
      </Grid>
    </>
  );
}

AddRecruitment.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default memo(AddRecruitment);
