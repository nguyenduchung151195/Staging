/**
 *
 * EditProfilePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { compose } from 'redux';
import { TextField, Paper, FormControl, FormHelperText, Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import { Breadcrumbs } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CameraAlt from '@material-ui/icons/CameraAlt';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withSnackbar } from 'notistack';
import makeSelectEditProfilePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { convertDatetimeToDate } from '../../utils/common';
import { updateProAct, getProAct, resetNoti, changeMyPassAct, repairViewConfigAct } from './actions';
import { fetchData } from '../../helper';
/* eslint-disable react/prefer-stateless-function */
export class EditProfilePage extends React.Component {
  state = {
    name: '',
    gender: 'male',
    email: '',
    phoneNumber: '',
    avatar: '',
    avatarURL: '',
    dob: new Date(),
    address: '',
    identityCardNumber: '',
    positions: '',
    // organizationUnit: '',
    note: '',
    // roles: '',
    errorName: false,
    errorCode: false,
    errorEmail: false,
    openDialog: false,
    lastPassword: '',
    newPassword: '',
    reNewPassword: '',
    lastPasswordError: {
      error: false,
      content: '',
    },
    newPasswordError: {
      error: false,
      content: '',
    },
    dialogRepair: false,
    requiredPass :  false
  };

  componentWillMount() {
    this.props.onGetPro();
    if (this.props.location && this.props.location.check === true) {
      this.setState({
        openDialog: true,
        requiredPass : true
      });
    }
  }

  componentWillReceiveProps(props) {
    const { editProfilePage } = props;
    if (editProfilePage.proPage) {
      this.state.name = editProfilePage.proPage.name;
      this.state.avatar = editProfilePage.proPage.avatar;
      this.state.address = editProfilePage.proPage.address;
      this.state.note = editProfilePage.proPage.note;
      this.state.code = editProfilePage.proPage.code;
      this.state.email = editProfilePage.proPage.email;
      this.state.positions = editProfilePage.proPage.positions;
      this.state.gender = editProfilePage.proPage.gender;
      this.state.phoneNumber = editProfilePage.proPage.phoneNumber;
      // this.state.dob = editProfilePage.proPage.dob;
      this.state.dob = convertDatetimeToDate(editProfilePage.proPage.dob);
      this.state.identityCardNumber = editProfilePage.proPage.identityCardNumber;
    }
  }
  render() {
    const { classes } = this.props;

    const { avatar,requiredPass } = this.state;
    const { state, check } = this.props.location;
    let edit = false;
    state !== undefined ? (edit = state.edit) : (edit = false);
    return (
      <div className={classes.root}>
        <Helmet>
          <title>Thông tin cá nhân</title>
          <meta name="description" content="Description of EditProfilePage" />
        </Helmet>
        <Dialog
          open={this.state.openDialog}
          onClose={requiredPass == true ? null : this.onOpenDialogChangePass}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Đổi mật khẩu</DialogTitle>
          <DialogContent style={{ width: '500px' }}>
            <TextField
              margin="normal"
              label="Mật khẩu cũ"
              variant="outlined"
              name="lastPassword"
              style={{ width: '100%' }}
              value={this.state.lastPassword}
              onChange={this.handleChangeInput}
              InputLabelProps={{
                shrink: true,
              }}
              type="password"
            />
            <FormHelperText style={this.state.lastPasswordError.error ? { color: 'red', width: '100%' } : { color: 'red', display: 'none' }}>
              {this.state.lastPasswordError.content}
            </FormHelperText>
            <TextField
              label="Mật khẩu mới"
              variant="outlined"
              name="newPassword"
              style={{ width: '100%' }}
              value={this.state.newPassword}
              onChange={this.handleChangeInput}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              type="password"
            />
            <FormHelperText style={this.state.newPasswordError.error ? { color: 'red', width: '100%' } : { color: 'red', display: 'none' }}>
              {this.state.newPasswordError.content}
            </FormHelperText>
            <TextField
              id="reNewPassword"
              variant="outlined"
              label="Nhập lại mật khẩu "
              onChange={this.handleChangeInput}
              style={{ width: '100%' }}
              value={this.state.reNewPassword}
              name="reNewPassword"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              type="password"
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleChangePassword} variant="outlined">
              LƯU
            </Button>
            {requiredPass === true ? null : (
              <Button onClick={this.onOpenDialogChangePass} color="secondary" variant="outlined" autoFocus>
                HỦY
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.dialogRepair}
          onClose={this.onOpenDialogRepair}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Khôi phục cấu hình</DialogTitle>
          <DialogContent style={{ width: '500px' }}>
            <Typography>Bạn có chắc chắn muốn khôi phục cấu hình? </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleRepairViewconfig} variant="outlined">
              LƯU
            </Button>
            <Button variant="outlined" onClick={this.props.onOpenDialogRepair} color="secondary" autoFocus>
              hủy
            </Button>
          </DialogActions>
        </Dialog>
        <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Admin
            </Link>
            <Typography color="textPrimary">{edit === true ? 'Cập nhật thông tin' : 'Thông tin cá nhân'}</Typography>
          </Breadcrumbs>
        </Paper>
        <Grid container>
          <Grid item md={8}>
            <Paper>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Thông tin cơ bản nhân viên</Typography>
                {edit === true ? (
                  <>
                    <Typography className={classes.secondaryHeading}>Các trường có dấu * là bắt buộc</Typography>
                  </>
                ) : null}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container>
                  <Grid justify="flex-start" container item md={6}>
                    <FormControl className={classes.textField1} error>
                      <TextField
                        id="code"
                        disabled
                        variant="outlined"
                        label="Mã nhân sự (*) : "
                        onChange={this.handleChangeInput}
                        type="text"
                        className={classes.textField}
                        value={this.state.code}
                        name="code"
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      {this.state.errorCode ? (
                        <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                          Mã nhân viên không được để trống
                        </FormHelperText>
                      ) : (
                        ''
                      )}
                    </FormControl>
                    <TextField
                      variant="outlined"
                      id="standard-select-currency"
                      select
                      label="Giới tính"
                      name="gender"
                      className={classes.textField}
                      value={this.state.gender}
                      onChange={this.handleChangeInput}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      // helperText="Please select your currency"
                      margin="normal"
                      disabled={!edit}
                    >
                      <MenuItem key="0" value="male">
                        Nam
                      </MenuItem>
                      <MenuItem key="1" value="female">
                        Nữ
                      </MenuItem>
                    </TextField>
                    <FormControl className={classes.textField1} style={{ padding: 0 }} error>
                      <TextField
                        variant="outlined"
                        id="email"
                        label="Email : "
                        // inputRef={input => (this.email = input)}
                        type="text"
                        name="email"
                        className={classes.textField}
                        onChange={this.handleChangeInput}
                        value={this.state.email}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        disabled={!edit}
                      />

                      {this.state.errorEmail ? (
                        <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                          Email không hợp lệ
                        </FormHelperText>
                      ) : (
                        ''
                      )}
                    </FormControl>
                    <TextField
                      variant="outlined"
                      id="phoneNumber"
                      label="Số điện thoại: "
                      value={this.state.phoneNumber}
                      name="phoneNumber"
                      onChange={this.handleChangeInput}
                      type="number"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      disabled={!edit}
                    />
                    <TextField
                      variant="outlined"
                      id="standard-select-currency"
                      disabled
                      // select
                      name="positions"
                      label="Cấp bậc:"
                      onChange={this.handleChangeInput}
                      className={classes.textField}
                      value={this.state.positions}
                      // SelectProps={{
                      //   MenuProps: {
                      //     className: classes.menu,
                      //   },
                      // }}
                      // helperText="Please select your currency"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    />
                  </Grid>
                  <Grid container justify="flex-end" item md={6}>
                    <FormControl className={classes.textField} style={{ padding: 0 }} error>
                      <TextField
                        variant="outlined"
                        id="name"
                        label="Họ và tên (*): "
                        value={this.state.name}
                        name="name"
                        onChange={this.handleChangeInput}
                        type="text"
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        style={{ width: '100%' }}
                        disabled={!edit}
                      />
                      {this.state.errorName ? (
                        <FormHelperText id="component-error-text1" style={{ marginTop: -5 }}>
                          Họ và tên không được để trống
                        </FormHelperText>
                      ) : (
                        ''
                      )}
                    </FormControl>
                    <TextField
                      variant="outlined"
                      id="dob"
                      label="Ngày sinh: "
                      name="dob"
                      value={this.state.dob}
                      onChange={this.handleChangeInput}
                      type="date"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      disabled={!edit}
                    />
                    <TextField
                      variant="outlined"
                      id="cmtnd"
                      label="Số CMND/CCCD : "
                      name="identityCardNumber"
                      // value={this.state.age}
                      onChange={this.handleChangeInput}
                      type="number"
                      className={classes.textField}
                      value={this.state.identityCardNumber}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      disabled={!edit}
                    />
                    <TextField
                      variant="outlined"
                      id="address"
                      label="Địa chỉ liên hệ: "
                      value={this.state.address}
                      name="address"
                      onChange={this.handleChangeInput}
                      type="text"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      disabled={!edit}
                    />

                    <TextField
                      variant="outlined"
                      id="note"
                      label="Ghi chú: "
                      value={this.state.note}
                      onChange={this.handleChangeInput}
                      name="note"
                      type="text"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      disabled={!edit}
                    />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </Paper>
            {edit === true ? (
              <>
                <Button variant="outlined" color="primary" style={{ marginTop: 20 }} onClick={this.onSubmit}>
                  Lưu
                </Button>
                <Button variant="outlined" color="primary" style={{ marginTop: 20, marginLeft: 20 }} onClick={this.onOpenDialogChangePass}>
                  Đổi mật khẩu
                </Button>
                <Button variant="outlined" color="primary" style={{ marginTop: 20, marginLeft: 20 }} onClick={this.onOpenDialogRepair}>
                  Khôi phục cấu hình
                </Button>

                <Button variant="outlined" color="secondary" onClick={this.goBack} style={{ marginTop: 20, marginLeft: 20 }}>
                  Hủy
                </Button>
              </>
            ) : null}
          </Grid>
          <Grid style={{ height: 200 }} item md={4} container justify="center">
            <Avatar style={{ width: 300, height: 300 }} src={avatar} className={classes.avatar} srcSet={this.state.avatarURL} />
            <input
              className={classes.textFieldAva}
              onChange={this.onSelectImg}
              accept="image/*"
              name="avatar"
              type="file"
              style={{ cursor: 'pointer', opacity: 0, width: '300px', position: 'absolute', zIndex: '999', margin: '0px' }}
              disabled={!edit}
            />
            <span className={classes.spanAva}>
              <CameraAlt className={classes.iconCam} />
            </span>
            <Grid container justify="center">
              <span>Ảnh đại diện</span>
            </Grid>
            {edit === true ? (
              <>
                <Grid container justify="center">
                  <span>(Nhấp vào ảnh để thay đổi ảnh đại diện)</span>
                </Grid>
              </>
            ) : null}
          </Grid>
        </Grid>
      </div>
    );
  }

  goBack = () => {
    this.state.user = null;
    localStorage.removeItem('user');
    this.props.history.goBack();
  };

  onOpenDialogChangePass = () => {
    const { openDialog } = this.state;
    this.setState({ openDialog: !openDialog });
  };

  onOpenDialogRepair = () => {
    const { dialogRepair } = this.state;
    this.setState({ dialogRepair: !dialogRepair });
  };

  handleRepairViewconfig = () => {
    this.props.onRepairViewConfig();
    this.onOpenDialogRepair();
  };

  // eslint-disable-next-line consistent-return
  handleChangePassword = () => {
    const { lastPassword, newPassword, reNewPassword } = this.state;
    if (lastPassword.length < 8) {
      return this.setState({
        lastPasswordError: {
          error: true,
          content: 'Mật khẩu tối thiểu 8 kí tự',
        },
      });
    }
    if (newPassword.length < 8) {
      return this.setState({
        newPasswordError: {
          error: true,
          content: 'Mật khẩu mới tối thiểu 8 kí tự',
        },
      });
    }
    if (newPassword !== reNewPassword) {
      return this.setState({
        newPasswordError: {
          error: true,
          content: 'Mật khẩu mới và nhập lại mật khẩu mới không trùng nhau',
        },
      });
    }
    this.props.onChangeMyPass({
      password: newPassword,
      lastPassword,
    });
    this.setState({ openDialog: false ,requiredPass : false});
  };

  onSubmit = () => {
    const { avatar, code, name, gender, email, phoneNumber, positions, dob, avatarURL, identityCardNumber, address, note } = this.state;
    if (code === '' || name === '') {
      if (code === '') {
        this.setState({ errorCode: true });
      }
      if (name === '') {
        this.setState({ errorName: true });
      }
    } else {
      const body = {
        avatar,
        code,
        name,
        gender,
        email,
        avatarURL,
        phoneNumber,
        positions,
        dob,
        identityCardNumber,
        address,
        note,
      };
      this.props.onUpdate(body);
    }
  };

  onSelectImg = e => {
    const urlAvt = URL.createObjectURL(e.target.files[0]);
    this.setState({ avatarURL: urlAvt, avatar: e.target.files[0] });
  };

  handleChangeInput = e => {
    // console.log(this.code.value);
    if (e.target.name === 'name' || e.target.name === 'code') {
      if (e.target.name === 'name') {
        this.state.errorName = false;
      }
      if (e.target.name === 'code') {
        this.state.errorCode = false;
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };
}

EditProfilePage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  editProfilePage: makeSelectEditProfilePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onUpdate: body => {
      dispatch(updateProAct(body));
    },
    onGetPro: () => {
      dispatch(getProAct());
    },
    onReset: () => {
      dispatch(resetNoti());
    },
    onChangeMyPass: body => {
      dispatch(changeMyPassAct(body));
    },
    onRepairViewConfig: () => {
      dispatch(repairViewConfigAct());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'editProfilePage', reducer });
const withSaga = injectSaga({ key: 'editProfilePage', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(EditProfilePage);
