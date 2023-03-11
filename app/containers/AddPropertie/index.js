/**
 *
 * AddPropertie
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withSnackbar } from 'notistack';
import { injectIntl } from 'react-intl';

import {
  Typography,
  TextField,
  Paper,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  MenuItem,
  FormHelperText,
  FormControl,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import { Menu, Edit, Settings, Close } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import makeSelectAddPropertie from './selectors';
import reducer from './reducer';
import saga from './saga';
import { fetchPropertiesAct, resetNotiAct, createPropertieAct, editPropertieAct } from './actions';
import messages from './messages';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */
export class AddPropertie extends React.Component {
  state = {
    // id: 0,
    name: '',
    code: '',
    order: 0,
    description: '',
    options: [],
    optionId: 0,
    propertyConfig: {
      isType: false,
      isFilter: false,
      isSort: false,
    },
    typeOfProperty: 0,
    typeList: [
      { name: 'Kiểu chữ', type: 'text' },
      { name: 'Kiểu danh sách', type: 'list' },
      { name: 'Kiểu ngày tháng', type: 'date' },
      { name: 'Kiểu địa chỉ trên Google Maps', type: 'maps' },
      { name: 'Kiểu liên kết', type: 'link' },
      { name: 'Kiểu tệp', type: 'file' },
      { name: 'Kiểu tiền tệ', type: 'money' },
      { name: 'Kiểu đúng/sai', type: 'bool' },
      { name: 'Kiểu số', type: 'number' },
      { name: 'Kiểu lựa chọn', type: 'select' },
      { name: 'Kiểu nhiều lựa chọn', type: 'multiSelect' },
      { name: 'Kiểu excel', type: 'excel' },
    ],
    // errorType: false,
    errorName: false,
    errorCode: false,
    errorOrder: false,
    currentProp: null,
  };

  componentWillMount() {
    this.props.onGetListProperty();
  }

  componentDidUpdate() {
    const { addPropertie } = this.props;

    if (addPropertie.successCreate) {
      this.props.enqueueSnackbar('Thao tác thành công!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.history.value = 2;
      this.props.history.push('/setting/properties');
      this.props.onResetNoti();
    }
    if (addPropertie.error) {
      this.props.enqueueSnackbar('Thao tác thất bại!', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { addPropertie, match } = props;
      let info;
      if (addPropertie.propertiesList) {
        info = addPropertie.propertiesList.find(n => {
          if (n.id === match.params.id) return true;
          return false;
        });
        if (match.params.id !== '0') {
          let type;
          this.state.typeList.forEach((item, index) => {
            if (item.type === info.type) type = index;
          });
          this.setState({
            name: info.name,
            description: info.describe,
            order: info.order,
            typeOfProperty: type,
            options: info.options,
            propertyConfig: info.config,
            code: info.code,
            currentProp: info,
          });
        }
        this.props.onResetNoti();
      }
    }
  }

  render() {
    const { currentProp } = this.state;
    const { intl } = this.props;
    const id = this.props.match.params.id;
    return (
      <div>
        <CustomAppBar
          title={
            id === '0'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'thêm mới thuộc tính' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật thuộc tính' })}`
          }
          onGoBack={this.goBack}
          onSubmit={id === '0' ? this.handleCreate : this.handleEdit}
        />
        <Helmet>
          {currentProp === null ? <title>Thêm mới thuộc tính</title> : <title>Sửa thuộc tính</title>}
          <meta name="description" content="Description of AddPropertie" />
        </Helmet>
        {/* <Paper style={{ padding: 20, marginBottom: '20px' }}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting/properties">
              Thuộc tính
            </Link>
            {this.state.currentProp === null ? (
              <Typography color="textPrimary">Thêm mới thuộc tính</Typography>
            ) : (
              <Typography color="textPrimary">Sửa thuộc tính</Typography>
            )}
          </Breadcrumbs>
        </Paper> */}
        <Paper style={{ width: '100%', padding: 20 }}>
          <Grid item md={12} container spacing={24}>
            <Grid md={8} item container>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '18px',
                }}
              >
                <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Thông tin cơ bản thuộc tính{' '}
                <span
                  style={{
                    color: '#A4A4A4',
                    fontStyle: 'italic',
                    fontWeight: 500,
                  }}
                >
                  Các trường có dấu * là cần nhập
                </span>
              </Typography>
              <Grid item md={12}>
                <FormControl style={{ width: '100%', margin: '10px auto' }}>
                  <TextField
                    label="Tên thuộc tính *"
                    value={this.state.name}
                    name="name"
                    onChange={this.handleChange}
                    variant="outlined"
                    style={{ width: '100%', margin: '10px auto' }}
                  />
                  {this.state.errorName ? (
                    <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                      Không được để trống tên
                    </FormHelperText>
                  ) : (
                    ''
                  )}
                </FormControl>
                <FormControl style={{ width: '20%', margin: '10px auto' }}>
                  <TextField
                    label="Mã thuộc tính *"
                    value={this.state.code}
                    // disabled={currentProp !== null}
                    name="code"
                    onChange={this.handleChange}
                    variant="outlined"
                  />
                  {this.state.errorCode ? (
                    <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                      Không được để trống mã
                    </FormHelperText>
                  ) : (
                    ''
                  )}
                </FormControl>
                <FormControl style={{ width: '20%', margin: '10px auto', marginLeft: 50 }}>
                  <TextField
                    label="Thứ tự thuộc tính"
                    value={this.state.order}
                    name="order"
                    onChange={this.handleChange}
                    variant="outlined"
                    type="number"
                    // style={{ width: '20%', margin: '10px auto', marginLeft: 50 }}
                  />
                  {this.state.errorOrder ? (
                    <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                      Thứ tự không được nhỏ hơn 0
                    </FormHelperText>
                  ) : (
                    ''
                  )}
                </FormControl>
                {/* <FormControl style={{ width: '20%', margin: '10px auto', marginLeft: 50 }}>
                <InputLabel>Kiểu thuộc tính &nbsp;</InputLabel>
                <Select value={this.state.typeOfProperty} style={{ width: '100%' }} name="typeOfProperty" onChange={this.handleChange}>
                  <MenuItem value={0}>Kiểu chữ</MenuItem>
                  <MenuItem value={1}>Kiểu danh sách</MenuItem>
                  <MenuItem value={2}>Kiểu ngày tháng</MenuItem>
                  <MenuItem value={3}>Kiểu địa chỉ trên Google Maps</MenuItem>
                  <MenuItem value={4}>Kiểu tài nguyên</MenuItem>
                  <MenuItem value={5}>Kiểu liên kết</MenuItem>
                  <MenuItem value={6}>Kiểu tệp</MenuItem>
                  <MenuItem value={7}>Kiểu tiền tệ</MenuItem>
                  <MenuItem value={8}>Kiểu đúng/sai</MenuItem>
                  <MenuItem value={9}>Kiểu số</MenuItem>
                </Select>
              </FormControl> */}
                <FormControl style={{ width: '20%', marginLeft: 50 }}>
                  <TextField
                    id="standard-select-currency"
                    select
                    label="Kiểu thuộc tính *"
                    name="typeOfProperty"
                    variant="outlined"
                    value={this.state.typeOfProperty}
                    onChange={this.handleChange}
                    style={{ marginTop: '10px' }}
                    // helperText="Please select your currency"
                    margin="normal"
                  >
                    {this.state.typeList.map((item, index) => (
                      <MenuItem key={item.type} value={index}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  {/* {this.state.errorType ? (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Chưa chọn kiểu thuộc tính
                  </FormHelperText>
                ) : (
                  ''
                )} */}
                </FormControl>
                <TextField
                  label="Mô tả"
                  value={this.state.description}
                  name="description"
                  onChange={this.handleChange}
                  variant="outlined"
                  style={{ width: '100%', margin: '10px auto' }}
                  multiline
                  rows={4}
                />
                {/* {this.state.currentProp === null ? (
                  <Button variant="contained" color="primary" onClick={() => this.handleCreate()}>
                    Lưu
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={() => this.handleEdit()}>
                    Lưu
                  </Button>
                )} */}
                &nbsp;
                {/* <Button variant="contained" onClick={this.goBack} color="primary">
                  Quay lại
                </Button> */}
              </Grid>
            </Grid>
            <Grid md={4} item>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '18px',
                  marginTop: 50,
                }}
              >
                <Settings style={{ fontSize: '20px', marginBottom: '5px' }} /> Cấu hình thuộc tính
              </Typography>
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.propertyConfig.isType}
                    onChange={this.handleChangeCheckbox('isType')}
                    value="isType"
                    color="primary"
                  />
                }
                label="Phải nhập"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.propertyConfig.isFilter}
                    onChange={this.handleChangeCheckbox('isFilter')}
                    value="isFilter"
                    color="primary"
                  />
                }
                label="Có thể lọc"
              />
              <FormControlLabel
                style={{ display: 'flex' }}
                control={
                  <Checkbox
                    checked={this.state.propertyConfig.isSort}
                    onChange={this.handleChangeCheckbox('isSort')}
                    value="isSort"
                    color="primary"
                  />
                }
                label="Có thể sắp xếp"
              />
            </Grid>
            {this.state.typeOfProperty === 1 ||
            this.state.typeOfProperty === 7 ||
            this.state.typeOfProperty === 9 ||
            this.state.typeOfProperty === 10 ? (
              <Grid item md={12} container direction="column">
                <Typography
                  component="p"
                  style={{
                    fontWeight: 550,
                    fontSize: '18px',
                    marginTop: 50,
                    display: 'block',
                  }}
                >
                  <Menu style={{ fontSize: '20px', marginBottom: '5px' }} /> Các giá trị tùy chọn
                </Typography>
                {/* eslint-disable */}
                {this.state.options.map(option => (
                  <Grid key={option.id} style={{ display: 'block', marginTop: 10, marginBottom: 10 }}>
                    <TextField
                      label="Tên tùy chọn"
                      value={option.name}
                      name="nameOption"
                      variant="outlined"
                      onChange={event => this.handleChangeOption('nameOption', option.id, event)}
                      style={{ width: '20%', margin: '10px auto' }}
                    />
                    <TextField
                      label="Giá trị tùy chọn"
                      value={option.value}
                      name="valueOption"
                      variant="outlined"
                      onChange={event => this.handleChangeOption('valueOption', option.id, event)}
                      style={{ width: '20%', margin: '10px auto', marginLeft: 20 }}
                    />
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => this.deleteRow(option.id)}
                      style={{ width: '10%', marginTop: 20, marginLeft: 20 }}
                    >
                      Xóa
                    </Button>
                  </Grid>
                ))}
                {/* eslint-enable */}
                <Button variant="outlined" color="primary" onClick={this.addRow} style={{ width: '20%', marginTop: 20 }}>
                  Thêm tùy chọn
                </Button>
              </Grid>
            ) : (
              ''
            )}
          </Grid>
        </Paper>
      </div>
    );
  }

  goBack = () => {
    this.props.history.value = 2;
    this.props.history.push('/setting/properties');
  };

  handleCreate = () => {
    const { name, code, order, description, options, propertyConfig, typeOfProperty, typeList } = this.state;
    if (name === '' || code === '' || order < 0) {
      if (name === '') {
        this.setState({ errorName: true });
      }
      if (code === '') {
        this.setState({ errorCode: true });
      }
      if (order < 0) {
        this.setState({ errorOrder: true });
      }
    } else {
      const op = [];
      if (
        typeList[typeOfProperty].type === 'list' ||
        typeList[typeOfProperty].type === 'bool' ||
        typeList[typeOfProperty].type === 'select' ||
        typeList[typeOfProperty].type === 'multiSelect'
      ) {
        options.forEach(item => {
          if (item.name !== '') {
            op.push({
              name: item.name,
              value: item.value,
            });
          }
        });
      }
      const body = {
        type: typeList[typeOfProperty].type,
        name,
        code,
        order,
        describe: description,
        config: propertyConfig,
        options: op,
      };
      this.props.onCreatePropertie(body);
    }
  };

  handleEdit = () => {
    const { name, code, order, description, options, currentProp, propertyConfig, typeOfProperty, typeList } = this.state;
    if (name === '' || code === '' || order < 0) {
      if (name === '') {
        this.setState({ errorName: true });
      }
      if (code === '') {
        this.setState({ errorCode: true });
      }
      if (order < 0) {
        this.setState({ errorOrder: true });
      }
    } else {
      const op = [];
      if (
        typeList[typeOfProperty].type === 'list' ||
        typeList[typeOfProperty].type === 'bool' ||
        typeList[typeOfProperty].type === 'select' ||
        typeList[typeOfProperty].type === 'multiSelect'
      ) {
        options.forEach(item => {
          if (item.name !== '') {
            op.push({
              name: item.name,
              value: item.value,
            });
          }
        });
      }
      const body = {
        type: typeList[typeOfProperty].type,
        name,
        code,
        id: currentProp.id,
        order,
        describe: description,
        config: propertyConfig,
        options: op,
      };
      this.props.onEdit(body);
    }
  };

  handleChange = e => {
    if (e.target.name === 'name' || e.target.name === 'code' || e.target.name === 'order') {
      if (e.target.name === 'name') {
        this.setState({ errorName: false });
      }
      if (e.target.name === 'code') {
        this.setState({ errorCode: false });
      }
      if (e.target.name === 'order') {
        this.setState({ errorOrder: false });
      }
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeCheckbox = name => event => {
    const { propertyConfig } = this.state;
    const target = propertyConfig;
    /* eslint-enable */
    target[name] = event.target.checked;
    this.setState({ propertyConfig: target });
  };

  addRow = () => {
    const { options } = this.state;
    const option = { id: this.state.optionId, name: '', value: '' };
    const op = options;
    op.push(option);
    // if (this.state.id === 0) {
    this.setState({ options: op });
    // }
    this.state.optionId = this.state.optionId + 1;
  };

  deleteRow = id => {
    // if (this.state.id === 0) {
    const { options } = this.state;
    const op = options.findIndex(option => {
      if (option.id === id) return true;
      return false;
    });
    options.splice(op, 1);
    this.setState({ options });
    // }
  };

  handleChangeOption = (name, id, event) => {
    // console.log(event);
    // const op = { id, name: '', value: '' };
    // if (name === 'nameOption') op.name = event.target.value;
    // if (name === 'valueOption') op.value = event.target.value;
    // console.log(op);
    // if (this.state.id === 0) {
    const { options } = this.state;
    const opOld = options.findIndex(option => {
      if (option.id === id) return true;
      return false;
    });
    if (name === 'nameOption') options[opOld].name = event.target.value;
    if (name === 'valueOption') options[opOld].value = event.target.value;
    this.setState({ options });
    // }
  };
}

AddPropertie.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addPropertie: makeSelectAddPropertie(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetListProperty: () => {
      dispatch(fetchPropertiesAct());
    },
    onResetNoti: () => {
      dispatch(resetNotiAct());
    },
    onCreatePropertie: data => {
      dispatch(createPropertieAct(data));
    },
    onEdit: data => {
      dispatch(editPropertieAct(data));
    },
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addPropertie', reducer });
const withSaga = injectSaga({ key: 'addPropertie', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
)(AddPropertie);
