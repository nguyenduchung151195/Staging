/* eslint-disable react/no-unused-state */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/**
 *
 * EditAssetInfo
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  Grid,
  withStyles,
  FormHelperText,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  FormControl,
  Typography,
  Fab,
  Checkbox,
  Button,
  Paper,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { CameraAlt, Delete } from '@material-ui/icons';
import { TextField } from 'components/LifetekUi';
import AvatarImg from 'images/product.png';

import { getLabelName } from 'utils/common';
import TextFieldCode from 'components/TextFieldCode';
import styles from './styles';
import { DatePicker } from 'material-ui-pickers';
import { MODULE_CODE } from '../../../../../../utils/constants';
import NumberFormat from 'react-number-format';
import CustomInputBase from '../../../../../../components/Input/CustomInputBase';

// import CustomInputBase from '../../../../components/Input/CustomInputBase';
/* eslint-disable react/prefer-stateless-function */

const listStatus = [
  {
    code: 0,
    name: 'Đang hoạt động',
  },
  {
    code: 1,
    name: 'Bảo hành',
  },
  {
    code: 2,
    name: 'Bảo trì',
  },
  {
    code: 3,
    name: 'Hỏng',
  },
  {
    code: 4,
    name: 'Mất',
  },
  {
    code: 5,
    name: 'Thanh lý',
  },
];

function KanbanStep(props) {
  const { listStatus, currentStatus, onChange } = props;

  return (
    <Stepper style={{ background: 'transparent' }} activeStep={currentStatus}>
      {listStatus.map((item, i) => (
        <Step key={i} onClick={() => onChange(item.code)}>
          <StepLabel style={{ cursor: 'pointer' }}>{item.name}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

class EditAssetInfo extends React.Component {
  state = {
    level: 0,
    assetStatus: 0,
    state: 1,
    code: '',
    image: '',
    name: '',
    unit: '',
    type: '',
    warrantyPeriod: '',
    warrantyPeriodUnit: '',
    errorWarrantyPeriodUnit: '',
    dateAcceptance: null,
    location: '',
    supplierId: '',
    note: '',
    depreciationCalculatedValue: '',
    depreciationCalculatedUnit: '',
    assetSerial: [],
    // image: null,
    errorName: false,
    errorMeterNumber: false,
    errorCode: false,
    errorDepreciationCalculatedUnit: false,
    errorSupplier: false,
    errorUnit: false,
    errorType: false,
    avatar: null,
    isSubmit: false,
    showSeries: false,
    expiry: '',
    expiryUnit: '',
    errorExpiryUnit: false,
    coefficient: '',
    meterNumber: '',

  };

  componentDidMount() {
    this.props.onRef(this);
    this.state.isSubmit = false;

    const { code, name, type, supplierId, meterNumber } = this.state;
    const rex = /^[A-Za-z0-9]+$/;
    if (
      name.trim() === '' ||
      name.trim().length > 200 ||
      code.length < 5 ||
      !rex.test(code) ||
      supplierId === '' ||
      type === '' ||
      type === undefined
      // expiryUnit === ''
    ) {
      if (name.trim() === '' || name.trim().length > 200) {
        this.setState({ errorName: true });
      }

      if (isNaN(meterNumber) === true) {
        this.setState({ errorMeterNumber: true });
      }

      if (code === '' || code.length < 5) {
        this.setState({ errorCode: true });
      }

      if (type === '') {
        this.setState({ errorType: true });
      }
      if (supplierId === '') {
        this.setState({ errorSupplier: true });
      }
      // else if(!!supplierId)  this.setState({ errorSupplier: false });
      this.props.handleChangeIndex(0);
    }
  }

  componentDidUpdate(preProps) {
    const { asset } = this.props;

    if (!this.state.isSubmit && preProps.asset !== asset && asset) {
      this.setState({
        image: asset.image || '',
        name: asset.name || '',
        code: asset.code || '',
        type: asset.type && asset.type._id || '',
        assetStatus: asset.assetStatus == null ? 0 : asset.assetStatus,
        location: asset.location || '',
        depreciationCalculatedValue: asset.depreciationCalculatedValue || '',
        warrantyPeriod: asset.warrantyPeriod || '',
        warrantyPeriodUnit: asset.warrantyPeriodUnit || '',
        dateAcceptance: asset.dateAcceptance || '',
        assetSerial: asset.assetSerial || [],
        supplierId: asset.supplierId ? asset.supplierId._id : '',
        unit: asset.unit ? asset.unit._id : '',
        depreciationCalculatedUnit: asset.depreciationCalculatedUnit || '',
        note: asset.note || '',
        expiry: asset.expiry || '',
        expiryUnit: asset.expiryUnit || '',
        coefficient: asset.coefficient || '',
        meterNumber: asset.meterNumber || '',
      });
      // this.state.isSubmit = true;

      if (asset.name.trim() !== '') {
        this.setState({ errorName: false })
      }
      if (asset.code.length > 4) {
        this.setState({ errorCode: false })
      }
      if (asset.type !== '') {
        this.setState({ errorType: false })
      }
      if (asset.supplierId && asset.supplierId.name_en === 'nha cung cap' || asset.supplierId && asset.supplierId.name_en === 'nha cung cap2') {
        this.setState({ errorSupplier: true });
      } else {
        this.setState({ errorSupplier: false })
      }

    }
  }

  handleChangeStatus = status => {
    this.setState({ assetStatus: status });
  };

  handleChangeSerial = (index, name, value) => {

    const { assetSerial } = this.state;
    assetSerial[index][name] = value;
    this.setState({ assetSerial });
  };

  handleDeleteSerial = index => {
    const { assetSerial } = this.state;
    assetSerial.splice(index, 1);
    this.setState({ assetSerial });
  };

  handleAddSerial = () => {
    const { assetSerial } = this.state;
    assetSerial.push({
      serial: '',
      price: '',
      date: null,
    });
    this.setState({ assetSerial });
  };

  handleChangeCheckbox = event => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  handleChangeInput = e => {
    const { name, value } = e.target;
    if (name === 'name') {
      if (value.trim().length < 200 && value.trim() !== '') {
        this.setState({ errorName: false });
      } else {
        this.setState({ errorName: true })
      }
    }
    if (name === 'meterNumber' && isNaN(value) === false) {
      this.setState({ errorMeterNumber: false });
    }
    if (name === 'code') {
      if (value.trim().length > 4) {
        this.setState({ errorCode: false });
      } else {
        this.setState({ errorCode: true })
      }
    }
    if (name === 'calculateUnit') {
      this.setState({ errorValue: false });
    }
    if (name === 'supplierId') {
      this.setState({ errorSupplier: false });
    }

    if (name === 'warrantyPeriodUnit') {
      this.setState({ errorWarrantyPeriodUnit: false });
    }

    if (name === 'unit') {
      this.setState({ errorUnit: false });
    }

    if (name === 'depreciationCalculatedUnit') {
      this.setState({ errorDepreciationCalculatedUnit: false });
    }
    if (name === 'expiryUnit') {
      this.setState({ errorExpiryUnit: false });
    }
    if (name === 'type') {
      this.setState({ errorType: false });
    }
    this.setState({ [name]: value });
  };

  handleDateChange = (name, value) => {
    this.setState({ [name]: value });
  };

  onHoverIn = () => {
    this.setState({ showAva: true });
  };

  onHoverOut = () => {
    this.setState({ showAva: false });
  };

  // eslint-disable-next-line consistent-return
  onSelectImg = e => {
    const types = ['image/png', 'image/jpeg', 'image/gif'];
    const file = e.target.files[0];
    // k có file
    if (!file) return false;

    let checkFile = true;
    let txt = '';
    // check image type
    if (types.every(type => file.type !== type)) {
      checkFile = false;
      txt = 'File bạn vừa chọn không đúng định dạng';
      // check image size > 3mb
    } else if (file.size / 1024 / 1024 > 3) {
      checkFile = false;
      txt = 'Dung lượng file tối đa là 3MB';
    }

    // confirm logo
    if (!checkFile) {
      this.props.enqueueSnackbar(txt, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
    } else {
      const urlAvt = URL.createObjectURL(e.target.files[0]);
      // eslint-disable-next-line react/no-unused-state
      this.setState({ image: urlAvt, avatar: e.target.files[0] }); // ,
    }
  };

  // DIDMOUNT
  // HANDLECHANGE
  getData = () => {
    const {
      avatar,
      level,
      assetStatus,
      state,
      code,
      image,
      name,
      type,
      unit,
      warrantyPeriod,
      warrantyPeriodUnit,
      dateAcceptance,
      location,
      supplierId,
      note,
      depreciationCalculatedValue,
      depreciationCalculatedUnit,
      assetSerial,
      expiry,
      expiryUnit,
      meterNumber,
      coefficient,
    } = this.state;

    const rex = /^[A-Za-z0-9]+$/;
    if (
      name.trim() === '' ||
      name.trim().length > 200 ||
      code.length < 5 ||
      !rex.test(code) ||
      supplierId === '' ||
      type === '' ||
      type === undefined
      // expiryUnit === ''
    ) {
      if (name.trim() === '' || name.trim().length > 200) {
        this.setState({ errorName: true });
      }

      if (isNaN(meterNumber) === true) {
        this.setState({ errorMeterNumber: true });
      }

      if (code === '' || code.length < 5) {
        this.setState({ errorCode: true });
      }

      if (type === '') {
        this.setState({ errorType: true });
      }
      if (supplierId === '') {
        this.setState({ errorSupplier: true });
      } else if (!!supplierId) this.setState({ errorSupplier: false });
      // if (warrantyPeriodUnit === '') {
      //   this.setState({ errorWarrantyPeriodUnit: true });
      // }
      // if (expiryUnit === '') {
      //   this.setState({ errorExpiryUnit: true });
      // }
      this.props.handleChangeIndex(0);
    } else {

      this.setState({ isSubmit: true });
      const info = {
        avatar,
        level,
        assetStatus,
        state,
        code,
        type,
        image,
        name,
        unit,
        warrantyPeriod,
        warrantyPeriodUnit,
        dateAcceptance,
        location,
        supplierId,
        note,
        depreciationCalculatedValue: parseInt(depreciationCalculatedValue),
        assetSerial,
        expiry,
        expiryUnit,
        meterNumber,
        coefficient,
      };

      if (depreciationCalculatedUnit) {
        info.depreciationCalculatedUnit = depreciationCalculatedUnit;
      }
      return info;
    }
  };
  render() {
    const { classes, suppliers, units, assetTypes } = this.props;
    const { assetStatus, image } = this.state;

    return (
      <div>
        <Grid container spacing={16} >
          <Grid md={12} item>
            <KanbanStep listStatus={listStatus} currentStatus={assetStatus} onChange={this.handleChangeStatus} />
          </Grid>
          <Grid md={2} item>
            {/* <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                borderRadius: 5,
                boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img src={image || AvatarImg} alt="Ảnh sản phẩm" className={classes.avatar} />
              <input
                accept="image/*"
                className={classes.inputAvt}
                type="file"
                onChange={this.onSelectImg}
                onMouseEnter={this.onHoverIn}
                onMouseLeave={this.onHoverOut}
                name="avatar"
              />
              <span className={classes.spanAva} style={this.state.showAva ? { opacity: 100 } : {}}>
                <CameraAlt className={classes.iconCam} />
              </span>
            </div> */}

            <div
              style={{
                // width: 200,
                // height: 200,
                display: 'flex',
                justifyContent: 'center',
                marginTop: 50,
                position: 'relative',
                borderRadius: 5,
                boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
              }}
            >
              {/* style={{ height: '10rem' }} */}
              <img src={this.state.image || AvatarImg} alt="Ảnh sản phẩm" className={classes.avatar} />
              {/* <img src={this.state.image === '' ? AvatarImg : this.state.image } alt="Ảnh sản phẩm" className={classes.avatar} /> */}
              <input
                accept="image/*"
                className={classes.inputAvt}
                type="file"
                onChange={this.onSelectImg}
                // onMouseEnter={this.onHoverIn}
                // onMouseLeave={this.onHoverOut}
                name="avatar"
              />
              <span className={classes.spanAva} style={this.state.showAva ? { opacity: 100 } : {}}>
                <CameraAlt className={classes.iconCam} style={{ marginLeft: 95 }} />
              </span>
            </div>
          </Grid>
          <Grid item xs={10}>
            <Grid container spacing={16}>
              <Grid md={6} item style={{ padding: "10px" }}>
                <TextField
                  // label={getLabelName('name', MODULE_CODE.Asset) || 'Tên tài sản'}
                  label="Tên tài sản"
                  name="name"
                  fullWidth
                  value={this.state.name}
                  onChange={this.handleChangeInput}
                  required
                  error={this.state.errorName}
                />
                {this.state.errorName && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Tên có độ dài không quá 200 kí tự và không được để trống
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={6} style={{ padding: "10px" }}>
                <TextField
                  // label={getLabelName('code', MODULE_CODE.Asset) || 'Mã tài sản'}
                  label="Mã tài sản"
                  name="code"
                  fullWidth
                  variant="outlined"
                  value={this.state.code}
                  onChange={this.handleChangeInput}
                  margin="dense"
                  required
                  error={this.state.errorCode}
                />
                {this.state.errorCode && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Mã có độ dài không dưới 5 kí tự và không được để trống
                  </FormHelperText>
                )}
              </Grid>
              <Grid md={6} item style={{ padding: "10px" }}>
                <Grid container spacing={8}>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      // label={getLabelName('warrantyPeriod', MODULE_CODE.Asset) || 'Thời gian bảo hành'}
                      label="Thời gian bảo hành"
                      value={this.state.warrantyPeriod}
                      onChange={this.handleChangeInput}
                      name="warrantyPeriod"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      select
                      fullWidth
                      // label={getLabelName('warrantyPeriodUnit', MODULE_CODE.Asset) ||'Đơn vị'}
                      label="Đơn vị bảo hành"
                      name="warrantyPeriodUnit"
                      value={this.state.warrantyPeriodUnit}
                      onChange={this.handleChangeInput}
                      // required
                      error={this.state.errorWarrantyPeriodUnit}
                    >
                      {units &&
                        units.map((item, index) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    {this.state.errorWarrantyPeriodUnit && (
                      <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                        Phải chọn đơn vị tính
                      </FormHelperText>
                    )}
                    <Link
                      // to="/Stock/StockConfig"
                      to={{
                        pathname: `/Stock/StockConfig`,
                        state: {
                          index: 4,
                        },
                      }}
                      style={{ display: 'block', textAlign: 'right' }}
                    >
                      Quản lý đơn vị tính
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} style={{ padding: "10px" }}>
                <TextField
                  select
                  fullWidth
                  // label={getLabelName('type', MODULE_CODE.Asset) || 'Loại tài sản'}
                  label="Loại tài sản"
                  name="type"
                  value={this.state.type}
                  onChange={this.handleChangeInput}
                  required
                  error={this.state.errorType}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {assetTypes &&
                    assetTypes.map((item, index) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </TextField>
                {this.state.errorType && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Phải chọn Loại tài sản
                  </FormHelperText>
                )}
                <Link
                  // to="/Stock/StockConfig"
                  to={{
                    pathname: '/Stock/StockConfig',
                    state: {
                      index: 2,
                    },
                  }}
                  style={{ display: 'block', textAlign: 'right' }}
                >
                  Quản lý loại tài sản
                </Link>
              </Grid>
              <Grid item xs={6} style={{ padding: "10px" }}>
                <TextField
                  fullWidth
                  // label={getLabelName('location', MODULE_CODE.Asset) || 'Vị trí'}
                  label="Vị trí"
                  value={this.state.location}
                  onChange={this.handleChangeInput}
                  name="location"
                />
              </Grid>
              <Grid item xs={6} style={{ padding: "10px" }}>
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  value={this.state.dateAcceptance || null}
                  variant="outlined"
                  label="Thời gian nghiệm thu"
                  margin="dense"
                  fullWidth
                  onChange={date => this.handleDateChange('dateAcceptance', date)}
                />
              </Grid>
              <Grid md={6} item style={{ padding: "10px" }}>
                <TextField
                  select
                  label={getLabelName('supplierId.name', MODULE_CODE.Asset) || ''}
                  name="supplierId"
                  fullWidth
                  value={this.state.supplierId}
                  onChange={this.handleChangeInput}
                  required
                  error={this.state.errorSupplier}
                >
                  {suppliers &&
                    suppliers.map(item => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </TextField>
                {this.state.errorSupplier && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Phải chọn nhà cung cấp
                  </FormHelperText>
                )}
                <Link to="/crm/Supplier" style={{ display: 'block', textAlign: 'right' }}>
                  Quản lý nhà cung cấp
                </Link>
              </Grid>

              <Grid md={6} item style={{ padding: "10px" }}>
                <Grid container spacing={8}>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      // label={getLabelName('depreciationCalculatedValue', MODULE_CODE.Asset) || 'Giá trị tính khấu hao'}
                      label="Giá trị tính khấu hao"
                      value={this.state.depreciationCalculatedValue}
                      onChange={this.handleChangeInput}
                      name="depreciationCalculatedValue"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      select
                      fullWidth
                      label="Đơn vị tính khấu hao"
                      name="depreciationCalculatedUnit"
                      value={this.state.depreciationCalculatedUnit}
                      onChange={this.handleChangeInput}
                    >
                      {units &&
                        units.map((item, index) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6} style={{ padding: "10px" }}>
                <TextField
                  select
                  fullWidth
                  // label={getLabelName('unit', MODULE_CODE.Asset) || 'Đơn vị tính'}
                  label="Đơn vị tính"
                  name="unit"
                  value={this.state.unit}
                  onChange={this.handleChangeInput}
                  // required
                  error={this.state.errorUnit}
                >
                  {units &&
                    units.map((item, index) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </TextField>
                {this.state.errorUnit && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Phải chọn đơn vị tính
                  </FormHelperText>
                )}
                <Link
                  // to="/Stock/StockConfig"
                  to={{
                    pathname: `/Stock/StockConfig`,
                    state: {
                      index: 4,
                    },
                  }}
                  style={{ display: 'block', textAlign: 'right' }}
                >
                  Quản lý đơn vị tính
                </Link>
              </Grid>
              <Grid item xs={6} style={{ padding: "10px" }}>
                <TextField
                  // label={getLabelName('coefficient', MODULE_CODE.Asset) || 'Hệ số nhân'}
                  label="Hệ số nhân"
                  name="coefficient"
                  fullWidth
                  variant="outlined"
                  value={this.state.coefficient}
                  onChange={this.handleChangeInput}
                  margin="dense"
                />
              </Grid>
              <Grid item xs={6} style={{ padding: "10px" }}>
                <TextField
                  // label={getLabelName('meterNumber', MODULE_CODE.Asset) || 'Số công tơ'}
                  label="Số công tơ"
                  name="meterNumber"
                  fullWidth
                  variant="outlined"
                  value={this.state.meterNumber}
                  onChange={this.handleChangeInput}
                  margin="dense"
                  error={this.state.errorMeterNumber}
                />
                {this.state.errorMeterNumber && (
                  <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                    Số công tơ phải là số
                  </FormHelperText>
                )}
              </Grid>
              <Grid md={6} item style={{ padding: "10px" }}>
                <Grid container spacing={8}>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      label={getLabelName('expiry ', MODULE_CODE.Asset) || 'Hạn sử dụng'}
                      value={this.state.expiry}
                      onChange={this.handleChangeInput}
                      name="expiry"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      select
                      fullWidth
                      label="Đơn vị hạn sử dụng"
                      name="expiryUnit"
                      value={this.state.expiryUnit}
                      onChange={this.handleChangeInput}
                      // required
                      error={this.state.errorExpiryUnit}
                    >
                      {units &&
                        units.map((item, index) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                    {this.state.errorExpiryUnit && (
                      <FormHelperText id="component-error-text1" style={{ color: 'red' }}>
                        Phải chọn đơn vị tính
                      </FormHelperText>
                    )}
                    <Link
                      // to="/Stock/StockConfig"
                      to={{
                        pathname: `/Stock/StockConfig`,
                        state: {
                          index: 4,
                        },
                      }}
                      style={{ display: 'block', textAlign: 'right' }}
                    >
                      Quản lý đơn vị tính
                    </Link>
                  </Grid>
                </Grid>
              </Grid>

              <Grid md={6} item style={{ padding: "10px" }}>
                <TextField
                  // label={getLabelName('note', MODULE_CODE.Asset) || 'Mô tả'}
                  label="Ghi chú"
                  multiline
                  rows={3}
                  fullWidth
                  name="note"
                  value={this.state.note}
                  onChange={this.handleChangeInput}
                />
              </Grid>
              <Grid md={6} item style={{ padding: "5px" }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={
                        <Checkbox name="showSeries" checked={this.state.showSeries} onChange={e => this.handleChangeCheckbox(e)} color="primary" />
                      }
                      label={getLabelName('isSerial', MODULE_CODE.Asset) || 'Hiện Serial'}
                    />
                  </FormControl>
                  {this.state.showSeries && (
                    <React.Fragment>
                      <Typography component="p">Danh sách Serial</Typography>
                      {this.state.assetSerial.length > 0 &&
                        this.state.assetSerial.map((item, index) => (
                          <Grid container spacing={8} key={index} alignItems="center" justify="center">
                            <Grid item xs={5}>
                              <CustomInputBase
                                label="Số Serial"
                                onChange={e => this.handleChangeSerial(index, 'serial', e.target.value)}
                                value={item.serial}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <NumberFormat
                                label="Giá"
                                value={item.price}
                                // prefix={'$'}
                                suffix={'VNĐ'}
                                // onChange={e => this.handleChangeSerial(index, 'price', e.target.value)}
                                thousandSeparator=","
                                decimalSeparator={null}
                                onValueChange={e => this.handleChangeSerial(index, 'price', e.value)}
                                customInput={CustomInputBase}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <DatePicker
                                inputVariant="outlined"
                                format="DD/MM/YYYY"
                                value={item.date}
                                variant="outlined"
                                label="Thời gian bảo hành"
                                margin="dense"
                                fullWidth
                                customInput={CustomInputBase}
                                onChange={date => this.handleChangeSerial(index, 'date', date)}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <Fab size="small" color="secondary" onClick={() => this.handleDeleteSerial(index)}>
                                <Delete />
                              </Fab>
                            </Grid>
                          </Grid>
                        ))}
                      <Button variant="contained" style={{ marginTop: '10px' }} onClick={this.handleAddSerial}>
                        Thêm
                      </Button>
                    </React.Fragment>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

EditAssetInfo.propTypes = {
  classes: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
};

// export default withStyles(styles)(AssetInfo);
export default compose(
  withStyles(styles),
  withSnackbar,
)(EditAssetInfo);
