/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-unused-state */
/**
 *
 * AddImportProduct
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Grid,
  TextField,
  Paper,
  MenuItem,
  withStyles,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  // FormControlLabel,
  // Checkbox,
} from '@material-ui/core';
// import MenuS from '@material-ui/core/Menu';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import NumberFormat from 'react-number-format';
import { Cancel, Delete, Close } from '@material-ui/icons'; // Done, Add
import { injectIntl } from 'react-intl';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { FileUpload } from '../../components/LifetekUi';
// import makeSelectAddBillPage, { makeSelectDashboardPage } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styles from './styles';
import TextFieldCode from '../../components/TextFieldCode';
import { serialize, convertDatetimeToDate } from '../../utils/common';
import { API_ADD_NEW_PRODUCT, API_SALE, API_SUPPLIERS } from '../../config/urlConfig';
import makeSelectAddImportProduct, { makeSelectDashboardPage } from './selectors';
import {
  getCRMSourceAct,
  createOrderAct,
  getOrderUpdateAct,
  getProductBySupplierAct,
  getProductByIdAct,
  resetNotiAct,
  updateOrderAct,
} from './actions';
import { changeSnackbar, changeStockAct } from '../Dashboard/actions';
import CustomAppBar from 'components/CustomAppBar';
import { viewConfigCheckForm } from 'utils/common';
import LoadingIndicator from '../../components/LoadingIndicator';
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import CustomInputBase from '../../components/Input/CustomInputBase';
// import { getOrderAct } from '../AddContractPage/actions';
// import { getAllContractAct } from './actions';

const tempDate = new Date();
const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
  }`;

function formatNumber(num) {
  if (num) return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return '';
}

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
    />
  );
}

/* eslint-disable react/prefer-stateless-function */
export class AddImportProduct extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }

  state = {
    currentStock: '',
    toStock: '',
    name: '',
    code: '',
    discount: 0,
    discountPercent: 0,
    payMethod: 0,
    paymentAmount: 0,
    total: 0,
    note: '',
    history: false,
    supplier: null,
    type: 1, // 0 đơn đặt hàng, 1 đặt hàng PO, 2 TRả hàng, 3 nhập đồng, 4 Chuyển kho,
    products: this.props.products ? this.props.products : [],
    paidList: [],
    isFinished: true,
    orderId: undefined,
    allStock: [],
    createdDate: moment().format('YYYY/MM/DD'),
    open: false,
    criteria: 0,
    // isDeleteProductsSelected: false,
    isEditPage: false,
    totalItems: 0,
    totalProducts: 0,
    employee: '',
    // quickImport: true,
    orderPOColumns: JSON.parse(localStorage.getItem('viewConfig'))
      .find(item => item.code === 'OrderPo')
      .listDisplay.type.fields.type.columns.map(item => ({ ...item, name: item.name.replace(/\./g, '_') })),
    localMessages: {},
  };

  componentWillMount() {
    if (this.props.id) return;
    if (this.props.match.params.id) {
      this.state.orderId = this.props.match.params.id;
      this.props.onGetOrder(this.props.match.params.id);
      this.state.isEditPage = true;
    }
    // this.props.onGetCRMSource();
  }

  componentDidUpdate(props) {
    if (props.addImportProduct.successCreate) {
      if (this.props.id) return;
      if (localStorage.getItem('traddingItem')) {
        const item = JSON.parse(localStorage.getItem('traddingItem'));
        this.props.history.push(`/crm/ExchangingAgreement/${item.exchangingAgreementId}`);
        localStorage.removeItem('traddingItem');
      } else {
        this.props.history.push('/crm/OrderPo');
      }
      this.props.onResetNoti();
    }
  }

  componentWillReceiveProps(props) {
    if (props.addImportProduct) {
      const localMessages = viewConfigCheckForm('OrderPo', props.addImportProduct);
      this.setState({
        localMessages,
      });
    }
    if (props.dashboardPage.currentStock !== '') {
      this.state.currentStock = props.dashboardPage.currentStock;
      if (!this.state.isEditPage) {
        this.state.toStock = props.dashboardPage.currentStock;
      }
      this.state.allStock = props.dashboardPage.allStock || [];
    }
    if (this.props.addImportProduct !== props.addImportProduct) {
      const {
        isFinished,
        createdDate,
        name,
        code,
        products,
        supplier,
        discount,
        discountPercent,
        paidList,
        note,
        createdBy,
        // type,
        // amount,
        // fromStock,
        // toStock,
      } = props.addImportProduct.order;
      // console.log(props.addImportProduct.order);
      if (this.state.type === 1 || this.state.type === 3) {
        const product = [];
        const productList = props.addImportProduct.productList || [];
        // if (this.state.isDeleteProductsSelected) {
        //   product = [];
        // } else if (this.state.products.length < productList.length) {
        //   product = this.state.products;
        // }
        productList.forEach(item => {
          const x = item.sellingPoint.find(n => {
            if (this.state.currentStock === n.organizationUnitId) return true;
          });
          if (x) {
            if (this.state.criteria === 0) {
              if (x.miximumSell !== null && x.miximumSell !== 0) {
                if (x.amount < x.miximumSell) {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: -1,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.sourcePrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                }
              } else if (item.otherInfo && item.otherInfo.limitOrder !== null) {
                if (x.amount < item.otherInfo.limitOrder) {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: -1,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.sourcePrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                }
              }
            } else if (this.state.criteria === 1) {
              if (x.maximumLimit !== null && x.maximumLimit !== 0) {
                if (x.amount > x.maximumLimit) {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: -1,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.sourcePrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                }
              } else if (item.otherInfo && item.otherInfo.maximumLimit !== null) {
                if (x.amount > item.otherInfo.maximumLimit) {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: -1,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.sourcePrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                }
              }
            } else {
              product.push({
                ...item,
                amount: 1,
                totalAmount: -1,
                unit: item.unit ? item.unit.name : '',
                importPrice: item.pricePolicy ? item.pricePolicy.sourcePrice : 0,
                discountPercent: 0,
                productId: item._id,
              });
            }
          }
        });
        this.setState({ products: product });
      }
      if (this.state.isEditPage) {
        const list = props.addImportProduct.productListById || [];
        if (list.length > 0 && products && products.length > 0) {
          const newList = products.map(item => {
            const x = list.find(n => n._id === item.productId);
            item.code = x ? x.code : '';
            item.description = '';
            if (x && x.isDescription) {
              item.description = x.description;
            }
            item.totalAmount = 0;
            return item;
          });
          this.setState({ products: newList });
        }
      }
      if (this.state.isEditPage && props.addImportProduct.order !== this.props.addImportProduct.order && products && products.length > 0) {
        const listId = products.map(item => item.productId);
        const params = {
          filter: {
            _id: { $in: listId },
          },
        };
        this.props.onGetProductById(serialize(params));
      }
      if (this.state.isEditPage && code && props.addImportProduct.order !== this.props.addImportProduct.order) {
        this.setState({
          isFinished,
          name,
          code,
          products,
          supplier,
          discount,
          discountPercent,
          paidList,
          note,
          employee: createdBy && createdBy.name && createdBy.name,
          // type,
          // toStock: toStock ? toStock.organizationUnitId : '',
          createdDate: convertDatetimeToDate(createdDate),
          // total: Number(amount),
        });
      }
    }
  }

  checkRequest = value => {
    const { orderPOColumns } = this.state;
    const column = orderPOColumns.filter(data => data.name === value);
    if (!this.isEmptyObject(column)) {
      return column[0].checkedRequireForm;
    }
  };

  checkShowForm = value => {
    const { orderPOColumns } = this.state;
    const column = orderPOColumns.filter(data => data.name === value);
    if (!this.isEmptyObject(column)) {
      return column[0].checkedShowForm;
    }
  };

  isEmptyObject = obj => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  render() {
    const id = this.props.match.params.id;
    const { classes, addImportProduct, intl } = this.props;
    const { name, code, note, localMessages } = this.state;
    this.state.totalItems = 0; // tổng số lượng hàng
    this.state.totalProducts = 0; // tổng số mặt hàng
    this.state.total = 0;
    // let totalBack = 0;
    // this.state.total -= discount;
    // const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    // const payMethod = crmSource.find(item => item.code === 'S17');
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    return (
      <div>
        <CustomAppBar
          className
          title={
            addStock === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới đặt hàng' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật đặt hàng' })}`
          }
          onGoBack={() => this.props.history.goBack()}
          onSubmit={() => {
            this.setState({ isFinished: true });
            this.submitBtn.current.click();
          }}
        />
        <Helmet>
          <title>{this.state.isEditPage ? 'Chỉnh sửa nhập hàng' : 'Thêm mới nhập hàng'}</title>
          <meta name="description" content="Create a new bill" />
        </Helmet>
        {addImportProduct.loading ? <LoadingIndicator /> : null}
        <Grid container spacing={24}>
          <Grid md={8} item>
            <Paper className={classes.paper}>
              <div style={{ display: 'flex' }}>
                {this.loadFindOption()}
                <TextField
                  // label="Loại"
                  name="type"
                  select
                  // disabled
                  value={this.state.type}
                  onChange={this.handleChange('type')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  style={{ width: '20%' }}
                  color="primary"
                >
                  <MenuItem value={0}>Đơn đặt hàng</MenuItem>
                  <MenuItem value={1}>Đặt hàng PO</MenuItem>
                  <MenuItem value={2}>Trả hàng</MenuItem>
                  <MenuItem value={3}>Nhập hàng</MenuItem>
                  <MenuItem value={4}>Chuyển kho</MenuItem>
                </TextField>
              </div>
            </Paper>
          </Grid>
          <Grid md={4} item>
            <Paper className={classes.paper} style={{ height: '97px' }}>
              <Grid container md={12} justify="center" alignContent="center" alignItems="center">
                {/* <Button
                  className={classes.button}
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={this.handleClickHistory}
                  color="primary"
                  variant="outlined"
                >
                  ...
                </Button>
                <MenuS
                  id="simple-menu"
                  anchorEl={this.state.history}
                  keepMounted
                  open={Boolean(this.state.history)}
                  onClose={() => this.setState({ history: null })}
                >
                  <MenuItem onClick={() => this.props.history.push('/crm/OrderPo/list')}>
                    <InsertDriveFile /> Lịch sử thao tác
                  </MenuItem>
                  {this.state.type === 3 ? <MenuItem>Nhập với số lượng nhiều</MenuItem> : ''}
                  <MenuItem onClick={() => this.handleClose('history')}>
                    <InsertDriveFile /> Lịch sử chuyển kho
                  </MenuItem>
                </MenuS> */}
                {this.state.type === 1 || this.state.type === 3 ? (
                  <Button className={classes.button} variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    Nhập nhanh
                  </Button>
                ) : (
                  ''
                )}
                {/* <Button className={classes.button} onClick={() => this.props.history.goBack()} variant="outlined" color="secondary">
                  <Cancel style={{ marginRight: '5px' }} /> Hủy
                </Button> */}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <ValidatorForm style={{ width: '100%', zIndex: 0, display: 'inline' }} onSubmit={this.handleSubmitForm}>
          <Grid spacing={24} container>
            <Grid item md={8}>
              <Paper className={classes.paper}>
                <Table>
                  <TableHead>
                    <TableCell>Tên mặt hàng</TableCell>
                    {this.state.type !== 4 ? (
                      <React.Fragment>
                        <TableCell>Giá nhập</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Đơn vị tính</TableCell>
                        <TableCell>Chiết khấu</TableCell>
                        <TableCell>Thành tiền</TableCell>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Đơn vị tính</TableCell>
                      </React.Fragment>
                    )}
                    <TableCell>Thao tác</TableCell>
                  </TableHead>
                  <TableBody>
                    {this.state.products.map(item => {
                      const totalPrice = item.importPrice * item.amount - item.importPrice * item.amount * (item.discountPercent / 100);
                      this.state.total += totalPrice || 0;
                      this.state.totalItems += parseInt(item.amount, 10) || 0;
                      this.state.totalProducts += 1;
                      return (
                        <TableRow key={item._id}>
                          <TableCell style={{ padding: '5px', width: '200px' }}>
                            <div>
                              <b style={{ fontSize: '16px' }}>{item.name}</b>
                              <br />
                              {`Mã sản phẩm: ${item.code}`}
                              <br />
                              {`Mô tả: ${item.description}`}
                            </div>
                          </TableCell>
                          {this.state.type !== 4 ? (
                            <React.Fragment>
                              <TableCell style={{ width: '200px' }}>
                                <TextField
                                  onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'importPrice')}
                                  style={{ width: '80%' }}
                                  value={item.importPrice}
                                  type="number"
                                />
                              </TableCell>
                              {this.state.type === 4 || this.state.type === 2 ? (
                                <TableCell>
                                  <TextValidator
                                    onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                    style={{ width: '80%' }}
                                    value={item.amount}
                                    type="number"
                                    validators={['minNumber:0', `${item.totalAmount !== -1 ? `maxNumber:${item.totalAmount}` : ''}`]}
                                    errorMessages={[
                                      'Không được nhỏ hơn 0',
                                      `${item.totalAmount !== -1 ? `Số lượng trong kho hiện còn ${item.totalAmount}` : ''}`,
                                    ]}
                                  />
                                </TableCell>
                              ) : (
                                <TableCell style={{ width: '150px' }}>
                                  <TextValidator
                                    onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                    style={{ width: '80%' }}
                                    value={item.amount}
                                    type="number"
                                    validators={['minNumber:0']}
                                    errorMessages={['Không được nhỏ hơn 0']}
                                  />
                                </TableCell>
                              )}
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>
                                <TextValidator
                                  onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'discountPercent')}
                                  style={{ width: '80%' }}
                                  value={item.discountPercent}
                                  validators={['minNumber:0', 'maxNumber:100']}
                                  errorMessages={['Không được nhỏ hơn 0', 'Không được vượt quá 100']}
                                  InputProps={{
                                    inputComponent: NumberFormatCustom,
                                  }}
                                />
                                %
                              </TableCell>
                              <TableCell>{formatNumber(totalPrice || 0)}</TableCell>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              {this.state.type === 4 || this.state.type === 2 ? (
                                <TableCell>
                                  <TextValidator
                                    onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                    style={{ width: '80%' }}
                                    value={item.amount}
                                    type="number"
                                    validators={['minNumber:0', `${item.totalAmount !== -1 ? `maxNumber:${item.totalAmount}` : ''}`]}
                                    errorMessages={[
                                      'Không được nhỏ hơn 0',
                                      `${item.totalAmount !== -1 ? `Số lượng trong kho hiện còn ${item.totalAmount}` : ''}`,
                                    ]}
                                  />
                                </TableCell>
                              ) : (
                                <TableCell>
                                  <TextValidator
                                    onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                    style={{ width: '80%' }}
                                    value={item.amount}
                                    type="number"
                                    validators={['minNumber:0']}
                                    errorMessages={['Không được nhỏ hơn 0']}
                                  />
                                </TableCell>
                              )}
                              <TableCell>{item.unit}</TableCell>
                            </React.Fragment>
                          )}
                          <TableCell>
                            <Fab color="secondary" size="small" onClick={() => this.handleDeleteProductSelect(item._id)}>
                              <Delete />
                            </Fab>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
              <Paper>
                <FileUpload name={this.state.name} id={id} code="OrderPo" />
              </Paper>
            </Grid>
            <Grid item md={4}>
              {this.state.type !== 4 ? (
                <Paper className={classes.paper}>
                  <Typography className={classes.typography} component="p">
                    Tổng số mặt hàng: <b>{this.state.totalProducts}</b>
                  </Typography>
                  <Typography className={classes.typography} component="p">
                    Tổng số lượng: <b>{this.state.totalItems}</b>
                  </Typography>
                  <Typography className={classes.typography}>
                    Người lập đơn: <strong>{this.state.isEditPage ? this.state.employee : this.props.dashboardPage.profile.name}</strong>
                  </Typography>
                  <hr />
                  {this.checkShowForm('code') && (
                    <TextField
                      label="Mã"
                      disabled={this.state.isEditPage}
                      variant="outlined"
                      margin="normal"
                      name="code"
                      value={code}
                      style={{ width: '100%', zIndex: 0 }}
                      onChange={this.handleChange('code')}
                      error={code === '' && this.checkRequest('code')}
                      required={this.checkRequest('code')}
                      helperText={localMessages.code}
                    />
                  )}

                  {this.checkShowForm('name') && (
                    <CustomInputBase
                      label="Tên"
                      variant="outlined"
                      margin="normal"
                      name="name"
                      value={name}
                      style={{ width: '100%', zIndex: 0 }}
                      onChange={this.handleChange('name')}
                      error={name === '' && this.checkRequest('name')}
                      required={this.checkRequest('name')}
                      helperText={localMessages.name}
                    />
                  )}

                  {this.checkShowForm('supplier_name') && (
                    <>
                      <Typography
                        style={{
                          color: 'grey',
                        }}
                      >
                        Nhà cung cấp
                      </Typography>
                      <AsyncSelect
                        // className={this.props.classes.select}
                        required={this.checkRequest('supplier_name')}
                        error={this.checkRequest('supplier_name') && this.state.supplier && this.state.localMessages.supplier_name}
                        placeholder="Tìm kiếm nhà cung cấp  ..."
                        loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_SUPPLIERS)}
                        loadingMessage={() => 'Đang tải ...'}
                        components={{ Option, SingleValue }}
                        // onBlur={() => field.onBlur({ value: field.value })}
                        onChange={this.handleSupplier}
                        // inputValue={value}
                        value={this.state.supplier}
                        theme={theme => ({
                          ...theme,
                          spacing: {
                            ...theme.spacing,
                            controlHeight: '55px',
                          },
                        })}
                      />
                    </>
                  )}

                  {/* <TextField
                    label="Nhà cung cấp"
                    value={this.state.supplier.name}
                    variant="outlined"
                    margin="normal"
                    style={{ width: '100%', zIndex: 0 }}
                  /> */}
                  {/* <TextValidator
                    label="Giảm giá tất cả các mục(%)"
                    variant="outlined"
                    value={discountPercent}
                    name="discountPercent"
                    margin="normal"
                    style={{ width: '100%', zIndex: 0 }}
                    onChange={this.handleChange('discountPercent')}
                    validators={['minNumber:0', 'maxNumber:100']}
                    errorMessages={['Không được nhỏ hơn 0', 'Không được vượt quá 100']}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                  <TextValidator
                    label="Giảm giá đơn hàng"
                    value={discount}
                    variant="outlined"
                    name="discount"
                    margin="normal"
                    onChange={this.handleChange('discount')}
                    validators={['minNumber:0', `maxNumber:${totalBack}`]}
                    errorMessages={['Số tiền không được nhỏ hơn 0', 'Không được vượt quá tổng tiền hóa đơn']}
                    style={{ width: '100%', zIndex: 0 }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                  /> */}
                  {this.checkShowForm('amount') && (
                    <TextField
                      label="Tổng tiền"
                      value={this.state.total}
                      variant="outlined"
                      margin="normal"
                      style={{ width: '100%', zIndex: 0 }}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                        readOnly: true,
                      }}
                      required={this.checkRequest('amount')}
                      error={this.checkRequest('amount') && this.state.total && this.state.localMessages.amount}
                    />
                  )}

                  {/* <div className={classes.payment}>
                    <TextValidator
                      label="Số tiền thanh toán"
                      value={paymentAmount}
                      variant="outlined"
                      name="paymentAmount"
                      margin="normal"
                      onChange={this.handleChange('paymentAmount')}
                      style={{ width: '100%', zIndex: 0 }}
                      // validators={['minNumber:0', `maxNumber:${totalBack}`]}
                      // errorMessages={['Số tiền không được nhỏ hơn 0', 'Không được vượt quá tổng tiền hóa đơn']}
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                    />
                    <TextField
                      className={classes.paymentMethod}
                      label="Phương thức thanh toán"
                      value={this.state.payMethod}
                      variant="outlined"
                      name="payMethod"
                      margin="normal"
                      select
                      onChange={this.handleChange('payMethod')}
                      style={{ width: '100%', zIndex: 0 }}
                    >
                      {payMethod
                        ? payMethod.data.map(item => (
                            <MenuItem value={item.title} key={item.value}>
                              {item.title}
                            </MenuItem>
                          ))
                        : null}
                    </TextField>
                  </div>
                  <Button
                    disabled={this.state.paymentAmount === '' || this.state.payMethod === 0 || parseInt(this.state.paymentAmount, 10) === 0}
                    variant="contained"
                    color="primary"
                    onClick={this.handleAddPaid}
                  >
                    Thanh toán
                  </Button>
                  <hr />
                  <Table>
                    {this.state.paidList.map(item => (
                      <TableRow>
                        <TableCell>{item.payMethod}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>
                          <Delete onClick={() => this.handleRemovePaid(item.payMethod)} style={{ cursor: 'pointer' }} color="secondary" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </Table> */}
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    {this.checkShowForm('createdDate') && (
                      <DatePicker
                        label="Ngày tạo"
                        value={this.state.createdDate}
                        fullWidth
                        inputVariant="outlined"
                        variant="outlined"
                        format="DD/MM/YYYY"
                        name="note"
                        margin="normal"
                        // onChange={this.handleChange('createdDate')}
                        onChange={e => this.handleChangeInput(e, true)}
                        style={{ width: '100%', zIndex: 0 }}
                        required={this.checkRequest('createdDate')}
                      // error={this.checkRequest('createdDate') && this.state.createdDate === date}
                      />
                    )}
                  </MuiPickersUtilsProvider>

                  {this.checkShowForm('note') && (
                    <TextField
                      label="Ghi chú"
                      value={note}
                      multiline
                      rows={3}
                      variant="outlined"
                      name="note"
                      margin="normal"
                      onChange={this.handleChange('note')}
                      style={{ width: '100%', zIndex: 0 }}
                      required={this.checkRequest('note')}
                      helperText={this.checkRequest('note') && note === '' ? localMessages.note : ''}
                      error={this.checkRequest('note') && note === ''}
                    />
                  )}

                  {/* <Button
                    onClick={() => {
                      this.setState({ isFinished: true });
                      this.submitBtn.current.click();
                    }}
                    variant="contained"
                    color="primary"
                    style={{ width: '100%' }}
                  >
                    <Done style={{ marginRight: '5px' }} />
                    Hoàn thành
                  </Button> */}
                </Paper>
              ) : (
                <Paper className={classes.paper}>
                  <Typography className={classes.typography} component="p">
                    Tổng số mặt hàng: <b>{this.state.totalProducts}</b>
                  </Typography>
                  <Typography className={classes.typography} component="p">
                    Tổng số lượng: <b>{this.state.totalItems}</b>
                  </Typography>
                  <Typography className={classes.typography}>
                    Người lập đơn: <strong>{this.state.isEditPage ? this.state.employee : this.props.dashboardPage.profile.name}</strong>
                  </Typography>
                  <hr />
                  {/* <TextValidator
                    label="Mã"
                    variant="outlined"
                    disabled={this.state.isEditPage}
                    margin="normal"
                    name="code"
                    value={code}
                    style={{ width: '100%', zIndex: 0 }}
                    onChange={this.handleChange('code')}
                    validators={['required', 'trim']}
                    errorMessages={['Không được để trống', 'Không được điền khoảng trắng']}
                  /> */}
                  <TextFieldCode
                    label="Mã"
                    variant="outlined"
                    disabled={this.state.isEditPage}
                    margin="normal"
                    name="code"
                    value={code}
                    style={{ width: '100%', zIndex: 0 }}
                    onChange={this.handleChange('code')}
                    code={7}
                  />
                  <CustomInputBase
                    label="Tên"
                    variant="outlined"
                    margin="normal"
                    name="name"
                    value={name}
                    style={{ width: '100%', zIndex: 0 }}
                    onChange={this.handleChange('name')}
                    validators={['required', 'trim']}
                    errorMessages={['Không được để trống', 'Không được điền khoảng trắng']}
                  />
                  <hr />
                  <TextField
                    id="standard-select-currency"
                    select
                    label="Kho tới"
                    name="stock"
                    variant="outlined"
                    value={this.state.toStock}
                    onChange={this.handleChange('toStock')}
                    style={{
                      width: '100%',
                    }}
                  // helperText="Please select your currency"
                  // margin="normal"
                  >
                    {this.state.allStock.map(item => (
                      <MenuItem
                        key={item.id}
                        value={item.id}
                        style={item.padding !== 0 ? { paddingLeft: `${parseInt(item.padding, 10) * 1.5}px` } : {}}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      label="Ngày tạo"
                      value={this.state.createdDate}
                      fullWidth
                      inputVariant="outlined"
                      variant="outlined"
                      format="DD/MM/YYYY"
                      name="note"
                      margin="normal"
                      // onChange={this.handleChange('createdDate')}
                      onChange={e => this.handleChangeInput(e, true)}
                      style={{ width: '100%', zIndex: 0 }}
                    />
                  </MuiPickersUtilsProvider>

                  <TextField
                    label="Ghi chú"
                    value={note}
                    multiline
                    rows={3}
                    variant="outlined"
                    name="note"
                    margin="normal"
                    onChange={this.handleChange('note')}
                    style={{ width: '100%', zIndex: 0 }}
                  />
                  <Button
                    onClick={() => {
                      this.setState({ isFinished: true });
                      // console.log(this.props.callback);
                      // if (this.props.callback) {
                      //   this.props.callback();
                      // }
                      this.submitBtn.current.click();
                    }}
                    style={{ width: '100%' }}
                    variant="outlined"
                    color="primary"
                  >
                    {/* <Done style={{ marginRight: '5px' }} /> */}
                    Hoàn thành
                  </Button>
                </Paper>
              )}
              {/* {console.log(this.props.callback)} */}
              <div style={{ display: 'none' }}>
                <button
                  ref={this.submitBtn}
                  type="submit"
                  onClick={() => {
                    this.props.callback();
                    this.props.onChangeSnackbar({ status: true, message: 'Câp nhập thành công', variant: 'success' });
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </ValidatorForm>
        <Dialog fullWidth open={this.state.open} onClose={this.handleCloseDialog} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Nhập nhanh sản phẩm</DialogTitle>
          <DialogContent>
            <Typography
              style={{
                color: 'grey',
              }}
            >
              Nhà cung cấp
            </Typography>
            <AsyncSelect
              className={this.props.classes.reactSelect}
              placeholder="Tìm kiếm nhà cung cấp  ..."
              loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_SUPPLIERS)}
              loadingMessage={() => 'Đang tải ...'}
              components={{ Option, SingleValue }}
              // onBlur={() => field.onBlur({ value: field.value })}
              onChange={this.handleSupplier}
              // inputValue={value}
              theme={theme => ({
                ...theme,
                spacing: {
                  ...theme.spacing,
                  controlHeight: '55px',
                },
              })}
            />
            <TextField
              id="standard-select-currency"
              select
              label="Tiêu chí hàng hóa"
              name="criteria"
              variant="outlined"
              value={this.state.criteria}
              onChange={this.handleChange('criteria')}
              style={{
                width: '100%',
              }}
              // helperText="Please select your currency"
              margin="normal"
            >
              <MenuItem value={0}>Sản phẩm dưới hạn mức</MenuItem>
              <MenuItem value={1}>Sản phẩm trên hạn mức</MenuItem>
              <MenuItem value={2}>Tất cả sản phẩm của nhà cung cấp</MenuItem>
            </TextField>
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.isDeleteProductsSelected}
                  onChange={this.handleChangeCheck('isDeleteProductsSelected')}
                  value="isDeleteProductsSelected"
                  color="primary"
                />
              }
              label="Xóa các sản phẩm đã chọn"
            /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onSort} variant="outlined" color="primary">
              LƯU
            </Button>
            <Button onClick={this.handleCloseDialog} variant="outlined" color="secondary">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  onSort = () => {
    const { supplier } = this.state;
    const params = {
      filter: {
        'supplier.supplierId': supplier.supplierId,
      },
    };
    this.props.onGetProductBySupplier(this.state.currentStock, serialize(params));
    this.setState({ open: false });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleCloseDialog = () => {
    this.setState({ open: false });
  };

  handleSubmitForm = () => {
    const {
      name,
      code,
      products,
      supplier,
      // discount,
      // discountPercent,
      // paidList,
      note,
      type,
      total,
      // currentStock,
      // allStock,
      // toStock,
      totalItems,
      // totalProducts,
      isFinished,
      createdDate,
    } = this.state;
    // let { isFinished } = this.state;
    // const x = allStock.find(item => item.id === currentStock);
    // const fromStock = {
    //   organizationUnitId: x.id,
    //   name: x.name,
    // };
    let employeeRaw;
    if (this.state.isEditPage) {
      employeeRaw = this.props.addImportProduct.order.createdBy;
    } else {
      employeeRaw = {
        name: this.props.dashboardPage.profile ? this.props.dashboardPage.profile.name : '',
        employeeId: this.props.dashboardPage.profile ? this.props.dashboardPage.profile._id : '',
      };
    }
    // let toStockRaw;
    // if (type === 4) {
    //   const y = allStock.find(item => item.id === toStock);
    //   toStockRaw = {
    //     organizationUnitId: y.id,
    //     name: y.name,
    //   };
    // }
    // if (type === 0 || type === 1 || type === 3) {
    //   let totalAmount = 0;
    //   paidList.forEach(item => (totalAmount += Number(item.amount)));
    //   if (total > totalAmount) isFinished = false;
    // }

    let exchangingAgreement;
    if (localStorage.getItem('traddingItem')) {
      exchangingAgreement = JSON.parse(localStorage.getItem('traddingItem'));
    }
    const body = {
      name,
      code,
      products,
      supplier,
      createdBy: employeeRaw,
      exchangingAgreement,
      // toStock: toStockRaw,
      // fromStock,
      amount: total,
      productAmount: Number(totalItems) || 0,
      createdDate: new Date(createdDate),
      // discount,
      // discountPercent,
      // paidList,
      note,
      type,
      // total,
      isFinished,
      callback: this.props.callback,
    };

    if (supplier == null && type !== 4) {
      this.props.onChangeSnackbar({ status: true, message: 'Nhà cung cấp không được để trống', variant: 'error' });
      return;
    }
    if (products.length === 0) {
      this.props.onChangeSnackbar({ status: true, message: 'Sản phẩm không được để trống', variant: 'error' });
      return;
    }
    // console.log(body);
    if (this.state.isEditPage) {
      const { match } = this.props;
      body.id = this.props.id ? this.props.id : match.params.id;
      this.props.onUpdateOrder(body);
    } else {
      this.props.onCreateOrder(body);
    }
  };

  handleSupplier = value => {
    const supplier = {
      supplierId: value._id,
      name: value.name,
      avatar: value.avatar,
    };
    this.setState({ supplier });
  };

  handleAddPaid = () => {
    const { paymentAmount, payMethod, paidList, total } = this.state;
    if (payMethod === 0) {
      return;
    }
    if (paymentAmount === 0) {
      return;
    }
    let amount = Number(paymentAmount);
    paidList.forEach(item => (amount += Number(item.amount)));
    if (amount > Number(total)) {
      this.props.onChangeSnackbar({ status: true, message: 'Số tiền thanh toán không được vượt quá tổng số tiền', variant: 'error' });
      return;
    }
    if (paidList.findIndex(item => item.payMethod === payMethod) >= 0) {
      this.props.onChangeSnackbar({ status: true, message: 'Đã tồn tại phương thức thanh toán', variant: 'error' });
      return;
    }
    paidList.push({
      amount: paymentAmount,
      payMethod,
    });
    this.setState({ paidList });
  };

  handleRemovePaid = name => {
    const { paidList } = this.state;
    const newPaidList = paidList.filter(item => item.payMethod !== name);
    this.setState({ paidList: newPaidList });
  };

  handleAddProduct = product => {
    const { products } = this.state;
    if (!products.find(item => item._id === product._id)) {
      const stock = product.sellingPoint.find(item => (item.organizationUnitId = this.state.currentStock));
      let totalAmount;
      if (stock) {
        totalAmount = stock.amount;
      } else {
        totalAmount = 0;
      }
      products.push({
        ...product,
        amount: 0,
        totalAmount,
        unit: product.unit ? product.unit.name : '',
        importPrice: product.pricePolicy ? product.pricePolicy.sourcePrice : 0,
        discountPercent: 0,
        productId: product._id,
      });
      this.setState({ products });
    }
  };

  handleAddProductImport = product => {
    const { products } = this.state;
    if (!products.find(item => item._id === product._id)) {
      let description = '';
      if (product.isDescription) {
        description = product.description;
      }

      products.push({
        ...product,
        amount: 1,
        code: product.code || '',
        description,
        totalAmount: -1,
        unit: product.unit ? product.unit.name : '',
        importPrice: product.pricePolicy ? product.pricePolicy.sourcePrice : 0,
        discountPercent: 0,
        productId: product._id,
      });
      this.setState({ products });
    }
  };

  handleAddProductOfSale = sale => {
    const { products } = sale;

    const newProdcuts = products.map(product => ({
      ...product,
      amount: product.amount || 0,
      unit: product.nameUnit || '',
      importPrice: product.sourcePrice || 0,
      discountPercent: product.discount || 0,
      productId: product.productId,
    }));
    this.setState({ products: newProdcuts });
  };

  handleOnChangeValueProductSelect = (e, id, name) => {
    const { products } = this.state;

    const index = products.findIndex(item => item._id === id);
    // const (products[index])[name] = value;
    products[index][name] = e.target.value;
    this.setState({ products });
  };

  handleDeleteProductSelect = id => {
    let { products } = this.state;
    products = products.filter(item => item._id !== id);
    this.setState({ products });
  };

  handleClickHistory = event => {
    this.setState({ history: event.currentTarget });
  };

  handleClose = name => {
    this.setState({ [name]: null });
  };

  handleInputChange = newValue => newValue;

  handleChangeInput = (e, isDate) => {
    const name = isDate ? 'createdDate' : e.target.name;
    const value = isDate ? moment(e).format('YYYY-MM-DD') : e.target.value;
    this.setState({ [name]: value });
  };

  handleChange = name => e => {
    if (name === 'type') {
      this.setState({ products: [] });
    }
    this.setState({ [name]: e.target.value });
  };

  loadOptions = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    return fetch(`${api}?filter%5Bname%5D%5B%24regex%5D=${newValue}&filter%5Bname%5D%5B%24options%5D=gi`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myJson => {
        const { data } = myJson;
        callback(
          data.map(item => ({
            ...item,
            value: item._id,
            avatar: item.avatar || item.logo,
          })),
        );
      });
  };

  loadOptionsStock = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    return fetch(
      `${api}?filter%5B%24or%5D%5B0%5D%5Btype%5D=salePoint&filter%5B%24or%5D%5B1%5D%5Btype%5D=stock&filter%5B%24text%5D%5B%24search%5D=${newValue}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then(response => response.json())
      .then(myJson => {
        callback(
          myJson.map(item => ({
            ...item,
            value: item._id,
          })),
        );
      });
  };

  loadFindOption = () => {
    const { type } = this.state;
    let api = '';
    let functionHandle = this.handleAddSale;
    switch (type) {
      case 0:
        api = API_SALE;
        functionHandle = this.handleAddProductOfSale;
        break;
      case 1:
        api = API_ADD_NEW_PRODUCT;
        functionHandle = this.handleAddProductImport;
        break;
      case 2:
        api = API_ADD_NEW_PRODUCT;
        functionHandle = this.handleAddProduct;
        break;
      case 3:
        api = API_ADD_NEW_PRODUCT;
        functionHandle = this.handleAddProductImport;
        break;
      case 4:
        api = API_ADD_NEW_PRODUCT;
        functionHandle = this.handleAddProduct;
        break;
      default:
        api = API_ADD_NEW_PRODUCT;
        functionHandle = this.handleAddProduct;
        break;
    }
    return (
      <AsyncSelect
        className={this.props.classes.reactSelect}
        placeholder="Tìm kiếm  ..."
        loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, api)}
        loadingMessage={() => 'Đang tải ...'}
        components={{ Option, SingleValue }}
        // onBlur={() => field.onBlur({ value: field.value })}
        onChange={functionHandle}
        // inputValue={value}
        theme={theme => ({
          ...theme,
          spacing: {
            ...theme.spacing,
            controlHeight: '55px',
          },
        })}
      />
    );
  };

  handleChangeCheck = name => event => {
    this.setState({ [name]: event.target.checked });
  };
}

const Option = props => (
  <components.Option {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start', zIndex: 100 }}>
      <Avatar src={`${props.data.avatar}?allowDefault=true`} />
      <div style={{ marginTop: 10, marginLeft: 20 }}>{props.data.name}</div>
    </div>
  </components.Option>
);

const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Avatar style={{ height: 30, width: 30 }} src={props.data.avatar} />
      <div style={{ marginTop: 5, marginLeft: 20 }}>{props.data.name}</div>
    </div>
  </components.SingleValue>
);

AddImportProduct.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addImportProduct: makeSelectAddImportProduct(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetCRMSource: () => {
      dispatch(getCRMSourceAct());
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onCreateOrder: body => {
      dispatch(createOrderAct(body));
    },
    onGetOrder: id => {
      dispatch(getOrderUpdateAct(id));
    },
    onChangeStock: id => {
      dispatch(changeStockAct(id));
    },
    onGetProductBySupplier: (body, params) => {
      dispatch(getProductBySupplierAct(body, params));
    },
    onGetProductById: body => {
      dispatch(getProductByIdAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNotiAct());
    },
    onUpdateOrder: body => {
      dispatch(updateOrderAct(body));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addImportProduct', reducer });
const withSaga = injectSaga({ key: 'addImportProduct', saga });

export default compose(
  withReducer,
  injectIntl,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddImportProduct);
