import React, { useState, useEffect } from 'react';
import { Grid, Typography, AppBar, Toolbar, IconButton, Button } from '@material-ui/core';
import { Edit, GpsFixed, Person, ExpandMore, Close } from '@material-ui/icons';

import CustomInputBase from 'components/Input/CustomInputBase';
import CustomButton from 'components/Button/CustomButton';

function EditEmployees(props) {
  const { employees, onClose } = props;
  const [employeesState, setEmployeesState] = useState({});

  useEffect(
    () => {
      if (employees) {
        setEmployeesState({ ...employees });
      } else {
        setEmployeesState({});
      }
    },
    [employees],
  );

  const handleInputChange = e => {
    setEmployeesState({
      ...employeesState,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmployeesUpdate = e => {
    console.log(employeesState);
  };
  console.log("ggggg", props)
  return (
    <React.Fragment>
      <Grid container spacing={24} style={{marginTop: 70}}>
      <AppBar className={props.timekeeping === null ? "HearderappBarEditEmploye" : ""}>
              <Toolbar>
                <IconButton
                  // className={id !== 'add' ? '' : ''}
                  className={props.timekeeping ===  null  ? "BTNEditEmploye" : ""}
                  color="inherit"
                  variant="contained"
                  onClick={e => onClose()}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                  {props.timekeeping === null ? `Thêm mới` : `cập nhật`}
                </Typography>
                {/* {showButtonEx()} */}

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleEmployeesUpdate}
                >
                  LƯU
                </Button>
              </Toolbar>
            </AppBar>
        <Grid item xl={12} xs={12}>
          <Typography variant="h5" color="primary">
            CẬP NHẬT MÁY CHẤM CÔNG
          </Typography>
        </Grid>
        <Grid item xl={6} xs={6}>
          <CustomInputBase name="equipmentId.name" label="Họ tên nhân viên" value={employeesState['equipmentId.name']} onChange={handleInputChange} />
        </Grid>

        <Grid item xl={6} xs={6}>
          <CustomInputBase name="equipmentId.code" label="Mã nhân viên" value={employeesState['equipmentId.code']} onChange={handleInputChange} />
        </Grid>

        <Grid item xl={12} xs={12}>
          {/* <Grid container spacing={8} justify="flex-end">
            <Grid item>
              <CustomButton variant="outlined" color="primary" onClick={handleEmployeesUpdate}>
                Cập nhật
              </CustomButton>
            </Grid>
            <Grid item>
              <CustomButton variant="outlined" color="secondary" onClick={e => onClose()}>
                Hủy
              </CustomButton>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default EditEmployees;
