/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-state */
/**
 *
 * AddBillPage
 *
 */

import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { combineReducers, compose } from 'redux';
import {
  Grid,
  TextField,
  Paper,
  MenuItem,
  withStyles,
  Button,
  Table,
  TableHead,
  AppBar,
  Toolbar,
  IconButton,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { FileUpload } from 'components/LifetekUi';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import NumberFormat from 'react-number-format';
import { Cancel, Done, Clear, Close } from '@material-ui/icons';
import AsyncSelect from 'react-select/async';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddBillPage, { makeSelectDashboardPage } from './selectors';
import reducer from './reducer';
import saga from './saga';
import LoadingIndicator from '../../components/LoadingIndicator';
import KanbanStepper from '../../components/KanbanStepper';
import messages from './messages';
import TextFieldCode from '../../components/TextFieldCode';
import styles from './styles';
import { serialize, convertDatetimeToDate, getLabelName } from '../../utils/common';
import { viewConfigCheckForm } from 'utils/common';
import { getAllContractAct, createBillAct, resetNotiAct, getBillByIdAct, updateBillAct, putDataBill } from './actions';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import CustomDatePicker from '../../components/CustomDatePicker';
import moment from 'moment';
import { SYS_CONF, API_UNIT_STOCK } from 'config/urlConfig';
import CustomAppBar from 'components/CustomAppBar';
import { fetchData } from '../../helper';

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
export class AddBillPage extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }

  state = {
    itemChoose: {},
    typeOfBill: 0,
    name: '',
    code: undefined,
    nameStaff: '',
    discount: 0,
    discountPercent: 0,
    payMethod: 0,
    paymentAmount: 0,
    agencyCode: null,
    total: 0,
    customer: {
      customerId: '',
      name: '',
    },
    remaining: 0,
    deliveryDate: date,
    orderDate: date,
    note: '',
    currentDelivery: 0,
    contractList: [],
    saleQuoList: [],
    arrToSearch: [],
    arrProduct: [],
    arrKanban: [],
    paymentMethod: [],
    paidList: [],
    deliveryList: [],
    POlist: [],
    kanbanStatus: 0,
    isEditPage: false,
    isSupplier: false,
    fieldAdded: [],
    billColumns: JSON.parse(localStorage.getItem('viewConfig'))
      .find(item => item.code === 'Bill')
      .listDisplay.type.fields.type.columns.map(item => ({ ...item, name: item.name.replace(/\./g, '_') })),
    localMessages: {},
    listUnit: []
  };

  componentWillMount() {
    const edittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));

    const params = {
      // filter: {
      //   catalogContract: 1,
      // },
    };
    if (edittingTrading) {
      if (Number(this.props.history.valueTab) !== 4) {
        params.filter['exchangingAgreement.exchangingAgreementId'] = edittingTrading._id;
      }
      this.state.typeOfBill = 1;
    }

    const paramsNew = serialize(params);
    this.props.onGetAllContract(paramsNew);
    const { match } = this.props;
    if (match.params.id) {
      this.props.onGetBillById(match.params.id);
    }
    if (window.location.pathname.split('/').includes('edit')) {
      this.state.isEditPage = true;
    } else {
      this.state.isEditPage = false;
    }
  }


  componentWillUnmount() {
    this.props.history.valueTab = undefined;
  }

  async componentDidMount() {
    this.getDataSysterm()
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.find(item => item.code === 'Bill');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
    const Data = await fetchData(API_UNIT_STOCK)
    console.log(Data, "sdjnvjsdnv")
    this.setState({ listUnit: Data || [] })
  }

  componentWillReceiveProps(props) {
    if (props.addBillPage) {
      const localMessages = viewConfigCheckForm('Bill', props.addBillPage);
      this.setState({
        localMessages,
      });
    }
    if (props !== this.props) {
      const { dashboardPage } = props;
      let nameStaff = '';
      if (dashboardPage.profile) {
        const { profile } = dashboardPage;
        nameStaff = profile.name;
      }
      this.setState({ nameStaff });
      const { addBillPage } = props;
      const allSaleQuo = addBillPage.allSaleQuo || [];
      const allPO = addBillPage.allPO || [];
      const allContract = addBillPage.allContract || [];
      let arrToSearch = [];
      if (!this.state.isEditPage) {
        arrToSearch = allSaleQuo.map(item => ({
          label: item.name,
          value: item._id,
        }));
      }
      const crmStatus = JSON.parse(localStorage.getItem('crmStatus'));
      const billStaus = crmStatus.find(item => item.code === 'ST04');
      const crmSource = JSON.parse(localStorage.getItem('crmSource'));
      const paymentMethod = crmSource.find(item => item.code === 'S17');
      const laneStart = [];
      const laneAdd = [];
      const laneSucces = [];
      const laneFail = [];
      if (billStaus.data) {
        billStaus.data.forEach(item => {
          switch (item.code) {
            case 1:
              laneStart.push(item);
              break;
            case 2:
              laneAdd.push(item);
              break;
            case 3:
              laneSucces.push(item);
              break;
            case 4:
              laneFail.push(item);
              break;
            default:
              break;
          }
        });
      }
      const paymentMethodData = paymentMethod.data;
      const arrKanban = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
      this.setState({ contractList: allContract, saleQuoList: allSaleQuo, arrKanban, paymentMethod: paymentMethodData, POlist: allPO });
      const { billSelected } = addBillPage;
      if (billSelected !== this.props.addBillPage.billSelected && this.state.isEditPage) {
        let customer = {};
        let arrProduct = [];
        if (billSelected.contract) {
          this.state.typeOfBill = 1;
          this.state.itemChoose = {
            label: billSelected.contract.name,
            value: billSelected.contract.contractId,
          };
          const chooseContract = allContract.find(item => item._id === billSelected.contract.contractId);
          if (chooseContract && chooseContract.typeContract === '1') {
            if (billSelected.currentDelivery.length === 0) {
              if (chooseContract.saleQuotation) {
                // const saleQuoId = chooseContract.saleQuotation.saleQuotationId;
                // const choose = allSaleQuo.find(item => item._id === saleQuoId);
                // if (choose) {
                //   customer = choose.customer;
                //   arrProduct = choose.products;
                // } else {
                //   arrProduct = [];
                // }
                customer = billSelected.customer;
                const products = billSelected.products.map(item => ({
                  name: item.name,
                  costPrice: item.price,
                  amount: item.amount,
                  nameUnit: item.unit,
                  discount: item.discount,
                }));
                arrProduct = products;
              }
            } else if (chooseContract && chooseContract.deliverimentRequest.length > 0) {
              const deliveryList = chooseContract.deliverimentRequest.map(item => {
                const x = chooseContract.paymentRequest[Number(item.stage)];
                return {
                  ...item,
                  ...x,
                };
              });
              const x = deliveryList.find(item => item._id === billSelected.currentDelivery[0]);
              const saleQuoId = chooseContract.saleQuotation.saleQuotationId;
              const choose = allSaleQuo.find(item => item._id === saleQuoId);
              arrProduct = x.products.map(item => {
                const y = choose.products.find(item1 => item1.productId === item.productId);
                return {
                  name: item.name,
                  amount: item.amount,
                  nameUnit: y.nameUnit,
                  discount: y.discount,
                  costPrice: y.costPrice,
                };
              });
              this.setState({ deliveryList, currentDelivery: billSelected.currentDelivery[0] });
            }
          }
          if (chooseContract && chooseContract.typeContract === '2') {
            if (billSelected.currentDelivery.length === 0) {
              if (chooseContract.order) {
                // const orderId = chooseContract.order.orderId;
                // const choose = allPO.find(item => item._id === orderId);
                // if (choose) {
                //   customer = choose.customer || choose.supplier;
                //   arrProduct = choose.products.map(item => ({
                //     name: item.name,
                //     amount: item.amount,
                //     nameUnit: item.nameUnit,
                //     discount: item.discountPercent,
                //     costPrice: item.importPrice,
                //   }));
                // } else {
                //   arrProduct = [];
                // }
                customer = billSelected.customer || billSelected.supplier;
                const products = billSelected.products.map(item => ({
                  name: item.name,
                  costPrice: item.price,
                  amount: item.amount,
                  nameUnit: item.unit,
                  discount: item.discount,
                }));
                arrProduct = products;
              }
            } else if (chooseContract && chooseContract.deliverimentRequest.length > 0) {
              const deliveryList = chooseContract.deliverimentRequest.map(item => {
                const x = chooseContract.paymentRequest[Number(item.stage)];
                return {
                  ...item,
                  ...x,
                };
              });
              const x = deliveryList.find(item => item._id === billSelected.currentDelivery[0]);
              const orderId = chooseContract.order.orderId;
              const choose = allPO.find(item => item._id === orderId);
              arrProduct = x.products.map(item => {
                const y = choose.products.find(item1 => item1.productId === item.productId);
                return {
                  name: item.name,
                  amount: item.amount,
                  nameUnit: y.nameUnit,
                  discount: y.discountPercent,
                  costPrice: y.importPrice,
                };
              });
              this.setState({ deliveryList, currentDelivery: billSelected.currentDelivery[0] });
            }
          }
          else {
            customer = billSelected.customer;
            const products = billSelected.products.map(item => ({
              name: item.name,
              costPrice: item.price,
              amount: item.amount,
              nameUnit: item.unit,
              discount: item.discount,
            }));
            arrProduct = products;
          }
        } else {
          this.state.typeOfBill = 0;
          this.state.itemChoose = {
            label: billSelected.saleQuotation ? billSelected.saleQuotation.name : '',
            value: billSelected.saleQuotation ? billSelected.saleQuotation.saleQuotationId || billSelected.saleQuotation.saleQuotationd : '',
          };
          // const choose = allSaleQuo.find(item => item._id === billSelected.saleQuotation.saleQuotationd);
          customer = billSelected.customer;
          const products = billSelected.products.map(item => ({
            name: item.name,
            costPrice: item.price,
            amount: item.amount,
            nameUnit: item.unit,
            discount: item.discount,
          }));
          arrProduct = products;
        }

        if (billSelected.others && Object.keys(billSelected.others).length > 0) {
          const { fieldAdded } = this.state;
          const keys = Object.keys(billSelected.others);
          fieldAdded.forEach(item => {
            const index = keys.findIndex(n => n === item.name.replace('others.', ''));
            if (index > -1) {
              item.value = billSelected.others[keys[index]];
            }
          });
          this.state.fieldAdded = fieldAdded;
        }
        this.state.name = billSelected.name;
        this.state.code = billSelected.code;
        this.state.discountPercent = Number(billSelected.discountPercent) || 0;
        this.state.discount = Number(billSelected.discount) || 0;
        // this.state.paymentAmount = Number(billSelected.total) - Number(billSelected.remaining);
        this.state.deliveryDate = convertDatetimeToDate(billSelected.deliveryDate);
        this.state.orderDate = convertDatetimeToDate(billSelected.orderDate);
        this.state.kanbanStatus = billSelected.kanbanStatus;
        this.state.note = billSelected.note;
        const payList = [];
        if (billSelected.paidList) {
          paymentMethodData.forEach(item => {
            const x = billSelected.paidList.find(n => n.payMethod === item.value);
            if (x) {
              payList.push({
                name: item.title,
                code: item.value,
                amount: x.amount,
              });
            }
          });
        }
        this.setState({ customer, arrProduct, paidList: payList });
      }
      if (this.state.typeOfBill === 0) {
        arrToSearch = allSaleQuo.map(item => ({
          label: item.name,
          value: item._id,
        }));
      } else {
        arrToSearch = allContract.map(item => ({
          label: item.name,
          value: item._id,
        }));
      }
      this.setState({ arrToSearch });
    }
  }

  componentDidUpdate(props) {
    const { successCreate } = props.addBillPage;
    if (successCreate) {
      this.props.onResetNoti();
      const isEdittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));
      if (isEdittingTrading) {
        isEdittingTrading.routingBackFromTabDialog = true;
        localStorage.setItem('edittingTrading', JSON.stringify(isEdittingTrading));
        this.props.history.push('/crm/ExchangingAgreement');
      } else {
        this.props.history.push('/crm/Bill');
      }
    }
  }

  getDataSysterm = () => {
    fetch(SYS_CONF, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    }).then(response => response.json())
      .then(data => {
        this.setState({ agencyCode: data.agencyCode })
      })
  }

  checkRequest = value => {
    const { billColumns } = this.state;
    const column = billColumns.filter(data => data.name === value);
    if (!this.isEmptyObject(column)) {
      return column[0].checkedRequireForm;
    }
  };

  checkShowForm = value => {
    const { billColumns } = this.state;
    const column = billColumns.filter(data => data.name === value);
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
  showButtonEx = (data, putDataBill, getData, onCreateBill) => {
    let newDataBill = getData()
    const clickButton = e => {
      let dataAddTo = {
        kindOfService: '072020',
        AmountInWords: "Một trăm mười lăm nghìn",
        ArisingDate: moment().format('DD/MM/YYYY'),
        PaymentStatus: '',
        EmailDeliver: '',
        ComName: 'LIFETEKJSC',
        // ComAddress

      }
      let detailVal = []
      if (data.typeOfBill === 0) {
        data.saleQuoList.forEach((item, index) => {
          const newItem = {
            order: index + 1,
            goodsType: Number(item.typeOfSalesQuotation) || 0,
            promotion: item.promotion || 0,
            goodsCode: item.code || '',
            goodsName: item.name || '',
            unit: item.unit || '',
            quantily: item.quantily || 1,
            price: item.totalAmount || 0,
            discountPercent: item.percentageDiscount || 0,
            discountTotal: item.priceDiscount || 0,
            otherFeeRate: 0,
            otherFeeMoney: 0,
            totalBeforeTax: item.totalAmount || 0,
            vat: item.vat || '0',
            totalAfterTax: item.totalAfterTax || 0,
            valueAddedTax: item.valueAddedTax || 0,
          }
          detailVal.push(newItem)
        })
      }
      const newData = {
        taxCode: '0105232093-999',
        typeOfBill: data.typeOfBill || '1',
        kyHieuMauHoaDon: 2,
        kyHieuHoaDon: '6K22BYY',
        billCode: data.code,
        invoiceFoundingDate: data.agencyCode !== 'vnpt' ? moment().format('YYYY-MM-DD hh:mm:ss') : moment().format('DD/MM/YYYY'),
        customersTaxCode: '12345678',
        organizationName: "LIFETEKJSC",
        customerName: data.customer ? data.customer.name : '',
        customerAddress: data.customer ? data.customer.representPosition : '',
        customerPhoneNumber: data.customer ? data.customer.representPhoneNumber : '',
        customerEmail: data.customer ? data.customer.customerEmail : '',
        payMethod: Number(data.payMethod) || 1,
        customersTaxCode: data.customer ? data.customer.customerEmail : '',
        payMethodName: '',
        accountNumber: '',
        bankName: '',
        currency: 'VND',
        discount: Number(data.discount) || 0,
        note: data.note || '',
        total: data.total || 0,
        paymentTotal: data.paymentAmount || 0,
        creator: data.nameStaff || '',
        paymentTerm: '',
        exchangeRate: Number(data.exchangeRate) || 0,
        taxTotal: Number(data.taxTotal) || 0,
        detail: detailVal || []
      }
      putDataBill(newData, data.agencyCode, newDataBill, 1);
      // onCreateBill(newDataBill)
    };
    return (
      <>
        <Button
          variant="outlined"
          color="inherit"
          className="mx-2"
          // component={
          //   <Link to={`/crm/trading/${this.state.dialogData._id}`}></Link>
          // }
          onClick={e => clickButton(e)}
        >
          {'PHÁT HÀNH & LƯU'}
        </Button>
      </>
    );
  };

  render() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const edittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));
    const { classes, addBillPage, intl, putDataBill } = this.props;
    const {
      nameStaff,
      discount,
      discountPercent,
      paymentAmount,
      name,
      code,
      deliveryDate,
      orderDate,
      note,
      arrToSearch,
      arrProduct,
      customer,
      paidList,
      kanbanStatus,
      arrKanban,
      localMessages,
      payMethod,
    } = this.state;
    let totalItems = 0; // tổng số lượng hàng
    let totalProducts = 0; // tổng số mặt hàng
    this.state.total = 0;
    let totalBack = 0;
    this.state.total -= discount;
    let paidAmount = 0;
    if (paidList.length > 0) {
      paidList.forEach(item => (paidAmount += Number(item.amount)));
    }
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    return (
      <div>
        {addBillPage.loading ? <LoadingIndicator /> : null}
        <CustomAppBar
          className
          title={
            addStock === 'add'
              ? `${intl && intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới hóa đơn' })}`
              : `${intl && intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật hóa đơn' })}`
          }
          onGoBack={() => {
            const isEdittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));
            if (isEdittingTrading) {
              isEdittingTrading.routingBackFromTabDialog = true;
            }
            localStorage.setItem('edittingTrading', JSON.stringify(isEdittingTrading));
            this.props.history.goBack();
          }}
          onSubmit={() => {
            this.submitBtn.current.click();
          }}
          frontBtn={this.showButtonEx(this.state, putDataBill, this.getData, this.props.onCreateBill)}
        />

        <Helmet>
          <title>{this.state.isEditPage ? 'Sửa hóa đơn' : 'Thêm mới hóa đơn'}</title>
          <meta name="description" content="Create a new bill" />
        </Helmet>
        <KanbanStepper
          listStatus={arrKanban}
          onKabanClick={value => {
            this.setState({ kanbanStatus: value });
          }}
          activeStep={kanbanStatus}
        />
        <Grid item md={12} container spacing={24}>
          <Grid md={8} item>
            <Paper className={classes.paper}>
              <div style={{ display: 'flex' }}>
                <AsyncSelect
                  style={{ paddingRight: 15 }}
                  // cacheOptions
                  value={this.state.itemChoose}
                  className={classes.reactSelect}
                  isDisabled={this.state.isEditPage}
                  loadOptions={this.loadOptions}
                  defaultOptions={arrToSearch}
                  onInputChange={this.handleInputChange}
                  onChange={this.handleChangeSelect}
                  theme={theme => ({
                    ...theme,
                    spacing: {
                      ...theme.spacing,
                      controlHeight: '54px',
                    },
                  })}
                />
                <TextField
                  // label="Loại"
                  name="typeOfBill"
                  select
                  disabled={this.state.isEditPage || edittingTrading}
                  value={this.state.typeOfBill}
                  onChange={this.handleChange('typeOfBill')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  style={{ width: '20%' }}
                >
                  <MenuItem value={0}>Báo giá</MenuItem>
                  <MenuItem value={1}>Hợp đồng</MenuItem>
                </TextField>
              </div>
              <div style={{ display: 'flex' }}>
                {this.state.typeOfBill === 1 && Object.keys(this.state.itemChoose).length > 0 ? (
                  <TextField
                    label="Giai đoạn giao hàng"
                    name="currentDelivery"
                    select
                    disabled={this.state.isEditPage}
                    value={this.state.currentDelivery}
                    onChange={this.handleChange('currentDelivery')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    style={{ width: '100%' }}
                  >
                    <MenuItem value={0}>Tất cả</MenuItem>
                    {this.state.deliveryList.map(item => (
                      <MenuItem value={item._id} key={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  ''
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>
        <Grid item md={12} spacing={24} container>
          <Grid item md={8}>
            <Paper className={classes.paper}>
              <Table>
                <TableHead>
                  <TableCell>Tên</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Đơn vị tính</TableCell>
                  <TableCell>Chiết khấu</TableCell>
                  <TableCell>Thành tiền</TableCell>
                </TableHead>
                <TableBody>
                  {arrProduct.map(item => {
                    const totalPrice =
                      // item.pricePolicy !== undefined ? (item.pricePolicy.costPrice / 100) * item.amount * ((100 - (discountPercent !== '' ? discountPercent : 0)) / 100) : (item.costPrice / 100) * item.amount * ((100 - (discountPercent !== '' ? discountPercent : 0)) / 100);
                      item.pricePolicy !== undefined ? (item.pricePolicy.costPrice) * item.amount * ((100 - (discountPercent !== '' ? discountPercent : 0)) / 100) : (item.costPrice) * item.amount * ((100 - (discountPercent !== '' ? discountPercent : 0)) / 100);

                    this.state.total += parseInt(totalPrice, 10);
                    totalBack += parseInt(totalPrice, 10);
                    totalItems += Number(item.amount);
                    totalProducts += 1;
                    return (
                      <TableRow key={item._id}>
                        <TableCell>{item.name}</TableCell>
                        {/* <TableCell>{formatNumber(item.pricePolicy !== undefined ? parseInt(item.pricePolicy.costPrice / 100, 10) : parseInt(item.costPrice / 100, 10))}</TableCell> */}
                        <TableCell>{formatNumber(item.pricePolicy !== undefined ? parseInt(item.pricePolicy.costPrice, 10) : parseInt(item.costPrice, 10))}</TableCell>
                        <TableCell>{formatNumber(item.amount)}</TableCell>
                        <TableCell>{item.nameUnit}</TableCell>
                        <TableCell>{discountPercent}%</TableCell>
                        <TableCell>{formatNumber(parseInt(totalPrice, 10))}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
            {this.state.fieldAdded.length > 0 ? (
              <Paper className={classes.paper}>
                <Grid item md={12} container spacing={16}>
                  {this.state.fieldAdded.length > 0
                    ? this.state.fieldAdded.map((item, index) => {
                      if (item.checked) {
                        return (
                          <Grid item md={6} key={item.name}>
                            <TextField
                              label={item.title}
                              variant="outlined"
                              type={item.type === 'string' ? 'text' : item.type}
                              value={item.value}
                              onChange={event => this.handleChangeAddedField(index, event)}
                              style={{ width: '100%' }}
                              margin="normal"
                            />
                          </Grid>
                        );
                      }
                    })
                    : ''}
                </Grid>
              </Paper>
            ) : (
              ''
            )}

            <Paper>
              <FileUpload name={this.state.name} id={id} code="Bill" />
            </Paper>
          </Grid>
          <Grid item md={4}>
            <Paper className={classes.paper}>
              <ValidatorForm style={{ width: '100%', display: 'inline' }} onSubmit={this.handleSubmitForm}>
                <Typography component="p">
                  Tổng số mặt hàng: <b>{totalProducts}</b>
                </Typography>
                <Typography component="p">
                  Tổng số lượng: <b>{totalItems}</b>
                </Typography>
                <hr />
                {this.checkShowForm('code') && (
                  <TextFieldCode
                    label={getLabelName('code', 'Bill')}
                    variant="outlined"
                    margin="normal"
                    name="code"
                    disabled={this.state.isEditPage}
                    value={code}
                    style={{ width: '100%' }}
                    onChange={this.handleChange('code')}
                    code={6}
                    required={this.checkRequest('code')}
                    error={this.checkRequest('code') && code === ''}
                    helperText={this.checkRequest('code') && code === '' ? localMessages.code : ''}
                  />
                )}

                {this.checkShowForm('name') && (
                  <CustomInputBase
                    label={getLabelName('name', 'Bill')}
                    variant="outlined"
                    margin="normal"
                    name="name"
                    value={name}
                    style={{ width: '100%' }}
                    onChange={this.handleChange('name')}
                    required={this.checkRequest('name')}
                    // validators={this.checkRequest('name') ? ['required', 'trim'] : ''}
                    // errorMessages={['Không được để trống', 'Không được điền khoảng trắng']}
                    error={name === '' && this.checkRequest('name')}
                    // required={this.checkRequest('name')}
                    helperText={localMessages.name}
                  />
                )}

                <hr />

                {this.checkShowForm('supplier') && (
                  <TextField
                    InputProps={{
                      readOnly: true,
                    }}
                    value={customer ? customer.name : ''}
                    label={this.state.isSupplier ? 'Tên nhà cung cấp' : 'Tên khách hàng'}
                    variant="outlined"
                    margin="normal"
                    style={{ width: '100%' }}
                    error={this.checkRequest('supplier') && customer.name === ''}
                    helperText={this.checkRequest('supplier') && customer.name === '' && localMessages.customer}
                  />
                )}

                {this.checkShowForm('sellEmployee') && (
                  <TextField
                    InputProps={{
                      readOnly: true,
                    }}
                    label="Nhân viên lập hóa đơn"
                    value={nameStaff}
                    variant="outlined"
                    margin="normal"
                    style={{ width: '100%' }}
                  />
                )}

                {this.checkShowForm('discountPercent') && (
                  <TextValidator
                    label={getLabelName('discountPercent', 'Bill')}
                    // InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    value={discountPercent}
                    name="discountPercent"
                    margin="normal"
                    required={this.checkRequest('discountPercent')}
                    style={{ width: '100%' }}
                    // required={this.checkRequest('discountPercent')}
                    error={this.checkRequest('discountPercent') && discountPercent === ''}
                    helperText={localMessages.discountPercent}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                )}

                {this.checkShowForm('discount') && (
                  <TextValidator
                    label={getLabelName('discount', 'Bill')}
                    value={discount}
                    variant="outlined"
                    name="discount"
                    margin="normal"
                    onChange={this.handleChange('discount')}
                    required={this.checkRequest('discount')}
                    error={this.checkRequest('discount') && discount === ''}
                    helperText={localMessages.discount}
                    style={{ width: '100%' }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                )}

                <hr />
                {this.checkShowForm('total') && (
                  <TextField
                    label={getLabelName('total', 'Bill')}
                    value={this.state.total}
                    variant="outlined"
                    margin="normal"
                    style={{ width: '100%' }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                      readOnly: true,
                    }}
                  />
                )}

                <Typography style={{ display: 'none' }}>
                  {this.state.paidList.length > 0 ? (this.state.remaining = this.state.total - Number(paidAmount)) : 0}
                </Typography>
                <Typography style={{ display: 'none' }}>
                  {this.state.paidList.length === 0 ? (this.state.remaining = this.state.total) : 0}
                </Typography>

                {this.checkShowForm('remaining') && (
                  <TextValidator
                    label={getLabelName('remaining', 'Bill')}
                    value={this.state.remaining}
                    variant="outlined"
                    validators={['minNumber:0']}
                    errorMessages={['Số tiền trả vượt quá tổng tiền của hóa đơn']}
                    margin="normal"
                    style={{ width: '100%' }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                      readOnly: true,
                    }}
                  />
                )}

                {this.state.paidList.map((item, index) => (
                  <Typography component="p" key={item.code}>
                    <Clear onClick={() => this.deletePaidItem(index)} style={{ cursor: 'pointer' }} color="secondary" /> {item.name}:{' '}
                    {formatNumber(item.amount)}
                  </Typography>
                ))}

                {this.checkShowForm('paidList') && (
                  <TextField
                    label="Phương thức thanh toán"
                    value={payMethod}
                    variant="outlined"
                    name="payMethod"
                    margin="normal"
                    select
                    onChange={this.handleChange('payMethod')}
                    style={{ width: '100%' }}
                    required={this.checkRequest('paidList')}
                    error={payMethod === 0 && this.checkRequest('paidList')}
                    helperText={localMessages.paidList}
                  >
                    {this.state.paymentMethod.map((item, index) => (
                      <MenuItem value={index} key={index}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                <TextValidator
                  label="Số tiền thanh toán"
                  value={paymentAmount}
                  variant="outlined"
                  name="paymentAmount"
                  margin="normal"
                  onChange={this.handleChange('paymentAmount')}
                  style={{ width: '70%' }}
                  validators={['minNumber:0', `maxNumber:${this.state.total}`]}
                  errorMessages={['Số tiền không được nhỏ hơn 0', 'Không được vượt quá tổng tiền hóa đơn']}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
                <Button variant="outlined" style={{ width: '30%', marginTop: '15px', height: '55px' }} onClick={this.addToPaidList} color="primary">
                  Thanh toán
                </Button>
                <hr />

                {this.checkShowForm('deliveryDate') && (
                  <CustomDatePicker
                    label={getLabelName('deliveryDate', 'Bill')}
                    value={deliveryDate}
                    variant="outlined"
                    // InputProps={{ inputProps: { min: this.state.orderDate } }}
                    name="deliveryDate"
                    margin="normal"
                    top="20px"
                    onChange={e => this.handleChangeInput(e, true)}
                    style={{ width: '100%' }}
                    required={this.checkRequest('deliveryDate')}
                  />
                )}

                {this.checkShowForm('orderDate') && (
                  <CustomDatePicker
                    label={getLabelName('orderDate', 'Bill')}
                    value={orderDate}
                    variant="outlined"
                    name="orderDate"
                    margin="normal"
                    onChange={e => this.handleChangeInput(e, false)}
                    style={{ width: '100%' }}
                    top="20px"
                    required={this.checkRequest('orderDate')}
                  />
                )}

                {this.checkShowForm('note') && (
                  <TextField
                    label={getLabelName('note', 'Bill')}
                    value={note}
                    multiline
                    rows={3}
                    variant="outlined"
                    name="note"
                    margin="normal"
                    onChange={this.handleChange('note')}
                    style={{ width: '100%' }}
                    required={this.checkRequest('note')}
                    error={note === '' && this.checkRequest('note')}
                    helperText={note === '' && this.checkRequest('note') ? localMessages.note : ''}
                  />
                )}

                <div style={{ display: 'none' }}>
                  <button ref={this.submitBtn} type="submit" />
                </div>
              </ValidatorForm>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }

  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };

  deletePaidItem = index => {
    const { paidList } = this.state;
    paidList.splice(index, 1);
    this.setState({ paidList });
  };

  addToPaidList = () => {
    const { paymentMethod, payMethod, paymentAmount, paidList } = this.state;
    const data = {
      name: paymentMethod[payMethod].title,
      code: paymentMethod[payMethod].value,
      amount: paymentAmount,
    };
    const x = paidList.findIndex(item => item.code === paymentMethod[payMethod].value);
    if (x === -1) {
      paidList.push(data);
    } else {
      paidList[x] = data;
    }
    this.setState({ paidList });
  };

  getData = () => {
    const {
      name,
      code,
      arrProduct,
      discount,
      discountPercent,
      total,
      remaining,
      // payMethod,
      paidList,
      deliveryDate,
      orderDate,
      note,
      // kanbanStatus,
      typeOfBill,
      itemChoose,
      saleQuoList,
      contractList,
      // deliveryList,
      currentDelivery,
      isSupplier,
      fieldAdded,
    } = this.state;
    let { customer, kanbanStatus } = this.state;
    const { dashboardPage } = this.props;
    let sellEmployee;
    if (dashboardPage.profile) {
      sellEmployee = {
        name: dashboardPage.profile.name,
        employeeId: dashboardPage.profile._id,
      };
    }
    const products = arrProduct.map(item => ({
      name: item.name,
      price: item.pricePolicy && item.pricePolicy.costPrice,
      amount: item.amount,
      unit: item.nameUnit,
      discount: item.discount,
      productId: item.productId,
    }));
    let contract;
    let saleQuotation;
    let currentDeliveryRaw = [];
    if (typeOfBill === 0) {
      const x = saleQuoList.find(n => n._id === itemChoose.value);
      if (x) {
        saleQuotation = {
          name: x.name,
          saleQuotationId: x._id,
        };
      }
    } else {
      const x = contractList.find(n => n._id === itemChoose.value);
      if (x) {
        contract = {
          name: x.name,
          contractId: x._id,
        };
      }
      if (currentDelivery === '0' || currentDelivery === 0) {
        currentDeliveryRaw = [];
      } else {
        currentDeliveryRaw.push(currentDelivery);
      }
    }
    const payList = paidList.map(item => ({
      payMethod: item.code,
      amount: item.amount,
    }));
    let supplier;
    if (isSupplier) {
      supplier = customer;
      customer = undefined;
    }
    const others = {};
    if (fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }
    if (kanbanStatus === 0) {
      kanbanStatus = this.state.arrKanban.length > 0 ? this.state.arrKanban[0]._id : '';
    }
    const body = {
      name,
      code,
      products,
      customer,
      currentDelivery: currentDeliveryRaw,
      supplier,
      contract,
      saleQuotation,
      sellEmployee,
      discount,
      discountPercent,
      total,
      paidList: payList,
      remaining,
      // payMethod,
      deliveryDate: new Date(deliveryDate),
      orderDate: new Date(orderDate),
      note,
      kanbanStatus,
      others,
    };
    return body
  }

  handleSubmitForm = () => {
    const {
      name,
      code,
      arrProduct,
      discount,
      discountPercent,
      total,
      remaining,
      // payMethod,
      paidList,
      deliveryDate,
      orderDate,
      note,
      // kanbanStatus,
      typeOfBill,
      itemChoose,
      saleQuoList,
      contractList,
      // deliveryList,
      currentDelivery,
      isSupplier,
      fieldAdded,
    } = this.state;
    let { customer, kanbanStatus } = this.state;
    const { dashboardPage } = this.props;
    let sellEmployee;
    if (dashboardPage.profile) {
      sellEmployee = {
        name: dashboardPage.profile.name,
        employeeId: dashboardPage.profile._id,
      };
    }
    const products = arrProduct.map(item => ({
      name: item.name,
      price: item.pricePolicy ? item.pricePolicy.costPrice : item.costPrice,
      amount: item.amount,
      unit: item.nameUnit,
      discount: item.discount,
      productId: item.productId,
    }));
    let contract;
    let saleQuotation;
    let currentDeliveryRaw = [];
    if (typeOfBill === 0) {
      const x = saleQuoList.find(n => n._id === itemChoose.value);
      if (x) {
        saleQuotation = {
          name: x.name,
          saleQuotationId: x._id,
        };
      }
    } else {
      const x = contractList.find(n => n._id === itemChoose.value);
      if (x) {
        contract = {
          name: x.name,
          contractId: x._id,
        };
      }
      if (currentDelivery === '0' || currentDelivery === 0) {
        currentDeliveryRaw = [];
      } else {
        currentDeliveryRaw.push(currentDelivery);
      }
    }
    const payList = paidList.map(item => ({
      payMethod: item.code,
      amount: item.amount,
    }));
    let supplier;
    if (isSupplier) {
      supplier = customer;
      customer = undefined;
    }
    const others = {};
    if (fieldAdded.length > 0) {
      fieldAdded.forEach(item => {
        others[item.name.replace('others.', '')] = item.value;
      });
    }
    if (kanbanStatus === 0) {
      kanbanStatus = this.state.arrKanban[0]._id;
    }
    const body = {
      name,
      code,
      products,
      customer,
      currentDelivery: currentDeliveryRaw,
      supplier,
      contract,
      saleQuotation,
      sellEmployee,
      discount,
      discountPercent,
      total,
      paidList: payList,
      remaining,
      // payMethod,
      deliveryDate: new Date(deliveryDate),
      orderDate: new Date(orderDate),
      note,
      kanbanStatus,
      others,
    };
    if (this.state.isEditPage) {
      const { match } = this.props;
      body.id = match.params.id;
      this.props.onUpdateBill(body);
    } else {
      this.props.onCreateBill(body);
    }
  };

  handleChangeSelect = selectedOption => {
    let arrProduct = [];
    let discount;
    let discountPercent;
    let { customer, deliveryList } = this.state;
    const { contractList, typeOfBill, saleQuoList, POlist } = this.state;
    console.log(selectedOption, 'selectedOption', typeOfBill)

    if (typeOfBill === 0) {
      const choose = saleQuoList.find(item => item._id === selectedOption.value);
      console.log(choose, 'choose')
      customer = choose.customer;
      let products = []
      if (choose.products && Array.isArray(choose.products) && choose.products.length) {
        const { listUnit } = this.state
        choose.products.map((el) => {
          const nameUnit = listUnit.find(it => it._id === el.unit)
          console.log(nameUnit, 'nameUnit')
          products.push({
            ...el,
            nameUnit: nameUnit.name || ''
          })
        })

      }
      // arrProduct = choose.products;
      console.log(products, "products")
      arrProduct = products
      discount = Number(choose.priceDiscount);
      discountPercent = Number(choose.percentageDiscount);
    } else {
      const chooseContract = contractList.find(item => item._id === selectedOption.value);
      if (chooseContract.typeContract === '1') {
        if (chooseContract.saleQuotation) {
          const saleQuoId = chooseContract.saleQuotation.saleQuotationId;
          const choose = saleQuoList.find(item => item._id === saleQuoId);
          if (choose) {
            customer = choose.customer;
            if (chooseContract.deliverimentRequest.length > 0) {
              deliveryList = chooseContract.deliverimentRequest.map(item => {
                const x = chooseContract.paymentRequest[Number(item.stage)];
                return {
                  ...item,
                  ...x,
                };
              });
            }
            arrProduct = choose.products;
            discount = Number(choose.priceDiscount);
            discountPercent = Number(choose.percentageDiscount);
            this.setState({ saleQuoBackup: choose, isSupplier: false });
          } else {
            arrProduct = [];
          }
        }
      } else if (chooseContract.order) {
        const orderId = chooseContract.order.orderId;
        const choose = POlist.find(item => item._id === orderId);
        if (choose) {
          customer = choose.supplier;
          if (chooseContract.deliverimentRequest.length > 0) {
            deliveryList = chooseContract.deliverimentRequest.map(item => {
              const x = chooseContract.paymentRequest[Number(item.stage)];
              return {
                ...item,
                ...x,
              };
            });
          }
          arrProduct = choose.products.map(item => ({
            name: item.name,
            amount: item.amount,
            costPrice: item.importPrice,
            discount: item.discountPercent,
            productId: item.productId,
          }));
          discount = Number(choose.discount);
          discountPercent = Number(choose.discountPercent);
          this.setState({ saleQuoBackup: choose, isSupplier: true });
        } else {
          arrProduct = [];
        }
      }
    }
    console.log(arrProduct, 'arrProduct')
    this.setState({
      itemChoose: selectedOption,
      arrProduct,
      customer,
      discount,
      discountPercent,
      deliveryList,
      currentDelivery: 0,
      backupProducts: arrProduct,
    });
  };

  // handleClickHistory = event => {
  //   this.setState({ history: event.currentTarget });
  // };

  handleClose = name => {
    this.setState({ [name]: null });
  };

  handleInputChange = newValue => newValue;

  handleChangeInput = (e, isDate) => {
    const name = isDate ? 'deliveryDate' : 'orderDate';
    let value = isDate ? moment(e).format('YYYY-MM-DD') : moment(e).format('YYYY-MM-DD');
    if (!e) {
      value = null
    }
    this.setState({ [name]: value });
  };

  handleChange = name => e => {
    if (name === 'typeOfBill') {
      const { contractList, saleQuoList } = this.state;
      let { arrToSearch } = this.state;
      arrToSearch = [];
      if (e.target.value === 0) {
        arrToSearch = saleQuoList.map(item => ({
          label: item.name,
          value: item._id,
        }));
      } else {
        arrToSearch = contractList.map(item => ({
          label: item.name,
          value: item._id,
        }));
      }
      this.setState({ arrToSearch, itemChoose: {}, arrProduct: [] });
    }
    if (name === 'currentDelivery') {
      const { backupProducts, deliveryList, saleQuoBackup } = this.state;
      let { arrProduct } = this.state;
      if (Number(e.target.value) === 0) {
        arrProduct = backupProducts;
      } else {
        const x = deliveryList.find(item => item._id === e.target.value);
        if (x) {
          arrProduct = x.products.map(item => {
            const y = saleQuoBackup.products.find(item1 => item1.productId === item.productId);
            return {
              name: item.name,
              amount: item.amount,
              nameUnit: y.nameUnit,
              discount: y.discountPercent,
              costPrice: y.importPrice,
            };
          });
        }
      }
      this.setState({ arrProduct });
    }
    this.setState({ [name]: e.target.value });
  };

  filterColors = newValue => {
    const { arrToSearch } = this.state;
    return arrToSearch.filter(i => i.label.toLowerCase().includes(newValue.toLowerCase().trim()));
  };

  loadOptions = (newValue, callback) =>
    // eslint-disable-next-line no-unused-vars
    new Promise(resolve => {
      setTimeout(() => {
        callback(this.filterColors(newValue));
      }, 500);
    });
}

AddBillPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addBillPage: makeSelectAddBillPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllContract: params => {
      dispatch(getAllContractAct(params));
    },
    onCreateBill: body => {
      dispatch(createBillAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNotiAct());
    },
    onGetBillById: body => {
      dispatch(getBillByIdAct(body));
    },
    onUpdateBill: body => {
      dispatch(updateBillAct(body));
    },
    putDataBill: (body, id, data, editMode) => {
      dispatch(putDataBill(body, id, data, editMode));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addBillPage', reducer });
const withSaga = injectSaga({ key: 'addBillPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddBillPage);
