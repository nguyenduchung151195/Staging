/**
 *
 * AddSalary
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Info } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import { TextField, Grid, Typography } from '../../../../../../../../components/LifetekUi';
import Department from '../../../../../../../../components/Filter/DepartmentAndEmployee';

/* eslint-disable react/prefer-stateless-function */
function AddSalary(props) {
  const { salary, onSave, onClose, profile } = props;
  console.log('profile', profile);
  const [localState, setLocalState] = useState({});
  // useEffect(() => {
  //   if (salary) {
  //     setLocalState({ ...salary });
  //   }
  // }, [salary]);
  const handeChangeDepartment = data => {
    const { department } = data;
    setLocalState({ ...localState, organizationUnit: department });
  };
  const handleInputChange = e => {
    const newLocalState = {
      ...localState,
      [e.target.name]: e.target.value,
    };
    setLocalState(newLocalState);
  };
  return (
    <>
      <Helmet>
        <title>Thêm mới diến biến lương 1</title>
        <meta name="description" content="Description of AddSalary " />
      </Helmet>
      <Typography variant="h5" color="primary" style={{ marginLeft: 40, marginTop: 50 }}>
        <Info />
        Thông tin diễn biến lương
      </Typography>
      <div>
        <Grid container style={{ marginLeft: 20 }}>
          <TextField
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            label="Số quyết định"
            style={{ width: '32%' }}
            value={localState.decisionNumber}
            name="decisionNumber"
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            type="date"
            style={{ marginLeft: 10, width: '32%' }}
            label="Ngày hưởng"
            name="enjoymentDate"
            value={localState.enjoymentDate}
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            type="date"
            style={{ marginLeft: 10, width: '32%' }}
            label="Ngày quyết định"
            value={localState.decisionDate}
            name="decisionDate"
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            label="Nơi làm việc"
            style={{ width: '32%' }}
            value={localState.workPlace}
            name="workPlace"
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            type="date"
            style={{ marginLeft: 10, width: '32%' }}
            label="Phương pháp"
            value={localState.procedure}
            name="procedure"
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            style={{ marginLeft: 10, width: '32%' }}
            label="Chức vụ"
            value={localState.position}
            name="position"
            onChange={handleInputChange}
          />
          <TextField
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            label="Lý do"
            style={{ width: '32%' }}
            value={localState.reason}
            name="reason"
            onChange={handleInputChange}
          />

          <Department onChange={handeChangeDepartment} department={localState.organizationUnit} disableEmployee profile={profile} moduleCode="hrm" />

          <TextField
            name="note"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            style={{ width: '32%' }}
            label="Ghi chú"
            value={localState.note}
            onChange={handleInputChange}
          />
        </Grid>
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 20 }}>
          <Button
            variant="outlined"
            color="primary"
            style={{ marginRight: 20 }}
            type="submit"
            onClick={e => {
              onSave(localState);
            }}
          >
            Lưu
          </Button>
          <Button variant="outlined" color="secondary" style={{ marginRight: 30 }} onClick={e => onClose()}>
            HỦY
          </Button>
        </div>
      </div>
    </>
  );
}

AddSalary.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

export default memo(AddSalary);
