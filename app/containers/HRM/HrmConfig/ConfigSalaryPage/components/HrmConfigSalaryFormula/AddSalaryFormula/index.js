import React, { memo } from 'react';
import { DialogActions, DialogContent, DialogTitle, Fab, Grid, Button, Dialog } from '@material-ui/core';
import CustomInputBase from 'components/Input/CustomInputBase';

function AddSalaryFormula(props) {
  const { openDialog, handleCloseDialog, data, handleChange, onSave, error } = props;

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle id="alert-dialog-title">{data && data._id ? 'Cập nhật công thức tính' : 'Thêm mới công thức tính'}</DialogTitle>
      <DialogContent style={{ width: 600 }}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <CustomInputBase
              label="Tên công thức"
              value={data.name}
              onChange={handleChange}
              name="name"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomInputBase
              label="Mã"
              value={data.code}
              onChange={handleChange}
              name="code"
              error={error.code}
              helperText={error.code}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onSave}
          variant="outlined"
          color="primary"
        >
          {data && data._id ? 'LƯU' : 'LƯU'}
        </Button>
        <Button
          onClick={handleCloseDialog}
          variant="outlined"
          color="secondary"
          autoFocus
        >
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default memo(AddSalaryFormula);