/**
 *
 * EditTask
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { MenuItem, Checkbox, Button, Paper, Avatar } from '@material-ui/core';
import { Edit, ModeComment } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import ListPage from 'components/List';
import { editTaskColumns } from 'variable';
import { TextField, Tabs, Tab, Grid, Typography, Autocomplete } from '../LifetekUi';
// import styled from 'styled-components';
import styles from './styles';
/* eslint-disable react/prefer-stateless-function */
class EditTask extends React.Component {
  state = {
    tabIndex: 0,
    tab: 0,
  };

  render() {
    // const taskPage = this.props.taskPage;
    const { tabIndex, tab } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Grid>
          <Typography variant="h4"> Sửa công việc</Typography>
          <div>
            <Tabs
              value={tabIndex}
              onChange={(event, value) => {
                this.setState({ tabIndex: value });
              }}
            >
              <Tab value={0} label="Cơ bản" />
              <Tab value={1} label="Tiến độ" />
              <Tab value={2} label="Tài liệu" />
              <Tab value={3} label="Chuyển công việc" />
              <Tab value={4} label="Chi tiết" />
            </Tabs>
            {tabIndex === 0 && (
              <div
                className="my-3"
                style={{
                  display: 'flex',
                }}
              >
                <Grid container>
                  <Grid item md={12} spacing={4}>
                    <TextField fullWidth required label="Tên công việc" />
                    <TextField fullWidth type="number" label="Tỷ lệ" />
                    <TextField multiline rowsMax="4" fullWidth label="Mô tả" />
                    <TextField fullWidth select label="Thông tin">
                      <MenuItem>Biểu mẫu hóa đơn</MenuItem>
                      <MenuItem>Biểu mẫu hóa </MenuItem>
                      <MenuItem>Biểu mẫu hóa đơn 2</MenuItem>
                      <MenuItem>Biểu mẫu hóa đơn 3</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item md={12}>
                    <TextField required InputLabelProps={{ shrink: true }} fullWidth type="date" label="Bắt đầu" />
                    <TextField required InputLabelProps={{ shrink: true }} fullWidth type="date" label="Kết thúc" />
                    <TextField fullWidth required label="Khách hàng" defaultValue="Công ty phần mềm Lifetek.vn" />
                    <Autocomplete name="Chọn" label="Được xem" />
                    <Autocomplete name="Chọn " label="Phụ trách" />
                    <Autocomplete name="Chọn " label="Phê duyệt tiến độ" />
                    <TextField fullWidth select label="Trạng thái">
                      <MenuItem>Đang thực hiện</MenuItem>
                      <MenuItem>Hoàn thành</MenuItem>
                      <MenuItem>Đóng dừng</MenuItem>
                      <MenuItem>Không thực thiện</MenuItem>
                    </TextField>
                    Nhắc nhở công việc
                    <Checkbox color="primary" />
                  </Grid>
                </Grid>
              </div>
            )}
            {tabIndex === 1 && (
              <div
                className="my-3"
                style={{
                  display: 'flex',
                }}
              >
                <Grid container>
                  <Grid item md={10} spacing={4} style={{ display: 'flex' }}>
                    <Autocomplete name="Chọn" />
                    <Button variant="outlined" color="primary">
                      Cập nhật
                    </Button>
                  </Grid>
                  <Grid item md={12} spacing={4} style={{ display: 'flex' }}>
                    <Typography style={{ fontWeight: 'bold' }}>Tiến độ và phê duyệt</Typography>
                  </Grid>
                  <Grid item md={12} spacing={4}>
                    <Tabs
                      value={tab}
                      onChange={(event, value) => {
                        this.setState({ tab: value });
                      }}
                    >
                      <Tab value={0} label="Tiến độ" />
                      <Tab value={1} label="Lịch sử" />
                      <Tab value={2} label="Phê duyệt" />
                    </Tabs>
                  </Grid>
                  {tab === 0 && (
                    <Grid container md={12} spacing={4}>
                      <Paper className="py-3" style={{ height: '100%' }}>
                        <ListPage
                          // disableEdit
                          disableAdd
                          deleteOption="data"
                          // settingBar={[this.addItem()]}
                          columns={editTaskColumns}
                          // disableConfig
                          // code="Currency"
                          // apiUrl={API_CURRENCY}
                          // mapFunction={this.mapFunction}
                        />
                      </Paper>
                    </Grid>
                  )}
                  {tab === 1 && (
                    <Grid item md={12} spacing={4}>
                      <Paper className="py-3" style={{ height: '100%' }}>
                        <ListPage
                          // disableEdit
                          disableAdd
                          deleteOption="data"
                          // settingBar={[this.addItem()]}
                          columns={editTaskColumns}
                          // disableConfig
                          // code="Currency"
                          // apiUrl={API_CURRENCY}
                          // mapFunction={this.mapFunction}
                        />
                      </Paper>
                    </Grid>
                  )}
                  {tab === 2 && (
                    <Grid item md={12} spacing={4}>
                      <Paper className="py-3" style={{ height: '100%' }}>
                        <ListPage
                          // disableEdit
                          disableAdd
                          deleteOption="data"
                          // settingBar={[this.addItem()]}
                          columns={editTaskColumns}
                          // disableConfig
                          // code="Currency"
                          // apiUrl={API_CURRENCY}
                          // mapFunction={this.mapFunction}
                        />
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </div>
            )}
            {tabIndex === 2 && (
              <div
                className="my-3"
                style={{
                  display: 'flex',
                }}
              >
                <Grid container md={12} spacing={4}>
                  <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>Danh sách tài liệu</Typography>
                  <Paper className="py-3" style={{ height: '100%' }}>
                    <ListPage
                      // disableEdit
                      // disableAdd
                      deleteOption="data"
                      // settingBar={[this.addItem()]}
                      columns={editTaskColumns}
                      // disableConfig
                      // code="Currency"
                      // apiUrl={API_CURRENCY}
                      // mapFunction={this.mapFunction}
                    />
                  </Paper>
                </Grid>
              </div>
            )}
            {tabIndex === 3 && (
              <div
                className="my-3"
                style={{
                  display: 'flex',
                }}
              >
                <Grid container md={12} spacing={4}>
                  <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>Chọn người thay thế</Typography>
                  <Grid container md={12} spacing={4}>
                    <Autocomplete name="Chọn " label="Người phụ trách" />
                    <Autocomplete name="Chọn " label="Người thay thế" />
                  </Grid>
                  <Grid container md={12} spacing={4}>
                    <Autocomplete name="Chọn " label="Người tham gia" />
                    <Autocomplete name="Chọn " label="Người thay thế" />
                  </Grid>
                  <Button variant="outlined" color="primary" style={{ marginLeft: '15px' }}>
                    Cập nhật
                  </Button>
                  <Grid container md={12} spacing={4}>
                    <Paper className="py-3">
                      <ListPage
                        // disableEdit
                        // disableAdd
                        deleteOption="data"
                        // settingBar={[this.addItem()]}
                        columns={editTaskColumns}
                        // disableConfig
                        // code="Currency"
                        // apiUrl={API_CURRENCY}
                        // mapFunction={this.mapFunction}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </div>
            )}
            {tabIndex === 4 && (
              <div className="my-3">
                <Grid container md={12} spacing={4}>
                  <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <Edit />
                    <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>Thông tin chi tiết</Typography>
                  </Grid>
                  <TextField required InputLabelProps={{ shrink: true }} fullWidth label="Tên công việc" />
                  <TextField required InputLabelProps={{ shrink: true }} fullWidth label="Khách hàng" />
                  <TextField required InputLabelProps={{ shrink: true }} fullWidth type="date" label="Bắt đầu" />
                  <TextField required InputLabelProps={{ shrink: true }} fullWidth type="date" label="Kết thúc" />
                  <TextField fullWidth select label="Tình trạng">
                    <MenuItem>Đang thực hiện</MenuItem>
                    <MenuItem>Hoàn thành</MenuItem>
                    <MenuItem>Đóng dừng</MenuItem>
                    <MenuItem>Không thực thiện</MenuItem>
                  </TextField>
                  <TextField required InputLabelProps={{ shrink: true }} fullWidth label="Dự án" />
                  <TextField required InputLabelProps={{ shrink: true }} fullWidth label="Tiến độ" />
                  <TextField fullWidth select label="Ưu tiên">
                    <MenuItem>Rất cao</MenuItem>
                    <MenuItem>Trung bình</MenuItem>
                    <MenuItem>Thấp</MenuItem>
                    <MenuItem>Rất thấp</MenuItem>
                  </TextField>
                  <Autocomplete name="Chọn" label="Được xem" />
                  <Autocomplete name="Chọn " label="Phụ trách" />
                  <Autocomplete name="Chọn " label="Người tham gia" />
                  <Autocomplete name="Chọn " label="Người tạo" />
                  <TextField required InputLabelProps={{ shrink: true }} fullWidth label="Mô tả" />
                  <TextField fullWidth InputLabelProps={{ shrink: true }} type="file" label="Tài liệu đính kèm" />
                  <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                    <ModeComment />
                    <Typography style={{ fontWeight: 'bold', fontSize: 16 }}>Ý kiến thảo luận</Typography>
                  </Grid>

                  <Grid container style={{ display: 'block', alignItems: 'center' }}>
                    <Avatar
                      style={{ width: '50px', height: '50px' }}
                      alt="Remy Sharp"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ115s4aNzLCYHrL41b3Sm52AbLyRDm5h7yNm3xQWeaGBFVbbL8"
                    />
                    <TextField id="outlined-multiline-flexible" multiline rows="4" margin="normal" variant="outlined" className={classes.textField} />
                    <Button variant="outlined" color="primary" style={{ marginLeft: '88%' }}>
                      Bình luận
                    </Button>
                  </Grid>
                </Grid>
              </div>
            )}
          </div>
        </Grid>
        <Button variant="outlined" color="primary" className={classes.button}>
          Lưu
        </Button>
        <Button variant="outlined" color="secondary" className={classes.button}>
          Hủy
        </Button>
      </div>
    );
  }
}

EditTask.propTypes = {};

export default withStyles(styles)(EditTask);
