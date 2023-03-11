/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/**
 *
 * AddExportStockPage
 *
 */

import React from 'react'; /*  */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from/*  */ 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux'; /*  */
import {
  Grid,
  TextField /*  */,
  Paper,
  MenuItem,
  withStyles,
  Button /*  */,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell /*  */,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { FileUpload } from 'components/LifetekUi';
import moment from 'moment';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import NumberFormat from 'react-number-format';
import { Cancel, Delete, Close } from '@material-ui/icons'; // Done, Add
import { injectIntl } from 'react-intl';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddExportStockPage, { makeSelectHocTable } from './selectors';
import reducer from './reducer';
import saga from './saga';
import CustomAppBar from 'components/CustomAppBar';
import { viewConfigCheckForm } from 'utils/common';

import TextFieldCode from '../../components/TextFieldCode';
import { changeSnackbar, changeStockAct } from '../Dashboard/actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import { serialize } from '../../utils/common';
import { requestApprove } from '../../utils/request';
import {
  API_ADD_NEW_PRODUCT,
  API_APPROVE_GROUPS,
  API_SUPPLIERS,
  API_CUSTOMERS,
  API_STOCK_IMPORT,
  API_SALE,
  GET_CONTRACT,
  API_UNIT_STOCK,
} from '../../config/urlConfig';
import styles from './styles';
import { getProductBySupplierAct, getProductByIdAct, resetNotiAct, createExportRecordAct, getOrderByIdAct, updateOrderExportAct } from './actions';
import CustomDatePicker from '../../components/CustomDatePicker';
import messages from './messages';
import makeSelectDashboardPage, { makeSelectMiniActive } from 'containers/Dashboard/selectors';
import { AsyncAutocomplete } from '../../components/LifetekUi';

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
export class AddExportStockPage extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }

  state = {
    toStock: '',
    name: '',
    code: undefined,
    discount: 0,
    discountPercent: 0,
    payMethod: 0,
    paymentAmount: 0,
    total: 0,
    note: '',
    supplier: null,
    customer: null,
    type: 0, // 0 đơn đặt hàng, 1 đặt hàng PO, 2 nhập hàng, 3 Chuyển kho,
    contractStage: '',
    products: [],
    paidList: [],
    allStock: [],
    createdDate: moment().format('YYYY-MM-DDTHH:mm'),
    implementationDate: moment().format('YYYY-MM-DDTHH:mm'),
    open: false,
    criteria: 0,
    isDeleteProductsSelected: false,
    isEditPage: false,
    remaining: 0,
    change: false,
    typeOfReturn: 0,
    choose: null,
    isQuickImport: false,
    salesQuotation: {},
    stockImport: {},
    contract: {},
    supplierList: [],
    customerList: [],
    contractDeliveryList: [],
    isFinish: false,
    isApproved: false,
    groupApproved: null,
    groupSelected: null,
    dynamicForms: '',
    state: 0,
    employee: '',
    unitData: [],
    contractInfo: ''
  };

  componentWillMount() {
    if (this.props.id ? this.props.id : this.props.match.params.id) {
      this.state.orderId = this.props.id ? this.props.id : this.props.match.params.id;
      this.props.onGetOrder(this.props.id ? this.props.id : this.props.match.params.id);
      this.state.isEditPage = true;

    }
  }

  componentDidMount() {
    this.loadOptionsFirst(API_SUPPLIERS, 'supplierList');
    this.loadOptionsFirst(API_CUSTOMERS, 'customerList');
    fetch(API_UNIT_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({ unitData: data })
        // console.log(data, 'datadata');
      }).catch()
    // if (!this.props.hocTable.dynamicForms) {
    //   this.props.history.push('/StockExport');
    // }
  }

  componentWillReceiveProps(props) {
    if (props.dashboardPage.profile && props.dashboardPage.profile.workingOrganization && props.dashboardPage.profile.workingOrganization._id) {
      if (!this.state.isEditPage) {
        this.state.toStock = props.dashboardPage.profile.workingOrganization._id;
      }
    }
    if (this.state.type !== 1 && this.state.type !== 3 && this.state.products && this.state.products.length > 0 && this.state.change) {
      const list = props.addExportStockPage.productListById || [];
      if (list.length > 0 && this.state.products.length > 0) {
        // eslint-disable-next-line react/no-access-state-in-setstate
        const newList = this.state.products.map(item => {
          const x = list.find(n => n._id === item.productId);
          item.description = '';
          if (x && x.isDescription) {
            item.description = x.description;
          }
          item.code = '';
          item.unit = '';
          let totalAmount = 0;
          if (x) {
            if (item.importPrice === 0 && this.state.type === 2) {
              item.importPrice = x.pricePolicy ? x.pricePolicy.sourcePrice : 0;
            } else if (item.importPrice === 0) {
              item.importPrice = x.pricePolicy ? x.pricePolicy.costPrice : 0;
            }
            item.code = x.code || '';
            item.unit = x.unit ? x.unit.name : '';
            const stock = x.sellingPoint.find(a => a.organizationUnitId === this.props.dashboardPage.profile.workingOrganization._id);
            if (stock) {
              totalAmount = stock.amount;
            } else {
              totalAmount = 0;
            }
          }
          item.discountPercent = item.discountPercent ? item.discountPercent : 0;
          item.totalAmount = totalAmount;
          return item;
        });
        this.setState({ products: newList });
      }
      this.state.change = false;
    }
    if ((this.state.type === 1 || (this.state.type === 2 && this.state.typeOfReturn === 1)) && !this.state.isEditPage && this.state.isQuickImport) {
      let product = [];
      const productList = props.addExportStockPage.productList || [];
      if (this.state.isDeleteProductsSelected) {
        product = [];
      } else if (this.state.products.length < productList.length) {
        product = this.state.products;
      }
      productList.forEach(item => {
        const x = item.sellingPoint.find(n => {
          if (this.props.dashboardPage.profile.workingOrganization._id === n.organizationUnitId) return true;
        });
        if (x) {
          if (this.state.criteria === 0) {
            if (x.miximumSell !== null && x.miximumSell !== 0) {
              if (x.amount < x.miximumSell) {
                if (this.state.type === 2) {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: x.amount || 0,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.sourcePrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                } else {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: x.amount || 0,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.costPrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                }
              }
            } else if (item.otherInfo && item.otherInfo.limitOrder !== null) {
              if (x.amount < item.otherInfo.limitOrder) {
                if (this.state.type === 2) {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: x.amount || 0,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.sourcePrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                } else {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: x.amount || 0,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.costPrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                }
              }
            }
          } else if (this.state.criteria === 1) {
            if (x.maximumLimit !== null && x.maximumLimit !== 0) {
              if (x.amount > x.maximumLimit) {
                if (this.state.type === 2) {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: x.amount || 0,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.sourcePrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                } else {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: x.amount || 0,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.costPrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                }
              }
            } else if (item.otherInfo && item.otherInfo.maximumLimit !== null) {
              if (x.amount > item.otherInfo.maximumLimit) {
                if (this.state.type === 2) {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: x.amount || 0,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.sourcePrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                } else {
                  product.push({
                    ...item,
                    amount: 1,
                    totalAmount: x.amount || 0,
                    unit: item.unit ? item.unit.name : '',
                    importPrice: item.pricePolicy ? item.pricePolicy.costPrice : 0,
                    discountPercent: 0,
                    productId: item._id,
                  });
                }
              }
            }
          } else if (this.state.type === 2) {
            product.push({
              ...item,
              amount: 1,
              totalAmount: x.amount || 0,
              unit: item.unit ? item.unit.name : '',
              importPrice: item.pricePolicy ? item.pricePolicy.sourcePrice : 0,
              discountPercent: 0,
              productId: item._id,
            });
          } else {
            product.push({
              ...item,
              amount: 1,
              totalAmount: x.amount || 0,
              unit: item.unit ? item.unit.name : '',
              importPrice: item.pricePolicy ? item.pricePolicy.costPrice : 0,
              discountPercent: 0,
              productId: item._id,
            });
          }
        }
      });
      this.setState({ products: product, isQuickImport: false });
    }
    if (this.state.isEditPage && props.addExportStockPage !== this.props.addExportStockPage && props.addExportStockPage.order) {
      const {
        createdDate,
        implementationDate,
        name,
        code,
        products,
        supplier,
        customer,
        discount,
        discountPercent,
        paidList,
        note,
        type,
        total,
        fromStock,
        employee,
        toStock,
        typeOfReturn,
        salesQuotation,
        stockImport,
        state,
        contract,
      } = props.addExportStockPage.order;
      if (this.state.isEditPage && props.addExportStockPage.order !== this.props.addExportStockPage.order) {
        if (type !== 3) {
          this.props.onChangeStock(fromStock && fromStock.organizationUnitId);
        }
        if (this.state.isEditPage) {
          this.state.choose = {};
          this.state.type = type;
          if (type === 2) {
            this.state.typeOfReturn = typeOfReturn;
          }
          if (type === 0 && salesQuotation) {
            this.state.choose.name = salesQuotation.name;
            this.state.choose._id = salesQuotation.salesQuotationId;
          }
          if ((type === 4 || type === 2) && stockImport) {
            this.state.choose.name = stockImport.name;
            this.state.choose._id = stockImport.stockImportId;
          }
          if (type === 5 && contract) {
            this.state.choose._id = contract.contractId;
            this.state.contractStage = contract.contractStage;
          }
        }
        if (
          this.state.isEditPage &&
          props.addExportStockPage.order &&
          props.addExportStockPage.order !== this.props.addExportStockPage.order &&
          products &&
          products.length > 0
        ) {
          const listId = products.map(item => item.productId);
          const params = {
            filter: {
              _id: { $in: listId },
            },
          };
          this.props.onGetProductById(serialize(params));
        }
        if (
          this.state.isEditPage &&
          props.addExportStockPage.order &&
          props.addExportStockPage.order !== this.props.addExportStockPage.order &&
          (type === 4 || type === 0)
        ) {
          const token = localStorage.getItem('token');
          fetch(
            `${stockImport ? API_STOCK_IMPORT : salesQuotation ? API_SALE : ''}/${stockImport ? stockImport.stockImportId : salesQuotation ? salesQuotation.salesQuotationId : ''
            }`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
            .then(response => response.json())
            .then(myJson => {
              const newProducts = myJson.products;
              const newDeliList = products.map(item => {
                const x = newProducts.find(n => n.productId === item.productId);
                if (x) {
                  item.totalDelivery = Number(x.amount) || 0;
                  item.exported = Number(x.exported) || 0;
                }
                item.discountPercent = item.discountPercent === '' ? 0 : item.discountPercent;
                return item;
              });
              this.setState({ products: newDeliList });
            });
        }
        if (
          this.state.isEditPage &&
          props.addExportStockPage.order &&
          props.addExportStockPage.order !== this.props.addExportStockPage.order &&
          type === 5
        ) {
          const token = localStorage.getItem('token');
          fetch(`${GET_CONTRACT}/${contract.contractId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(response => response.json())
            .then(myJson => {
              this.state.choose.name = myJson.name;
              this.state.contractDeliveryList = myJson.deliverimentRequest ? myJson.deliverimentRequest : [];
              if (myJson.deliverimentRequest && myJson.deliverimentRequest.length > 0) {
                const currentStage = myJson.deliverimentRequest.find(id => String(id._id) === String(contract.contractStage));
                if (currentStage) {
                  const newProducts = currentStage.products;
                  const newDeliList = products.map(item => {
                    const x = newProducts.find(n => n.productId === item.productId);
                    if (x) {
                      item.totalDelivery = Number(x.amount);
                      item.exported = x.exported ? Number(x.exported) : 0;
                    }
                    return item;
                  });
                  this.setState({ products: newDeliList });
                }
              }
            });
        }
        let isApproved = false;
        let isFinish = false;
        if (Number(state) === 4) {
          isFinish = false;
        } else if (Number(state) === 3) {
          isFinish = true;
          isApproved = false;
        } else if (Number(state) === 0 || Number(state) === 1 || Number(state) === 2) {
          isFinish = true;
          isApproved = true;
        }
        this.setState({
          name,
          code,
          supplier,
          customer,
          discount,
          discountPercent,
          paidList,
          salesQuotation,
          stockImport,
          contract,
          note,
          total,
          isFinish,
          isApproved,
          employee: employee || '',
          toStock: type === 3 ? toStock.organizationUnitId : '',
          createdDate: moment(createdDate).format('YYYY-MM-DDTHH:mm'),
          implementationDate: moment(implementationDate).format('YYYY-MM-DDTHH:mm'),
          state: 0,
        });
      }
      if (this.state.isEditPage && props.addExportStockPage.order) {
        const list = props.addExportStockPage.productListById || [];
        if (list.length > 0 && products && products.length > 0) {
          const newList = products.map(item => {
            const x = list.find(n => n._id === item.productId);
            item.description = '';
            if (x && x.isDescription) {
              item.description = x.description;
            }
            item.code = '';
            let totalAmount = 0;
            if (x) {
              item.code = x.code || '';
              const stock = x.sellingPoint.find(a => a.organizationUnitId === fromStock.organizationUnitId);
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
    }
  }

  componentDidUpdate(props) {
    if (props.addExportStockPage.successCreate) {
      if (this.props.id) return;
      this.props.history.push('/StockExport');
      this.props.onResetNoti();
    }
  }

  render() {
    const id = this.props.match.params.id;
    const { classes, addExportStockPage, intl, dashboardPage, miniActive } = this.props;
    const { allTemplates } = dashboardPage;
    const moduleTemplates = (allTemplates || []).filter(t => t.moduleCode === 'StockExport');
    const { discount, discountPercent, paymentAmount, name, code, note, paidList } = this.state;
    let totalItems = 0; // tổng số lượng hàng
    let totalProducts = 0; // tổng số mặt hàng
    this.state.total = 0;
    let totalBack = 0;
    this.state.remaining = this.state.total;
    this.state.total -= discount;
    const crmSource = JSON.parse(localStorage.getItem('crmSource'));
    const payMethod = crmSource.find(item => item.code === 'S17');
    let paidAmount = 0;
    if (paidList.length > 0) {
      paidList.forEach(item => (paidAmount += Number(item.amount)));
    }
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    return (
      <div>
        <AppBar className={classes.HearderappBarStockEx} style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260 }}>
          <Toolbar>
            <IconButton
              className={classes.BTNStockEx}
              color="inherit"
              variant="contained"
              onClick={() => this.props.history.goBack()}
              aria-label="Close"
            >
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
              {addStock === 'add'
                ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới xuất kho' })}`
                : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật xuất kho' })}`}
              {/* {intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới' })} */}
            </Typography>
            {/* {showButtonEx()} */}

            <Button
              onClick={() => {
                // this.submitBtn.current.click();
                this.handleSubmitForm();
              }}
              variant="outlined"
              color="inherit"
            >
              {/* <Done style={{ marginRight: '5px' }} /> */}
              {this.state.isFinish ? 'Tạo yêu cầu xuất kho' : 'Lưu'}
            </Button>
          </Toolbar>
        </AppBar>
        <Helmet>
          <title>{this.state.isEditPage ? 'Chỉnh sửa xuất kho' : 'Thêm mới xuất kho'}</title>
          <meta name="description" content="Description of AddExportStockPage" />
        </Helmet>
        {addExportStockPage.loading ? <LoadingIndicator /> : null}
        <Grid container spacing={24} style={{ marginTop: '10px' }}>
          <Grid md={8} item>
            <Paper className={classes.paper}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* {this.loadFindOption()} */}
                {this.state.type === 0 ? <AsyncAutocomplete value="" onChange={po => this.handleAddPOImport(po)} url={API_SALE} /> : null}
                {this.state.type === 1 ? (
                  <AsyncAutocomplete value="" onChange={product => this.handleAddProductImport(product)} url={API_ADD_NEW_PRODUCT} />
                ) : null}
                {/* {this.state.type === 2 ? (
                  <AsyncAutocomplete value="" onChange={product => this.handleAddProductImport(product)} url={API_ADD_NEW_PRODUCT} />
                ) : null} */}
                {this.state.type === 2 && this.state.typeOfReturn === 0 ? (
                  <AsyncAutocomplete value="" onChange={po => this.handleAddPOImport(po)} url={API_STOCK_IMPORT} />
                ) : null}
                {this.state.type === 2 && this.state.typeOfReturn === 1 ? (
                  <AsyncAutocomplete value="" onChange={product => this.handleAddProductImport(product)} url={API_ADD_NEW_PRODUCT} />
                ) : null}
                {this.state.type === 3 ? (
                  <AsyncAutocomplete value="" onChange={product => this.handleAddProductImport(product)} url={API_ADD_NEW_PRODUCT} />
                ) : null}
                {this.state.type === 4 ? <AsyncAutocomplete value="" onChange={po => this.handleAddPOImport(po)} url={API_STOCK_IMPORT} /> : null}
                {this.state.type === 5 ? <AsyncAutocomplete value="" onChange={po => this.handleAddPOImport(po)} url={GET_CONTRACT} /> : null}
                <TextField
                  // label="Loại"
                  name="type"
                  select
                  disabled={this.state.isEditPage}
                  value={this.state.type}
                  onChange={this.handleChange('type')}
                  // InputLabelProps={{
                  //   shrink: true,
                  // }}
                  variant="outlined"
                  style={{ width: '20%', padding: '7px 8px' }}
                  color="primary"
                >
                  <MenuItem value={0}>Xuất theo đơn hàng</MenuItem>
                  <MenuItem value={1}>Xuất hàng trực tiếp</MenuItem>
                  <MenuItem value={2}>Trả hàng</MenuItem>
                  <MenuItem value={3}>Yêu cầu chuyển kho</MenuItem>
                  <MenuItem value={4}>Xuất hàng theo lô</MenuItem>
                  <MenuItem value={5}>Xuất hàng theo hợp đồng</MenuItem>
                </TextField>
                {this.state.type === 2 ? (
                  <TextField
                    // label="Loại"
                    name="typeOfReturn"
                    select
                    disabled={this.state.isEditPage}
                    value={this.state.typeOfReturn}
                    onChange={this.handleChange('typeOfReturn')}
                    // InputLabelProps={{
                    //   shrink: true,
                    // }}

                    variant="outlined"
                    style={{ width: '20%' }}
                    color="primary"
                  >
                    <MenuItem value={0}>Trả hàng theo đơn hàng</MenuItem>
                    <MenuItem value={1}>Trả hàng trực tiếp</MenuItem>
                  </TextField>
                ) : null}
              </div>
              <div style={{ display: 'flex' }}>
                {this.state.type === 5 && this.state.contractDeliveryList.length > 0 ? (
                  <TextField
                    label="Giai đoạn"
                    name="contractStage"
                    select
                    disabled={this.state.isEditPage}
                    value={this.state.contractStage}
                    onChange={this.handleChange('contractStage')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    style={{ width: '100%' }}
                    color="primary"
                    margin="normal"
                  >
                    {this.state.contractDeliveryList.map(item => (
                      <MenuItem value={item._id} key={item._id}>
                        Giao hàng ngày {moment(item.timeDelivery).format('DD-MM-YYYY')}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : null}
              </div>
            </Paper>
          </Grid>
          <Grid md={4} item>
            <Paper className={classes.paper} style={{ height: '97px' }}>
              <Grid container md={12} justify="center" alignContent="center" alignItems="center">
                {(this.state.type === 1 || (this.state.type === 2 && this.state.typeOfReturn === 1)) && !this.state.isEditPage ? (
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
                    <TableCell style={{ padding: '0 10px' }}>Tên sản phẩm</TableCell>
                    {this.state.type !== 3 ? (
                      <React.Fragment>
                        <TableCell style={{ padding: '0 10px' }}>Giá bán</TableCell>
                        {this.state.type === 0 || this.state.type === 4 || this.state.type === 5 ? (
                          <TableCell style={{ padding: '0 10px' }}>Đã xuất</TableCell>
                        ) : null}
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
                      // console.log(item, 'item');
                      const totalPrice = item.importPrice * item.amount - item.importPrice * item.amount * (item.discountPercent / 100);
                      this.state.total += totalPrice;
                      this.state.total -= this.state.total * (this.state.discountPercent / 100);
                      totalBack += totalPrice;
                      totalItems += parseInt(item.amount, 10) || 0;
                      totalProducts += 1;
                      // console.log(this.state.type, 'this.state.type');
                      return (
                        <TableRow key={item._id}>
                          <TableCell style={{ padding: '0 10px', width: '200px' }}>
                            <div>
                              <b style={{ fontSize: '16px' }}>{item.name}</b>
                              <br />
                              {`Mã sản phẩm: ${item.code}`}
                              <br />
                              {/* {console.log(55555, formatNumber(Number(item.totalAmount)))} */}
                              {/* {`Trong kho: ${item.totalAmount === 0 ? 0 : formatNumber(Number(item.totalAmount))}`} */}

                              {/* {`Trong kho: ${this.state.type === 3  || this.state.type === 1
                                ? (item.sellingPoint && item.sellingPoint[0] && item.sellingPoint[0].amount) || '0'
                                : this.state.type === 0 || this.state.type === 4 ? item.totalDelivery || '0' : item.totalAmount
                                }`} */}
                              {`Trong kho: ${item.sellingPoint === undefined ? item.amount : item.sellingPoint && item.sellingPoint[0] && item.sellingPoint[0].amount}`}
                              <br />
                              {`Mô tả: ${item.description || ''}`}
                            </div>
                          </TableCell>
                          {this.state.type !== 3 ? (
                            <React.Fragment>
                              <TableCell style={{ padding: '0 10px', width: '250px' }}>
                                <TextValidator
                                  onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'importPrice')}
                                  style={{ width: '100%' }}
                                  value={item.importPrice}
                                  disabled={Number(this.state.state) === 4}
                                  type="number"
                                  validators={[`minNumber:1`]}
                                  errorMessages={[`Không được nhỏ hơn hoặc bằng 0`]}
                                />
                              </TableCell>
                              {this.state.type === 0 || this.state.type === 4 || this.state.type === 5 ? (
                                <React.Fragment>
                                  <TableCell style={{ padding: '0 10px' }}>
                                    {`${item.exported === 0 ? 0 : formatNumber(item.exported)}/${formatNumber(
                                    item.totalDelivery,
                                  )}`}</TableCell>
                                  <TableCell style={{ padding: '0 10px', width: '200px' }}>
                                    <TextValidator
                                      onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                      style={{ width: '100%' }}
                                      value={item.amount}
                                      type="number"
                                      disabled={Number(this.state.state) === 4}
                                      validators={[
                                        `minNumber:0`,
                                        `${`maxNumber:${this.state.isEditPage === false
                                          ? item.totalDelivery - item.exported
                                          : item.totalDelivery - item.exported + item.amountBackup >= item.totalAmount
                                            ? item.totalAmount
                                            : item.totalDelivery - item.exported + item.amountBackup
                                        }`}`,
                                      ]}
                                      errorMessages={[
                                        `Không được nhỏ hơn 0`,
                                        `Giới hạn nhập ${this.state.isEditPage === false
                                          ? item.totalDelivery - item.exported
                                          : item.totalDelivery - item.exported + item.amountBackup >= item.totalAmount
                                            ? item.totalAmount
                                            : item.totalDelivery - item.exported + item.amountBackup
                                        }`,
                                      ]}
                                    />
                                  </TableCell>
                                </React.Fragment>
                              ) : (
                                <TableCell style={{ padding: '0 10px', width: '200px' }}>
                                  <TextValidator
                                    disabled={Number(this.state.state) === 4}
                                    onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                    style={{ width: '100%' }}
                                    value={item.amount}
                                    type="number"
                                    validators={[
                                      'minNumber:0',
                                      `${this.state.type === 2 ? `${Number(item.totalAmount) !== -1 ? `maxNumber:${item.totalDelivery}` : ''}` : ''}`,
                                    ]}
                                    errorMessages={[
                                      'Không được nhỏ hơn 0',
                                      `${this.state.type === 2 ? `${Number(item.totalAmount) !== -1 ? `Trong kho còn ${item.totalDelivery}` : ''}` : ''
                                      }`,
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
                              <TableCell style={{ padding: '0 10px' }}>
                                <TextValidator
                                  onChange={e => this.handleOnChangeValueProductSelect(e, item._id, 'amount')}
                                  style={{ width: '80%' }}
                                  value={item.amount}
                                  type="number"
                                  disabled={Number(this.state.state) === 4}
                                  validators={[
                                    'minNumber:0',
                                    // `${item.totalAmount !== -1 ? `maxNumber:${item.totalAmount}` : ''}`
                                    `${item.sellingPoint && item.sellingPoint[0] && item.sellingPoint[0].amount !== -1
                                      ? `maxNumber:${item.sellingPoint && item.sellingPoint[0] && item.sellingPoint[0].amount}`
                                      : ''
                                    }`,
                                  ]}
                                  errorMessages={[
                                    'Không được nhỏ hơn 0',
                                    `${item.sellingPoint && item.sellingPoint[0] && item.sellingPoint[0].amount !== -1
                                      ? `Số lượng trong kho hiện còn ${item.sellingPoint && item.sellingPoint[0] && item.sellingPoint[0].amount}`
                                      : ''
                                    }`,
                                  ]}
                                />
                              </TableCell>
                              <TableCell style={{ padding: '0 10px' }}>{item.unit}</TableCell>
                            </React.Fragment>
                          )}
                          {this.state.isEditPage || this.state.type === 5 ? null : (
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
                <FileUpload name={this.state.name} id={id} code="StockExport" />
              </Paper>
            </Grid>
            <Grid item md={4}>
              {this.state.type !== 3 ? (
                <Paper className={classes.paper}>
                  <Typography className={classes.typography} component="p">
                    Tổng số mặt hàng: <b>{totalProducts}</b>
                  </Typography>
                  <Typography className={classes.typography} component="p">
                    Tổng số lượng: <b>{totalItems}</b>
                  </Typography>
                  <Typography className={classes.typography}>
                    Người lập đơn:{' '}
                    <strong>
                      {this.state.isEditPage ? (this.state.employee ? this.state.employee.name : '') : this.props.dashboardPage.profile.name}
                    </strong>
                  </Typography>
                  {Number(this.state.type) !== 3 ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={this.state.isEditPage}
                          checked={this.state.isFinish}
                          onChange={this.handleChangeCheck('isFinish')}
                          value="isFinish"
                          color="primary"
                        />
                      }
                      label="Tạo yêu cầu xuất kho"
                    />
                  ) : null}
                  {this.state.isFinish === true ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.isApproved}
                          onChange={this.handleChangeCheck('isApproved')}
                          value="isApproved"
                          color="primary"
                          disabled={this.state.isEditPage}
                        />
                      }
                      label="Tạo yêu cầu phê duyệt"
                    />
                  ) : null}
                  {this.state.isFinish === true && this.state.isApproved === true && this.state.isEditPage === false ? (
                    <React.Fragment>
                      <Typography
                        style={{
                          color: 'grey',
                        }}
                      >
                        Nhóm phê duyệt
                      </Typography>
                      <AsyncSelect
                        className={this.props.classes.reactSelect}
                        placeholder="Tìm kiếm nhóm phê duyệt ..."
                        loadOptions={(newValue, callback) => this.loadOptionsNoDotData(newValue, callback, API_APPROVE_GROUPS)}
                        loadingMessage={() => 'Đang tải ...'}
                        components={{ Option, SingleValue }}
                        // onBlur={() => field.onBlur({ value: field.value })}
                        onChange={this.handleGroupApproved}
                        // inputValue={value}
                        isDisabled={this.state.isEditPage}
                        value={this.state.groupApproved}
                        theme={theme => ({
                          ...theme,
                          spacing: {
                            ...theme.spacing,
                            controlHeight: '55px',
                          },
                        })}
                      />
                      <TextField
                        label="Biểu mẫu phê duyệt"
                        name="dynamicForms"
                        select
                        disabled={this.state.isEditPage}
                        value={this.state.dynamicForms}
                        onChange={this.handleChange('dynamicForms')}
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        margin="normal"
                        variant="outlined"
                        style={{ width: '100%' }}
                        color="primary"
                      >
                        {moduleTemplates.map(item => (
                          <MenuItem value={item._id} key={item._id}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </TextField>
                    </React.Fragment>
                  ) : null}
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
                    code={9}
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

                  {this.state.type !== 2 ? (
                    <React.Fragment>
                      <Typography
                        style={{
                          color: 'grey',
                        }}
                      >
                        Khách hàng
                      </Typography>
                      <AsyncSelect
                        // className={this.props.classes.select}
                        placeholder="Tìm kiếm khách hàng ..."
                        loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_CUSTOMERS)}
                        loadingMessage={() => 'Đang tải ...'}
                        components={{ Option, SingleValue }}
                        // onBlur={() => field.onBlur({ value: field.value })}
                        onChange={this.handleCustomer}
                        defaultOptions={this.state.customerList}
                        // inputValue={value}
                        isDisabled={this.state.isEditPage || this.state.type === 0 || this.state.type === 5}
                        value={this.state.customer}
                        theme={theme => ({
                          ...theme,
                          spacing: {
                            ...theme.spacing,
                            controlHeight: '55px',
                          },
                        })}
                      />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
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
                        defaultOptions={this.state.supplierList}
                        onChange={this.handleSupplier}
                        // inputValue={value}
                        isDisabled={this.state.isEditPage || this.state.typeOfReturn === 0}
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
                      />
                      <TextValidator
                        label="Giảm giá đơn hàng"
                        value={discount}
                        variant="outlined"
                        name="discount"
                        margin="normal"
                        onChange={this.handleChange('discount')}
                        validators={['minNumber:0', `maxNumber:${totalBack || 0}`]}
                        errorMessages={['Số tiền không được nhỏ hơn 0', 'Không được vượt quá tổng tiền hóa đơn']}
                        style={{ width: '100%', zIndex: 0 }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
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
                      />
                      <Typography style={{ display: 'none' }}>
                        {this.state.paidList.length > 0 ? (this.state.remaining = this.state.total - Number(paidAmount)) : 0}
                      </Typography>
                      <Typography style={{ display: 'none' }}>
                        {this.state.paidList.length === 0 ? (this.state.remaining = this.state.total) : 0}
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
                      />

                      <div className={classes.payment}>
                        <TextField
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
                        variant="outlined"
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
                            <TableCell>{formatNumber(item.amount)}</TableCell>
                            <TableCell>
                              <Delete onClick={() => this.handleRemovePaid(item.payMethod)} style={{ cursor: 'pointer' }} color="secondary" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </Table>
                    </React.Fragment>
                  )}
                  <CustomDatePicker
                    label="Ngày tạo"
                    value={this.state.createdDate}
                    variant="outlined"
                    name="note"
                    disabled={Number(this.state.state) === 4}
                    margin="normal"
                    // onChange={this.handleChange('createdDate')}
                    onChange={e => this.handleChangeInput(e, true)}
                    style={{ width: '100%', zIndex: 0 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    top="20px"
                  />
                  <CustomDatePicker
                    label="Ngày giao hàng"
                    value={this.state.implementationDate}
                    variant="outlined"
                    name="note"
                    disabled={this.state.isEditPage}
                    margin="normal"
                    //onChange={this.handleChange('implementationDate')}
                    onChange={e => this.handleChangeInput(e, false)}
                    style={{ width: '100%', zIndex: 0 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    top="20px"
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
                </Paper>
              ) : (
                <Paper className={classes.paper}>
                  <Typography className={classes.typography} component="p">
                    Tổng số mặt hàng: <b>{totalProducts}</b>
                  </Typography>
                  <Typography className={classes.typography} component="p">
                    Tổng số lượng: <b>{totalItems}</b>
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
                    {this.props.dashboardPage.allStock &&
                      this.props.dashboardPage.allStock.map(item => (
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
                    top="20px"
                  />

                  <CustomDatePicker
                    label="Ngày giao hàng"
                    value={this.state.implementationDate}
                    onChange={e => this.handleChangeInput(e, false)}
                    variant="outlined"
                    name="note"
                    margin="normal"
                    //onChange={this.handleChange('implementationDate')}
                    style={{ width: '100%', zIndex: 0 }}
                    top="20px"
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
                        this.submitBtn.current.click();
                      }}
                      style={{ width: '100%' }}
                      variant="contained"
                      color="primary"
                    >
                      <Done style={{ marginRight: '5px' }} />
                    Hoàn thành
                  </Button> */}
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
            <Button onClick={this.handleCloseDialog} color="secondary" variant="outlined">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  handleSubmitForm = () => {
    const {
      type,
      name,
      code,
      products,
      supplier,
      customer,
      paidList,
      toStock,
      choose,
      createdDate,
      implementationDate,
      note,
      typeOfReturn,
      employee,
      contractStage,
      contractInfo
    } = this.state;
    
    const { dashboardPage } = this.props;
    const { allStock } = dashboardPage;
    let customerRaw;
    let supplierRaw;
    let billRaw;
    let stockImport;
    let contractRaw;
    if (products.length === 0) {
      this.props.onChangeSnackbar({ status: true, message: 'Sản phẩm không được để trống!', variant: 'error' });
      return;
    }
    const productsRaw = products.filter(it => {
      if (Number(it.amount) > 0) return true;
    });
    if (type === 2) {
      if (supplier === null) {
        this.props.onChangeSnackbar({ status: true, message: 'Nhà cung cấp không được để trống', variant: 'error' });
        return;
      }
      supplierRaw = supplier;
    } else if (type !== 3) {
      if (customer === null) {
        this.props.onChangeSnackbar({ status: true, message: 'Khách hàng không được để trống', variant: 'error' });
        return;
      }
      customerRaw = customer;
    }
    if (productsRaw.length === 0) {
      this.props.onChangeSnackbar({ status: true, message: 'Sản phẩm phải có số lượng lớn hơn 0!', variant: 'error' });
      return;
    }
    if (choose && !this.state.isEditPage) {
      if (type === 0) {
        billRaw = {
          salesQuotationId: choose._id,
          name: choose.name,
        };
      }
      if (type === 2 || type === 4) {
        stockImport = {
          stockImportId: choose._id,
          name: choose.name,
        };
      }
      console.log(choose, 'choose')
      if (type === 5) {
        contractRaw = {
          contractId: choose._id,
          contractStage,
          contractCode: choose.code,
          name: choose.name
        };
      }
    }
    if (this.state.isEditPage) {
      if (type === 0) {
        billRaw = this.state.salesQuotation;
      }
      if (type === 2 || type === 4) {
        stockImport = this.state.stockImport;
      }
      if (type === 5) {
        contractRaw = this.state.contract;
      }
    }
    // const employee = {
    //   employeeId: this.props.dashboardPage.profile._id,
    //   name: this.props.dashboardPage.profile.name,
    // };
    const x = allStock.find(item => item.id === this.props.dashboardPage.profile.workingOrganization._id);
    const fromStock = {
      organizationUnitId: x ? x.id : null,
      name: x ? x.name : null,
      code: x ? x.code : null,
    };
    let toStockRaw;
    if (type === 3) {
      const y = allStock.find(item => item.id === toStock);
      if (y) {
        toStockRaw = {
          organizationUnitId: y.id,
          name: y.name,
        };
      }
      if (String(toStock) === String(fromStock.organizationUnitId)) {
        this.props.onChangeSnackbar({ status: true, message: 'Hai kho giống nhau!', variant: 'error' });
        return;
      }
    }
    let typeOfReturnRaw;
    if (type === 2) {
      typeOfReturnRaw = typeOfReturn;
    }
    let employeeRaw;
    if (this.state.isEditPage) {
      employeeRaw = employee;
    } else {
      employeeRaw = {
        name: this.props.dashboardPage.profile ? this.props.dashboardPage.profile.name : '',
        employeeId: this.props.dashboardPage.profile ? this.props.dashboardPage.profile._id : '',
        code: this.props.dashboardPage.profile ? this.props.dashboardPage.profile.code : '',
      };
    }
    
    let groupApproved = {};
    let dynamicForms = '';
    if (this.state.isFinish === true && this.state.isApproved === true) {
      if (this.state.groupApproved === null) {
        this.props.onChangeSnackbar({ status: true, message: 'Bạn phải chọn nhóm phê duyệt!', variant: 'error' });
        return;
      }
      if (this.state.dynamicForms === '') {
        this.props.onChangeSnackbar({ status: true, message: 'Bạn phải chọn biểu mẫu phê duyệt!', variant: 'error' });
        return;
      }
      groupApproved = this.state.groupApproved;
      dynamicForms = this.state.dynamicForms;
    }
    let state = 0;
    if (this.state.isFinish === false) {
      state = 4;
    } else if (this.state.isApproved === false) {
      state = 3;
    }
    products.forEach(item => {
      if (item.exported) {
        delete item.exported;
      }
    });
    const { allTemplates } = dashboardPage;
    const moduleTemplates = (allTemplates || []).filter(t => t.moduleCode === 'StockExport');
    const body = {
      type,
      name,
      code,
      groupApproved,
      groupSelected: this.state.groupSelected,
      dynamicForms,
      state,
      // isFinished: !this.state.isFinish,
      // isApproved: !this.state.isApproved,
      supplier: supplierRaw,
      customer: customerRaw,
      typeOfReturn: typeOfReturnRaw,
      products,
      paidList,
      createdDate: new Date(createdDate),
      implementationDate: new Date(implementationDate),
      salesQuotation: billRaw,
      stockImport,
      contract: contractRaw,
      note,
      employee: employeeRaw,
      fromStock,
      toStock: toStockRaw,
      dynamicFormsList: moduleTemplates || this.props.hocTable.dynamicForms,
      contractInfo
    };
    const messages = viewConfigCheckForm('StockExport', body);
    console.log(messages, 'messages messages', body)
    if (Object.keys(messages).length === 0) {
      if (!this.state.isEditPage) {
        this.props.onCreate(body);
      } else {
        const { match } = this.props;
        body.id = match.params.id;
        this.props.onUpdate(body);
      }
    } else {
      let mess = ''
      for (const mes in messages) {
        if (!mess)
          mess = mess + `${messages[mes]}`
        else mess = mess + `, ${messages[mes]}`
      }
      this.props.onChangeSnackbar && this.props.onChangeSnackbar({ status: true, message: mess || 'Thêm dữ liệu thất bại', variant: 'error' });
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

  loadFindOption = () => {
    const { type, typeOfReturn } = this.state;
    let api = '';
    let functionHandle = this.handleAddSale;
    // console.log(type, "type")
    switch (type) {
      case 0:
        api = API_SALE;
        functionHandle = this.handleAddPOImport;
        break;
      case 1:
        api = API_ADD_NEW_PRODUCT;
        functionHandle = this.handleAddProductImport;
        break;
      case 2:
        api = API_ADD_NEW_PRODUCT;
        functionHandle = this.handleAddProductImport;
        break;
      case 3:
        api = API_ADD_NEW_PRODUCT;
        functionHandle = this.handleAddProductImport;
        break;
      case 4:
        api = API_STOCK_IMPORT;
        functionHandle = this.handleAddPOImport;
        break;
      case 5:
        api = GET_CONTRACT;
        functionHandle = this.handleAddPOImport;
        break;
      default:
        api = API_ADD_NEW_PRODUCT;
        functionHandle = this.handleAddProduct;
        break;
    }
    if (type === 2) {
      switch (typeOfReturn) {
        case 0:
          api = API_STOCK_IMPORT;
          functionHandle = this.handleAddPOImport;
          break;
        case 1:
          api = API_ADD_NEW_PRODUCT;
          functionHandle = this.handleAddProductImport;
          break;
        default:
          api = API_ADD_NEW_PRODUCT;
          functionHandle = this.handleAddProduct;
          break;
      }
    }
    return (
      <AsyncSelect
        className={this.props.classes.reactSelect}
        placeholder="Tìm kiếm ..."
        loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, api)}
        loadingMessage={() => 'Đang tải ...'}
        components={{ Option, SingleValue }}
        // onBlur={() => field.onBlur({ value: field.value })}
        isDisabled={this.state.isEditPage}
        onChange={functionHandle}
        value={this.state.choose}
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

  onSort = () => {
    const { supplier } = this.state;
    const params = {
      filter: {
        'supplier.supplierId': supplier.supplierId,
      },
    };
    this.props.onGetProductBySupplier(this.props.dashboardPage.profile.workingOrganization._id, serialize(params));
    this.setState({ open: false, isQuickImport: true });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleCloseDialog = () => {
    this.setState({ open: false });
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

  handleGroupApproved = value => {
    const groupApproved = {
      idGroupApproved: value._id,
      name: value.name,
    };
    this.setState({ groupApproved, groupSelected: value });
  };

  handleCustomer = value => {
    const customer = {
      customerId: value._id,
      name: value.name,
      avatar: value.avatar,
      code: value.code,
    };
    this.setState({ customer });
  };

  handleAddPaid = () => {
    const { paymentAmount, payMethod, paidList } = this.state;
    if (payMethod === 0) {
      return;
    }
    if (paymentAmount === 0) {
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
    this.state.remaining -= Number(paymentAmount);
    this.setState({ paidList });
  };

  handleRemovePaid = name => {
    const { paidList } = this.state;
    const newPaidList = paidList.filter(item => item.payMethod !== name);
    this.setState({ paidList: newPaidList });
  };

  handleAddProductImport = product => {
    const { products } = this.state;
    // console.log(666668, product);
    if (!products.find(item => item._id === product._id)) {
      const stock = product.sellingPoint.find(item1 => item1.organizationUnitId === this.props.dashboardPage.profile.workingOrganization._id);
      let totalAmount;
      if (stock) {
        totalAmount = stock.amount;
      } else {
        totalAmount = 0;
      }
      if (this.state.type === 2) {
        products.push({
          ...product,
          amount: 1,
          totalAmount,
          unit: product.unit ? product.unit.name : '',
          importPrice: product.pricePolicy ? product.pricePolicy.sourcePrice : 0,
          discountPercent: 0,
          productId: product._id,
        });
      } else {
        products.push({
          ...product,
          amount: 1,
          totalAmount,
          unit: product.unit ? product.unit.name : '',
          importPrice: product.pricePolicy ? product.pricePolicy.costPrice : 0,
          discountPercent: 0,
          productId: product._id,
        });
        // console.log('hihih', products);
      }
      this.setState({ products });
    }
  };

  handleAddPOImport = async (po) => {
    const { products } = po;
    console.log(po, 'nsjdnjv')
    const { unitData } = this.state;
    let newProdcuts = [];
    if (this.state.type !== 5) {
      if (this.state.type === 0) {
        console.log(products, "products1")
        newProdcuts = products.map(product => {
          let data = '';
          unitData.map(unitData => {
            if (unitData._id === product.unit) data = unitData.name;
          })
          return {
            ...product,
            amount: product.amount || 0,
            unit: product.nameUnit || data,
            importPrice: product.price || product.pricePolicy && product.pricePolicy.costPrice || 0,
            totalDelivery: product.amount || 0,
            exported: product.exported || 0,
            discountPercent: product.discount || 0,
            productId: product.productId,
          }
        });
        this.setState({ customer: po.customer ? po.customer : null });
      } else if (Number(po.productAmount) === Number(po.productExported)) {
        this.props.onChangeSnackbar({ status: true, message: 'Lô đã được xuất hết', variant: 'error' });
      } else {
        console.log(products, 'products2')
        newProdcuts = products.map(product => ({
          ...product,
          amount: product.amount - product.exported || 0,
          unit: product.unit || '',
          totalDelivery: product.amount || 0,
          exported: product.exported || 0,
          importPrice: product.importPrice || 0,
          discountPercent: product.discountPercent || 0,
          productId: product.productId,
        }));
      }
      const listId = products.map(item => item.productId);
      const params = {
        filter: {
          _id: { $in: listId },
        },
      };
      this.props.onGetProductById(serialize(params));
      if (this.state.type === 2 || this.state.type === 4) {
        this.props.onChangeStock(po.toStock.organizationUnitId);
      }
      this.setState({ products: newProdcuts, change: true, supplier: po.supplier, choose: po });
    } else if (po.deliverimentRequest.length === 0) {
      this.props.onChangeSnackbar({ status: true, message: 'Hợp đồng không có giai đoạn giao hàng', variant: 'error' });
      this.setState({ choose: null, contractDeliveryList: [], contractStage: '' });
    } else {
      let customer = ''
      await fetch(`${API_SALE}/${po.saleQuotation ? po.saleQuotation.saleQuotationId : ''}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => response.json())
        .then(myJson => {
          console.log(myJson, 'myJson')
          if (myJson) {
            customer = myJson.customer ? myJson.customer : null
            this.setState({ customer: myJson.customer ? myJson.customer : null });
          } else {
            this.props.onChangeSnackbar({ status: true, message: 'Đơn hàng của hợp đồng đã bị xóa!', variant: 'error' });
          }
        });
      if (po.customerId && !customer) {

        await fetch(`${API_CUSTOMERS}/${po.customerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(res => {
            console.log(res, "shdbvhb")
            customer = {
              customerId: res._id,
              name: res.name,
              avatar: res.avatar,
              code: res.code,
            };
          }).catch((err) => {
            console.log(err)
          })
        console.log(customer, 'customer')

        this.setState({
          customer,
          choose: po,
          contractDeliveryList: po.deliverimentRequest ? po.deliverimentRequest : [],
          contractStage: '',
          change: true,
          products: [],
        });

      }
      else {
        this.setState({
          choose: po,
          contractDeliveryList: po.deliverimentRequest ? po.deliverimentRequest : [],
          contractStage: '',
          change: true,
          products: [],
        });
      }

    }
  };

  loadOptionsNoDotData = (newValue, callback, api) => {
    // const token = localStorage.getItem('token');
    const url = `${api}?filter%5Bname%5D%5B%24regex%5D=${newValue}&filter%5Bname%5D%5B%24options%5D=gi`;
    return requestApprove(url, {}).then(myJson => {
      callback(
        myJson.map(item => ({
          ...item,
          value: item._id,
          // avatar: item.avatar || item.logo,
        })),
      );
    });
  };

  loadOptions = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    let url = `${api}?filter%5Bname%5D%5B%24options%5D=i&filter%5Bname%5D%5B%24regex%5D=${newValue}${api === API_STOCK_IMPORT
      ? '&filter%5Btype%5D%5B%24in%5D%5B0%5D=1'
      : api === GET_CONTRACT
        ? '&filter%5BtypeContract%5D%5B%24in%5D%5B0%5D=1&filter%5BcatalogContract%5D%5B%24in%5D%5B0%5D=1'
        : ''
      }`;
    if (this.state.type === 2 && this.state.typeOfReturn === 0) {
      url = `${api}?filter%5Btype%5D%5B%24in%5D%5B0%5D=0&filter%5Btype%5D%5B%24in%5D%5B1%5D=1&filter%5Btype%5D%5B%24in%5D%5B2%5D=2&filter%5Bname%5D%5B%24options%5D=i&filter%5Bname%5D%5B%24regex%5D=${newValue}`;
    }
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

  handleChange = name => e => {
    // console.log(77777, name);
    if (name === 'typeOfReturn' || name === 'type') {
      this.setState({ products: [] });
    }
    if (name === 'contractStage') {
      const x = this.state.contractDeliveryList.find(n => String(n._id) === e.target.value);
      // console.log(6666612, x);
      if (x) {
        const { products } = x;

        let contractInfo = {
          address: x.Address || '',
          company: x.company || ''
        }
        const newProdcuts = products.map(product => ({
          amount: Number(product.amount) - (product.exported ? Number(product.exported) : 0) || 0,
          unit: product.unit || '',
          totalDelivery: product.amount || 0,
          exported: product.exported || 0,
          importPrice: product.price || 0,
          discountPercent: 0,
          productId: product.productId,
          name: product.name,
          _id: product.productId,
          sellingPoint: product.sellingPoint
        }));
        console.log(products, 'products')
        const listId = products.map(item => item.productId || item._id);
        const params = {
          filter: {
            _id: { $in: listId },
          },
        };
        this.props.onGetProductById(serialize(params));
        console.log(newProdcuts, 'newProdcuts')
        this.setState({ products: newProdcuts, change: true, contractInfo });
      }
    }
    // console.log(e.target.value, 'e.target.value')
    this.setState({ [name]: e.target.value });
  };

  handleChangeInput = (e, isDate) => {
    const name = isDate ? 'createdDate' : 'implementationDate';
    const value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    this.setState({ [name]: value });
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

AddExportStockPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  addExportStockPage: makeSelectAddExportStockPage(),
  dashboardPage: makeSelectDashboardPage(),
  miniActive: makeSelectMiniActive(),
  hocTable: makeSelectHocTable(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetProductBySupplier: (body, params) => {
      dispatch(getProductBySupplierAct(body, params));
    },
    onGetProductById: body => {
      dispatch(getProductByIdAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNotiAct());
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onCreate: obj => {
      dispatch(createExportRecordAct(obj));
    },
    onChangeStock: id => {
      dispatch(changeStockAct(id));
    },
    onGetOrder: id => {
      dispatch(getOrderByIdAct(id));
    },
    onUpdate: id => {
      dispatch(updateOrderExportAct(id));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addExportStockPage', reducer });
const withSaga = injectSaga({ key: 'addExportStockPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddExportStockPage);
