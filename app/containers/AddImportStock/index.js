/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-unused-state */
/**
 *
 * addImportStock
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
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
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  DialogTitle,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
// import MenuS from '@material-ui/core/Menu';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import NumberFormat from 'react-number-format';
import { Cancel, Delete, Close } from '@material-ui/icons'; // Done, Add
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { injectIntl } from 'react-intl';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { FileUpload } from 'components/LifetekUi';
import TextFieldCode from '../../components/TextFieldCode';
import CustomAppBar from 'components/CustomAppBar';

// import makeSelectAddBillPage, { makeSelectDashboardPage } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styles from './styles';
import { serialize, convertDatetimeToDateForTextField } from '../../utils/common';
import { API_ADD_NEW_PRODUCT, API_SALE, API_SUPPLIERS, API_ORDER_PO, API_STOCK_EXPORT } from '../../config/urlConfig';
import makeSelectaddImportStock, { makeSelectDashboardPage } from './selectors';
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
import LoadingIndicator from '../../components/LoadingIndicator';
import CustomDatePicker from '../../components/CustomDatePicker';
import moment from 'moment';
import {AsyncAutocomplete} from '../../components/LifetekUi';
// import { getOrderAct } from '../AddContractPage/actions';
// import { getAllContractAct } from './actions';

function formatNumber(num) {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
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
export class addImportStock extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }

  state = {
    currentStock: '',
    toStock: '',
    name: '',
    code: undefined,
    discount: null,
    discountPercent: null,
    payMethod: 0,
    paymentAmount: null,
    total: 0,
    note: '',
    history: false,
    supplier: null,
    type: 0, // 0 đơn đặt hàng, 1 đặt hàng PO, 2 nhập hàng, 3 Chuyển kho,
    products: [],
    paidList: [],
    isFinished: true,
    orderId: undefined,
    allStock: [],
    createdDate: moment().format('YYYY-MM-DDTHH:mm'),
    open: false,
    criteria: 0,
    isDeleteProductsSelected: false,
    isEditPage: false,
    choosePO: {},
    remaining: 0,
    change: false,
    employee: '',
    orderPO: {},
    exportStock: {},
    supplierList: [],
    totalItems: 0,
    state: 0,
  };

  componentWillMount() {
    if (this.props.match.params.id) {
      this.state.orderId = this.props.match.params.id;
      this.props.onGetOrder(this.props.match.params.id);
      this.state.isEditPage = true;
    }
    // this.props.onGetCRMSource();
  }

  componentDidMount() {
    if (!this.state.currentStock && this.props.dashboardPage.currentStock)
      this.setState({ currentStock: this.props.dashboardPage.currentStock, allStock: this.props.dashboardPage.allStock });
    this.loadOptionsFirst(API_SUPPLIERS, 'supplierList');
  }

  componentDidUpdate(props) {
    if (props.addImportStock.successCreate) {
      this.props.history.push('/StockImport');
      this.props.onResetNoti();
    }
  }

  componentWillReceiveProps(props) {
    if (props.dashboardPage.currentStock !== '') {
      this.state.currentStock = props.dashboardPage.currentStock;
      if (!this.state.isEditPage && this.state.type !== 3) {
        this.state.toStock = props.dashboardPage.currentStock;
      }
      this.state.allStock = props.dashboardPage.allStock || [];
    }
    if (this.props.addImportStock !== props.addImportStock) {
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
        type,
        total,
        orderPO,
        exportStock,
        fromStock,
        employee,
        toStock,
        state,
      } = props.addImportStock.order;
      if (this.state.isEditPage) {
        this.state.type = type;
      }
      // console.log(props.addImportStock.order);
      if (this.state.type === 2 && !this.state.isEditPage) {
        let product = [];
        const productList = props.addImportStock.productList || [];

        if (this.state.isDeleteProductsSelected) {
          product = [];
        } else if (this.state.products.length < productList.length) {
          product = this.state.products;
        }
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
                    totalAmount: x.amount || 0,
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
                    totalAmount: x.amount || 0,
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
                    totalAmount: x.amount || 0,
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
                    totalAmount: x.amount || 0,
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
                totalAmount: x.amount || 0,
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
      if (this.state.isEditPage && props.addImportStock.order) {
        const list = props.addImportStock.productListById || [];
        if (list.length > 0 && products && products.length > 0) {
          const newList = products.map(item => {
            const x = list.find(n => n._id === item.productId);
            item.description = '';
            if (x && x.isDescription) {
              item.description = x.description;
            }
            if (x && x.catalog) {item.catalog = x.catalog;}
            
            item.code = '';

            let totalAmount = 0;
            if (x) {
              item.code = x.code || '';
              const stock = x.sellingPoint.find(a => a.organizationUnitId === toStock.organizationUnitId);
              if (stock) {
                totalAmount = stock.amount;
              } else {
                totalAmount = 0;
              }
            }
            item.discountPercent = item.discountPercent ? item.discountPercent : 0;
            item.totalAmount = totalAmount;
            item.amountBackup = item.amount;
            return item;
          });
          this.setState({ products: newList });
        }
      }
      if (this.state.type !== 2 && this.state.products && this.state.products.length > 0 && this.state.change) {
        const list = props.addImportStock.productListById || [];

        if (list.length > 0 && this.state.products.length > 0) {
          // eslint-disable-next-line react/no-access-state-in-setstate
          const newList = this.state.products.map(item => {
            const x = list.find(n => n._id === item.productId);
            item.description = '';
            if (x) {
              if (x.isDescription) {
                item.description = x.description;
              }
              item.catalog = x ? x.catalog : null;
              item.code = '';
              if (x) {
                item.code = x.code || '';
              }
              if (this.state.type === 0) {
                item.importPrice = x.pricePolicy ? x.pricePolicy.sourcePrice : 0;
              }
            }
            if (this.state.type !== 3) {
              let totalAmount = 0;
              if (x) {
                const stock = x.sellingPoint.find(a => a.organizationUnitId === this.state.currentStock);
                if (stock) {
                  totalAmount = stock.amount;
                } else {
                  totalAmount = 0;
                }
              }
              item.totalAmount = totalAmount;
            }
            item.discountPercent = item.discountPercent ? item.discountPercent : 0;
            return item;
          });

          this.setState({ products: newList });
        }
        this.state.change = false;
      }
      if (
        this.state.isEditPage &&
        props.addImportStock.order &&
        props.addImportStock.order !== this.props.addImportStock.order &&
        products &&
        products.length > 0
      ) {
        const listId = products.map(item => item.productId);
        console.log('listId', listId);
        const params = {
          filter: {
            _id: { $in: listId },
          },
        };
        this.props.onGetProductById(serialize(params));
      }
      if (this.state.isEditPage && props.addImportStock.order && props.addImportStock.order !== this.props.addImportStock.order && type === 1) {
        const token = localStorage.getItem('token');
        fetch(`${API_ORDER_PO}/${orderPO && orderPO.orderPOId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(response => response.json())
          .then(myJson => {
            const newProducts = myJson.products;
            const newDeliList = products.map(item => {
              const x = newProducts.find(n => n.productId === item.productId);
              if (x) {
                item.totalDelivery = x.amount;
                item.delivered = x.delivered;
              }
              item.discountPercent = item.discountPercent === '' ? 0 : item.discountPercent;
              return item;
            });
            this.setState({ products: newDeliList });
          });
      }
      if (this.state.isEditPage && code && props.addImportStock.order !== this.props.addImportStock.order) {
        if (type !== 3) {
          this.props.onChangeStock(toStock && toStock.organizationUnitId);
        }
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
          type,
          orderPO,
          exportStock,
          employee: employee || '',
          fromStock: fromStock ? fromStock.organizationUnitId : '',
          toStock: toStock ? toStock.organizationUnitId : '',
          createdDate: moment(createdDate).format('YYYY-MM-DDTHH:mm'),
          total,
          state,
        });
      }
    }
  }

  render() {
    const id = this.props.match.params.id;
    const { classes, addImportStock, intl } = this.props;
    const { discount, discountPercent, paymentAmount, name, code, note, paidList } = this.state;
    this.state.totalItems = 0; // tổng số lượng hàng
    let totalProducts = 0; // tổng số mặt hàng
    this.state.total = 0;
    let totalBack = 0;
    this.state.remaining = this.state.total;
    this.state.total -= discount;
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    const data = crmSource.find(item => item.code === 'S17');

    let paidAmount = 0;
    if (paidList && paidList.length > 0) {
      paidList.forEach(item => (paidAmount += Number(item.amount)));
    }
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    return (
      <div>
        <CustomAppBar
          title={
            addStock === 'add'
              ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới nhập kho' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật nhập kho' })}`
          }
          onGoBack={() => this.props.history.goBack()}
          onSubmit={() => {
            this.setState({ isFinished: true });
            this.submitBtn.current.click();
          }}
        />
        <Helmet>
          <title>{this.state.isEditPage ? 'Chỉnh sửa nhập kho' : 'Thêm mới nhập kho'}</title>
          <meta name="description" content="Create a new bill" />
        </Helmet>
        {addImportStock.loading ? <LoadingIndicator /> : null}
        <Grid style={{ display: 'flex', alignItems: 'stretch' }} container spacing={24}>
          <Grid md={8} item>
            <Paper className={classes.paper}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* {this.loadFindOption()} */}
                {this.state.type === 0 ? 
                 <AsyncAutocomplete value="" onChange={sale =>this.handleAddProductOfSale(sale)} url={API_SALE} />
                : null}
                {this.state.type === 1 ? 
                 <AsyncAutocomplete value="" onChange={sale =>this.handleAddProductOfPO(sale)} url={API_ORDER_PO} />
                : null}
                {this.state.type === 2 ? 
                 <AsyncAutocomplete value="" onChange={product =>this.handleAddProductImport(product)} url={API_ADD_NEW_PRODUCT} />
                : null}
                {this.state.type === 3 ? 
                 <AsyncAutocomplete value="" onChange={sale =>this.handleAddProductOfStock(sale)} url={API_STOCK_EXPORT} />
                : null}
                <TextField
                  // label="Loại"
                  name="type"
                  select
                  disabled={this.state.isEditPage}
                  value={this.state.type}
                  onChange={this.handleChange('type')}
                  variant="outlined"
                  style={{ width: '20%', padding: '7px 8px' }}
                  color="primary"
                >
                  <MenuItem value={0}>Nhập đơn hàng</MenuItem>
                  <MenuItem value={1}>Nhập hàng PO</MenuItem>
                  <MenuItem value={2}>Nhập hàng trực tiếp</MenuItem>
                  <MenuItem value={3}>Phê duyệt chuyển kho</MenuItem>
                </TextField>
              </div>
            </Paper>
          </Grid>
          {/* <Grid md={4} item>
            <Paper className={classes.paper} style={{ height: '97px' }}>
              <Grid container md={12} justify="center" alignContent="center" alignItems="center">
                {this.state.type === 2 && !this.state.isEditPage ? (
                  <Button className={classes.button} variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    Nhập nhanh
                  </Button>
                ) : (
                  ''
                )}
                <Button className={classes.button} onClick={() => this.props.history.goBack()} variant="outlined" color="secondary">
                  <Cancel style={{ marginRight: '5px' }} /> Hủy
                </Button>
              </Grid>
            </Paper>
          </Grid> */}
        </Grid>
        <ValidatorForm style={{ width: '100%', zIndex: 0, display: 'inline' }} onSubmit={this.handleSubmitForm}>
          <Grid spacing={24} container>
            <Grid item md={8}>
              <Paper className={classes.paper}>
                <Table>
                  <TableHead>
                    <TableCell style={{ padding: '0 10px' }}>Tên sản phẩm</TableCell>
                    {this.state.type !== 3 ? (
                      <React.Fragment>
                        <TableCell style={{ padding: '0 10px' }}>Giá nhập</TableCell>
                        {this.state.type === 1 ? <TableCell style={{ padding: '0 10px' }}>Đã nhập</TableCell> : null}
                        <TableCell style={{ padding: '0 10px' }}>Số lượng</TableCell>
                        <TableCell style={{ padding: '0 10px' }}>Đơn vị tính</TableCell>
                        <TableCell style={{ padding: '0 10px' }}>Chiết khấu</TableCell>
                        <TableCell style={{ padding: '0 10px' }}>Thành tiền</TableCell>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Đơn vị tính</TableCell>
                      </React.Fragment>
                    )}
                    {this.state.isEditPage ? null : <TableCell>Thao tác</TableCell>}
                  </TableHead>
                  <TableBody>
                    {this.state.products.map(item => {
                      // console.log(item,'itemitem');
                      const totalPrice = item.importPrice * item.amount - item.importPrice * item.amount * (item.discountPercent / 100);
                      this.state.total += totalPrice;
                      this.state.total -= this.state.total * (this.state.discountPercent / 100);
                      totalBack += totalPrice;
                      this.state.totalItems += parseInt(item.amount, 10) || 0;
                      totalProducts += 1;

                      return (
                        <TableRow key={item._id}>
                          <TableCell style={{ padding: '0 10px', width: '200px' }}>
                            <div>
                              <b style={{ fontSize: '16px' }}>{item.name}</b>
                              <br />
                              {`Mã sản phẩm: ${item.code === undefined ? '' : item.code}`}
                              <br />
                              {/* {`Trong kho: ${item.totalAmount === 0 ? 0 : formatNumber(Number(item.totalAmount))}`} */}
                              {`Trong kho: ${item.sellingPoint === undefined ? item.amount : item.sellingPoint && item.sellingPoint[0] && item.sellingPoint[0].amount}`}
                              <br />
                              {`Mô tả: ${item.description === undefined ? '' : item.description}`}
                            </div>
                          </TableCell>
                          {this.state.type !== 3 ? (
                            <React.Fragment>
                              <TableCell style={{ padding: '0 10px', width: '200px' }}>
                                <TextField
                                  onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'importPrice')}
                                  style={{ width: '80%' }}
                                  value={item.importPrice}
                                  type="number"
                                  disabled={Number(this.state.state) === 4}
                                />
                              </TableCell>
                              {this.state.type === 1 ? (
                                <TableCell style={{ padding: '0 10px' }}>{`${item.delivered === 0 ? 0 : formatNumber(item.delivered)}/${formatNumber(
                                  item.totalDelivery,
                                )}`}</TableCell>
                              ) : null}
                              {this.state.type === 3 ? (
                                <TableCell style={{ padding: '0 10px' }}>
                                  <TextValidator
                                    onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                    style={{ width: '100%' }}
                                    value={item.amount}
                                    type="number"
                                    disabled={Number(this.state.state) === 4}
                                    validators={['minNumber:0', `${item.totalAmount !== -1 ? `maxNumber:${item.totalAmount}` : ''}`]}
                                    errorMessages={[
                                      'Không được nhỏ hơn 0',
                                      `${item.totalAmount !== -1 ? `Số lượng trong kho hiện còn ${item.totalAmount}` : ''}`,
                                    ]}
                                  />
                                </TableCell>
                              ) : this.state.type === 1 ? (
                                <TableCell style={{ padding: '0 10px', width: '200px' }}>
                                  <TextValidator
                                    onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                    style={{ width: '100%' }}
                                    value={item.amount}
                                    disabled={Number(this.state.state) === 4}
                                    type="number"
                                    validators={[
                                      `minNumber:${
                                        this.state.isEditPage === false
                                          ? 0
                                          : item.amountBackup - item.amount > item.totalAmount
                                            ? item.totalAmount
                                            : 0
                                      }`,
                                      `${`maxNumber:${
                                        this.state.isEditPage === false
                                          ? item.totalDelivery - item.delivered
                                          : item.totalDelivery - item.delivered + item.amountBackup
                                      }`}`,
                                    ]}
                                    errorMessages={[
                                      `${this.state.isEditPage === false ? `Không được nhỏ hơn 0` : `Trong kho còn ${item.totalAmount}`}`,
                                      `Giới hạn nhập ${
                                        this.state.isEditPage === false
                                          ? item.totalDelivery - item.delivered
                                          : item.totalDelivery - item.delivered + item.amountBackup
                                      }`,
                                    ]}
                                  />
                                </TableCell>
                              ) : (
                                <TableCell style={{ padding: '0 10px', width: '200px' }}>
                                  <TextValidator
                                    onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                    style={{ width: '100%' }}
                                    value={item.amount}
                                    type="number"
                                    disabled={Number(this.state.state) === 4}
                                    validators={[
                                      `minNumber:${
                                        this.state.isEditPage === false
                                          ? 0
                                          : item.amountBackup - item.amount > item.totalAmount
                                            ? item.totalAmount
                                            : 0
                                      }`,
                                    ]}
                                    errorMessages={[
                                      `${this.state.isEditPage === false ? `Không được nhỏ hơn 0` : `Trong kho còn ${item.totalAmount}`}`,
                                    ]}
                                  />
                                </TableCell>
                              )}
                              <TableCell style={{ padding: '0 10px' }}>{item.unit}</TableCell>
                              <TableCell style={{ padding: '0 10px' }}>
                                <TextValidator
                                  onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'discountPercent')}
                                  style={{ width: '80%' }}
                                  value={item.discountPercent}
                                  disabled={Number(this.state.state) === 4}
                                  validators={['minNumber:0', 'maxNumber:100']}
                                  errorMessages={['Không được nhỏ hơn 0', 'Không được vượt quá 100']}
                                  InputProps={{
                                    inputComponent: NumberFormatCustom,
                                  }}
                                />
                                %
                              </TableCell>
                              <TableCell style={{ padding: '0 10px' }}>{formatNumber(totalPrice)}</TableCell>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              {this.state.type === 3 ? (
                                <TableCell style={{ padding: '0 10px' }}>
                                  <TextValidator
                                    disabled={Number(this.state.state) === 4}
                                    onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                    style={{ width: '80%' }}
                                    value={item.amount}
                                    type="number"
                                    validators={['minNumber:0', `${item.totalAmount !== -1 ? `maxNumber:${item.totalAmount}` : ''}`]}
                                    errorMessages={[
                                      'Không được nhỏ hơn 0',
                                      `${item.totalAmount !== -1 ? `Số lượng chuyển kho là ${item.totalAmount}` : ''}`,
                                    ]}
                                  />
                                </TableCell>
                              ) : (
                                <TableCell style={{ padding: '0 10px' }}>
                                  <TextValidator
                                    onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                    style={{ width: '80%' }}
                                    value={item.amount}
                                    disabled={Number(this.state.state) === 4}
                                    type="number"
                                    validators={['minNumber:0']}
                                    errorMessages={['Không được nhỏ hơn 0']}
                                  />
                                </TableCell>
                              )}
                              <TableCell style={{ padding: '0 10px' }}>{item.unit}</TableCell>
                            </React.Fragment>
                          )}
                          {this.state.isEditPage ? null : (
                            <TableCell>
                              <Fab color="secondary" size="small" onClick={() => this.handleDeleteProductSelect(item._id)}>
                                <Delete />
                              </Fab>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>

              <Paper>
                <FileUpload name={this.state.name} id={id} code="StockImport" />
              </Paper>
            </Grid>
            <Grid item md={4}>
              {this.state.type !== 3 ? (
                <Paper className={classes.paper}>
                  <Typography className={classes.typography} component="p">
                    Tổng số mặt hàng: <b>{totalProducts}</b>
                  </Typography>
                  <Typography className={classes.typography} component="p">
                    Tổng số lượng: <b>{this.state.totalItems}</b>
                  </Typography>
                  <Typography className={classes.typography}>
                    Người lập đơn:{' '}
                    <strong>
                      {this.state.isEditPage ? (this.state.employee ? this.state.employee.name : '') : this.props.dashboardPage.profile.name}
                    </strong>
                  </Typography>
                  <hr />
                  {/* <TextValidator
                    label="Mã"
                    disabled={this.state.isEditPage}
                    variant="outlined"
                    margin="normal"
                    name="code"
                    value={code}
                    style={{ width: '100%', zIndex: 0 }}
                    onChange={this.handleChange('code')}
                    validators={['required', 'trim', 'matchRegexp:^[A-Za-z0-9]+$']}
                    errorMessages={['Không được để trống', 'Không được điền khoảng trắng', 'Không được điền kí tự đặc biệt']}
                  /> */}
                  <TextFieldCode
                    label="Mã"
                    // disabled={this.state.isEditPage}
                    disabled
                    variant="outlined"
                    margin="normal"
                    name="code"
                    value={code}
                    style={{ width: '100%', zIndex: 0 }}
                    onChange={this.handleChange('code')}
                    code={10}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  <TextValidator
                    label="Tên"
                    variant="outlined"
                    margin="normal"
                    name="name"
                    value={name}
                    style={{ width: '100%', zIndex: 0 }}
                    onChange={this.handleChange('name')}
                    validators={['required', 'trim']}
                    errorMessages={['Không được để trống', 'Không được điền khoảng trắng']}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  <Typography
                    style={{
                      color: 'grey',
                    }}
                  >
                    Nhà cung cấp
                  </Typography>
                  <AsyncSelect
                    // className={this.props.classes.select}
                    placeholder="Tìm kiếm nhà cung cấp  ..."
                    loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_SUPPLIERS)}
                    loadingMessage={() => 'Đang tải ...'}
                    components={{ Option, SingleValue }}
                    // onBlur={() => field.onBlur({ value: field.value })}
                    onChange={this.handleSupplier}
                    // inputValue={value}
                    defaultOptions={this.state.supplierList}
                    isDisabled={this.state.type === 1 || this.state.isEditPage}
                    value={this.state.supplier}
                    theme={theme => ({
                      ...theme,
                      spacing: {
                        ...theme.spacing,
                        controlHeight: '55px',
                      },
                    })}
                  />
                  <TextValidator
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
                    InputLabelProps={{
                      shrink: true
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
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
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
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  <Typography style={{ display: 'none' }}>
                    {this.state.paidList && this.state.paidList.length > 0 ? (this.state.remaining = this.state.total - Number(paidAmount)) : 0}
                  </Typography>
                  <Typography style={{ display: 'none' }}>
                    {this.state.paidList && this.state.paidList.length === 0 ? (this.state.remaining = this.state.total) : 0}
                  </Typography>
                  <TextField
                    label="Số tiền nợ"
                    value={this.state.remaining}
                    variant="outlined"
                    margin="normal"
                    style={{ width: '100%', zIndex: 0 }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />

                  <div className={classes.payment}>
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
                      InputLabelProps={{
                        shrink: true
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
                      {data
                        ? data.data.map(item => (
                            <MenuItem value={item.title} key={item.value}>
                              {item.title}
                            </MenuItem>
                          ))
                        : null}
                    </TextField>
                  </div>
                  <Button
                    disabled={this.state.paymentAmount === '' || this.state.payMethod === 0 || parseInt(this.state.paymentAmount, 10) === 0}
                    variant="outlined"
                    color="primary"
                    onClick={this.handleAddPaid}
                  >
                    Thanh toán
                  </Button>
                  <hr />
                  <Table>
                    {this.state.paidList && this.state.paidList.length > 0
                      ? this.state.paidList.map(item => (
                          <TableRow>
                            <TableCell>{item.payMethod}</TableCell>
                            <TableCell>{formatNumber(item.amount)}</TableCell>
                            <TableCell>
                              <Delete onClick={() => this.handleRemovePaid(item.payMethod)} style={{ cursor: 'pointer' }} color="secondary" />
                            </TableCell>
                          </TableRow>
                        ))
                      : null}
                  </Table>
                  <CustomDatePicker
                    label="Ngày tạo"
                    value={this.state.createdDate}
                    variant="outlined"
                    disabled={Number(this.state.state) === 4}
                    name="note"
                    margin="normal"
                    onChange={e => this.handleChangeInput(e, true)}
                    style={{ width: '100%', zIndex: 0 }}
                  />
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
                    Tổng số mặt hàng: <b>{totalProducts}</b>
                  </Typography>
                  <Typography className={classes.typography} component="p">
                    Tổng số lượng: <b>{this.state.totalItems}</b>
                  </Typography>
                  <Typography className={classes.typography}>
                    Người lập đơn:{' '}
                    <strong>
                      {this.state.isEditPage ? (this.state.employee ? this.state.employee.name : '') : this.props.dashboardPage.profile.name}
                    </strong>
                  </Typography>
                  <hr />
                  <TextValidator
                    label="Mã"
                    variant="outlined"
                    // disabled={this.state.isEditPage}
                    disabled
                    margin="normal"
                    name="code"
                    value={code}
                    style={{ width: '100%', zIndex: 0 }}
                    onChange={this.handleChange('code')}
                    validators={['required', 'trim']}
                    errorMessages={['Không được để trống', 'Không được điền khoảng trắng']}
                  />
                  <TextValidator
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
                    label="Kho đi"
                    name="stock"
                    disabled
                    variant="outlined"
                    value={this.state.fromStock}
                    onChange={this.handleChange('fromStock')}
                    style={{
                      width: '100%',
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // helperText="Please select your currency"
                    margin="normal"
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
                  <TextField
                    id="standard-select-currency"
                    select
                    label="Kho tới"
                    name="stock"
                    disabled
                    variant="outlined"
                    value={this.state.toStock}
                    onChange={this.handleChange('toStock')}
                    style={{
                      width: '100%',
                    }}
                    // helperText="Please select your currency"
                    margin="normal"
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
                  <CustomDatePicker
                    label="Ngày tạo"
                    value={this.state.createdDate}
                    variant="outlined"
                    name="note"
                    margin="normal"
                    onChange={e => this.handleChangeInput(e, true)}
                    style={{ width: '100%', zIndex: 0 }}
                  />
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

              <div style={{ display: 'none' }}>
                <button ref={this.submitBtn} type="submit" />
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.isDeleteProductsSelected}
                  onChange={this.handleChangeCheck('isDeleteProductsSelected')}
                  value="isDeleteProductsSelected"
                  color="primary"
                />
              }
              label="Xóa các sản phẩm đã chọn"
            />
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
      discount,
      discountPercent,
      paidList,
      note,
      type,
      total,
      currentStock,
      allStock,
      toStock,
      fromStock,
      isFinished,
      createdDate,
      choosePO,
      remaining,
      employee,
      totalItems,
    } = this.state;
    
    const x = allStock.find(item => item.id === currentStock);
    let toStockRaw;
    if (x) {
      toStockRaw = {
        organizationUnitId: x.id,
        name: x.name,
      };
    }
    let fromStockRaw;
    if (type === 3) {
      const y = allStock.find(item => item.id === toStock);
      const z = allStock.find(item => item.id === fromStock);
      if (z) {
        fromStockRaw = {
          organizationUnitId: z.id,
          name: z.name,
        };
      }
      if (y) {
        toStockRaw = {
          organizationUnitId: y.id,
          name: y.name,
        };
      }
    }
    let orderPO;
    if (type === 1) {
      if (this.state.isEditPage) {
        orderPO = this.state.orderPO;
      } else {
        orderPO = {
          orderPOId: choosePO._id,
          name: choosePO.name,
        };
      }
    }
    if (supplier == null && type !== 3) {
      this.props.onChangeSnackbar({ status: true, message: 'Nhà cung cấp không được để trống', variant: 'error' });
      return;
    }
    // let { isFinished } = this.state;
    // if (type === 0) {
    //   let totalAmount = 0;
    //   paidList.forEach(item => (totalAmount += Number(item.amount)));
    //   if (total > totalAmount) isFinished = false;
    // }
    if (products.length === 0) {
      this.props.onChangeSnackbar({ status: true, message: 'Sản phẩm không được để trống', variant: 'error' });
      return;
    }
    let employeeRaw;
    if (this.state.isEditPage) {
      employeeRaw = employee;
    } else {
      employeeRaw = {
        name: this.props.dashboardPage.profile ? this.props.dashboardPage.profile.name : '',
        employeeId: this.props.dashboardPage.profile ? this.props.dashboardPage.profile._id : '',
      };
    }
    let exportStock;
    if (type === 3) {
      if (this.state.isEditPage) {
        exportStock = this.state.exportStock;
      } else {
        exportStock = {
          exportStockId: choosePO._id,
          name: choosePO.name,
        };
      }
    }
    const body = {
      name,
      code,
      products,
      supplier,
      orderPO,
      employee: employeeRaw,
      toStock: toStockRaw,
      fromStock: fromStockRaw,
      createdDate: new Date(createdDate),
      discount,
      discountPercent,
      paidList,
      exportStock,
      remaining: -Number(remaining),
      note,
      type,
      total,
      isFinished,
      productAmount: totalItems || 0,
    };
    if (supplier == null && type !== 3) {
      this.props.onChangeSnackbar({ status: true, message: 'Nhà cung cấp không đượcc để trống', variant: 'error' });
      return;
    }
    if (products.length === 0) {
      this.props.onChangeSnackbar({ status: true, message: 'Sản phẩm không được để trống', variant: 'error' });
      return;
    }
    if (this.state.isEditPage) {
      const { match } = this.props;
      body.id = match.params.id;
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
      code: value.code,
    };
    this.setState({ supplier });
  };

  handleAddPaid = () => {
    const { paymentAmount, payMethod, paidList } = this.state;
    if (payMethod === 0) {
      return;
    }
    if (paymentAmount === 0) {
      return;
    }
    // let amount = Number(paymentAmount);
    // paidList.forEach(item => (amount += Number(item.amount)));
    // if (amount > Number(total)) {
    //   this.props.onChangeSnackbar({ status: true, message: 'Số tiền thanh toán không được vượt quá tổng số tiền', variant: 'error' });
    //   return;
    // }
    if (paidList.findIndex(item => item.payMethod === payMethod) >= 0) {
      this.props.onChangeSnackbar({ status: true, message: 'Đã tồn tại phương thức thanh toán', variant: 'error' });
      return;
    }
    paidList.push({
      amount: paymentAmount,
      payMethod,
    });
    this.state.remaining -= Number(paymentAmount);
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
      const stock = product.sellingPoint.find(item1 => item1.organizationUnitId === this.state.currentStock);
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
      const stock = product.sellingPoint.find(item1 => item1.organizationUnitId === this.state.currentStock);
      let totalAmount;
      if (stock) {
        totalAmount = stock.amount;
      } else {
        totalAmount = 0;
      }
      products.push({
        ...product,
        amount: 1,
        totalAmount,
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
      importPrice: product.costPrice || 0,
      discountPercent: product.discount || 0,
      productId: product.productId,
    }));
    const listId = products.map(item => item.productId);
    const params = {
      filter: {
        _id: { $in: listId },
      },
    };
    this.props.onGetProductById(serialize(params));
    this.setState({ products: newProdcuts, change: true });
  };

  handleAddProductOfPO = sale => {
    if (Number(sale.productAmount) === Number(sale.quantityDelivered)) {
      this.props.onChangeSnackbar({ status: true, message: 'Đơn hàng đã được nhập hết', variant: 'error' });
    } else {
      const { products } = sale;
      const newProdcuts = products.map(product => ({
        ...product,
        amount: product.amount || 0,
        unit: product.unit || '',
        totalDelivery: product.amount || 0,
        delivered: product.delivered || 0,
        importPrice: product.importPrice || 0,
        discountPercent: product.discountPercent || 0,
        productId: product.productId,
      }));
      const listId = products.map(item => item.productId);
      const params = {
        filter: {
          _id: { $in: listId },
        },
      };
      this.props.onGetProductById(serialize(params));
      this.setState({ products: newProdcuts, choosePO: sale, supplier: sale.supplier, change: true });
    }
  };

  handleAddProductOfStock = sale => {
    if (sale.isImportedStock) {
      this.props.onChangeSnackbar({ status: true, message: 'Yêu cầu chuyển kho đã được nhập', variant: 'error' });
    } else {
      const { products } = sale;
      const newProdcuts = products.map(product => ({
        ...product,
        amount: product.amount || 0,
        unit: product.unit || '',
        totalAmount: product.amount || 0,
        productId: product.productId,
      }));
      const listId = products.map(item => item.productId);
      const params = {
        filter: {
          _id: { $in: listId },
        },
      };
      this.props.onGetProductById(serialize(params));
      this.setState({
        products: newProdcuts,
        choosePO: sale,
        change: true,
        toStock: sale.toStock.organizationUnitId,
        fromStock: sale.fromStock.organizationUnitId,
      });
    }
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

  handleChangeInput = e => {
    const name = 'createdDate';
    const value = moment(e).format('YYYY-MM-DD');
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
    const url = `${api}?filter%5Bname%5D%5B%24regex%5D=${newValue}&filter%5Bname%5D%5B%24options%5D=gi${
      api === API_STOCK_EXPORT ? '&filter%5Btype%5D=3' : ''
    }`;
    return fetch(url, {
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
      `${api}?filter%5B%24or%5D%5B0%5D%5Btype%5D=salePoint&filter%5B%24or%5D%5B1%5D%5Btype%5D=stock&filter%5Bname%5D%5B%24options%5D=i&filter%5Bname%5D%5B%24regex%5D=${newValue}`,
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

  loadOptionsFirst = (api, name) => {
    const token = localStorage.getItem('token');
    const url = `${api}?limit=10&skip=0`;
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(myJson => {
        const { data } = myJson;
        const list = data.map(item => ({
          ...item,
          value: item._id,
          avatar: item.avatar || item.logo,
        }));
        this.setState({ [name]: list });
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
        api = API_ORDER_PO;
        functionHandle = this.handleAddProductOfPO;
        break;
      case 2:
        api = API_ADD_NEW_PRODUCT;
        functionHandle = this.handleAddProductImport;
        break;
      case 3:
        api = API_STOCK_EXPORT;
        functionHandle = this.handleAddProductOfStock;
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
        isDisabled={this.state.isEditPage && this.state.type === 1}
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

addImportStock.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addImportStock: makeSelectaddImportStock(),
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

const withReducer = injectReducer({ key: 'addImportStock', reducer });
const withSaga = injectSaga({ key: 'addImportStock', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(addImportStock);
