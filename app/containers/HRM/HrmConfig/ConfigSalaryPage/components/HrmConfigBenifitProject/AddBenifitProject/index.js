import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem } from '@material-ui/core';
import React, { memo } from 'react';
import CustomInputBase from 'components/Input/CustomInputBase';

function AddBenifitProject(props) {
  const { data, openDialog, handleCloseDialog, onSave, handleChange } = props;
  return (
    <Dialog fullWidth open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle>{data && data._id ? 'Cập nhật thưởng dự án' : 'Thêm thưởng dự án'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={16}>
          <Grid item xs={6}>
            <CustomInputBase type="text" label="Tên thưởng dự án" name="name" value={data.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <CustomInputBase type="text" label="Hệ số" name="coefficient" value={data.coefficient} onChange={handleChange} />
          </Grid>
          {/* <Grid item xs={6}>
            <CustomInputBase select label="Loại dự án" value={data.coefficient} onChange={handleChange} >
              <MenuItem value={1}>Dự án cấp 1</MenuItem>
              <MenuItem value={2}>Dự án cấp 2</MenuItem>
              <MenuItem value={3}>Dự án cấp 3</MenuItem>
              <MenuItem value={4}>Dự án cấp 4</MenuItem>
            </CustomInputBase>
          </Grid> */}
          <Grid item xs={6}>
            <CustomInputBase type="number" label="Giá trị" name="value" value={data.value} onChange={handleChange} />
          </Grid>
          {/* <Grid item xs={6}>
            <CustomInputBase type="text" label="Chi phí nhân công" value={data.coefficient} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <CustomInputBase type="text" label="Lãi bình quân" value={data.coefficient} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <CustomInputBase type="text" label="Lợi nhuận" value={data.coefficient} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <CustomInputBase type="text" label="Tỷ lệ thưởng" value={data.coefficient} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <CustomInputBase type="text" label="Quỹ thưởng" value={data.coefficient} onChange={handleChange} />
          </Grid> */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSave} color="primary" color="primary" variant="outlined">
          Lưu
            </Button>
        <Button onClick={handleCloseDialog} variant="outlined" color="secondary">
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(AddBenifitProject);
