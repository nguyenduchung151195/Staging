/* eslint-disable spaced-comment */
/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable array-callback-return */
/**
 *
 * AddContractPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import {
  withStyles,
  Paper,
  Grid,
  Typography,
  TextField,
  Tabs,
  IconButton,
  Tab,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  MenuItem,
  Dialog,
  DialogContent,
  Button,
  Fab,
  TablePagination,
  Toolbar,
  AppBar,
  DialogActions,
  TableFooter,
  FormHelperText,
  Drawer,
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Close, Add, Delete, Edit } from '@material-ui/icons';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withSnackbar } from 'notistack';
// import AsyncSelect from 'react-select/async';
// import { components } from 'react-select';
import moment from 'moment';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import TextFieldCode from '../../components/TextFieldCode';
import { AsyncAutocomplete, Dialog as DialogLifetek } from '../../components/LifetekUi';
import ScanFileByH from '../../components/ScanFileByH';
import makeSelectAddContractPage from './selectors';
import reducer from './reducer';
import saga, { getSaleQuoById } from './saga';
import {
  getAllContractAct,
  getOrderAct,
  createContractAct,
  getProductAct,
  setEmptyAct,
  getContractById,
  updateContractAct,
  getCustomerAct,
  getCustomerInfo,
  resetNoti,
  getAllProductAct,
} from './actions';
import { API_TASK_PROJECT, API_USERS, API_CUSTOMERS, API_TASK_CONTRACT_PROJECT, API_HISTORY, API_UNIT_STOCK } from '../../config/urlConfig';
import styles from './styles';
import {
  serialize,
  convertDatetimeToDate,
  getLabelName,
  viewConfigCheckRequired,
  viewConfigCheckShowForm,
  viewConfigShowLabel,
} from '../../utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import KanbanStepper from '../../components/KanbanStepper';
import ProductInforDrawer from '../../components/ProductInforDrawer';
import UpdatePaymentRequestDialog from '../../components/UpdatePaymentRequestDialog';
import messages from './messages';
import FileUpload from '../../components/LifetekUi/FileUpload';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomButton from '../../components/Button/CustomButton';
import { sortTask, fetchData } from '../../helper';
import { viewConfigCheckForm } from 'utils/common';
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import CustomAppBar from 'components/CustomAppBar';
import ListPage from 'components/List';

// const tempDate = new Date();
// const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${
//   tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
// }`;
// const dateRaw = moment().format('YYYY-MM-DD');
const date = null;
const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
    marginBottom: '10px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

function formatNumber(num) {
  if (num) return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return '';
}

/* eslint-disable react/prefer-stateless-function */
export class AddContractPage extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }

  state = {
    value: 0,
    open: false,
    open2: false,
    open3: false,
    open4: false,
    openChooseSale: false,
    openEditProduct: false,
    //
    searchStartDay: date,
    searchEndDay: date,
    orderList: [],
    itemChoose: {},
    orderProductChoose: [],
    orderProductChooseAPI: [],
    catalogContract: 0,
    contractSigningDate: moment().format('YYYY/MM/DD'),
    belong: 0,
    startDay: date,
    // deliveryDay: date,
    paymentOrder: [],
    name: '',
    productType: '',
    code: undefined,
    cycle: '',
    nameOrder: '',
    idCodeOrder: null,
    notice: '',
    // numberOrders: '',
    expirationDay: moment().format('YYYY/MM/DD'),
    // statusContract: 0,
    // contractPrinciples: [],
    kanbanStatus: 0,
    arrKanban: [],
    task: null,
    jobs: null,
    rowsPerPage: 5, // số hàng hiển thị trên một bảng
    page: 0, // trang hiện tại
    currentStage: {
      name: '',
      statusPay: 0,
      timePay: moment().format('YYYY-MM-DD'),
      amount: 0,
      contractWork: null,
      workCompleted: {},
      currency: 'VNĐ',
      VAT: false,
      totalPrice: '',
      jobs: null,
    },
    currentDeliverRequest: {
      stage: '', // id của yêu cầu thanh toán paymentRequest
      timeDelivery: '',
      company: '',
      Address: '',
      products: [],
    },
    deliverimentRequest: [],
    isEdit: -1,
    isEditDelivery: -1,
    file: null,
    fileName: '',
    fileNote: '',
    arrFile: [],
    codeError: false,
    codeTypeError: false,
    productTypeError: false,
    nameError: false,
    cycleError: false,
    dateError: false,
    typeContainer: null,
    belongName: '',
    typeContract: this.props.typeContract ? this.props.typeContract : 0,
    saleError: false,

    searchTaskError: false,
    expirationDayError: false,
    startDayError: false,
    contractSigningDateError: false,
    cycleRequire: false,
    cycleMin: false,
    noticeMin: false,
    noticeRequire: false,
    openDetail: false,
    product: {},
    customer: {},
    allProduct: {},
    amountDelivery: [],
    fieldAdded: [],
    totalMoney: 0,
    totalMoney2: 0,
    responsible: null,
    customerName: null,
    jobs: null,
    chooseItem: null,
    chooseProductPrice: null,
    chooseProductAmount: null,
    chooseProductDiscount: null,
    localMessages: {},
    contractColumns: JSON.parse(localStorage.getItem('viewConfig'))
      .find(item => item.code === 'Contract')
      .listDisplay.type.fields.type.columns.map(item => ({ ...item, name: item.name.replace(/\./g, '_') })),
    listContractTypes: [],
    openDialogScan: false,
    newProject: null,
    dataScan: null,
    listUnit: []
  };

  componentWillMount() {
    const { match } = this.props;
    if (window.location.pathname.split('/').includes('edit')) {
      this.props.onGetContractById(this.props.id ? this.props.id : match.params.id);
      this.state.typeContainer = 'edit';
    } else {
      this.state.typeContainer = 'add';
      this.props.onGetAllContract(this.props.id ? this.props.id : match.params.id);
    }
    this.props.onDefaultAction();
    this.props.onGetAllProduct();
    if (parseInt(this.state.catalogContract, 10) === 1) {
      this.setState({ value: 0 });
    } else {
      this.setState({ value: 1 });
    }
  }

  componentDidMount() {

    const listCrmSource = JSON.parse(localStorage.getItem('crmSource')) || [];
    const contractTypeSource = listCrmSource.find(i => i.code === 'S15');
    let newListContractTypes = [];
    if (contractTypeSource) {
      newListContractTypes = contractTypeSource.data;
    }
    this.setState({ listContractTypes: newListContractTypes });
    if (this.state.typeContainer === 'add') {
      this.state.typeContract = this.props.id ? this.props.id : this.props.match.params.id;
    }
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.find(item => item.code === 'Contract');

    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      // const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
    fetchData(API_UNIT_STOCK).then((data) => {
      console.log("listUnit", data)
      this.setState({ listUnit: data })
    }).catch(() => {
      console.log("lấy danh sách đơn vị thất bại")
      this.setState({ listUnit: [] })
    })
  }

  componentWillUpdate(props) {
    const { successCreate } = props.addContractPage;
    if (successCreate) {
      this.props.onDefaultAction();
      const isEdittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));
      if (isEdittingTrading) {
        isEdittingTrading.routingBackFromTabDialog = true;
        localStorage.setItem('edittingTrading', JSON.stringify(isEdittingTrading));
        this.props.callback ? this.props.callback() : this.props.history.push('/crm/ExchangingAgreement');
      } else {
        props.history.value = 1;
        this.props.callback ? this.props.callback() : this.props.history.push('/crm/Contract');
      }
    }
  }

  componentWillReceiveProps(props) {
    if (props.addContractPage) {
      const localMessages = viewConfigCheckForm('Contract', props.addContractPage);
      this.setState({
        localMessages,
      });
    }
    if (props !== this.props) {
      const { addContractPage } = props;
      const allProduct = addContractPage.allProduct;
      const contractPrinciples = addContractPage.allContract || [];
      const kanbanStatus = addContractPage.status || {};
      const arrOrder = addContractPage.allOrder || [];
      const arrProduct = addContractPage.listProduct || [];
      const customer = addContractPage.customer || {};
      const arr = [];
      if (this.state.typeContainer === 'edit') {
        //   this.props.onGetCustomerInfo(this.props.addContractPage.contract.customerId)

        this.setState({ customerName: customer });
      }

      contractPrinciples.forEach(item => {
        if (item.catalogContract === 0) {
          arr.push(item);
        }
      });
      // const arrKanban = kanbanStatus.data
      //   ? kanbanStatus.data.map(item => ({
      //       code: item.code,
      //       name: item.name,
      //     }))
      //   : [];
      const laneStart = [];
      const laneAdd = [];
      const laneSucces = [];
      const laneFail = [];
      if (kanbanStatus.data) {
        kanbanStatus.data.forEach(item => {
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
      let amountDelivery = [];
      const arrKanban = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
      const arrOrderSorted = arrOrder.sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
      });

      this.setState({ arrKanban, orderProductChooseAPI: arrProduct, customerName: customer, allProduct }); // contractPrinciples: arr,
      const { contract, listProduct, saleQuo } = addContractPage;
      this.filterOrderList(arrOrderSorted);
      if (this.props.itemSales) {
        this.setState({
          nameOrder: this.props.itemSales.name,
        });
      }
      if (
        (this.props.id ? this.props.id : this.props.match.params.id) !== '1' &&
        (this.props.id ? this.props.id : this.props.match.params.id) !== '2' &&
        this.state.orderProductChoose &&
        this.state.orderProductChoose.length === 0
      ) {
        this.state.orderProductChoose = saleQuo ? (saleQuo.products ? saleQuo.products : []) : [];
        if (saleQuo && saleQuo !== null && Object.keys(saleQuo).length > 0) {
          let totalMoney = 0;
          saleQuo.products.forEach(n => {
            totalMoney += (Number(n.costPrice) * Number(n.amount) * Number(100 - Number(n.discount) || 0)) / 100;
          });
          this.setState({ totalMoney });
        }
      }
      if (
        (this.props.id ? this.props.id : this.props.match.params.id) !== '1' &&
        (this.props.id ? this.props.id : this.props.match.params.id) !== '2' &&
        this.state.itemChoose &&
        Object.keys(this.state.itemChoose).length === 0
      ) {
        this.state.itemChoose = saleQuo;
      }
      if (this.state.typeContainer === 'edit') {
        if (addContractPage.contract.task && addContractPage.contract.task !== null && addContractPage.contract.task.taskId) {
          this.loadOptions2(addContractPage.contract.task.taskId);
        }
      }
      if (
        this.props.addContractPage.contract !== props.addContractPage.contract &&
        this.state.typeContainer === 'edit' &&
        contract !== this.props.contract &&
        contract.code
      ) {
        this.state.catalogContract = contract.catalogContract;
        this.state.name = contract.name;
        this.state.code = contract.code;
        this.state.deliverimentRequest = contract.deliverimentRequest || [];
        if (contract.task) {
          this.state.task = contract.task;
          if (contract.task.taskId) {
            this.getProjectTree(contract.task.taskId);
          }
        }
        this.state.typeContract = contract.typeContract || '';
        this.state.belong = contract.belong ? contract.belong.contractId : '';
        this.state.kanbanStatus = contract.kanbanStatus;
        this.state.contractSigningDate = contract.contractSigningDate;
        this.state.expirationDay = contract.expirationDay;
        this.state.startDay = !this.state.startDay ? null : convertDatetimeToDate(contract.startDay);
        this.state.dataPay = contract.paymentOrder || '';
        this.state.cycle = contract.cycle || null;
        this.state.notice = contract.notice || null;
        this.state.arrFile = contract.otherRequest;
        this.state.paymentOrder = contract.paymentRequest;
        this.state.responsible = contract.responsible;
        this.state.productType = contract.productType;
        if (parseInt(contract.catalogContract, 10) === 1 || parseInt(contract.catalogContract, 10) === 2) {
          this.state.idCodeOrder = contract.saleQuotation ? contract.saleQuotation.saleQuotationId : '';
          this.state.nameOrder = contract.saleQuotation ? contract.saleQuotation.name : '';
        }
        // this.state.nameOrder = contract.nameOrder|| '';
        this.state.orderProductChooseAPI = listProduct || [];
        this.state.orderProductChoose = addContractPage.contract.listProduct || [];
        this.state.itemChoose = saleQuo;
        if (contract.others && Object.keys(contract.others).length > 0) {
          const { fieldAdded } = this.state;
          const keys = Object.keys(contract.others);
          fieldAdded.forEach(item => {
            const index = keys.findIndex(n => n === item.name.replace('others.', ''));
            if (index > -1) {
              item.value = contract.others[keys[index]];
            }
          });
          this.state.fieldAdded = fieldAdded;
        }
      }
      if (this.state.amountDelivery.length === 0) {
        amountDelivery = arrProduct.map(item => ({
          productId: item._id,
          amount: 0,
        }));
      }
      if (amountDelivery.length > 0 && contract.deliverimentRequest && contract.deliverimentRequest.length > 0) {
        contract.deliverimentRequest.forEach(item => {
          if (item && item.products) {
            item.products.forEach(pro => {
              const x = amountDelivery.findIndex(n => n.productId === pro.productId);
              if (x > -1) {
                amountDelivery[x].amount += Number(pro.amount);
              }
            });
          }
        });
        this.setState({ amountDelivery });
      }
    }
  }

  checkRequest = value => {
    const { contractColumns } = this.state;
    const column = contractColumns.filter(data => data.name === value);
    if (!this.isEmptyObject(column)) {
      return column[0].checkedRequireForm;
    }
  };

  getLabelNames = name => {
    return viewConfigCheckShowForm('Contract', name, this.state.catalogContract, 'title');
  };

  checkShowForm = value => {
    return viewConfigCheckShowForm('Contract', value, this.state.catalogContract, 'checkedShowForm');
  };

  isEmptyObject = obj => {
    let object;
    if (Array.isArray(obj) === true) {
      object = obj[0];
    } else {
      object = obj;
    }
    for (const key in object) {
      if (object.hasOwnProperty(key)) return false;
    }
    return true;
  };

  filterOrderList = data => {
    let orderList2 = null;

    if (this.state.customerName) {
      if (this.isEmptyObject(this.state.customerName)) {
        this.setState({ orderList: data });
      } else {
        orderList2 = data.filter(
          item => item.customer.customerId === this.state.customerName._id || item.customer.customerId === this.state.customerName.customerId,
        );
        this.setState({ orderList: orderList2 });
      }
    } else {
      this.setState({ orderList: data });
    }
  };

  toggleDrawer = product => {
    const { openDetail } = this.state;
    this.setState({
      openDetail: !openDetail,
      product,
    });
  };

  handleResetProduct = () => {
    if (this.props.addContractPage.contract.listProduct) {
      this.setState({
        orderProductChoose: this.props.addContractPage.contract.listProduct,
        nameOrder: '',
      });
    } else {
      this.setState({
        orderProductChoose: [],
        nameOrder: '',
      });
    }
  };

  handlePriceProduct = item => {
    let { totalMoney2 } = this.state;
    let prevTotal = totalMoney2;
    let totalMoneyItem = 0;
    if (item.x) {
      if (item.costPrice) {
        return formatNumber((Number(item.costPrice) * parseInt(item.amount, 10) * (100 - item.discount)) / 100);
      } else {
        return 0;
      }
    } else {
      if (item.discount) {
        totalMoneyItem = formatNumber((Number(item.costPrice) * parseInt(item.amount, 10) * (100 - item.discount)) / 100);
        // this.handleTotalPriceProduct(totalMoneyItem)
        return totalMoneyItem;
      } else {
        totalMoneyItem = formatNumber(Number(item.costPrice) * parseInt(item.amount, 10));
        // this.handleTotalPriceProduct(totalMoneyItem)
        return totalMoneyItem;
      }
    }
  };

  getProjectTree(projectId) {
    const filter = serialize({ filter: { projectId, status: 1 } });
    fetchData(`${API_TASK_PROJECT}?${filter}`, 'GET').then(projects => {
      const newProject = sortTask(projects.data, [], projectId, true);
      this.setState({ jobs: { data: newProject } });
    });
  }

  handleTotalPriceProduct = () => {
    let { orderProductChoose } = this.state;
  };
  handleScan = () => {
    this.setState({
      openDialogScan: true,
    });
  };
  handleCloseDialogScan = () => {
    this.setState({
      openDialogScan: false,
    });
  };
  onSaveDataScan = data => {
    this.setState(data);
  };
  render() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const { classes, addContractPage, match, intl } = this.props;
    let { orderProductChoose, orderList, localMessages } = this.state;
    const { orderProductChooseAPI, deliverimentRequest, arrKanban, kanbanStatus } = this.state;

    const { rowsPerPage, page } = this.state;
    if (orderProductChoose && orderProductChoose.length > 0 && orderProductChooseAPI.length > 0) {
      orderProductChoose = orderProductChoose.map(item => {
        const x = orderProductChooseAPI.find(n => n._id === item.productId);
        return {
          ...item,
          x,
        };
      });
    }
    if (this.state.amountDelivery.length === 0 && this.state.orderProductChooseAPI.length > 0) {
      const amountDelivery = this.state.orderProductChooseAPI.map(item => ({
        productId: item._id,
        amount: 0,
      }));
      this.state.amountDelivery = amountDelivery;
    }
    if (
      deliverimentRequest &&
      deliverimentRequest.length > 0 &&
      deliverimentRequest[0]._id &&
      orderProductChoose.length > 0 &&
      orderProductChooseAPI.length > 0
    ) {
      const temp = [];
      deliverimentRequest.forEach(item => {
        const products = [];
        item.products.forEach(pro => {
          const x = orderProductChoose.find(i => i.productId === pro.productId);
          products.push({
            productId: pro.productId,
            name: pro.name,
            amount: Number(pro.amount),
            exported: pro.exported ? Number(pro.exported) : 0,
            totalAmount: x.amount,
            price: x.costPrice ? x.costPrice : 0,
            unit: x.x.unit ? x.x.unit.name : '',
          });
        });
        const tempDate = new Date(item.timeDelivery);
        const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
          }`;
        temp.push({
          Address: item.Address,
          company: item.company,
          products,
          stage: item.stage,
          timeDelivery: date,
        });
      });
      this.state.deliverimentRequest = temp;
    }
    if (orderList && orderList.length > 0) {
      orderList = orderList.slice(rowsPerPage * page, rowsPerPage * page + rowsPerPage);
    }
    let total = 0;
    const taskFilter = {
      isProject: true,
    };
    if (this.state.customerName && (this.state.customerName._id || this.state.customerName.customerId)) {
      taskFilter.customer = this.state.customerName._id || this.state.customerName.customerId;
    }
    return (
      <div>
        {addContractPage.loading ? <LoadingIndicator /> : null}
        {/* <AppBar className={classes.HearderappBarContrac}>
        <Toolbar>
          <IconButton
            // className={id !== 'add' ? '' : ''}
            className={classes.BTNCONTRAC}
            color="inherit"
            variant="contained"
            onClick={() => {
              const isEdittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));
              if (isEdittingTrading) {
                isEdittingTrading.routingBackFromTabDialog = true;
              }
              localStorage.setItem('edittingTrading', JSON.stringify(isEdittingTrading));
              this.props.callback ? this.props.callback() : this.props.history.goBack();
              this.props.history.value = 1;
            }}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {id === '1'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới Hợp đồng' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Hợp đồng' })}`}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={this.handleSubmit}
          >
            {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
          </Button>
        </Toolbar>
        </AppBar> */}
        <CustomAppBar
          className
          title={
            id === '1'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới Hợp đồng KH' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Hợp đồng KH' })}`
          }
          onGoBack={() => {
            const isEdittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));
            if (isEdittingTrading) {
              isEdittingTrading.routingBackFromTabDialog = true;
            }
            localStorage.setItem('edittingTrading', JSON.stringify(isEdittingTrading));
            this.props.callback ? this.props.callback() : this.props.history.goBack();
            this.props.history.value = 1;
          }}
          onSubmit={this.handleSubmit}
          onScan={this.handleScan}
        />
        <Helmet>
          <title>{this.state.typeContainer === 'edit' ? 'Cập nhật hợp đồng' : 'Thêm mới hợp đồng'}</title>
          <meta name="description" content="Description of AddContractPage" />
        </Helmet>
        <KanbanStepper
          listStatus={arrKanban}
          onKabanClick={value => {
            this.setState({ kanbanStatus: value });
          }}
          activeStep={kanbanStatus}
        />
        {/* {this.state.openDetail ? ( */}
        <Drawer anchor="right" open={this.state.openDetail} onClose={this.toggleDrawer} className={classes.detailProduct}>
          <div tabIndex={0} role="button" className={classes.detailProduct}>
            {this.state.openDetail ? <ProductInforDrawer product={this.state.product} currentStock={null} onClose={this.toggleDrawer} /> : null}
          </div>
        </Drawer>
        {/* ):null} */}
        {/* <FormattedMessage {...messages.header} /> */}
        <Paper style={{ width: '100%', padding: 20 }}>
          <Grid item container spacing={24}>
            <Grid md={8} item container>
              <Typography
                component="p"
                style={{
                  fontWeight: 550,
                  fontSize: '18px',
                }}
              >
                {intl.formatMessage(messages.thongTinHopDong || { id: 'thongTinHopDong', defaultMessage: 'thongTinHopDong' })}
              </Typography>
            </Grid>

            {/*------------------- Mã hợp đồng ----------------------*/}
            {this.checkShowForm('code') && (
              <Grid item md={6}>
                {/* <TextField
                label={this.getLabelNames('code', 'Contract')}
                error={this.state.codeError || this.state.code === '' || this.state.codeTypeError}
                onChange={this.handleChangeInput}
                value={this.state.code}
                variant="outlined"
                style={{ width: '100%' }}
                name="code"
              /> */}
                <TextFieldCode
                  // label={this.getLabelNames('code',  'Contract', this.state.catalogContract)}
                  label={this.getLabelNames('code')}
                  onChange={this.handleChangeInput}
                  value={this.state.code}
                  variant="outlined"
                  style={{ width: '100%' }}
                  name="code"
                  code={5}
                />

                <FormHelperText
                  id="component-error-text"
                  style={this.state.codeError || this.state.codeTypeError ? { color: 'red' } : { color: 'red', display: 'none' }}
                >
                  {this.state.codeError ? intl.formatMessage(messages.maTrong || { id: 'maTrong', defaultMessage: 'maTrong' }) : ''}
                  {this.state.codeTypeError ? 'Mã không được chứa kí tự đặc biệt' : ''}
                </FormHelperText>
              </Grid>
            )}

            {/*------------------- tên khách hàng ----------------------*/}
            {/* {this.state.catalogContract.toString() === '2' ? (
              <Grid item md={6}>
                <TextFieldCode
                  // label={this.getLabelNames('customer', 'Contract')}
                  label={this.checkRequest('customerId')}
                  onChange={this.handleChangeInput}
                  value={this.state.customerName === null ? 'TÊN KHÁCH HÀNG' : this.state.customerName.name}
                  variant="outlined"
                  style={{ width: '100%' }}
                  name="customer"
                />
              </Grid>
            ) : ( */}
            {this.checkShowForm('catalogContract') && (
              <Grid item md={6}>
                <CustomInputBase
                  id="standard-select-currency"
                  select
                  label={this.getLabelNames('catalogContract')}
                  // label='Loại hợp đồng'
                  name="catalogContract"
                  value={this.state.catalogContract}
                  onChange={this.handleChangeInput}
                  disabled={this.state.typeContainer === 'edit'}
                  required={this.checkRequest('catalogContract')}
                // helperText="Please select your currency"
                >
                  {this.state.listContractTypes.map((i, index) => (
                    <MenuItem value={i.value}>{i.title}</MenuItem>
                  ))}
                </CustomInputBase>
              </Grid>
            )}
            {this.checkShowForm('customerId') && (
              <Grid item md={6}>
                <AsyncAutocomplete
                  style={{ width: '100%', height: '100%' }}
                  required={this.checkRequest('customerId')}
                  label={this.getLabelNames('customerId')}
                  onChange={value => {
                    this.setState({ customerName: value }, () => {
                      if (this.state.customerName !== null) {
                        this.props.onGetCustomerInfo(this.state.customerName._id);
                      }
                    });
                  }}
                  // disabled
                  error={(this.state.customerName === null || this.isEmptyObject(this.state.customerName)) && this.checkRequest('customerId')}
                  url={API_CUSTOMERS}
                  value={this.state.customerName}
                  helperText={
                    (this.state.customerName === null || this.isEmptyObject(this.state.customerName)) &&
                    this.checkRequest('customerId') &&
                    localMessages.customerId
                  }
                />
              </Grid>
            )}

            {/* )} */}

            {/*------------------- Loại hợp đồng ----------------------*/}

            {/*------------------- Tên dự án -----------------------*/}

            {this.checkShowForm('task.name') && (
              <Grid item md={6}>
                <AsyncAutocomplete
                  // isMulti
                  // name="Chọn người quản lý..."
                  label={this.getLabelNames('task.name')}
                  onChange={value => {
                    this.getProjectTree(value._id);

                    this.setState({ task: value }, () => {
                      if (this.state.task && this.state.task !== null) {
                        this.loadOptions2(this.state.task);
                      }
                    });
                  }}
                  error={(this.state.searchTaskError || this.state.task === null) && this.checkRequest('task.name')}
                  required={this.checkRequest('task.name')}
                  url={API_TASK_PROJECT}
                  value={this.state.task}
                  filter={taskFilter}
                // filter={this.handleFilter()}
                />
                <FormHelperText
                  id="component-error-text"
                  style={
                    (this.state.searchTaskError || this.state.task === null) && this.checkRequest('task.name')
                      ? { color: 'red' }
                      : { color: 'red', display: 'none' }
                  }
                >
                  {/* {intl.formatMessage(messages.timDuAnTrong || { id: 'timDuAnTrong', defaultMessage: 'timDuAnTrong' })} */}
                  {localMessages.task_name}
                </FormHelperText>
              </Grid>
            )}

            {/*------------------- Tên hợp đồng ----------------------*/}
            {this.checkShowForm('name') &&
              (this.state.catalogContract.toString() === '1' || this.state.catalogContract.toString() === '2' ? (
                <Grid item md={6}>
                  <CustomInputBase
                    label={this.getLabelNames('name')}
                    name="name"
                    required={this.checkRequest('name')}
                    error={(this.state.nameError || this.state.name === '') && this.checkRequest('name')}
                    onChange={this.handleChangeInput}
                    value={this.state.name}
                    aria-describedby="component-error-text"
                  />
                  <FormHelperText
                    id="component-error-text"
                    style={
                      (this.state.nameError || this.state.name === '') && this.checkRequest('name')
                        ? { color: 'red' }
                        : { color: 'red', display: 'none' }
                    }
                  >
                    {/* {intl.formatMessage(messages.tenTrong || { id: 'tenTrong', defaultMessage: 'tenTrong' })} */}
                    {localMessages.name}
                  </FormHelperText>
                </Grid>
              ) : (
                ''
              ))}

            {/*------------------- báo giá ----------------------*/}
            {this.checkShowForm('saleQuotation.name') &&
              (parseInt(this.state.catalogContract, 10) === 1 || parseInt(this.state.catalogContract, 10) === 2 ? (
                <React.Fragment>
                  <Grid item md={6}>
                    <CustomInputBase
                      label={this.getLabelNames('saleQuotation.name')}
                      InputProps={{
                        readOnly: true,
                      }}
                      error={this.state.saleError && this.checkRequest('saleQuotation.name')}
                      onClick={this.chooseOrder}
                      value={this.state.nameOrder}
                      name="nameOrder"
                      required={this.checkRequest('saleQuotation.name')}
                    />
                    <FormHelperText
                      id="component-error-text"
                      style={this.state.saleError && this.checkRequest('saleQuotation.name') ? { color: 'red' } : { color: 'red', display: 'none' }}
                    >
                      {/* {intl.formatMessage(messages.donHangTrong || { id: 'donHangTrong', defaultMessage: 'donHangTrong' })} */}
                      {localMessages['saleQuotation.name']}
                    </FormHelperText>
                  </Grid>
                  {/* <Grid item md={6}>
                  <TextField
                    label="Số đơn hàng"
                    value={this.state.numberOrders}
                    name="numberOrders"
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    style={{ width: '100%' }}
                  />
                </Grid> */}
                </React.Fragment>
              ) : null)}

            {/*------------------- thuộc hợp đồng ----------------------*/}

            {this.checkShowForm('belong.name') &&
              (this.state.catalogContract.toString() === '1' || this.state.catalogContract.toString() === '2' ? (
                <Grid item md={6}>
                  <CustomInputBase
                    id="standard-select-currency"
                    select
                    disabled={(this.props.id ? this.props.id : match.params.id) !== '1' && (this.props.id ? this.props.id : match.params.id) !== '2'}
                    label={this.getLabelNames('belong.name')}
                    name="belong"
                    value={this.state.belong}
                    onChange={this.handleChangeInput}
                    // error={this.state.belong === 0 && this.checkRequest('belong')}
                    required={this.checkRequest('belong.name')}
                  // helperText="Please select your currency"
                  >
                    <MenuItem value={0}>
                      {/* {intl.formatMessage(messages.chonHopDongNguyenTac || { id: 'chonHopDongNguyenTac', defaultMessage: 'chonHopDongNguyenTac' })} */}
                      {localMessages['belong.name']}
                    </MenuItem>
                    {this.props.addContractPage.allContract
                      .filter(item => item.typeContract == this.state.typeContract && (item.catalogContract == '0' || item.catalogContract == '1'))
                      .map(item => (
                        <MenuItem value={item._id} key={item._id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </CustomInputBase>
                </Grid>
              ) : (
                ''
              ))}

            {/*------------------- người chịu trách nhiệm ----------------------*/}

            {this.checkShowForm('responsible') &&
              (this.state.catalogContract.toString() === '1' || this.state.catalogContract.toString() === '2' ? (
                <Grid item md={6}>
                  <AsyncAutocomplete
                    isMulti
                    // name="Chọn người quản lý..."
                    label={this.getLabelNames('responsible')}
                    onChange={value => this.setState({ responsible: value })}
                    url={API_USERS}
                    value={this.state.responsible}
                    error={this.state.responsible === null && this.checkRequest('responsible')}
                    helperText={this.state.responsible === null && this.checkRequest('responsible') && localMessages.responsible}
                    required={this.checkRequest('responsible')}
                  />
                </Grid>
              ) : (
                ''
              ))}

            {/*------------------- Tên hợp đồng ----------------------*/}
            {this.checkShowForm('name') &&
              (this.state.catalogContract.toString() === '1' || this.state.catalogContract.toString() === '2' ? (
                ''
              ) : (
                <Grid item md={6}>
                  <CustomInputBase
                    label={this.getLabelNames('name', 'Contract')}
                    name="name"
                    required={this.checkRequest('name')}
                    error={(this.state.nameError || this.state.name === '') && this.checkRequest('name')}
                    onChange={this.handleChangeInput}
                    value={this.state.name}
                    aria-describedby="component-error-text"
                  />
                  <FormHelperText
                    id="component-error-text"
                    style={
                      (this.state.nameError || this.state.name === '') && this.checkRequest('name')
                        ? { color: 'red' }
                        : { color: 'red', display: 'none' }
                    }
                  >
                    {/* {intl.formatMessage(messages.tenTrong || { id: 'tenTrong', defaultMessage: 'tenTrong' })} */}
                    {/* {localMessages.name} */}
                    Không được để trống TÊN HỢP ĐỒNG
                  </FormHelperText>
                </Grid>
              ))}

            {/*------------------- Ngày ký hợp đồng ----------------------*/}
            {this.checkShowForm('contractSigningDate') && (
              <Grid item md={6}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    fullWidth
                    inputVariant="outlined"
                    variant="outlined"
                    format="DD/MM/YYYY"
                    label={this.getLabelNames('contractSigningDate', 'Contract')}
                    name="contractSigningDate"
                    // onChange={this.handleChangeInput}
                    onChange={e => this.handleChangeInput(e, 'contractSigningDate')}
                    value={this.state.contractSigningDate}
                    // InputProps={{ inputProps: { max: dateRaw } }}
                    error={this.state.contractSigningDateError || this.state.contractSigningDate === date}
                    required={this.checkRequest('contractSigningDate')}
                  />
                </MuiPickersUtilsProvider>

                <FormHelperText
                  id="component-error-text"
                  style={
                    (this.state.contractSigningDateError || this.state.contractSigningDate === date) && this.checkRequest('contractSigningDate')
                      ? { color: 'red' }
                      : { color: 'red', display: 'none' }
                  }
                >
                  {localMessages.contractSigningDate}
                  {/* {intl.formatMessage(messages.ngayKiTrong || { id: 'ngayKiTrong', defaultMessage: 'ngayKiTrong' })} */}
                </FormHelperText>
              </Grid>
            )}

            {/*------------------- chu kỳ ----------------------*/}

            {this.checkShowForm('cycle') &&
              (parseInt(this.state.catalogContract, 10) === 1 || parseInt(this.state.catalogContract, 10) === 2 ? (
                <React.Fragment>
                  <Grid item md={6}>
                    <CustomInputBase
                      label={this.getLabelNames('cycle', 'Contract')}
                      type="number"
                      onChange={this.handleChangeInput}
                      value={this.state.cycle}
                      name="cycle"
                      error={(this.state.cycleError || this.state.cycleRequire || this.state.cycle === '') && this.checkRequest('cycle')}
                      required={this.checkRequest('cycle')}
                    />
                    <FormHelperText
                      id="component-error-text"
                      style={this.state.cycleMin || this.state.cycleRequire ? { color: 'red' } : { color: 'red', display: 'none' }}
                    >
                      {/* {this.state.cycleRequire ? intl.formatMessage(messages.chuKiTrong || { id: 'chuKiTrong', defaultMessage: 'chuKiTrong' }) : ''} */}
                      {this.state.cycleRequire && localMessages.cycle}
                      {this.state.cycleMin ? intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' }) : ''}
                    </FormHelperText>
                  </Grid>

                  {/* <Grid item md={6}>
                  <TextField
                    label="Số đơn hàng"
                    value={this.state.numberOrders}
                    name="numberOrders"
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    style={{ width: '100%' }}
                  />
                </Grid> */}
                </React.Fragment>
              ) : null)}

            {/*------------------- ngày bắt đầu ----------------------*/}
            {this.checkShowForm('startDay') && (
              <Grid item md={6}>
                <CustomInputBase
                  label={this.getLabelNames('startDay', 'Contract')}
                  name="startDay"
                  type="date"
                  error={(this.state.dateError || this.state.startDayError || this.state.startDay === date) && this.checkRequest('startDay')}
                  required={this.checkRequest('startDay')}
                  value={this.state.startDay}
                  onChange={this.handleChangeInput}
                />
                <FormHelperText
                  id="component-error-text"
                  style={
                    (this.state.dateError || this.state.startDayError || this.state.startDay === date) && this.checkRequest('startDay')
                      ? { color: 'red' }
                      : { color: 'red', display: 'none' }
                  }
                >
                  {/* {intl.formatMessage(messages.batDauTrong || { id: 'batDauTrong', defaultMessage: 'batDauTrong' })} */}
                  {localMessages.startDay}
                </FormHelperText>
              </Grid>
            )}

            {/*------------------- chú ý ----------------------*/}

            {this.checkShowForm('notice') &&
              (parseInt(this.state.catalogContract, 10) === 1 || parseInt(this.state.catalogContract, 10) === 2 ? (
                <Grid item md={6}>
                  <CustomInputBase
                    label={this.getLabelNames('notice', 'Contract')}
                    name="notice"
                    type="number"
                    error={
                      (this.state.cycleError || this.state.noticeRequire || this.state.noticeMin || this.state.notice === '') &&
                      this.checkRequest('notice')
                    }
                    required={this.checkRequest('notice')}
                    value={this.state.notice}
                    onChange={this.handleChangeInput}
                  />
                  <FormHelperText
                    id="component-error-text"
                    style={
                      (this.state.cycleError || this.state.noticeRequire || this.state.noticeMin || this.state.notice === '') &&
                        this.checkRequest('notice')
                        ? { color: 'red' }
                        : { color: 'red', display: 'none' }
                    }
                  >
                    {this.state.noticeRequire ? localMessages.notice : ''}
                    {this.state.cycleError ? 'Báo trước phải nhỏ hơn chu kỳ! ' : ''}
                    {this.state.noticeMin ? intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' }) : ''}
                  </FormHelperText>
                </Grid>
              ) : null)}

            {/*------------------- ngày hết hạn ----------------------*/}

            {this.checkShowForm('expirationDay') &&
              (this.state.catalogContract.toString() === '1' || this.state.catalogContract.toString() === '2' ? (
                <Grid item md={6}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      inputVariant="outlined"
                      variant="outlined"
                      format="DD/MM/YYYY"
                      label={this.getLabelNames('expirationDay', 'Contract')}
                      name="expirationDay"
                      value={this.state.expirationDay}
                      error={
                        (this.state.dateError || this.state.expirationDayError || this.state.expirationDay === date) &&
                        this.checkRequest('expirationDay')
                      }
                      required={this.checkRequest('expirationDay')}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={e => this.handleChangeInput(e, 'expirationDay')}
                      style={{ width: '100%' }}
                    />
                    <FormHelperText
                      id="component-error-text"
                      style={
                        (this.state.dateError || this.state.expirationDayError || this.state.expirationDay === date) &&
                          this.checkRequest('expirationDay')
                          ? { color: 'red' }
                          : { color: 'red', display: 'none' }
                      }
                    >
                      {/* {intl.formatMessage(messages.ngayHetHanTrong || { id: 'ngayHetHanTrong', defaultMessage: 'ngayHetHanTrong' })} */}
                      {localMessages.expirationDay}
                    </FormHelperText>
                  </MuiPickersUtilsProvider>
                </Grid>
              ) : (
                <Grid item md={6}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      inputVariant="outlined"
                      variant="outlined"
                      format="DD/MM/YYYY"
                      label={this.getLabelNames('expirationDay', 'Contract')}
                      name="expirationDay"
                      value={this.state.expirationDay}
                      error={
                        // (this.state.dateError || this.state.expirationDayError || this.state.expirationDay === date) &&
                        // this.checkRequest('expirationDay')
                        this.state.dateError || this.state.expirationDayError || this.state.expirationDay === date
                      }
                      required={this.checkRequest('expirationDay')}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      // onChange={this.handleChangeInput}
                      onChange={e => this.handleChangeInput(e, 'expirationDay')}
                      style={{ width: '100%' }}
                    />
                    <FormHelperText
                      id="component-error-text"
                      style={
                        (this.state.dateError || this.state.expirationDayError || this.state.expirationDay === date) &&
                          this.checkRequest('expirationDay')
                          ? { color: 'red' }
                          : { color: 'red', display: 'none' }
                      }
                    >
                      {/* {intl.formatMessage(messages.ngayHetHanTrong || { id: 'ngayHetHanTrong', defaultMessage: 'ngayHetHanTrong' })} */}
                      {localMessages.expirationDay}
                    </FormHelperText>
                  </MuiPickersUtilsProvider>
                </Grid>
              ))}

            {/*------------------- người chịu trách nhiệm ----------------------*/}
            {this.checkShowForm('responsible') &&
              (this.state.catalogContract.toString() === '0' || this.state.catalogContract.toString() === '3' ? (
                <Grid item md={6}>
                  <AsyncAutocomplete
                    isMulti
                    // name="Chọn người quản lý..."
                    label="NGƯỜI CHỊU TRÁCH NHIỆM"
                    onChange={value => {
                      this.setState({ responsible: value });
                    }}
                    url={API_USERS}
                    value={this.state.responsible}
                    error={this.state.responsible === null && this.checkRequest('responsible')}
                    helperText={this.state.responsible === null && this.checkRequest('responsible') && localMessages.responsible}
                    required={this.checkRequest('responsible')}
                  />
                </Grid>
              ) : (
                ''
              ))}

            {/*------------------- Loại sản phẩm ----------------------*/}

            {/* ----------- thêm trường ở viewconfig -------------- */}

            {/* <Grid item md={6}>
              <TextField label="YC mua nguyên vật liệu" name="valueOption" variant="outlined" style={{ width: '100%' }} />
            </Grid> */}

            {this.state.fieldAdded.length > 0
              ? this.state.fieldAdded
                .filter(item => {
                  if (!item.filterConfig) return true;
                  if (
                    item.filterConfig &&
                    item.filterConfig[
                    !isNaN(parseInt(this.state.catalogContract, 10)) && parseInt(this.state.catalogContract, 10) < 4
                      ? parseInt(this.state.catalogContract, 10) + 1
                      : this.state.catalogContract
                    ] &&
                    item.filterConfig[
                      !isNaN(parseInt(this.state.catalogContract, 10)) && parseInt(this.state.catalogContract, 10) < 4
                        ? parseInt(this.state.catalogContract, 10) + 1
                        : this.state.catalogContract
                    ].checkedShowForm
                  ) {
                    return true;
                  }
                  return false;
                })
                .map((item, index) => {
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
            {/*------------------- 2 button ----------------------*/}

            {/* <Grid container md={12} direction="row" justify="flex-end" style={{ marginBottom: 15, marginRight: 12 }}>
              <CustomButton onClick={this.handleSubmit} color="primary">
                {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })}
              </CustomButton>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <CustomButton
                onClick={() => {
                  const isEdittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));
                  if (isEdittingTrading) {
                    isEdittingTrading.routingBackFromTabDialog = true;
                  }
                  localStorage.setItem('edittingTrading', JSON.stringify(isEdittingTrading));
                  this.props.callback ? this.props.callback() : this.props.history.goBack();
                  this.props.history.value = 1;
                }}
                color="default"
              >
                {intl.formatMessage(messages.quayLai || { id: 'quayLai', defaultMessage: 'quayLai' })}
              </CustomButton>
            </Grid> */}
          </Grid>
          <DialogLifetek title="Tải file" onClose={this.handleCloseDialogScan} open={this.state.openDialogScan}>
            <ScanFileByH onSaveDataScan={this.onSaveDataScan} onCloseDialogScan={this.handleCloseDialogScan} code="Contract" />
          </DialogLifetek>

          {/* ----------- Bảng khách hàng ----------- */}

          {this.state.customerName !== null && Object.keys(this.state.customerName).length > 0 ? (
            <Grid item container style={{ marginTop: 20, marginBottom: 20 }} spacing={24}>
              <Grid md={8} item container>
                <Typography
                  component="p"
                  style={{
                    fontWeight: 550,
                    fontSize: '18px',
                  }}
                >
                  {intl.formatMessage(messages.thongTinKhachHang || { id: 'thongTinKhachHang', defaultMessage: 'thongTinKhachHang' })}
                </Typography>
              </Grid>
              <Grid item md={6}>
                <CustomInputBase
                  label={intl.formatMessage(messages.tenKhachHang || { id: 'tenKhachHang', defaultMessage: 'tenKhachHang' })}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={this.state.customerName.name}
                />
              </Grid>
              <Grid item md={6}>
                <CustomInputBase
                  label={intl.formatMessage(messages.congty || { id: 'congty', defaultMessage: 'congty' })}
                  InputProps={{
                    readOnly: true,
                  }}
                  value=""
                />
              </Grid>
              <Grid item md={6}>
                <CustomInputBase
                  label={intl.formatMessage(messages.diaChi || { id: 'diaChi', defaultMessage: 'diaChi' })}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={this.state.customerName.address}
                />
              </Grid>
              <Grid item md={6}>
                <CustomInputBase
                  label={intl.formatMessage(messages.dienThoai || { id: 'dienThoai', defaultMessage: 'dienThoai' })}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={this.state.customerName.phoneNumber}
                  variant="outlined"
                  style={{ width: '100%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          ) : (
            ''
          )}
          <UpdatePaymentRequestDialog
            handleAddtoList={this.onAddToListPayment}
            open={this.state.open2}
            intl={intl}
            messages={messages}
            handleClose={this.handleClose2}
            currentStage={Object.assign({}, this.state.currentStage)}
            classes={classes}
            totalMoney={this.state.totalMoney}
            minday={this.state.contractSigningDate}
            taskChoose={this.state.task}
            jobs={this.state.jobs}
            edit={this.state.typeContainer === 'edit' ? 'true' : 'false'}
          />

          {/* --------- bảng bên dưới ----------- */}

          <Grid item container spacing={48} style={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ marginTop: 10, marginBottom: 10, zIndex: '0 !important' }} color="default">
              <Tabs value={this.state.value} indicatorColor="primary" textColor="primary" onChange={this.handleChangeTabList}>
                <Tab
                  style={
                    parseInt(this.state.catalogContract, 10) === 3 || parseInt(this.state.catalogContract, 10) === 2
                      // parseInt(this.state.catalogContract, 10) === 2
                      ? { display: 'block' }
                      : { display: 'none' }
                  }
                  label={intl.formatMessage(messages.yeuCauSanPham || { id: 'yeuCauSanPham', defaultMessage: 'yeuCauSanPham' })}
                />

                <Tab label={intl.formatMessage(messages.yeuCauThanhToan || { id: 'yeuCauThanhToan', defaultMessage: 'yeuCauThanhToan' })} />

                <Tab
                  style={this.state.typeContainer === 'edit' ? { display: 'block' } : { display: 'none' }}
                  label={intl.formatMessage(messages.yeuCauGiaoHang || { id: 'yeuCauGiaoHang', defaultMessage: 'yeuCauGiaoHang' })}
                />
                {/* <Tab label={intl.formatMessage(messages.yeuCauKhac || { id: 'yeuCauKhac', defaultMessage: 'yeuCauKhac' })} /> */}
                <Tab label={'Tài liệu đính kèm'} />

                <Tab label={intl.formatMessage({ id: 'giaiDoan', defaultMessage: 'LỊCH SỬ HỢP ĐỒNG' })} />
              </Tabs>
            </AppBar>
            {this.state.value === 0 && (parseInt(this.state.catalogContract, 10) === 1 || parseInt(this.state.catalogContract, 10) === 2) ? (
              <Paper style={{ width: '100%' }}>
                {/* -----------------------------------Danh sách sản phẩm------------------------------------------------ */}
                <Grid style={{ display: 'block' }}>
                  {!this.state.nameOrder ? (
                    <CustomButton style={{ margin: 15 }} color="primary" aria-label="Add" size="small" onClick={this.chooseOrderWithoutSale}>
                      {intl.formatMessage(messages.ycttThemMoi || { id: 'ycttThemMoi', defaultMessage: 'ycttThemMoi' })}
                    </CustomButton>
                  ) : (
                    <CustomButton style={{ margin: 15 }} color="primary" aria-label="Reset" size="small" onClick={this.handleResetProduct}>
                      {intl.formatMessage(messages.tuyChinh || { id: 'tuyChinh', defaultMessage: 'tuyChinh' })}
                    </CustomButton>
                  )}
                </Grid>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{intl.formatMessage(messages.ycspName || { id: 'ycspName', defaultMessage: 'ycspName' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycspGia || { id: 'ycspGia', defaultMessage: 'ycspGia' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycspSoLuong || { id: 'ycspSoLuong', defaultMessage: 'ycspSoLuong' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycspDonViTinh || { id: 'ycspDonViTinh', defaultMessage: 'ycspDonViTinh' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycspChietKhau || { id: 'ycspChietKhau', defaultMessage: 'ycspChietKhau' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycspThanhTien || { id: 'ycspThanhTien', defaultMessage: 'ycspThanhTien' })}</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                    {orderProductChoose
                      ? orderProductChoose.map(item => {
                        total += item.x
                          ? item.costPrice
                            ? (Number(item.costPrice) * parseInt(item.amount, 10) * (100 - (item.discount || 0))) / 100
                            : 0
                          : item.costPrice
                            ? (Number(item.costPrice) * parseInt(item.amount, 10) * (100 - (item.discount || 0))) / 100
                            : 0;
                        return (
                          <TableRow>
                            <TableCell>
                              <CustomButton color="primary" onClick={() => this.toggleDrawer(item)}>
                                {item.name}
                              </CustomButton>
                            </TableCell>
                            <TableCell>{item.costPrice}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>{item.x ? (item.x.unit ? item.x.unit.name : '') : item.unit}</TableCell>
                            <TableCell>{item.discount ? item.discount : 0}%</TableCell>
                            <TableCell>{this.handlePriceProduct(item)}</TableCell>
                            <TableCell>
                              {!this.state.nameOrder && (
                                <Fab color="primary" aria-label="Delete" size="small" className="mr-1" onClick={() => this.editProduct(item)}>
                                  <Edit />
                                </Fab>
                              )}
                              {!this.state.nameOrder && (
                                <Fab color="primary" aria-label="Edit" size="small" onClick={() => this.confirmDelete(item)}>
                                  <Delete />
                                </Fab>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                      : ''}
                    <TableRow>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell>
                        {intl.formatMessage(messages.ycspGiaTriDonHang || { id: 'ycspGiaTriDonHang', defaultMessage: 'ycspGiaTriDonHang' })}
                      </TableCell>
                      <TableCell>{formatNumber(total)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            ) : (
              ''
            )}
            {/* giai đoạn thanh toán */}
            {this.state.value === 1 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  <CustomButton style={{ margin: 15 }} color="primary" aria-label="Add" size="small" onClick={this.addToPaymentOrder}>
                    {intl.formatMessage(messages.ycttThemMoi || { id: 'ycttThemMoi', defaultMessage: 'ycttThemMoi' })}
                  </CustomButton>
                </Grid>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{intl.formatMessage(messages.ycttTen || { id: 'ycttTen', defaultMessage: 'ycttTen' })}</TableCell>
                      <TableCell>
                        {intl.formatMessage(messages.ycttNgayKiBienBan || { id: 'ycttNgayKiBienBan', defaultMessage: 'ycttNgayKiBienBan' })}
                      </TableCell>
                      <TableCell>{intl.formatMessage(messages.ycttSoTien || { id: 'ycttSoTien', defaultMessage: 'ycttSoTien' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycttTrangThai || { id: 'ycttTrangThai', defaultMessage: 'ycttTrangThai' })}</TableCell>
                      <TableCell>VAT</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycttHanhDong || { id: 'ycttHanhDong', defaultMessage: 'ycttHanhDong' })}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.paymentOrder.length > 0
                      ? this.state.paymentOrder.map((item, index) => (
                        <TableRow>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{moment(item.timePay).format('DD-MM-YYYY')}</TableCell>
                          <TableCell>{formatNumber(item.amount)}</TableCell>
                          <TableCell>
                            {item.statusPay === 0
                              ? `${intl.formatMessage(
                                messages.ycttChuaNghiemThu || { id: 'ycttChuaNghiemThu', defaultMessage: 'ycttChuaNghiemThu' },
                              )}`
                              : item.statusPay === 1
                                ? `${intl.formatMessage(messages.ycttDaThanhLy || { id: 'ycttDaThanhLy', defaultMessage: 'ycttDaThanhLy' })}`
                                : item.statusPay === 2
                                  ? `${intl.formatMessage(
                                    messages.ycttDenNghiThanhToan || { id: 'ycttDenNghiThanhToan', defaultMessage: 'Đề nghị thanh toán' },
                                  )}`
                                  : `${intl.formatMessage(
                                    messages.ycttDaNghiemThu || { id: 'ycttDaNghiemThu', defaultMessage: 'ycttDaNghiemThu' },
                                  )}`}
                          </TableCell>
                          <TableCell>
                            {item.VAT === false
                              ? `${intl.formatMessage(messages.ycttKhong || { id: 'ycttKhong', defaultMessage: 'ycttKhong' })}`
                              : `${intl.formatMessage(messages.ycttCo || { id: 'ycttCo', defaultMessage: 'ycttCo' })}`}
                          </TableCell>

                          <TableCell>
                            <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editToPaymentOrder(index)}>
                              <Edit />
                            </Fab>
                            {/* &nbsp;&nbsp;
                              <Fab color="inherit" aria-label="Add" size="small" onClick={() => this.deleteToPaymentOrder(index)}>
                                <InsertDriveFile />
                              </Fab> */}
                            &nbsp;&nbsp;
                            <Fab color="secondary" aria-label="Add" size="small" onClick={() => this.deleteToPaymentOrder(index)}>
                              <Delete />
                            </Fab>
                          </TableCell>
                        </TableRow>
                      ))
                      : ''}
                  </TableBody>
                </Table>
              </Paper>
            )}
            {this.state.value === 3 && (
              <Grid item md={12}>
                <Paper>
                  <FileUpload disableWhenApproved code="Contract" name={this.state.name} id={id} />
                </Paper>
              </Grid>
            )}
            {/* yêu cầu giao hàng */}
            {this.state.value === 2 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  <CustomButton style={{ margin: 15 }} color="primary" aria-label="Add" size="small" onClick={this.addToDeliverPayment}>
                    {intl.formatMessage(messages.ycghThemMoi || { id: 'ycghThemMoi', defaultMessage: 'ycghThemMoi' })}
                  </CustomButton>
                </Grid>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{intl.formatMessage(messages.ycghGiaiDoan || { id: 'ycghGiaiDoan', defaultMessage: 'ycghGiaiDoan' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghThoiGian || { id: 'ycghThoiGian', defaultMessage: 'ycghThoiGian' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghCongTy || { id: 'ycghCongTy', defaultMessage: 'ycghCongTy' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghDiaDiem || { id: 'ycghDiaDiem', defaultMessage: 'ycghDiaDiem' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghSanPham || { id: 'ycghSanPham', defaultMessage: 'ycghSanPham' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghHanhDong || { id: 'ycghHanhDong', defaultMessage: 'ycghHanhDong' })}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                    {this.state.deliverimentRequest.length > 0
                      ? this.state.deliverimentRequest.map((item, index) => {
                        let count = 0;
                        item.products.forEach(n => {
                          if (n.exported && Number(n.exported) > 0) {
                            count++;
                          }
                        });
                        return (
                          <TableRow>
                            <TableCell>{this.state.paymentOrder[Number(item.stage)].name}</TableCell>
                            <TableCell>{moment(item.timeDelivery).format('DD-MM-YYYY')}</TableCell>
                            <TableCell>{item.company}</TableCell>
                            <TableCell>{item.Address}</TableCell>
                            <TableCell>
                              <CustomButton color="primary" onClick={() => this.editTodeliverimentRequest(index, -2)}>
                                {intl.formatMessage(messages.ycghChiTiet || { id: 'ycghChiTiet', defaultMessage: 'ycghChiTiet' })}
                              </CustomButton>
                            </TableCell>

                            {count > 0 ? null : (
                              <TableCell>
                                <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editTodeliverimentRequest(index, -1)}>
                                  <Edit />
                                </Fab>
                                &nbsp;&nbsp;
                                <Fab color="secondary" aria-label="Add" size="small" onClick={() => this.deleteTodeliverimentRequest(index)}>
                                  <Delete />
                                </Fab>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })
                      : ''}
                  </TableBody>
                </Table>
              </Paper>
            )}
            {this.state.value === 4 && (
              <Grid item md={12}>
                <ListPage
                  disableEdit
                  disableAdd
                  convertTree
                  disableDot
                  // client
                  disableSelect
                  code="ModuleHistory"
                  filter={{
                    id: id,
                  }}
                  // taskId={addProjects._id}
                  // columns={supplierColumns}
                  apiUrl={API_HISTORY}
                // filter={{ typeContract: '1', 'taskId': addProjects._id }}
                // mapFunction={this.mapContract}
                />
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* -------- Danh sách báo giá ---------- */}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose}>
            Danh sách báo giá
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <Grid container spacing={8}>
              <Grid item md={4}>
                <CustomInputBase
                  label={intl.formatMessage(messages.hdTuNgay || { id: 'hdTuNgay', defaultMessage: 'hdTuNgay' })}
                  name="searchStartDay"
                  type="date"
                  value={this.state.searchStartDay}
                  onChange={this.handleChangeInput}
                />
              </Grid>

              <Grid item md={4}>
                <CustomInputBase
                  label={intl.formatMessage(messages.hdDenNgay || { id: 'hdDenNgay', defaultMessage: 'hdDenNgay' })}
                  name="searchEndDay"
                  type="date"
                  value={this.state.searchEndDay}
                  onChange={this.handleChangeInput}
                />
              </Grid>

              <Grid item md={4} className="pt-3">
                <CustomButton size="large" color="primary" onClick={this.searchOrder} className={classes.searchBtn}>
                  {intl.formatMessage(messages.timKiem || { id: 'timKiem', defaultMessage: 'timKiem' })}
                </CustomButton>
              </Grid>
            </Grid>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{intl.formatMessage(messages.hdMa || { id: 'hdMa', defaultMessage: 'hdMa' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.hdName || { id: 'hdName', defaultMessage: 'hdName' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.hdKhachHang || { id: 'hdKhachHang', defaultMessage: 'hdKhachHang' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.hdGiaTri || { id: 'hdGiaTri', defaultMessage: 'hdGiaTri' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.hdHanhDong || { id: 'hdHanhDong', defaultMessage: 'hdHanhDong' })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.orderList.length > 0
                  ? this.state.orderList
                    .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                    .map((item, index) => {
                      let amount = 0;
                      if (item.products) {
                        item.products.forEach(n => {
                          amount += n.amount ? n.amount : 0;
                        });
                      }
                      return (
                        <TableRow>
                          <TableCell>{item.code}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.customer ? item.customer.name : ''}</TableCell>
                          <TableCell>{amount}</TableCell>
                          <TableCell>
                            <Fab
                              color="primary"
                              aria-label="Add"
                              size="small"
                              onClick={() => {
                                this.addToListOrder(index + this.state.page * this.state.rowsPerPage)
                              }}
                            >
                              <Add />
                            </Fab>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  : ''}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[15, 30, 50]}
              component="div"
              count={this.state.orderList.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              backIconButtonProps={{
                'aria-label': 'Trang trước',
              }}
              nextIconButtonProps={{
                'aria-label': 'Trang tiếp theo',
              }}
              labelRowsPerPage="Hiển thị: "
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </DialogContent>
        </Dialog>

        {/* -------- Sửa sản phẩm ---------------  */}

        <Dialog
          open={this.state.openEditProduct}
          fullWidth
          maxWidth="md"
          onClose={this.handleCloseEditProduct}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" onClose={this.handleCloseEditProduct}>
            Sửa danh sách sản phẩm
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <ValidatorForm style={{ width: '100%' }} onSubmit={this.handleSave}>
              <Grid item container md={12}>
                <Grid item md={12}>
                  <TextValidator
                    label="Giá sản phẩm"
                    name="costPrice"
                    value={this.state.chooseProductPrice}
                    onChange={val => this.setState({ chooseProductPrice: val.target.value && val.target.value.replace(/^0+/, '') })}
                    variant="outlined"
                    type="number"
                    style={{ width: '100%', display: 'flex !important' }}
                    margin="normal"
                  // validators={['minNumber:0', this.state.currentStage.currency === '%' ? 'maxNumber: 100' : 'matchRegexp:[0-9]']}
                  // errorMessages={[
                  //   `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                  //   this.state.currentStage.currency === '%'
                  //     ? 'Không vượt quá 100%'
                  //     : `${intl.formatMessage(messages.canNhapSo || { id: 'canNhapSo', defaultMessage: 'canNhapSo' })}`,
                  // ]}
                  />

                  <TextValidator
                    label="Số lượng sản phẩm"
                    name="amount"
                    value={this.state.chooseProductAmount}
                    onChange={val => this.setState({ chooseProductAmount: val.target.value && val.target.value.replace(/^0+/, '') })}
                    variant="outlined"
                    type="number"
                    style={{ width: '100%', display: 'flex !important' }}
                    margin="normal"
                  // validators={['minNumber:0', this.state.currentStage.currency === '%' ? 'maxNumber: 100' : 'matchRegexp:[0-9]']}
                  // errorMessages={[
                  //   `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                  //   this.state.currentStage.currency === '%'
                  //     ? 'Không vượt quá 100%'
                  //     : `${intl.formatMessage(messages.canNhapSo || { id: 'canNhapSo', defaultMessage: 'canNhapSo' })}`,
                  // ]}
                  />

                  <TextValidator
                    label="Chiết khẩu"
                    name="discount"
                    value={this.state.chooseProductDiscount && this.state.chooseProductDiscount}
                    onChange={val => this.setState({ chooseProductDiscount: val.target.value })}
                    variant="outlined"
                    type="number"
                    style={{ width: '100%', display: 'flex !important' }}
                    margin="normal"
                  // validators={['minNumber:0', this.state.currentStage.currency === '%' ? 'maxNumber: 100' : 'matchRegexp:[0-9]']}
                  // errorMessages={[
                  //   `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                  //   this.state.currentStage.currency === '%'
                  //     ? 'Không vượt quá 100%'
                  //     : `${intl.formatMessage(messages.canNhapSo || { id: 'canNhapSo', defaultMessage: 'canNhapSo' })}`,
                  // ]}
                  />
                </Grid>
              </Grid>
            </ValidatorForm>
          </DialogContent>
          <DialogActions>
            <CustomButton
              onClick={() => {
                this.confirmEditProduct();
              }}
              color="primary"
              autoFocus
              variant="outlined"
            >
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </CustomButton>
            <CustomButton variant="outlined" color="secondary" onClick={this.handleCloseEditProduct}>
              {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
            </CustomButton>
          </DialogActions>
        </Dialog>

        {/* -------- Danh sách sản phẩm ---------- */}
        <Dialog
          open={this.state.openChooseSale}
          onClose={this.handleCloseChooseSale}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title" onClose={this.handleCloseChooseSale}>
            Danh sách sản phẩm
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{intl.formatMessage(messages.ycspName || { id: 'ycspName', defaultMessage: 'ycspName' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.ycspGia || { id: 'ycspGia', defaultMessage: 'ycspGia' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.ycspSoLuong || { id: 'ycspSoLuong', defaultMessage: 'ycspSoLuong' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.ycspDonViTinh || { id: 'ycspDonViTinh', defaultMessage: 'ycspDonViTinh' })}</TableCell>
                  {/* <TableCell>{intl.formatMessage(messages.ycspChietKhau || { id: 'ycspChietKhau', defaultMessage: 'ycspChietKhau' })}</TableCell>
                  <TableCell>{intl.formatMessage(messages.ycspThanhTien || { id: 'ycspThanhTien', defaultMessage: 'ycspThanhTien' })}</TableCell> */}
                  <TableCell>{intl.formatMessage(messages.hdHanhDong || { id: 'hdHanhDong', defaultMessage: 'hdHanhDong' })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.allProduct.length > 0
                  ? this.state.allProduct
                    .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                    .map(item => {
                      let amount = 0;
                      if (item.sellingPoint) {
                        item.sellingPoint.forEach(n => {
                          amount += n.amount ? n.amount : 0;
                        });
                      }
                      return (
                        <TableRow>
                          <TableCell>
                            <CustomButton color="primary" onClick={() => this.toggleDrawer(item)}>
                              {item.name}
                            </CustomButton>
                          </TableCell>
                          <TableCell>
                            {/* {item.costPrice ? formatNumber(item.costPrice) : item.x.pricePolicy ? formatNumber(item.x.pricePolicy.costPrice) : ''} */}
                            {formatNumber(item.pricePolicy.costPrice)}
                          </TableCell>
                          <TableCell>{amount}</TableCell>
                          <TableCell>{item.unit && item.unit.name}</TableCell>
                          {/* <TableCell>{item.discount}%</TableCell>
                            <TableCell>
                              {item.x
                                ? item.costPrice
                                  ? formatNumber((Number(item.costPrice) * parseInt(item.amount, 10) * (100 - item.discount)) / 100)
                                  : ''
                                : ''}
                            </TableCell> */}
                          <TableCell>
                            <Fab color="primary" aria-label="Add" size="small" onClick={() => {
                              this.addToListOrder2(item)
                            }}>
                              <Add />
                            </Fab>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  : ''}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[15, 30, 50]}
              component="div"
              count={this.state.allProduct.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              backIconButtonProps={{
                'aria-label': 'Trang trước',
              }}
              nextIconButtonProps={{
                'aria-label': 'Trang tiếp theo',
              }}
              labelRowsPerPage="Hiển thị: "
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={this.state.open3} onClose={this.handleClose3} fullWidth maxWidth="md">
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose3}>
            {intl.formatMessage(messages.ycghCapnhat || { id: 'ycghCapnhat', defaultMessage: 'ycghCapnhat' })}
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            {/* &nbsp;&nbsp;&nbsp;
            <TextField
              label="Đến ngày"
              name="searchEndDay"
              type="date"
              value={this.state.searchEndDay}
              onChange={this.handleChangeInput}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ width: '100%' }}
            /> */}
            <ValidatorForm style={{ width: '100%' }} onSubmit={this.handleSubmitForm}>
              <Grid item md={12} container>
                <Grid item md={12}>
                  <TextValidator
                    label={intl.formatMessage(messages.ycghGiaiDoan || { id: 'ycghGiaiDoan', defaultMessage: 'ycghGiaiDoan' })}
                    name="stage"
                    select
                    disabled={this.state.isEditDelivery === -2}
                    value={this.state.currentDeliverRequest.stage}
                    onChange={(e) => this.handleChangeInputDeliverRequest(e, false)}
                    variant="outlined"
                    style={{ width: '100%' }}
                    validators={['required']}
                    margin="normal"
                    errorMessages={[`${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`]}
                  >
                    {this.state.paymentOrder.map((item, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <MenuItem value={index} key={index}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextValidator>
                </Grid>
                <Grid item md={4} style={{ padding: 25 }}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DatePicker
                      fullWidth
                      inputVariant="outlined"
                      variant="outlined"
                      format="DD/MM/YYYY"
                      label={intl.formatMessage(messages.ycghThoiGian || { id: 'ycghThoiGian', defaultMessage: 'ycghThoiGian' })}
                      name="timeDelivery"
                      disabled={this.state.isEditDelivery === -2}
                      onChange={(e) => this.handleChangeInputDeliverRequest(e, true)}
                      value={this.state.contractSigningDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      validators={['required', 'trim']}
                      errorMessages={[
                        `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                        `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                      ]}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                {/* <TextValidator
                  label={intl.formatMessage(messages.ycghThoiGian || { id: 'ycghThoiGian', defaultMessage: 'ycghThoiGian' })}
                  name="timeDelivery"
                  type="date"
                  disabled={this.state.isEditDelivery === -2}
                  value={this.state.currentDeliverRequest.timeDelivery}
                  onChange={this.handleChangeInputDeliverRequest}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  margin="normal"
                  variant="outlined"
                  style={{ width: '100%' }}
                  validators={['required', 'trim']}
                  errorMessages={[
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                  ]}
                /> */}
                <Grid item md={4} style={{ padding: 10 }}>
                  <TextValidator
                    label={intl.formatMessage(messages.ycghCongTy || { id: 'ycghCongTy', defaultMessage: 'ycghCongTy' })}
                    name="company"
                    disabled={this.state.isEditDelivery === -2}
                    value={this.state.currentDeliverRequest.company}
                    onChange={(e) => this.handleChangeInputDeliverRequest(e, false)}
                    variant="outlined"
                    style={{ width: '100%' }}
                    margin="normal"
                    validators={['required', 'trim']}
                    errorMessages={[
                      `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                      `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                    ]}
                  />
                </Grid>
                <Grid item md={4} style={{ padding: '10px 20px 10px 10px' }}>
                  <TextValidator
                    label={intl.formatMessage(messages.ycghDiaDiem || { id: 'ycghDiaDiem', defaultMessage: 'ycghDiaDiem' })}
                    name="Address"
                    disabled={this.state.isEditDelivery === -2}
                    value={this.state.currentDeliverRequest.Address}
                    onChange={(e) => this.handleChangeInputDeliverRequest(e, false)}
                    variant="outlined"
                    margin="normal"
                    style={{ width: '100%' }}
                    validators={['required', 'trim']}
                    errorMessages={[
                      `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                      `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                    ]}
                  />
                </Grid>
              </Grid>
              <Paper style={{ marginTop: 20 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{intl.formatMessage(messages.ycghTen || { id: 'ycghTen', defaultMessage: 'ycghTen' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghDonGia || { id: 'ycghDonGia', defaultMessage: 'ycghDonGia' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghConLai || { id: 'ycghConLai', defaultMessage: 'ycghConLai' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghSoLuong || { id: 'ycghSoLuong', defaultMessage: 'ycghSoLuong' })}</TableCell>
                      <TableCell>{intl.formatMessage(messages.ycghDonVi || { id: 'ycghDonVi', defaultMessage: 'ycghDonVi' })}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.currentDeliverRequest.products.map((item, index) => {
                      const amountDelivery1 = this.state.amountDelivery.find(n => n.productId === item.productId);
                      const amountDelivery = Object.assign({}, amountDelivery1);
                      let amountDeliveryNumberic = Number(item.totalAmount) - (Number(amountDelivery.amount) || 0) - (Number(item.amount) || 0);
                      if (this.state.isEditDelivery > -1) {
                        // sửa
                        let totalDelivery = 0;
                        const { deliverimentRequest } = this.state;
                        deliverimentRequest.forEach((deli, indexDeli) => {
                          if (indexDeli !== this.state.isEditDelivery) {
                            const cur = deli.products.find(n => item.productId === n.productId);
                            totalDelivery += Number(cur.amount);
                          }
                        });
                        amountDeliveryNumberic = item.totalAmount - totalDelivery - (Number(item.amount) || 0);
                      }
                      if (Number(this.state.isEditDelivery) === -2) {
                        // xem
                        amountDeliveryNumberic = Number(item.totalAmount) - Number(amountDelivery.amount);
                      }
                      return (parseInt(amountDelivery.amount, 10) !== item.totalAmount && this.state.isEditDelivery === -1) ||
                        this.state.isEditDelivery === -2 ||
                        this.state.isEditDelivery > -1 ? (
                        <TableRow>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>
                            {amountDeliveryNumberic}/{item.totalAmount}
                          </TableCell>
                          <TableCell>

                            <TextValidator
                              type="number"
                              variant="outlined"
                              style={{ width: 100 }}
                              disabled={this.state.isEditDelivery === -2}
                              name="amount"
                              validators={['minNumber:0',
                                // `maxNumber:${item.totalAmount - parseInt(amountDelivery.amount, 10)}`
                                `maxNumber:${item.totalAmount}`
                              ]}
                              errorMessages={[
                                item.amount < 0
                                  ? `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}` : '',
                                item.amount > item.totalAmount
                                  ? `${intl.formatMessage(
                                    messages.khongVuotQuaSoLuong || { id: 'khongVuotQuaSoLuong', defaultMessage: 'khongVuotQuaSoLuong' },
                                  )}`
                                  : '',
                              ]}
                              value={item.amount}
                              onChange={e => this.handleChangeInputDeliverRequestProduct(e, index)}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                        </TableRow>
                      ) : (
                        ''
                      );
                    })}
                  </TableBody>
                  <TableFooter />
                </Table>
              </Paper>
              <div style={{ display: 'none' }}>
                <button ref={this.submitBtn} type="submit" />
              </div>
            </ValidatorForm>
          </DialogContent>
          <DialogActions style={this.state.isEditDelivery === -2 ? { display: 'none' } : {}}>
            <CustomButton
              style={{ margin: 20 }}
              onClick={() => {
                this.submitBtn.current.click();
              }}
              color="primary"
              autoFocus
              variant="outlined"
            >
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </CustomButton>
            <CustomButton variant="outlined" color="secondary" style={{ margin: 20 }} onClick={this.handleClose3}>
              {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
            </CustomButton>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.open4} onClose={this.handleClose4}>
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose4}>
            {intl.formatMessage(messages.thongBao || { id: 'thongBao', defaultMessage: 'thongBao' })}
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            {intl.formatMessage(messages.noiDungThongBaoXoa || { id: 'noiDungThongBaoXoa', defaultMessage: 'noiDungThongBaoXoa' })}
          </DialogContent>
          <DialogActions style={this.state.isEditDelivery === -2 ? { display: 'none' } : {}}>
            <CustomButton style={{ margin: 20 }} onClick={() => this.deleteFromListOrder()} color="primary" autoFocus>
              {intl.formatMessage({ id: 'dialog.confirm' })}
            </CustomButton>
            <CustomButton style={{ margin: 20 }} onClick={this.handleClose4}>
              {intl.formatMessage({ id: 'dialog.cancel' })}
            </CustomButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  chooseOrderWithoutSale = () => {
    this.props.onGetAllProduct();
    this.setState({ openChooseSale: true });
  };

  editProduct = item => {
    this.setState({
      chooseItem: item,
      chooseProductPrice: item.costPrice,
      chooseProductAmount: item.amount,
      chooseProductDiscount: item.discount,
      openEditProduct: true,
    });
  };

  confirmEditProduct = () => {
    const { orderProductChoose, chooseItem, chooseProductPrice, chooseProductAmount, chooseProductDiscount } = this.state;
    const itemIndex = orderProductChoose.map(item => item.id).indexOf(chooseItem.id);
    orderProductChoose[itemIndex].costPrice = chooseProductPrice;
    orderProductChoose[itemIndex].amount = chooseProductAmount;
    orderProductChoose[itemIndex].discount = chooseProductDiscount;
    this.handleCloseEditProduct();
  };

  handleChangeAddedField = (index, e) => {
    const { fieldAdded } = this.state;
    const fields = [...fieldAdded];
    fieldAdded[index].value = e.target.value;
    this.setState({ fieldAdded: fields });
  };

  handleSubmit = () => {
    // const { match } = this.props;
    let error = false;
    // if (this.state.expirationDay === null) {
    //   this.setState({
    //     expirationDayError: true,
    //   });
    //   error = true;
    // }
    // if (this.state.startDay === null) {
    //   this.setState({
    //     startDayError: true,
    //   });
    //   error = true;
    // }
    // if (this.state.task === null && (this.state.catalogContract.toString() === '1' || this.state.catalogContract.toString() === '2')) {
    //   this.setState({
    //     searchTaskError: true,
    //   });
    //   error = true;
    // }
    // if (this.state.contractSigningDate === null) {
    //   this.setState({
    //     contractSigningDateError: true,
    //   });
    //   error = true;
    // }
    // if (parseInt(this.state.catalogContract, 10) === 1) {
    //   if (this.state.notice === '') {
    //     this.setState({
    //       noticeRequire: true,
    //     });
    //     error = true;
    //   }
    //   if (this.state.cycle === '') {
    //     this.setState({
    //       cycleRequire: true,
    //     });
    //     error = true;
    //   }
    // }
    // if (this.state.code === '') {
    //   this.setState({
    //     codeError: true,
    //   });
    //   error = true;
    // }
    // const rex = /^[A-Za-z0-9]+$/;
    // if (Number(this.state.cycle) < 0) {
    //   this.setState({
    //     cycleMin: true,
    //   });
    //   error = true;
    // }
    // if (Number(this.state.notice) < 0) {
    //   this.setState({
    //     noticeMin: true,
    //   });
    //   error = true;
    // }
    // if (this.state.notice > this.state.cycle) {
    //   this.setState({
    //     cycleError: true,
    //   });
    //   error = true;
    // }
    // if (this.state.startDay !== null && this.state.expirationDay !== null && this.state.contractSigningDate !== null) {
    //   if (this.state.startDay >= this.state.expirationDay) {
    //     this.setState({
    //       dateError: true,
    //     });
    //     error = true;
    //     if (Number(this.state.catalogContract) === 1 || Number(this.state.catalogContract) === 2) {
    //       this.props.onChangeSnackbar(true, `Ngày kí hợp đồng phải nhỏ hơn bằng ngày bắt đầu và nhỏ hơn bằng ngày giao hàng!`, 'error');
    //     } else {
    //       this.props.onChangeSnackbar(true, `Ngày kí hợp đồng phải nhỏ hơn bằng ngày bắt đầu và nhỏ hơn bằng ngày hết hạn!`, 'error');
    //     }
    //   }
    //   if (this.state.contractSigningDate > this.state.startDay) {
    //     this.setState({
    //       dateError: true,
    //     });
    //     error = true;
    //     if (Number(this.state.catalogContract) === 1 || Number(this.state.catalogContract) === 2) {
    //       this.props.onChangeSnackbar(true, `Ngày kí hợp đồng phải nhỏ hơn bằng ngày bắt đầu và nhỏ hơn bằng ngày giao hàng!`, 'error');
    //     } else {
    //       this.props.onChangeSnackbar(true, `Ngày kí hợp đồng phải nhỏ hơn bằng ngày bắt đầu và nhỏ hơn bằng ngày hết hạn!`, 'error');
    //     }
    //   }
    // }
    // const id = this.props.id ? this.props.id : this.props.match.params.id;
    if (this.state.name === '') {
      this.props.onChangeSnackbar(true, `Tên hợp đồng không được để trống!`, 'error');
    } else if (
      this.state.expirationDay !== null &&
      this.state.contractSigningDate &&
      moment(this.state.expirationDay).diff(moment(this.state.contractSigningDate)) < 0
    ) {
      this.setState({
        expirationDayError: true,
        contractSigningDateError: true,
      });
      this.props.onChangeSnackbar(true, `Ngày hết hạn phải lớn hơn ngày ký hợp đồng!`, 'error');
      error = true;
    }
    if (!error) {
      const others = {};
      if (this.state.fieldAdded.length > 0) {
        this.state.fieldAdded.forEach(item => {
          others[item.name.replace('others.', '')] = item.value;
        });
      }
      let kanbanStatus = 0;
      if (this.state.kanbanStatus === 0) {
        kanbanStatus = this.state.arrKanban[0]._id;
      } else {
        kanbanStatus = this.state.kanbanStatus;
      }
      const body = {
        customerId: this.state.customerName ? this.state.customerName._id : null,
        name: this.state.name,
        code: this.state.code,
        catalogContract: this.state.catalogContract,
        contractSigningDate: this.state.contractSigningDate,
        startDay: this.state.startDay,
        expirationDay: this.state.expirationDay,
        belong: {
          contractId: this.state.belong,
          name: this.state.belongName,
        },
        cycle: this.state.cycle,
        notice: this.state.notice,
        typeContract: 1,
        paymentRequest: this.state.paymentOrder,
        saleQuotation:
          (parseInt(this.state.catalogContract, 10) === 1 || parseInt(this.state.catalogContract, 10) === 2)
            ? {
              name: this.state.nameOrder,
              saleQuotationId: this.state.idCodeOrder,
            }
            : undefined,
        listProduct: this.state.orderProductChoose,
        deliverimentRequest: this.state.deliverimentRequest,
        kanbanStatus,
        task: this.state.task ? { taskId: this.state.task._id || this.state.task.taskId, name: this.state.task.name } : null,
        productType: this.state.productType,
        otherRequest: {
          urlFile: this.state.file,
          nameFile: this.state.fileName,
          note: this.state.fileNote,
          createdAt: new Date(),
        },
        others,
        responsible: this.state.responsible,
      };
      if (this.state.typeContainer === 'add') {
        if (this.state.name !== '' && this.state.code !== '') {
          const newFile = body.otherRequest;
          body.otherRequest = this.state.arrFile;
          body.newFile = newFile;
          if (body.belong.contractId === 0) {
            body.belong = undefined;
          }

          this.props.onCreateContract(body);
        }
      } else {
        const { addContractPage } = this.props;
        const { contract } = addContractPage;
        const newFile = body.otherRequest;
        body.otherRequest = contract.otherRequest;
        body.newFile = newFile;
        if (body.belong.contractId === 0 || body.belong.contractId === '') {
          body.belong = undefined;
        }
        this.props.onUpdateContract(body);
      }
    }
  };

  handleChangeInputFile = e => {
    this.setState({ file: e.target.files[0] });
  };

  deleteToPaymentOrder = index => {
    const { paymentOrder } = this.state;
    paymentOrder.splice(index, 1);
    this.setState({ paymentOrder });
  };

  editToPaymentOrder = index => {
    let { currentStage } = this.state;
    const { paymentOrder } = this.state;
    currentStage = paymentOrder[index];
    this.setState({ currentStage }, () => {
      this.setState({ isEdit: index, open2: true });
    });
  };

  deleteTodeliverimentRequest = index => {
    const { deliverimentRequest, amountDelivery } = this.state;
    deliverimentRequest[index].products.forEach(item => {
      const x = amountDelivery.findIndex(n => n.productId === item.productId);
      amountDelivery[x].amount -= item.amount === '' ? 0 : parseInt(item.amount, 10);
    });
    deliverimentRequest.splice(index, 1);
    this.setState({ deliverimentRequest, amountDelivery });
  };

  editTodeliverimentRequest = (index, number) => {
    const { deliverimentRequest } = this.state;
    let { currentDeliverRequest } = this.state;
    currentDeliverRequest = Object.assign({}, deliverimentRequest[index]);
    const numberic = number === -1 ? index : number;
    this.setState({ currentDeliverRequest, isEditDelivery: numberic, open3: true });
  };

  onAddToListPayment = currentStage => {
    const { paymentOrder, isEdit } = this.state;
    // let { currentStage } = this.state;
    if (isEdit === -1) {
      paymentOrder.push(currentStage);
    } else {
      paymentOrder[isEdit] = currentStage;
    }
    currentStage = {
      name: '',
      statusPay: 0,
      timePay: date,
      amount: 0,
      contractWork: null,
      workCompleted: {},
      currency: 'VNĐ',
      VAT: false,
      totalPrice: '',
    };
    this.setState({ paymentOrder, currentStage, isEdit: -1 }, () => {
      this.setState({ open2: false });
    });
  };

  handleSubmitForm = () => {
    const { deliverimentRequest, isEditDelivery, amountDelivery } = this.state;
    let { currentDeliverRequest } = this.state;
    if (isEditDelivery === -1) {
      currentDeliverRequest.products.forEach(pro => {
        const x = amountDelivery.findIndex(item => item.productId === pro.productId);
        if (x !== -1) {
          amountDelivery[x].amount += pro.amount === '' ? 0 : parseInt(pro.amount, 10);
          amountDelivery[x].timeDelivery = this.state.contractSigningDate
        }
      });
      deliverimentRequest.push(currentDeliverRequest);
    } else {
      deliverimentRequest[isEditDelivery].products.forEach(item => {
        const x = currentDeliverRequest.products.find(n => n.productId === item.productId);
        if (item.amount !== x.amount) {
          const change = x.amount - item.amount;
          const y = amountDelivery.findIndex(item1 => item1.productId === item.productId);
          amountDelivery[y].amount += change;
        }
      });
      deliverimentRequest[isEditDelivery] = currentDeliverRequest;
    }
    currentDeliverRequest = {
      stage: '', // id của yêu cầu thanh toán paymentRequest
      timeDelivery: '',
      company: '',
      Address: '',
      products: [],
    };
    this.setState({ deliverimentRequest, amountDelivery, currentDeliverRequest, open3: false, isEditDelivery: -1 });
  };

  handleAddSale = sale => {
    const choose = {
      taskId: sale._id,
      name: sale.name,
    };
    this.setState({ task: choose });
  };

  handleChangeInputStage = e => {
    const { currentStage } = this.state;
    currentStage[e.target.name] = e.target.value;
    this.setState({ currentStage });
  };

  handleChangeInputDeliverRequest = (e, date) => {
    const { currentDeliverRequest } = this.state;
    if (date) {
      currentDeliverRequest['timeDelivery'] = e
      this.setState({ currentDeliverRequest, contractSigningDate: e });
    }
    else {
      currentDeliverRequest[e.target.name] = e.target.value;
      this.setState({ currentDeliverRequest });
    }
  };

  handleChangeInputDeliverRequestProduct = (e, index) => {
    const { currentDeliverRequest } = this.state;
    currentDeliverRequest.products[index][e.target.name] = e.target.value;
    this.setState({ currentDeliverRequest });
  };

  addToPaymentOrder = () => {
    const currentStage = {
      name: '',
      statusPay: 0,
      timePay: moment().format('DD-MM-YYYY'),
      amount: 0,
      contractWork: null,
      workCompleted: {},
      currency: 'VNĐ',
      VAT: false,
      totalPrice: '',
    };

    this.setState({ currentStage, open2: true });
  };

  loadOptions2 = value => {
    const token = localStorage.getItem('token');
    if (value && value.projectId && value.projectId._id) {
      const url = `${API_TASK_CONTRACT_PROJECT}/${value && value.projectId && value.projectId._id}`;
      let data;

      return fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(myJson => {
          // data = myJson.splice(0, 1);
          this.setState({
            jobs: myJson,
          });
        });
    }

  };

  // updateProjects = () => {
  //   const token = localStorage.getItem('token');
  //   const url = `${API_TASK_PROJECT}/${this.state.task._id}`
  //   return fetch(url , {
  //     method: 'PUT',
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  // }

  addToDeliverPayment = () => {
    const { itemChoose, orderProductChooseAPI, orderProductChoose } = this.state;
    const products = [];
    if (itemChoose === null) {
      this.props.onChangeSnackbar(
        true,
        `${this.props.intl.formatMessage(messages.baoGiaBanHangBiXoa || { id: 'baoGiaBanHangBiXoa', defaultMessage: 'baoGiaBanHangBiXoa' })}`,
        'error',
      );
      return;
    }
    // if (itemChoose.products && itemChoose.products.length > 0 && orderProductChooseAPI.length > 0) {
    //   itemChoose.products.forEach(item => {
    // orderProductChooseAPI.forEach(pro => {
    orderProductChoose.forEach(item => {
      // if (pro._id === item.productId) {
      // const x = orderProductChoose.find(n => n.productId === item.productId);
      products.push({
        // productId: item.productId,
        productId: item.idCodeOrder || item.productId,
        name: item.name,
        // amount: 0,
        amount: item.amount,
        // price: x.costPrice ? Number(x.costPrice) : 0,
        price: item.costPrice ? Number(item.costPrice) : 0,
        // unit: pro.unit ? pro.unit.name : '',
        unit: item.unit,
        // totalAmount: Number(x.amount),
        totalAmount: Number(item.amount),
        sellingPoint: item.sellingPoint || [],
      });
      // }
    });
    // });
    // }
    const currentDeliverRequest = {
      stage: '', // id của yêu cầu thanh toán paymentRequest
      timeDelivery: this.state.contractSigningDate,
      company: '',
      Address: '',
      products,
    };
    this.setState({ currentDeliverRequest, isEditDelivery: -1, open3: true });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  // Thay đổi số dòng trên một trang
  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  addToListOrder = (index, item) => {
    const { orderList, listUnit } = this.state;
    const itemChoose = this.props.itemSales ? this.props.itemSales : orderList[index];
    let totalMoney = 0;
    itemChoose.products.forEach(n => {
      totalMoney += (Number(n.costPrice) * Number(n.amount) * Number(100 - Number(n.discount) || 0)) / 100;
    });
    let products = itemChoose.products ? itemChoose.products : []
    if (products && Array.isArray(products) && products.length) {
      products = products.map((el) => {
        const unit = el.unit && listUnit.find(it => it._id === el.unit)
        console.log(unit, "unit", el.unit, listUnit)
        return {
          ...el,
          costPrice: el && el.pricePolicy && el.pricePolicy.costPrice,
          unit: unit && unit.name || el.unit
        }
      })
    }
    console.log(products, 'products')
    this.props.onSetEmpty();
    this.props.onGetProduct(itemChoose);
    this.props.onGetCustomer(itemChoose.customer);
    this.setState({
      idCodeOrder: itemChoose._id,
      orderProductChoose: products,
      open: false,
      orderList: [],
      itemChoose,
      nameOrder: itemChoose.name,
      totalMoney,
    });
  };

  notiSuccess = value => {
    this.props.enqueueSnackbar('Thêm sản phẩm ' + value + ' thành công', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  };

  addToListOrder2 = value => {
    const { orderProductChoose } = this.state;
    let choose = null;
    if (orderProductChoose.length > 0) {
      choose = orderProductChoose.find(item => item.id === value._id);
      if (choose === null || !choose) {
        orderProductChoose.push({
          id: value._id,
          name: value.name,
          amount: 1,
          costPrice: value.pricePolicy.costPrice,
          unit: value.unit.name,
          discount: 0,
          sellingPoint: value.sellingPoint
        });
        this.notiSuccess(value.name);
      } else {
        orderProductChoose.map(item => {
          if (item.id === value._id) {
            item.amount += 1;
          }
        });
        choose = null;
        this.notiSuccess(value.name);
      }
    } else {
      orderProductChoose.push({
        id: value._id,
        name: value.name,
        amount: 1,
        costPrice: value.pricePolicy.costPrice,
        unit: value.unit.name,
        discount: 0,
        sellingPoint: value.sellingPoint
      });
      this.notiSuccess(value.name);
    }
  };

  deleteFromListOrder = () => {
    const { orderProductChoose, chooseItem } = this.state;
    const removeIndex = orderProductChoose.map(item => item.id).indexOf(chooseItem.id);
    orderProductChoose.splice(removeIndex, 1);
    this.handleClose4();
  };

  confirmDelete = val => {
    this.setState({
      chooseItem: val,
      open4: true,
    });
  };

  searchOrder = () => {
    const { searchStartDay, searchEndDay } = this.state;
    const start = `${searchStartDay}T00:00:00.000Z`;
    const end = `${searchEndDay}T23:59:00.000Z`;
    const params = serialize({
      filter: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    });

    this.props.onGetOrder(params);
  };

  handleClose = () => {
    this.setState({ open: false, orderList: [] });
  };

  handleClose2 = () => {
    this.setState({ open2: false });
  };

  handleClose3 = () => {
    this.setState({ open3: false });
  };

  handleClose4 = () => {
    this.setState({ open4: false });
  };

  handleCloseChooseSale = () => {
    this.setState({ openChooseSale: false, orderList: [] });
  };

  handleCloseEditProduct = () => {
    this.setState({
      chooseProductPrice: null,
      chooseProductAmount: null,
      chooseProductDiscount: null,
      openEditProduct: false,
    });
  };

  chooseOrder = () => {
    this.setState({ open: true });
  };

  handleFilter = () => {
    if (this.state.customerName === null) {
      return {};
    }
    const customerId = this.state.customerName._id || this.state.customerName.customerId;
    if (!!customerId) {
      return { customer: customerId };
    }
    return {};
  };

  handleChangeInput = (e, key) => {
    const name = e.target ? e.target.name : key;
    const value = e.target ? e.target.value : moment(e).format('DD/MM/YYYY');
    console.log(value, 'value');
    if (name === 'contractSigningDate' || name === 'expirationDay') this.setState({ [name]: e });
    else this.setState({ [name]: value });
    if (name === 'catalogContract') {
      this.setState({
        customerName: null,
        task: null,
        belong: 0,
      });
    }
    if (name === 'catalogContract' && value === 1) {
      this.setState({ value: 0 });
    }
    if (name === 'catalogContract' && value === 0) {
      this.setState({ value: 1 });
    }
    if (name === 'belong') {
      const item = this.props.addContractPage.allContract.find(item => item._id === value);

      if (item) {
        this.state.belongName = item.name;
        this.state.contractSigningDate = convertDatetimeToDate(item.contractSigningDate);
        this.state.startDay = convertDatetimeToDate(item.startDay);
        this.state.paymentOrder = item.paymentRequest;
        this.state.arrFile = item.otherRequest;
        if (item.customerId) {
          this.props.onGetCustomerInfo(item.customerId);
        }
        // this.state.expirationDay = convertDatetimeToDate(item.expirationDay);
      }
    }
  };

  handleChangeTabList = (event, value) => {
    this.setState({ value });
  };

  loadOptions = (newValue, callback, api) => {
    const token = localStorage.getItem('token');
    const url = `${api}?filter%5Bname%5D%5B%24regex%5D=${newValue}&filter%5Bname%5D%5B%24options%5D=gi${api === API_TASK_PROJECT ? '&filter%5BisProject%5D=true' : ''
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
          })),
        );
      });
  };
}

AddContractPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addContractPage: makeSelectAddContractPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllContract: params => {
      dispatch(getAllContractAct(params));
    },
    onGetOrder: params => {
      dispatch(getOrderAct(params));
    },
    onGetAllProduct: params => {
      dispatch(getAllProductAct(params));
    },
    onGetProduct: params => {
      dispatch(getProductAct(params));
    },
    onGetCustomer: params => {
      dispatch(getCustomerAct(params));
    },
    onGetCustomerInfo: id => {
      dispatch(getCustomerInfo(id));
    },
    onSetEmpty: () => {
      dispatch(setEmptyAct());
    },
    onCreateContract: body => {
      dispatch(createContractAct(body));
    },
    onUpdateContract: body => {
      dispatch(updateContractAct(body));
    },
    onDefaultAction: body => {
      dispatch(resetNoti(body));
    },
    onGetContractById: id => {
      dispatch(getContractById(id));
    },
    onGetSaleQuoById: id => {
      dispatch(getSaleQuoById(id));
    },
    onChangeSnackbar: (status, message, variant) => {
      dispatch(changeSnackbar({ status, message, variant }));
    },
  };
}

// const Option = props => (
//   <components.Option {...props}>
//     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//       {/* <Avatar src={props.data.avatar} /> */}
//       <div style={{ marginTop: 10 }}>{props.data.name}</div>
//     </div>
//   </components.Option>
// );

// const SingleValue = ({ children, ...props }) => (
//   <components.SingleValue {...props}>
//     <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//       {/* <Avatar style={{ height: 30, width: 30 }} src={props.data.avatar} /> */}
//       <div style={{ marginTop: 5 }}>{props.data.name}</div>
//     </div>
//   </components.SingleValue>
// );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addContractPage', reducer });
const withSaga = injectSaga({ key: 'addContractPage', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddContractPage);
