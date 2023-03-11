/**
 *
 * AddSalesPolicy
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import { Checkbox, MenuItem, Button, Table, TableCell, TableBody, TableRow, TableHead, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Cancel, Add, Close } from '@material-ui/icons';
import { Grid, Paper, TextField, Autocomplete, Typography, FileUpload } from '../../components/LifetekUi';
import makeSelectAddSalesPolicy from './selectors';
import { mergeData, getSalesPolicy, getDefault, getSalesPolicyCurrent, postSalesPolicy, putSalesPolicy, handleClose } from './actions';
import reducer from './reducer';
import saga from './saga';
import { changeSnackbar } from '../Dashboard/actions';
import messages from './messages';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import './style.css';
import CustomAppBar from 'components/CustomAppBar';
import TodayIcon from '@material-ui/icons/Today';

// const nameColumns = JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'SalesPolicy').listDisplay.type.fields.type.columns;

export class AddSalesPolicy extends React.Component {
  state = {
    columns: [
      // { name: '_id', title: 'ID', checked: true },
      { name: 'order', title: 'STT', checked: true, type: 'order' },
      { name: 'quantity', title: 'Số lượng mua', checked: true, type: 'number' },
      { name: 'discountItem', title: 'Giảm giá mặt bằng cho mỗi mục', checked: true, type: 'number' },
      { name: 'discountRatioItem', title: 'Giảm giá theo tỷ lệ % trên một đơn vị', checked: true, type: 'number' },
    ],
    nameColumns: JSON.parse(localStorage.getItem('viewConfig')).find(item => item.code === 'SalesPolicy').listDisplay.type.fields.type.columns,
  };

  componentDidMount() {
    this.props.getSalesPolicy();
    const id = this.props.match.params.id;
    if (id === 'add') {
      this.props.getDefault();
    } else {
      this.props.getSalesPolicyCurrent(id);
    }
  }

  render() {
    const names = {};
    this.state.nameColumns.forEach(element => {
      names[element.name] = element.title;
    });
    const id = this.props.match.params.id;
    const { addSalesPolicy, intl } = this.props;
    const { rule, name, description, startDate, endDate, discount, codeSale, products, product, categorys, conditions } = addSalesPolicy;

    return (
      <div>
        <CustomAppBar
          title={
            id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới chính sách bán hàng' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật chính sách bán hàng' })}`
          }
          onGoBack={this.onHandleClose}
          onSubmit={this.onSave}
        />
        {/* <Helmet>
          <title>{this.state.typeContainer === 'edit' ? 'Cập nhật hợp đồng' : 'Thêm mới hợp đồng'}</title>
          <meta name="description" content="Description of AddContractPage" />
        </Helmet> */}

        <Helmet>
          <title>{intl.formatMessage(messages.tieude || { id: 'tieude', defaultMessage: 'tieude' })}</title>
          <meta name="description" content="Description of AddSalesPolicy " />
        </Helmet>
        {/* <div>
          <Paper style={{ marginBottom: 20, padding: '0px 16px' }}>
            {this.props.id ? null : (
              <Breadcrumbs aria-label="Breadcrumb">
                <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                  Dashboard
                </Link>
                <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/crm/ConfigCRM">
                  CRM
                </Link>
                <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/crm/SalesPolicy">
                  {intl.formatMessage(messages.chinhsachbanhang || { id: 'chinhsachbanhang', defaultMessage: 'chinhsachbanhang' })}
                </Link>
                <Typography color="textPrimary">
                  {id === 'add'
                    ? intl.formatMessage(messages.tieude || { id: 'tieude', defaultMessage: 'tieude' })
                    : intl.formatMessage(messages.suatieude || { id: 'suatieude', defaultMessage: 'suatieude' })}
                </Typography>
              </Breadcrumbs>
            )}
          </Paper>
        </div> */}
        <ValidatorForm onSubmit={this.onSave}>
          <AppBar className="HearderappBarAddSalePolicy">
            {/* <Toolbar>
          <IconButton
            // className={id !== 'add' ? '' : ''}
            className='BTNADDSalePolicy'
            color="inherit"
            variant="contained"
            onClick={this.onHandleClose}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật' })}`}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            type="submit"
            // onClick={this.onSave}
          >
            {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
          </Button>
        </Toolbar> */}
          </AppBar>
          <Paper>
            <Grid container>
              <Grid item xs={12} md={12} style={{ marginLeft: '50px', cursor: 'pointer' }} onClick={this.handleDrawer}>
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  select
                  required
                  label={names.rule}
                  value={rule}
                  name="rule"
                  onChange={e => this.props.mergeData({ rule: e.target.value })}
                >
                  {/* gia trị rule tu 1 den 6 */}
                  <MenuItem value={1}>
                    {intl.formatMessage(messages.giamgiadonhang || { id: 'giamgiadonhang', defaultMessage: 'giamgiadonhang' })}
                  </MenuItem>
                  <MenuItem value={2}>
                    {' '}
                    {intl.formatMessage(messages.giamgiacaocap || { id: 'giamgiacaocap', defaultMessage: 'giamgiacaocap' })}
                  </MenuItem>
                  <MenuItem value={3}>{intl.formatMessage(messages.muaXnhanY || { id: 'muaXnhanY', defaultMessage: 'muaXnhanY' })}</MenuItem>
                  <MenuItem value={4}>{intl.formatMessage(messages.muaX || { id: 'muaX', defaultMessage: 'muaX' })}</MenuItem>
                  <MenuItem value={5}> {intl.formatMessage(messages.chitieuX || { id: 'chitieuX', defaultMessage: 'chitieuX' })}</MenuItem>
                  <MenuItem value={6}>
                    {' '}
                    {intl.formatMessage(messages.hoahongchokhachhang || { id: 'hoahongchokhachhang', defaultMessage: 'hoahongchokhachhang' })}
                  </MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  label={names.name}
                  value={name}
                  name="name"
                  onChange={e => this.props.mergeData({ name: e.target.value, errorName: !Boolean(e.target.value) })}
                  error={addSalesPolicy.errorName}
                  helperText={addSalesPolicy.errorName ? 'Tên quy tắc không được để trống' : ''}
                />
                <TextField
                  rows={2}
                  fullWidth
                  multiline
                  label={names.description}
                  onChange={e => this.handleChange('description', e.target.value)}
                  value={description}
                  name="description"
                />
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    keyboard
                    keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                    invalidLabel="DD/MM/YYYY"
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                    label={names.startDate}
                    value={startDate}
                    name="startDate"
                    // onChange={e => this.handleChangeInput(e, true)}
                    //onChange={e => this.props.mergeData({ startDate: e.target.value, errorStartDate: !Boolean(e.target.value) })}
                    onChange={value => this.props.mergeData({ startDate: value, errorStartDate: !Boolean(value) })}
                    // error={addSalesPolicy.errorStartDate}
                    // helperText={addSalesPolicy.errorStartDate ? 'Ngày bắt đầu không được để trống' : ''}
                  />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    keyboard
                    keyboardIcon={<TodayIcon style={{ width: '80%' }} />}
                    invalidLabel="DD/MM/YYYY"
                    inputVariant="outlined"
                    format="DD/MM/YYYY"
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                    label={names.endDate}
                    value={endDate}
                    name="endDate"
                    onChange={e => this.handleChangeInput(e, false)}
                    onChange={value => this.props.mergeData({ endDate: value, errorEndDate: !Boolean(value) })}
                    // onChange={e => this.props.mergeData({ endDate: e.target.value, errorEndDate: !Boolean(e.target.value) })}
                    error={addSalesPolicy.errorEndDate}
                    helperText={addSalesPolicy.errorEndDate ? 'Ngày kết thúc không được để trống' : ''}
                  />
                </MuiPickersUtilsProvider>

                {names.discount}
                <Checkbox color="primary" checked={discount} onChange={e => this.handleDiscount('discount', e.target.checked)} />
                {discount === true ? (
                  <div>
                    <TextField
                      fullWidth
                      label="Mã giảm giá"
                      onChange={e => this.handleChange('codeSale', e.target.value)}
                      value={codeSale}
                      name="codeSale"
                    />
                    {/* Xuất phiếu giảm giá
                  <Checkbox color="primary" checked={couponRecipte} onChange={e => this.handleDiscount('couponRecipte', e.target.checked)} /> */}
                  </div>
                ) : null}
                {names.active}
                <Checkbox color="primary" checked={addSalesPolicy.active} onChange={e => this.handleDiscount('active', e.target.checked)} />
                {rule !== 5 ? (
                  <React.Fragment>
                    <Autocomplete
                      isMulti
                      name="Chọn... "
                      label={names.product}
                      suggestions={products.data}
                      onChange={value => this.props.mergeData({ product: value, errorProduct: !Boolean(value) })}
                      value={product}
                      error={addSalesPolicy.errorProduct}
                      helperText={addSalesPolicy.errorProduct ? 'Sản phẩm không được để trống' : ''}
                    />

                    <Autocomplete
                      isMulti
                      name="Chọn... "
                      label={names.category}
                      suggestions={categorys.data}
                      onChange={this.selectCategory}
                      value={addSalesPolicy.category}
                    />
                    <Autocomplete
                      isMulti
                      name="Chọn... "
                      label={names.label}
                      suggestions={addSalesPolicy.labels}
                      onChange={this.selectLabels}
                      value={addSalesPolicy.label}
                    />
                  </React.Fragment>
                ) : null}
                {rule === 1 ? (
                  <React.Fragment>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      select
                      required
                      label="Giảm giá"
                      value={addSalesPolicy.sale}
                      name="sale"
                      onChange={e => this.props.mergeData({ sale: e.target.value })}
                      style={{ width: '13%' }}
                    >
                      {/* gia trị sale tu 1 den 2 */}
                      <MenuItem value={1}>
                        {intl.formatMessage(messages.giamtheophantram || { id: 'giamtheophantram', defaultMessage: 'giamtheophantram' })}
                      </MenuItem>
                      <MenuItem value={2}>{intl.formatMessage(messages.giamtheoso || { id: 'giamtheoso', defaultMessage: 'giamtheoso' })}</MenuItem>
                    </TextField>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      style={{ width: '86%', marginLeft: '15px' }}
                      onChange={e => {
                        addSalesPolicy.sale === 1
                          ? this.handleChangePercentageDiscount('percentageDiscount', e.target.value)
                          : this.handleChangePriceDiscount('priceDiscount', e.target.value);
                      }}
                      value={addSalesPolicy.sale === 1 ? addSalesPolicy.percentageDiscount : addSalesPolicy.priceDiscount}
                      name={addSalesPolicy.sale === 1 ? 'percentageDiscount' : 'priceDiscount'}
                      type="number"
                    />
                    {names.unlimited}*
                    <Checkbox color="primary" checked={addSalesPolicy.unlimited} onChange={e => this.handleDiscount('unlimited', e.target.checked)} />
                    {addSalesPolicy.unlimited === false ? (
                      <TextField
                        required
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        type="number"
                        label={names.maxSale}
                        onChange={e => this.handleChange('maxSale', e.target.value)}
                        value={addSalesPolicy.maxSale}
                        name="maxSale"
                      />
                    ) : null}
                  </React.Fragment>
                ) : null}
                {rule === 2 ? (
                  <React.Fragment>
                    <Typography variant="subtitle2">
                      {intl.formatMessage(messages.giaphanchia || { id: 'giaphanchia', defaultMessage: 'giaphanchia' })}
                    </Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {this.state.columns.filter(el => el.checked === true).map(item => (
                            <TableCell>{item.title}</TableCell>
                          ))}
                          <TableCell>Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.props.addSalesPolicy.splitPrice.map((i, e) => (
                          <TableRow>
                            <TableCell>{e + 1}</TableCell>
                            <TableCell>
                              <TextField value={i.quantity} name="quantity" onChange={this.changePriceValue(e)} fullWidth />
                            </TableCell>
                            <TableCell>
                              <TextField fullWidth value={i.discountItem} type="number" name="discountItem" onChange={this.changeDiscountItem(e)} />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                value={i.discountRatioItem}
                                type="number"
                                name="discountRatioItem"
                                onChange={this.changeDiscountRatioItem(e)}
                              />
                            </TableCell>
                            <TableCell>
                              <div style={{ display: 'flex' }}>
                                <Cancel onClick={event => this.deleteRow(e)} style={{ margin: 5 }} />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <Button onClick={this.addRow} color="primary">
                        Thêm hàng
                      </Button>
                    </Table>
                  </React.Fragment>
                ) : null}
                {rule === 3 ? (
                  <React.Fragment>
                    <TextField
                      required
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      label={names.buyAmount}
                      value={addSalesPolicy.buyAmount}
                      name="buyAmount"
                      onChange={e => this.handleBuyAmount('buyAmount', e.target.value)}
                      error={addSalesPolicy.errorbuyAmount}
                      helperText={addSalesPolicy.errorbuyAmount ? 'Số lượng mua không được để trống' : ''}
                    />
                    <TextField
                      required
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      label={names.receivedAmount}
                      value={addSalesPolicy.receivedAmount}
                      name="receivedAmount"
                      onChange={e => this.handleReceivedAmount('receivedAmount', e.target.value)}
                      error={addSalesPolicy.errorreceivedAmount}
                      helperText={addSalesPolicy.errorreceivedAmount ? 'Số lượng nhận không được để trống' : ''}
                    />
                    {names.discount}*
                    <Checkbox color="primary" checked={addSalesPolicy.unlimited} onChange={e => this.handleDiscount('unlimited', e.target.checked)} />
                    {addSalesPolicy.unlimited === false ? (
                      <TextField
                        required
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        type="number"
                        label={names.maxSale}
                        onChange={e => this.handleChange('maxSale', e.target.value)}
                        value={addSalesPolicy.maxSale}
                        name="maxSale"
                      />
                    ) : null}
                  </React.Fragment>
                ) : null}
                {rule === 4 ? (
                  <React.Fragment>
                    <TextField
                      required
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      label={names.buyAmount}
                      value={addSalesPolicy.buyAmount}
                      name="buyAmount"
                      onChange={e => this.handleBuyAmount('buyAmount', e.target.value)}
                      error={addSalesPolicy.errorbuyAmount}
                      helperText={addSalesPolicy.errorbuyAmount ? 'Số lượng mua không được để trống' : ''}
                    />
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      select
                      required
                      label="Giảm giá"
                      value={addSalesPolicy.sale}
                      name="sale"
                      onChange={e => this.props.mergeData({ sale: e.target.value })}
                      style={{ width: '13%' }}
                    >
                      {/* gia trị sale tu 1 den 2 */}
                      <MenuItem value={1}>
                        {intl.formatMessage(messages.giamtheophantram || { id: 'giamtheophantram', defaultMessage: 'giamtheophantram' })}
                      </MenuItem>
                      <MenuItem value={2}>{intl.formatMessage(messages.giamtheoso || { id: 'giamtheoso', defaultMessage: 'giamtheoso' })}</MenuItem>
                    </TextField>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      style={{ width: '86%', marginLeft: '15px' }}
                      onChange={e => {
                        addSalesPolicy.sale === 1
                          ? this.handleChangePercentageDiscount('percentageDiscount', e.target.value)
                          : this.handleChangePriceDiscount('priceDiscount', e.target.value);
                      }}
                      value={addSalesPolicy.sale === 1 ? addSalesPolicy.percentageDiscount : addSalesPolicy.priceDiscount}
                      name={addSalesPolicy.sale === 1 ? 'percentageDiscount' : 'priceDiscount'}
                      type="number"
                    />
                    {names.unlimited}*
                    <Checkbox color="primary" checked={addSalesPolicy.unlimited} onChange={e => this.handleDiscount('unlimited', e.target.checked)} />
                    {addSalesPolicy.unlimited === false ? (
                      <TextField
                        required
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        type="number"
                        label={names.maxSale}
                        onChange={e => this.handleChange('maxSale', e.target.value)}
                        value={addSalesPolicy.maxSale}
                        name="maxSale"
                      />
                    ) : null}
                  </React.Fragment>
                ) : null}
                {rule === 5 ? (
                  <React.Fragment>
                    <TextField
                      required
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      label={names.expense}
                      value={addSalesPolicy.expense}
                      name="expense"
                      onChange={e => this.handleChangeExpenses('expense', e.target.value)}
                      error={addSalesPolicy.errorExpense}
                      helperText={addSalesPolicy.errorExpense ? 'Số tiền chi tiêu không được để trống' : ''}
                      type="number"
                    />
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      select
                      required
                      label="Giảm giá"
                      value={addSalesPolicy.sale}
                      name="sale"
                      onChange={e => this.props.mergeData({ sale: e.target.value })}
                      style={{ width: '13%' }}
                    >
                      {/* gia trị sale tu 1 den 2 */}
                      <MenuItem value={1}>
                        {intl.formatMessage(messages.giamtheophantram || { id: 'giamtheophantram', defaultMessage: 'giamtheophantram' })}
                      </MenuItem>
                      <MenuItem value={2}>{intl.formatMessage(messages.giamtheoso || { id: 'giamtheoso', defaultMessage: 'giamtheoso' })}</MenuItem>
                    </TextField>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      style={{ width: '86%', marginLeft: '15px' }}
                      onChange={e => {
                        addSalesPolicy.sale === 1
                          ? this.handleChangePercentageDiscount('percentageDiscount', e.target.value)
                          : this.handleChangePriceDiscount('priceDiscount', e.target.value);
                      }}
                      value={addSalesPolicy.sale === 1 ? addSalesPolicy.percentageDiscount : addSalesPolicy.priceDiscount}
                      name={addSalesPolicy.sale === 1 ? 'percentageDiscount' : 'priceDiscount'}
                      type="number"
                    />
                    {names.discount}*
                    <Checkbox color="primary" checked={addSalesPolicy.unlimited} onChange={e => this.handleDiscount('unlimited', e.target.checked)} />
                    {addSalesPolicy.unlimited === false ? (
                      <TextField
                        required
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        type="number"
                        label={names.maxSale}
                        onChange={e => this.handleChange('maxSale', e.target.value)}
                        value={addSalesPolicy.maxSale}
                        name="maxSale"
                      />
                    ) : null}
                  </React.Fragment>
                ) : null}
                {rule === 6 ? (
                  <React.Fragment>
                    <TextField
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      select
                      required
                      label="Loại điều kiện"
                      value={addSalesPolicy.condition}
                      name="condition"
                      onChange={e => this.props.mergeData({ condition: e.target.value })}
                    >
                      {/* gia trị condition tu 1 den 5 */}
                      <MenuItem value={1}>{intl.formatMessage(messages.quytacVa || { id: 'quytacVa', defaultMessage: 'quytacVa' })}</MenuItem>
                      <MenuItem value={0}>{intl.formatMessage(messages.quytacHOAC || { id: 'quytacHOAC', defaultMessage: 'quytacHOAC' })}</MenuItem>
                    </TextField>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      select
                      required
                      label="Giảm giá"
                      value={addSalesPolicy.sale}
                      name="sale"
                      onChange={e => this.props.mergeData({ sale: e.target.value })}
                      style={{ width: '13%' }}
                    >
                      {/* gia trị sale tu 1 den 2 */}
                      <MenuItem value={1}>
                        {intl.formatMessage(messages.giamtheophantram || { id: 'giamtheophantram', defaultMessage: 'giamtheophantram' })}
                      </MenuItem>
                      <MenuItem value={2}>{intl.formatMessage(messages.giamtheoso || { id: 'giamtheoso', defaultMessage: 'giamtheoso' })}</MenuItem>
                    </TextField>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      style={{ width: '86%', marginLeft: '15px' }}
                      onChange={e => {
                        addSalesPolicy.sale === 1
                          ? this.handleChangePercentageDiscount('percentageDiscount', e.target.value)
                          : this.handleChangePriceDiscount('priceDiscount', e.target.value);
                      }}
                      value={addSalesPolicy.sale === 1 ? addSalesPolicy.percentageDiscount : addSalesPolicy.priceDiscount}
                      name={addSalesPolicy.sale === 1 ? 'percentageDiscount' : 'priceDiscount'}
                      type="number"
                    />
                    Cho phép sửa
                    <Checkbox color="primary" checked={addSalesPolicy.isEdit} onChange={this.changeEdit} />
                    <Table>
                      <TableBody>
                        {conditions.map((i, e) => (
                          <TableRow>
                            {/* <div style={{ display: 'flex' }}> */}
                            <TableCell>
                              <TextField
                                InputLabelProps={{ shrink: true }}
                                select
                                label="Chọn danh mục"
                                value={i.value}
                                name="condition"
                                onChange={this.changeConditionValue(e)}
                                fullWidth
                              >
                                {/* gia trị condition tu 1 den 5 */}
                                {addSalesPolicy.sources.map(item => (
                                  <MenuItem disabled={!['customers', 'S18'].includes(item.value)} value={item.value}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                select
                                label="Là"
                                value={i.conditionType}
                                name="compare"
                                onChange={this.changeCondition({ index: e, name: 'conditionType' })}
                              >
                                {/* gia trị condition tu 1 den 5 */}
                                <MenuItem disabled={i.type === 3} value={1}>
                                  {intl.formatMessage(messages.la || { id: 'la', defaultMessage: 'la' })}
                                </MenuItem>
                                <MenuItem disabled={i.type === 3} value={2}>
                                  {intl.formatMessage(messages.khongpaila || { id: 'khongpaila', defaultMessage: 'khongpaila' })}
                                </MenuItem>
                                <MenuItem disabled={i.type === 1 || i.type === 2} value={3}>
                                  {intl.formatMessage(messages.lonhon || { id: 'lonhon', defaultMessage: 'lonhon' })}
                                </MenuItem>
                                <MenuItem disabled={i.type === 1 || i.type === 2} value={4}>
                                  {intl.formatMessage(messages.nhohon || { id: 'nhohon', defaultMessage: 'nhohon' })}
                                </MenuItem>
                                <MenuItem disabled={i.type === 1 || i.type === 2} value={5}>
                                  {intl.formatMessage(messages.bang || { id: 'bang', defaultMessage: 'bang' })}
                                </MenuItem>
                              </TextField>
                            </TableCell>
                            <TableCell>{this.mapData(i, e)}</TableCell>
                            <TableCell>
                              {addSalesPolicy.condition === 1
                                ? intl.formatMessage(messages.va || { id: 'va', defaultMessage: 'va' })
                                : intl.formatMessage(messages.hoac || { id: 'hoac', defaultMessage: 'hoac' })}
                            </TableCell>
                            <TableCell>
                              <div style={{ display: 'flex' }}>
                                <Add onClick={this.addCondition} style={{ margin: 5 }} />
                                <Cancel onClick={this.deleteCondition(e)} style={{ margin: 5 }} />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </React.Fragment>
                ) : null}
                <FileUpload name={this.props.addSalesPolicy.name} id={id} code="SalesPolicy" />
              </Grid>
            </Grid>

            {/* <div style={{ display: 'flex', justifyContent: 'flex-end', margin: 20 }}>
              <Button variant="contained" color="primary" style={{ marginRight: 25 }} type="submit">
                {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })}
              </Button>
              <Button variant="contained" color="secondary" onClick={this.onHandleClose}>
                {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
              </Button>
            </div> */}
          </Paper>
        </ValidatorForm>
      </div>
    );
  }

  handleChangeInput = (e, isDate) => {
    const name = isDate ? 'startDate' : 'endDate';
    const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    this.setState({ [name]: value });
    this.setState({ [e.target.name]: e.target.value });
  };

  changeEdit = e => {
    this.props.mergeData({ isEdit: e.target.checked });
    if (e.target.checked && this.notice !== true) {
      this.props.onChangeSnackbar({ status: true, message: 'Điều này cho phép được sửa chính sách', variant: 'warning' });
    }
    this.notice = true;
  };

  addCondition = () => {
    const { conditions } = this.props.addSalesPolicy;
    const newConditions = conditions.concat({ type: 1, value: 'customers', conditionType: 1, data: null });
    this.props.mergeData({ conditions: newConditions });
  };

  deleteCondition = id => () => {
    const { conditions } = this.props.addSalesPolicy;
    if (conditions.length === 1) return;
    const newConditions = conditions.filter((item, index) => index !== id);
    this.props.mergeData({ conditions: newConditions });
  };

  changeCondition = data => e => {
    const conditions = [...this.props.addSalesPolicy.conditions];
    conditions[data.index][data.name] = e.target.value;
    this.props.mergeData({ conditions });
  };

  changeConditionValue = index => e => {
    const conditions = [...this.props.addSalesPolicy.conditions];
    conditions[index].value = e.target.value;
    // eslint-disable-next-line eqeqeq
    const type = this.props.addSalesPolicy.sources.find(i => i.value == e.target.value).type;
    // const newType = {}
    conditions[index].type = type;
    conditions[index].data = null;
    switch (type) {
      case 1:
      case 2:
        if (![1, 2].includes(conditions[index].conditionType)) conditions[index].conditionType = 1;
        break;
      case 3:
        if (![3, 4, 5].includes(conditions[index].conditionType)) conditions[index].conditionType = 3;
        break;
      default:
        break;
    }

    this.props.mergeData({ conditions });
  };

  mapData = (e, i) => {
    const sr = this.props.addSalesPolicy.sources.find(it => it.value === e.value);
    const newSr = sr ? sr.data : [];
    switch (e.type) {
      case 1:
        return (
          <Autocomplete
            name="Chọn... "
            isMulti
            value={e.data}
            // label="Tên khách hàng"
            suggestions={this.props.addSalesPolicy[e.value]}
            onChange={this.changeDataCondition(i)}
          />
        );
      case 2:
        return (
          <Autocomplete
            name="Chọn... "
            // label="Tên khách hàng"
            isMulti
            value={e.data}
            suggestions={newSr.map(i => ({ ...i, name: i.title, _id: i.value }))}
            onChange={this.changeDataCondition(i)}
          />
        );
      case 3:
        return <TextField value={e.data} onChange={e => this.changeDataCondition(i)(e.target.value)} type="number" />;
      default:
        return <TextField onChange={e => this.changeDataCondition(i)(e.target.value)} value={e.data} />;
    }
  };

  changeDataCondition = index => value => {
    const conditions = [...this.props.addSalesPolicy.conditions];
    if (value && typeof value === 'object' && value.constructor === Array) conditions[index].data = value.map(i => ({ name: i.name, _id: i._id }));
    else conditions[index].data = value;
    this.props.mergeData({ conditions });
  };

  addRow = () => {
    const data = {
      quantity: '',
      discountItem: '',
      discountRatioItem: '',
    };
    const tabData = this.props.addSalesPolicy.splitPrice.concat(data);
    this.props.mergeData({ splitPrice: tabData });
  };

  deleteRow = index => {
    const tabData = this.props.addSalesPolicy.splitPrice;
    const newTab = [...tabData];
    newTab.splice(index, 1);
    this.props.mergeData({ splitPrice: newTab });
  };

  onChangeListTable = data => {
    const tabData = this.props.addSalesPolicy.splitPrice;
    const newTab = [...tabData];
    newTab[data.index] = { ...tabData[data.index], [data.name]: data.value };
    this.props.mergeData({ splitPrice: newTab });
  };

  handleChange = (name, value) => {
    this.props.mergeData({ [name]: value });
  };

  handleDiscount = (name, checked) => {
    this.props.mergeData({ [name]: checked });
  };

  selectProduct = product => {
    this.props.mergeData({ product });
  };

  selectCategory = category => {
    this.props.mergeData({ category });
  };

  selectLabels = label => {
    this.props.mergeData({ label });
  };

  onSave = () => {
    const { addSalesPolicy } = this.props;
    const id = this.props.match.params.id;
    if (new Date(addSalesPolicy.startDate) >= new Date(addSalesPolicy.endDate)) {
      this.props.onChangeSnackbar({ status: true, message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu', variant: 'warning' });
      return;
    }

    // if (
    //   // addSalesPolicy.errorRule ||
    //   addSalesPolicy.errorName ||
    //   addSalesPolicy.errorStartDate ||
    //   addSalesPolicy.errorEndDate ||
    //   addSalesPolicy.errorbuyAmount ||
    //   addSalesPolicy.errorreceiveAmount ||
    //   addSalesPolicy.errorExpense ||
    //   addSalesPolicy.errorProduct
    // )

    const data = {
      rule: addSalesPolicy.rule,
      name: addSalesPolicy.name,
      description: addSalesPolicy.description,
      startDate: addSalesPolicy.startDate,
      endDate: addSalesPolicy.endDate,
      active: addSalesPolicy.active,
      discount: addSalesPolicy.discount,
      codeSale: addSalesPolicy.codeSale,
      product: addSalesPolicy.product,
      category: addSalesPolicy.category,
      label: addSalesPolicy.label,
      priceDiscount: addSalesPolicy.priceDiscount,
      percentageDiscount: addSalesPolicy.percentageDiscount,
      maxSale: addSalesPolicy.maxSale,
      unlimited: addSalesPolicy.unlimited,
      buyAmount: addSalesPolicy.buyAmount,
      receivedAmount: addSalesPolicy.receivedAmount,
      expense: addSalesPolicy.expense,
      splitPrice: addSalesPolicy.splitPrice,
      condition: addSalesPolicy.condition,
      sale: addSalesPolicy.sale,
      conditions: addSalesPolicy.conditions.filter(item => item.data && item.conditionType && item.value),
    };
    if (id === 'add') this.props.postSalesPolicy(data);
    else this.props.putSalesPolicy(data, id);
  };

  onHandleClose = () => {
    this.props.handleClose();
    this.props.getDefault();
  };

  handleChangePercentageDiscount = (name, value) => {
    if (value < 0 || value > 100) return;
    this.props.mergeData({
      percentageDiscount: value,
      priceDiscount: 0,
    });
  };

  handleChangePriceDiscount = (name, value) => {
    if (value < 0) return;
    this.props.mergeData({
      percentageDiscount: 0,
      priceDiscount: value,
    });
  };

  handleChangeExpenses = (name, value) => {
    if (value < 0) return;
    this.props.mergeData({ expense: value, errorExpense: !Boolean(value) });
  };

  changePriceValue = index => e => {
    const splitPrice = this.props.addSalesPolicy.splitPrice;
    splitPrice[index].quantity = e.target.value;
    this.props.mergeData({ splitPrice });
  };

  changeDiscountItem = index => e => {
    const splitPrice = [...this.props.addSalesPolicy.splitPrice];
    if (e.target.value < 0) return;
    splitPrice[index].discountItem = e.target.value;
    splitPrice[index].discountRatioItem = 0;
    this.props.mergeData({ splitPrice });
  };

  changeDiscountRatioItem = index => e => {
    const splitPrice = [...this.props.addSalesPolicy.splitPrice];
    if (e.target.value < 0 || e.target.value > 100) {
      return;
    }
    splitPrice[index].discountRatioItem = e.target.value;
    splitPrice[index].discountItem = 0;
    this.props.mergeData({ splitPrice });
  };

  handleBuyAmount = (name, value) => {
    if (value < 0) return;
    this.props.mergeData({ buyAmount: value, errorbuyAmount: !Boolean(value) });
  };

  handleReceivedAmount = (name, value) => {
    if (value < 0) return;
    this.props.mergeData({ receivedAmount: value, errorreceivedAmount: !Boolean(value) });
  };
}

// AddSalesPolicy.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  addSalesPolicy: makeSelectAddSalesPolicy(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    getSalesPolicy: () => dispatch(getSalesPolicy()),
    getDefault: () => dispatch(getDefault()),
    getSalesPolicyCurrent: id => dispatch(getSalesPolicyCurrent(id)),
    postSalesPolicy: data => dispatch(postSalesPolicy(data)),
    putSalesPolicy: (data, id) => dispatch(putSalesPolicy(data, id)),
    handleClose: () => dispatch(handleClose()),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addSalesPolicy', reducer });
const withSaga = injectSaga({ key: 'addSalesPolicy', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
)(AddSalesPolicy);
