/* eslint-disable consistent-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable array-callback-return */
/**
 *
 * AddSupplierContract
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
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
  Toolbar,
  Fab,
  TablePagination,
  AppBar,
  DialogActions,
  TableFooter,
  FormHelperText,
  Drawer,
} from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Close, Add, Delete, Edit, SaveAlt } from '@material-ui/icons';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import moment from 'moment';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddSupplierContract from './selectors';
import reducer from './reducer';
import saga, { getSaleQuoById } from './saga';
import CustomInputBase from 'components/Input/CustomInputBase';
import {
  getAllContractAct,
  getOrderAct,
  createContractAct,
  getProductAct,
  setEmptyAct,
  getContractById,
  updateContractAct,
  getCustomerAct,
  resetNoti,
} from './actions';
import styles from './styles';
import { sortTask, fetchData } from '../../helper';
import { serialize, convertDatetimeToDate, getLabelName, viewConfigCheckShowForm } from '../../utils/common';
import { API_TASK_PROJECT } from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import KanbanStepper from '../../components/KanbanStepper';
import ProductInforDrawer from '../../components/ProductInforDrawer';
import UpdatePaymentRequestDialog from '../../components/UpdatePaymentRequestDialog';
import messages from './messages';
import TextFieldCode from '../../components/TextFieldCode';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomAppBar from 'components/CustomAppBar';

// const tempDate = new Date();
// const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${
//   tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
// }`;
const dateRaw = moment().format('YYYY-MM-DD');
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
export class AddSupplierContract extends React.Component {
  constructor(props) {
    super(props);
    this.submitBtn = React.createRef();
  }

  state = {
    value: 0,
    open: false,
    open2: false,
    open3: false,
    //
    searchStartDay: date,
    searchEndDay: date,
    orderList: [],
    itemChoose: {},
    orderProductChoose: [],
    orderProductChooseAPI: [],
    catalogContract: 0,
    contractSigningDate: date,
    belong: 0,
    startDay: date,
    // deliveryDay: date,
    paymentOrder: [],
    name: '',
    code: '',
    cycle: '',
    nameOrder: '',
    idCodeOrder: '',
    notice: '',
    // numberOrders: '',
    expirationDay: date,
    // statusContract: 0,
    // contractPrinciples: [],
    kanbanStatus: 0,
    arrKanban: [],
    rowsPerPage: 5, // số hàng hiển thị trên một bảng
    page: 0, // trang hiện tại
    currentStage: {
      name: '',
      statusPay: 0,
      timePay: moment().format('YYYY-MM-DD'),
      amount: 0,
      template: null,
      workCompleted: {},
      currency: 'VNĐ',
      VAT: false,
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
    nameError: false,
    cycleError: false,
    dateError: false,
    typeContainer: null,
    belongName: '',
    typeContract: 0,
    saleError: false,

    expirationDayError: false,
    startDayError: false,
    contractSigningDateError: false,
    cycleRequire: false,
    noticeRequire: false,
    openDetail: false,
    cycleMin: false,
    noticeMin: false,
    task: null,
    product: {},
    customer: {},
    amountDelivery: [],
    fieldAdded: [],
    totalMoney: 0,
    jobs: null,
    listContractTypes: [],
    contractColumns: JSON.parse(localStorage.getItem('viewConfig'))
      .find(item => item.code === 'Contract')
      .listDisplay.type.fields.type.columns.map(item => ({ ...item, name: item.name.replace(/\./g, '_') })),
  };

  componentWillMount() {
    const { match } = this.props;
    if (window.location.pathname.split('/').includes('edit')) {
      this.props.onGetContractById(match.params.id);
      this.state.typeContainer = 'edit';
    } else {
      this.state.typeContainer = 'add';
      this.props.onGetAllContract(match.params.id);
    }
    this.props.onDefaultAction();
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
      this.state.typeContract = this.props.match.params.id;
    }
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.find(item => item.code === 'Contract');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
  }

  componentWillUpdate(props) {
    const { successCreate } = props.addSupplierContract;
    if (successCreate) {
      this.props.onDefaultAction();
      props.history.value = 2;
      this.props.history.push('/crm/Contract');
    }
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { addSupplierContract } = props;
      const contractPrinciples = addSupplierContract.allContract || [];
      // const kanbanStatus = addSupplierContract.status || {};
      const arrOrder = addSupplierContract.allOrder || [];
      const arrProduct = addSupplierContract.listProduct || [];
      const customer = addSupplierContract.customer || {};
      const arr = [];
      contractPrinciples.forEach(item => {
        if (item.catalogContract === 0) {
          arr.push(item);
        }
      });
      const status = JSON.parse(localStorage.getItem('crmStatus'));
      // const kanbanStatus = status.find(item => item.code === 'ST05');
      const kanbanStatus = status.find(item => item.code === 'ST253');

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
      const amountDelivery = arrProduct.map(item => ({
        productId: item._id,
        amount: 0,
      }));
      const arrKanban = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
      this.setState({ arrKanban, amountDelivery, orderList: arrOrder, orderProductChooseAPI: arrProduct, customer }); // contractPrinciples: arr,
      const { contract, listProduct, saleQuo } = addSupplierContract;
      if (this.props.match.params.id !== '1' && this.props.match.params.id !== '2' && this.state.orderProductChoose.length === 0) {
        this.state.orderProductChoose = saleQuo ? (saleQuo.products ? saleQuo.products : []) : [];
        if (Object.keys(saleQuo).length > 0) {
          let totalMoney = 0;
          saleQuo.products.forEach(n => {
            totalMoney += (Number(n.costPrice) * Number(n.amount) * Number(100 - Number(n.discount) || 0)) / 100;
          });
          this.setState({ totalMoney });
        }
      }
      if (
        this.props.match.params.id !== '1' &&
        this.props.match.params.id !== '2' &&
        this.state.itemChoose &&
        Object.keys(this.state.itemChoose).length === 0
      ) {
        this.state.itemChoose = saleQuo;
      }
      if (
        this.props.addSupplierContract.contract !== props.addSupplierContract.contract &&
        this.state.typeContainer === 'edit' &&
        contract !== this.props.contract &&
        contract.code
      ) {
        this.state.catalogContract = contract.catalogContract;
        this.state.name = contract.name;
        this.state.code = contract.code;
        if (contract.task) {
          this.state.task = contract.task;
          if (contract.task.taskId) {
            this.getProjectTree(contract.task.taskId);
          }
        }
        this.state.deliverimentRequest = contract.deliverimentRequest || [];
        this.state.typeContract = contract.typeContract || '';
        this.state.belong = contract.belong ? contract.belong.contractId : '';
        this.state.kanbanStatus = contract.kanbanStatus;
        this.state.contractSigningDate = convertDatetimeToDate(contract.contractSigningDate);
        this.state.expirationDay = convertDatetimeToDate(contract.expirationDay);
        this.state.startDay = convertDatetimeToDate(contract.startDay);
        this.state.dataPay = contract.paymentOrder || '';
        this.state.cycle = contract.cycle || null;
        this.state.notice = contract.notice || null;
        this.state.arrFile = contract.otherRequest;
        this.state.paymentOrder = contract.paymentRequest;
        if (parseInt(contract.catalogContract, 10) === 2) {
          this.state.idCodeOrder = contract.order ? contract.order.orderId : '';
          this.state.nameOrder = contract.order ? contract.order.name : '';
        }
        // this.state.nameOrder = contract.nameOrder|| '';
        this.state.orderProductChooseAPI = listProduct || [];
        this.state.orderProductChoose = saleQuo.products || [];
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
    }
  }

  toggleDrawer = product => {
    const { openDetail } = this.state;
    this.setState({
      openDetail: !openDetail,
      product,
    });
  };

  getProjectTree(projectId) {
    const filter = serialize({ filter: { projectId, status: 1 } });
    fetchData(`${API_TASK_PROJECT}?${filter}`, 'GET').then(projects => {
      const newProject = sortTask(projects.data, [], projectId, true);
      this.setState({ jobs: { data: newProject } });
    });
  }

  checkShowForm = value => {
    return viewConfigCheckShowForm('Contract', value, this.state.catalogContract, 'checkedShowForm');
  };

  getLabelNames = name => {
    return viewConfigCheckShowForm('Contract', name, this.state.catalogContract, 'title');
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

  render() {
    const { classes, addSupplierContract, match, intl } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;

    let { orderProductChoose, orderList } = this.state;
    const { orderProductChooseAPI, deliverimentRequest, arrKanban, kanbanStatus } = this.state;
    const { rowsPerPage, page } = this.state;
    if (orderProductChoose.length > 0 && orderProductChooseAPI.length > 0) {
      orderProductChoose = orderProductChoose.map(item => {
        const x = orderProductChooseAPI.find(n => n._id === item.productId);
        return {
          ...item,
          x,
        };
      });
    }
    if (deliverimentRequest.length > 0 && deliverimentRequest[0]._id && orderProductChoose.length > 0 && orderProductChooseAPI.length > 0) {
      const temp = [];
      deliverimentRequest.forEach(item => {
        const products = [];
        item.products.forEach(pro => {
          const x = orderProductChoose.find(i => i.productId === pro.productId);
          products.push({
            productId: pro.productId,
            name: pro.name,
            amount: pro.amount,
            totalAmount: x.amount,
            price: x.x.pricePolicy ? x.x.pricePolicy.costPrice : 0,
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
    return (
      <div>
        {addSupplierContract.loading ? <LoadingIndicator /> : null}
        <CustomAppBar
          className
          title={
            id === '2'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới Hợp đồng NCC' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật Hợp đồng NCC' })}`
          }
          onGoBack={() => {
            this.props.history.value = 2;
            this.props.history.goBack();
          }}
          onSubmit={this.handleSubmit}
        />
        <Helmet>
          <title>{this.state.typeContainer === 'edit' ? 'Cập nhật hợp đồng' : 'Thêm mới hợp đồng'}</title>
          <meta name="description" content="Description of addSupplierContract" />
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
            {this.state.openDetail ? <ProductInforDrawer product={this.state.product.x} currentStock={null} onClose={this.toggleDrawer} /> : null}
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
            {this.checkShowForm('catalogContract') && (
              <Grid item md={6}>
                <Typography
                  style={{
                    color: 'grey',
                    height: 5
                  }}
                >
                  {" "}
                </Typography>
                <CustomInputBase
                  id="standard-select-currency"
                  select
                  label={this.getLabelNames('catalogContract')}
                  name="catalogContract"
                  margin="normal"
                  value={this.state.catalogContract}
                  onChange={this.handleChangeInput}
                  disabled={this.state.typeContainer === 'edit'}
                  required
                >
                  {this.state.listContractTypes.map((i, index) => (
                    <MenuItem value={i.value}>{i.title}</MenuItem>
                  ))}
                </CustomInputBase>
              </Grid>
            )}
            {/* <Grid item md={6}>
              <TextField
                id="standard-select-currency"
                select
                label={getLabelName('catalogContract', 'Contract')}
                name="catalogContract"
                variant="outlined"
                value={this.state.catalogContract}
                style={{ width: '100%', marginTop: '20px' }}
                onChange={this.handleChangeInput}
                disabled={this.state.typeContainer === 'edit'}
                // helperText="Please select your currency"
              >
                <MenuItem value={0}>
                  {intl.formatMessage(messages.hopDongNguyenTac || { id: 'hopDongNguyenTac', defaultMessage: 'hopDongNguyenTac' })}
                </MenuItem>
                <MenuItem value={1}>
                  {intl.formatMessage(messages.hopDongThoiVu || { id: 'hopDongThoiVu', defaultMessage: 'hopDongThoiVu' })}
                </MenuItem>
              </TextField>
            </Grid> */}
            {this.checkShowForm('task.name') && (
              <Grid item md={6}>
                <Typography
                  style={{
                    color: 'grey',
                  }}
                >
                  {this.getLabelNames('task.name')}
                </Typography>
                <AsyncSelect
                  className={classes.reactSelect}
                  placeholder="Tìm kiếm ..."
                  loadOptions={(newValue, callback) => this.loadOptions(newValue, callback, API_TASK_PROJECT)}
                  loadingMessage={() => 'Đang tải ...'}
                  components={{ Option, SingleValue }}
                  onChange={this.handleAddSale}
                  value={this.state.task}
                  theme={theme => ({
                    ...theme,
                    spacing: {
                      ...theme.spacing,
                      controlHeight: '55px',
                    },
                  })}
                />
              </Grid>
            )}
            {this.checkShowForm('name') && (
              <Grid item md={6}>
                <TextField
                  label={this.getLabelNames('name')}
                  name="name"
                  required
                  error={this.state.nameError}
                  onChange={this.handleChangeInput}
                  value={this.state.name}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ width: '100%' }}
                  aria-describedby="component-error-text"
                />
                <FormHelperText id="component-error-text" style={this.state.nameError ? { color: 'red' } : { color: 'red', display: 'none' }}>
                  {intl.formatMessage(messages.tenTrong || { id: 'tenTrong', defaultMessage: 'tenTrong' })}
                </FormHelperText>
              </Grid>
            )}

            {/* <Grid item md={6}>
              <TextField
                // label={getLabelName('producte', 'Contract')}
                label="NHÀ CUNG CẤP"
                name="ncc"
                required
                error={this.state.nameError}
                onChange={this.handleChangeInput}
                value={this.state.name}
                variant="outlined"
                style={{ width: '100%' }}
                aria-describedby="component-error-text"
              />
              <FormHelperText id="component-error-text" style={this.state.nameError ? { color: 'red' } : { color: 'red', display: 'none' }}>
                {intl.formatMessage(messages.tenTrong || { id: 'tenTrong', defaultMessage: 'tenTrong' })}
              </FormHelperText>
            </Grid> */}
            {this.checkShowForm('contractSigningDate') && (
              <Grid item md={6}>
                <CustomDatePicker
                  label={this.getLabelNames('contractSigningDate')}
                  name="contractSigningDate"
                  variant="outlined"
                  onChange={e => this.handleChangeInput(e, 'contractSigningDate')}
                  value={this.state.contractSigningDate}
                  style={{ width: '100%' }}
                  // InputProps={{ inputProps: { max: dateRaw } }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={this.state.contractSigningDateError}
                />
                <FormHelperText
                  id="component-error-text"
                  style={this.state.contractSigningDateError ? { color: 'red' } : { color: 'red', display: 'none' }}
                >
                  {intl.formatMessage(messages.ngayKiTrong || { id: 'ngayKiTrong', defaultMessage: 'ngayKiTrong' })}
                </FormHelperText>
              </Grid>
            )}
            {this.checkShowForm('startDay') && (
              <Grid item md={6}>
                <CustomDatePicker
                  label={this.getLabelNames('startDay')}
                  name="startDay"
                  error={this.state.dateError || this.state.startDayError}
                  value={this.state.startDay}
                  onChange={e => this.handleChangeDate(e, true)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  style={{ width: '100%' }}
                />
                <FormHelperText id="component-error-text" style={this.state.startDayError ? { color: 'red' } : { color: 'red', display: 'none' }}>
                  {intl.formatMessage(messages.batDauTrong || { id: 'batDauTrong', defaultMessage: 'batDauTrong' })}
                </FormHelperText>
              </Grid>
            )}

            {this.state.catalogContract.toString() === '1'
              ? this.checkShowForm('expirationDay') && (
                <Grid item md={6}>
                  <CustomDatePicker
                    label={this.getLabelNames('expirationDay')}
                    name="expirationDay"
                    error={this.state.dateError || this.state.expirationDayError}
                    value={this.state.expirationDay}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={e => this.handleChangeInput(e, 'expirationDay')}
                    variant="outlined"
                    style={{ width: '100%' }}
                  />
                  <FormHelperText
                    id="component-error-text"
                    style={this.state.expirationDayError ? { color: 'red' } : { color: 'red', display: 'none' }}
                  >
                    {intl.formatMessage(messages.ngayGiaoHangTrong || { id: 'ngayGiaoHangTrong', defaultMessage: 'ngayGiaoHangTrong' })}
                  </FormHelperText>
                </Grid>
              )
              : this.checkShowForm('expirationDay') && (
                <Grid item md={6}>
                  <CustomDatePicker
                    label={this.getLabelNames('expirationDay')}
                    name="expirationDay"
                    value={this.state.expirationDay}
                    error={this.state.dateError || this.state.expirationDayError}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={e => this.handleChangeInput(e, 'expirationDay')}
                    variant="outlined"
                    style={{ width: '100%' }}
                  />
                  <FormHelperText
                    id="component-error-text"
                    style={this.state.expirationDayError ? { color: 'red' } : { color: 'red', display: 'none' }}
                  >
                    {intl.formatMessage(messages.ngayHetHanTrong || { id: 'ngayHetHanTrong', defaultMessage: 'ngayHetHanTrong' })}
                  </FormHelperText>
                </Grid>
              )}
            {this.checkShowForm('code') && (
              <Grid item md={6}>
                <TextFieldCode
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

            {/* hợp đồng nguyên tắc */}
            {
              (this.state.catalogContract.toString() === '1' || this.state.catalogContract.toString() === '2')
                ? this.checkShowForm('belong.name') && (
                  <Grid item md={6}>
                    <TextField
                      id="standard-select-currency"
                      select
                      disabled={match.params.id !== '1' && match.params.id !== '2'}
                      label={this.getLabelNames('belong.name')}
                      name="belong"
                      variant="outlined"
                      value={this.state.belong}
                      style={{ width: '100%' }}
                      onChange={this.handleChangeInput}
                    // helperText="Please select your currency"
                    >
                      <MenuItem value={0}>
                        {intl.formatMessage(messages.chonHopDongNguyenTac || { id: 'chonHopDongNguyenTac', defaultMessage: 'chonHopDongNguyenTac' })}
                      </MenuItem>
                      {this.props.addSupplierContract.allContract
                        .filter(
                          item =>
                            item.catalogContract &&
                            item.typeContract &&
                            item.typeContract.toString() === this.state.typeContract.toString() &&
                            (item.catalogContract.toString() === '0' || item.catalogContract.toString() === '1'),
                        )
                        .map(item => (
                          <MenuItem value={item._id} key={item._id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                )
                : ''}
            {parseInt(this.state.catalogContract, 10) === 2 ? (
              <React.Fragment>
                {this.checkShowForm('cycle') && (
                  <Grid item md={6}>
                    <TextField
                      label={this.getLabelNames('cycle')}
                      type="number"
                      onChange={this.handleChangeInput}
                      value={this.state.cycle}
                      name="cycle"
                      variant="outlined"
                      error={this.state.cycleError || this.state.cycleRequire}
                      style={{ width: '100%' }}
                    />
                    <FormHelperText
                      id="component-error-text"
                      style={this.state.cycleMin || this.state.cycleRequire ? { color: 'red' } : { color: 'red', display: 'none' }}
                    >
                      {this.state.cycleRequire ? intl.formatMessage(messages.chuKiTrong || { id: 'chuKiTrong', defaultMessage: 'chuKiTrong' }) : ''}
                      {this.state.cycleMin ? intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' }) : ''}
                    </FormHelperText>
                  </Grid>
                )}
                {this.checkShowForm('order.name') && (
                  <Grid item md={6}>
                    <TextField
                      label={this.getLabelNames('order.name')}
                      InputProps={{
                        readOnly: true,
                      }}
                      error={this.state.saleError}
                      value={this.state.nameOrder}
                      onClick={this.chooseOrder}
                      name="nameOrder"
                      variant="outlined"
                      style={{ width: '100%' }}
                    />
                    {/* <FormHelperText id="component-error-text" style={this.state.saleError ? { color: 'red' } : { color: 'red', display: 'none' }}>
                        {intl.formatMessage(messages.donHangTrong || { id: 'donHangTrong', defaultMessage: 'donHangTrong' })}
                      </FormHelperText> */}
                  </Grid>
                )}
                {this.checkShowForm('notice') && (
                  <Grid item md={6}>
                    <TextField
                      label={this.getLabelNames('notice')}
                      type="number"
                      onChange={this.handleChangeInput}
                      value={this.state.notice}
                      name="notice"
                      variant="outlined"
                      error={this.state.cycleError || this.state.noticeRequire || this.state.noticeMin}
                      style={{ width: '100%' }}
                    />
                    <FormHelperText
                      id="component-error-text"
                      style={
                        this.state.noticeRequire || this.state.cycleError || this.state.noticeMin
                          ? { color: 'red' }
                          : { color: 'red', display: 'none' }
                      }
                    >
                      {this.state.noticeRequire
                        ? intl.formatMessage(messages.baoTruocTrong || { id: 'baoTruocTrong', defaultMessage: 'baoTruocTrong' })
                        : ''}
                      {this.state.cycleError ? 'Báo trước phải nhỏ hơn chu kỳ! ' : ''}
                      {this.state.noticeMin ? intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' }) : ''}
                    </FormHelperText>
                  </Grid>
                )}

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
            ) : null}
            {/* <Grid item md={6}>
                  <TextField
                    id="standard-select-currency"
                    select
                    label="Trạng thái"
                    name="kanbanStatus"
                    variant="outlined"
                    value={this.state.kanbanStatus}
                    style={{ width: '100%' }}
                    onChange={this.handleChangeInput}
                    // helperText="Please select your currency"
                  >
                    {this.state.arrKanban.map((item, index) => (
                      <MenuItem value={index} key={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
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
                          InputLabelProps={{ shrink: true }}
                          onChange={event => this.handleChangeAddedField(index, event)}
                          style={{ width: '100%' }}
                          margin="normal"
                        />
                      </Grid>
                    );
                  }
                })
              : ''}
            {/* <Grid item md={12}>
                  <Button variant="contained" onClick={this.handleSubmit} color="primary">
                    {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })}
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button
                    variant="contained"
                    onClick={() => {
                      this.props.history.value = 2;
                      this.props.history.goBack();
                    }}
                    color="secondary"
                  >
                    {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
                  </Button>
                </Grid> */}
          </Grid>
          {Object.keys(this.state.customer).length > 0 ? (
            <Grid item container style={{ marginTop: 20, marginBottom: 20 }} spacing={24}>
              <Grid md={8} item container>
                <Typography
                  component="p"
                  style={{
                    fontWeight: 550,
                    fontSize: '18px',
                  }}
                >
                  {intl.formatMessage(messages.thongTinNCC || { id: 'thongTinNCC', defaultMessage: 'thongTinNCC' })}
                </Typography>
              </Grid>
              <Grid item md={6}>
                <TextField
                  label={intl.formatMessage(messages.tenNCC || { id: 'tenNCC', defaultMessage: 'tenNCC' })}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={this.state.customer.name}
                  variant="outlined"
                  style={{ width: '100%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  label={intl.formatMessage(messages.congty || { id: 'congty', defaultMessage: 'congty' })}
                  InputProps={{
                    readOnly: true,
                  }}
                  value=""
                  variant="outlined"
                  style={{ width: '100%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  label={intl.formatMessage(messages.diaChi || { id: 'diaChi', defaultMessage: 'diaChi' })}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={this.state.customer.adress}
                  variant="outlined"
                  style={{ width: '100%' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  label={intl.formatMessage(messages.dienThoai || { id: 'dienThoai', defaultMessage: 'dienThoai' })}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={this.state.customer.phone}
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
            jobs={this.state.jobs}
            messages={messages}
            handleClose={this.handleClose2}
            currentStage={Object.assign({}, this.state.currentStage)}
            classes={classes}
            totalMoney={this.state.totalMoney}
            minday={this.state.contractSigningDate}
          />
          {/* bảng dưới */}
          <Grid item container spacing={48} style={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ marginTop: 10, marginBottom: 10, zIndex: 0 }} color="default">
              <Tabs value={this.state.value} indicatorColor="primary" textColor="primary" onChange={this.handleChangeTabList}>
                {/* <Tab label={intl.formatMessage(messages.yeuCauKhac || { id: 'yeuCauKhac', defaultMessage: 'yeuCauKhac' })} /> */}
                <Tab label="Tài liệu đính kèm" />
                <Tab label={intl.formatMessage(messages.yeuCauThanhToan || { id: 'yeuCauThanhToan', defaultMessage: 'yeuCauThanhToan' })} />
                <Tab
                  style={parseInt(this.state.catalogContract, 10) === 2 ? { display: 'block' } : { display: 'none' }}
                  label={intl.formatMessage(messages.yeuCauSanPham || { id: 'yeuCauSanPham', defaultMessage: 'yeuCauSanPham' })}
                />
                <Tab
                  style={
                    parseInt(this.state.catalogContract, 10) === 2 && this.state.typeContainer === 'edit' ? { display: 'block' } : { display: 'none' }
                  }
                  label={intl.formatMessage(messages.yeuCauGiaoHang || { id: 'yeuCauGiaoHang', defaultMessage: 'yeuCauGiaoHang' })}
                />
              </Tabs>
            </AppBar>
            {this.state.value === 2 && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{intl.formatMessage(messages.ycspName || { id: 'ycspName', defaultMessage: 'ycspName' })}</TableCell>
                    <TableCell>{intl.formatMessage(messages.ycspGia || { id: 'ycspGia', defaultMessage: 'ycspGia' })}</TableCell>
                    <TableCell>{intl.formatMessage(messages.ycspSoLuong || { id: 'ycspSoLuong', defaultMessage: 'ycspSoLuong' })}</TableCell>
                    <TableCell>{intl.formatMessage(messages.ycspDonViTinh || { id: 'ycspDonViTinh', defaultMessage: 'ycspDonViTinh' })}</TableCell>
                    <TableCell>{intl.formatMessage(messages.ycspChietKhau || { id: 'ycspChietKhau', defaultMessage: 'ycspChietKhau' })}</TableCell>
                    <TableCell>{intl.formatMessage(messages.ycspThanhTien || { id: 'ycspThanhTien', defaultMessage: 'ycspThanhTien' })}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderProductChoose.length > 0
                    ? orderProductChoose.map(item => {
                      total += item.x
                        ? item.x.pricePolicy
                          ? (item.x.pricePolicy.costPrice * parseInt(item.amount, 10) * (100 - item.discountPercent)) / 100
                          : 0
                        : 0;
                      return (
                        <TableRow>
                          <TableCell>
                            <Button color="primary" onClick={() => this.toggleDrawer(item)}>
                              {item.name}
                            </Button>
                          </TableCell>
                          <TableCell>{item.x ? (item.x.pricePolicy ? formatNumber(item.x.pricePolicy.costPrice) : '') : ''}</TableCell>
                          <TableCell>{item.amount}</TableCell>
                          <TableCell>{item.x ? (item.x.unit ? item.x.unit.name : '') : ''}</TableCell>
                          <TableCell>{item.discountPercent}%</TableCell>
                          <TableCell>
                            {item.x
                              ? item.x.pricePolicy
                                ? formatNumber((item.x.pricePolicy.costPrice * parseInt(item.amount, 10) * (100 - item.discountPercent)) / 100)
                                : ''
                              : ''}
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
            )}
            {this.state.value === 1 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  <Button style={{ margin: 15 }} variant="outlined" color="primary" aria-label="Add" size="small" onClick={this.addToPaymentOrder}>
                    {intl.formatMessage(messages.ycttThemMoi || { id: 'ycttThemMoi', defaultMessage: 'ycttThemMoi' })}
                  </Button>
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
                          <TableCell>{convertDatetimeToDate(item.timePay)}</TableCell>
                          <TableCell>{formatNumber(item.amount)}</TableCell>
                          <TableCell>{item.statusPay === 0 ? 'Chưa nhiệm thu' : item.statusPay === 2 ? 'Đã thanh lý' : 'Đã nhiệm thu'}</TableCell>
                          <TableCell>{item.VAT === false ? 'Không' : 'Có'}</TableCell>
                          <TableCell>
                            <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editToPaymentOrder(index)}>
                              <Edit />
                            </Fab>
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
            {this.state.value === 0 && (
              <div style={{ width: '100%' }}>
                <TextField
                  label="File upload"
                  type="file"
                  onChange={this.handleChangeInputFile}
                  name="file"
                  // value={this.state.file ? this.state.file : null}
                  variant="outlined"
                  style={{ width: '100%' }}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label={intl.formatMessage(messages.yckTenFile || { id: 'yckTenFile', defaultMessage: 'yckTenFile' })}
                  onChange={this.handleChangeInput}
                  value={this.state.fileName}
                  name="fileName"
                  variant="outlined"
                  style={{ width: '100%' }}
                  margin="normal"
                />
                <TextField
                  label={intl.formatMessage(messages.ycttGhiChu || { id: 'ycttGhiChu', defaultMessage: 'ycttGhiChu' })}
                  multiline
                  rows={4}
                  onChange={this.handleChangeInput}
                  value={this.state.fileNote}
                  name="fileNote"
                  variant="outlined"
                  style={{ width: '100%' }}
                  margin="normal"
                />
                {this.state.arrFile.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{intl.formatMessage(messages.yckTenFile || { id: 'yckTenFile', defaultMessage: 'yckTenFile' })}</TableCell>
                        <TableCell>
                          {intl.formatMessage(messages.ycttNgayTaiLen || { id: 'ycttNgayTaiLen', defaultMessage: 'ycttNgayTaiLen' })}
                        </TableCell>
                        <TableCell>{intl.formatMessage(messages.ycttGhiChu || { id: 'ycttGhiChu', defaultMessage: 'ycttGhiChu' })}</TableCell>
                        <TableCell>{intl.formatMessage(messages.ycttTaiXuong || { id: 'ycttTaiXuong', defaultMessage: 'ycttTaiXuong' })}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.arrFile.length > 0
                        ? this.state.arrFile.map(item => {
                          const date = item.createdAt ? convertDatetimeToDate(item.createdAt) : '';
                          return (
                            <TableRow>
                              <TableCell>{item.nameFile}</TableCell>
                              <TableCell>{date}</TableCell>
                              <TableCell>{item.note}</TableCell>
                              <TableCell>
                                <SaveAlt style={{ color: '#0795db', cursor: 'pointer' }} onClick={() => window.open(item.urlFile)} />
                              </TableCell>
                            </TableRow>
                          );
                        })
                        : ''}
                    </TableBody>
                  </Table>
                ) : (
                  ''
                )}
              </div>
            )}
            {this.state.value === 3 && (
              <Paper style={{ width: '100%' }}>
                <Grid style={{ display: 'block' }}>
                  <Button style={{ margin: 15 }} variant="outlined" color="primary" aria-label="Add" size="small" onClick={this.addToDeliverPayment}>
                    {intl.formatMessage(messages.ycghThemMoi || { id: 'ycghThemMoi', defaultMessage: 'ycghThemMoi' })}
                  </Button>
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
                      ? this.state.deliverimentRequest.map((item, index) => (
                        <TableRow>
                          <TableCell>
                            {this.state.paymentOrder.find(ele => ele._id === item.stage)
                              ? this.state.paymentOrder.find(ele => ele._id === item.stage).name
                              : ''}
                          </TableCell>
                          <TableCell>{item.timeDelivery}</TableCell>
                          <TableCell>{item.company}</TableCell>
                          <TableCell>{item.Address}</TableCell>
                          <TableCell>
                            <Button color="primary" onClick={() => this.editTodeliverimentRequest(index, -2)}>
                              {intl.formatMessage(messages.ycghChiTiet || { id: 'ycghChiTiet', defaultMessage: 'ycghChiTiet' })}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Fab color="primary" aria-label="Add" size="small" onClick={() => this.editTodeliverimentRequest(index, -1)}>
                              <Edit />
                            </Fab>
                            &nbsp;&nbsp;
                            <Fab color="secondary" aria-label="Add" size="small" onClick={() => this.deleteTodeliverimentRequest(index)}>
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
          </Grid>
        </Paper>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title" onClose={this.handleClose}>
            {intl.formatMessage(messages.hdDanhSachHoaDon || { id: 'hdDanhSachHoaDon', defaultMessage: 'hdDanhSachHoaDon' })}
          </DialogTitle>
          <DialogContent style={{ paddingTop: '10px' }}>
            <TextField
              label={intl.formatMessage(messages.hdTuNgay || { id: 'hdTuNgay', defaultMessage: 'hdTuNgay' })}
              name="searchStartDay"
              type="date"
              value={this.state.searchStartDay}
              onChange={this.handleChangeInput}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ width: '30%' }}
            />
            &nbsp;&nbsp;&nbsp;
            <TextField
              label={intl.formatMessage(messages.hdDenNgay || { id: 'hdDenNgay', defaultMessage: 'hdDenNgay' })}
              name="searchEndDay"
              type="date"
              value={this.state.searchEndDay}
              onChange={this.handleChangeInput}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              style={{ width: '30%' }}
            />
            &nbsp;&nbsp;&nbsp;
            <Button size="large" variant="outlined" color="primary" onClick={this.searchOrder} className={classes.searchBtn}>
              {intl.formatMessage(messages.timKiem || { id: 'timKiem', defaultMessage: 'timKiem' })}
            </Button>
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
                          <TableCell>{item.supplier ? item.supplier.name : ''}</TableCell>
                          <TableCell>{amount}</TableCell>
                          <TableCell>
                            <Fab
                              color="primary"
                              aria-label="Add"
                              size="small"
                              onClick={() => this.addToListOrder(index + this.state.page * this.state.rowsPerPage)}
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
            <ValidatorForm style={{ width: '100%', display: 'inline' }} onSubmit={this.handleSubmitForm}>
              <Grid item md={12} container>
                <Grid item md={12}>
                  <TextValidator
                    label={intl.formatMessage(messages.ycghGiaiDoan || { id: 'ycghGiaiDoan', defaultMessage: 'ycghGiaiDoan' })}
                    name="stage"
                    select
                    disabled={this.state.isEditDelivery === -2}
                    value={this.state.currentDeliverRequest.stage}
                    onChange={this.handleChangeInputDeliverRequest}
                    variant="outlined"
                    margin="normal"
                    style={{ width: '100%' }}
                    validators={['required']}
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
                <TextValidator
                  label={intl.formatMessage(messages.ycghThoiGian || { id: 'ycghThoiGian', defaultMessage: 'ycghThoiGian' })}
                  name="timeDelivery"
                  type="date"
                  disabled={this.state.isEditDelivery === -2}
                  value={this.state.currentDeliverRequest.timeDelivery}
                  onChange={this.handleChangeInputDeliverRequest}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  margin="normal"
                  style={{ width: '100%' }}
                  validators={['required', 'trim']}
                  errorMessages={[
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                  ]}
                />
                <TextValidator
                  label={intl.formatMessage(messages.ycghCongTy || { id: 'ycghCongTy', defaultMessage: 'ycghCongTy' })}
                  name="company"
                  disabled={this.state.isEditDelivery === -2}
                  value={this.state.currentDeliverRequest.company}
                  onChange={this.handleChangeInputDeliverRequest}
                  variant="outlined"
                  style={{ width: '100%' }}
                  margin="normal"
                  validators={['required', 'trim']}
                  errorMessages={[
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                  ]}
                />
                <TextValidator
                  label={intl.formatMessage(messages.ycghDiaDiem || { id: 'ycghDiaDiem', defaultMessage: 'ycghDiaDiem' })}
                  name="Address"
                  disabled={this.state.isEditDelivery === -2}
                  value={this.state.currentDeliverRequest.Address}
                  onChange={this.handleChangeInputDeliverRequest}
                  variant="outlined"
                  style={{ width: '100%' }}
                  validators={['required', 'trim']}
                  margin="normal"
                  errorMessages={[
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                    `${intl.formatMessage(messages.truongBatBuoc || { id: 'truongBatBuoc', defaultMessage: 'truongBatBuoc' })}`,
                  ]}
                />
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
                      let amountDeliveryNumberic = item.totalAmount - parseInt(amountDelivery.amount, 10) - (parseInt(item.amount, 10) || 0);
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
                        amountDeliveryNumberic = item.totalAmount - totalDelivery - (parseInt(item.amount, 10) || 0);
                      }
                      if (Number(this.state.isEditDelivery) === -2) {
                        // xem
                        amountDeliveryNumberic = item.totalAmount - parseInt(amountDelivery.amount, 10);
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
                              validators={['minNumber:0', `maxNumber:${item.totalAmount - parseInt(amountDelivery.amount, 10)}`]}
                              errorMessages={[
                                `${intl.formatMessage(messages.nhoHon0 || { id: 'nhoHon0', defaultMessage: 'nhoHon0' })}`,
                                `${intl.formatMessage(
                                  messages.khongVuotQuaSoLuong || { id: 'khongVuotQuaSoLuong', defaultMessage: 'khongVuotQuaSoLuong' },
                                )}`,
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
            <Button
              style={{ margin: 20 }}
              onClick={() => {
                this.submitBtn.current.click();
              }}
              variant="outlined"
              color="primary"
              autoFocus
            >
              {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </Button>
            <Button style={{ margin: 20 }} onClick={this.handleClose3} color="secondary" variant="outlined">
              {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

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
    // if (this.state.contractSigningDate === null) {
    //   this.setState({
    //     contractSigningDateError: true,
    //   });
    //   error = true;
    // }
    // if (this.state.code === '') {
    //   this.setState({
    //     codeError: true,
    //   });
    //   error = true;
    // }
    // const rex = /^[A-Za-z0-9]+$/;
    // // if (!rex.test(this.state.code.trim())) {
    // //   this.setState({
    // //     codeTypeError: true,
    // //   });
    // //   error = true;
    // // }
    // if (parseInt(this.state.catalogContract, 10) === 2) {
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
    //     this.props.onChangeSnackbar(
    //       true,
    //       `${this.props.intl.formatMessage(
    //         messages.ngayKiNhoHonNgayBatDau || { id: 'ngayKiNhoHonNgayBatDau', defaultMessage: 'ngayKiNhoHonNgayBatDau' },
    //       )}`,
    //       'error',
    //     );
    //   }
    //   if (this.state.contractSigningDate > this.state.startDay) {
    //     this.setState({
    //       dateError: true,
    //     });
    //     error = true;
    //     this.props.onChangeSnackbar(
    //       true,
    //       `${this.props.intl.formatMessage(
    //         messages.ngayKiNhoHonNgayBatDau || { id: 'ngayKiNhoHonNgayBatDau', defaultMessage: 'ngayKiNhoHonNgayBatDau' },
    //       )}`,
    //       'error',
    //     );
    //   }
    // }

    // if (parseInt(this.state.catalogContract, 10) === 2 && !this.state.idCodeOrder) {
    //   this.props.onChangeSnackbar(
    //     true,
    //     `${this.props.intl.formatMessage(
    //       messages.hopDongThoiVuCanChonDonHang || { id: 'hopDongThoiVuCanChonDonHang', defaultMessage: 'hopDongThoiVuCanChonDonHang' },
    //     )}`,
    //     'error',
    //   );
    //   this.setState({
    //     saleError: true,
    //   });
    //   error = true;
    // }
    if (!error) {
      const { deliverimentRequest } = this.state;
      deliverimentRequest.forEach(item => {
        const pro = [];
        item.products.forEach(prod => {
          pro.push({
            productId: prod.productId,
            name: prod.name,
            amount: prod.amount,
          });
        });
        item.products = pro;
      });
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
      let body = {
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
        typeContract: this.state.typeContract,
        paymentRequest: this.state.paymentOrder,
        task: this.state.task ? { taskId: this.state.task._id || this.state.task.taskId, name: this.state.task.name } : null,
        // order:
        //   parseInt(this.state.catalogContract, 10) === 2
        //     ? {
        //       name: this.state.nameOrder,
        //       orderId: this.state.idCodeOrder,
        //     }
        //     : undefined,
        deliverimentRequest,
        kanbanStatus,
        otherRequest: {
          urlFile: this.state.file,
          nameFile: this.state.fileName,
          note: this.state.fileNote,
          createdAt: new Date(),
        },
        others,
        // numberOrders:this.state.
      };
      if (parseInt(this.state.catalogContract, 10) === 2 && this.state.idCodeOrder) {
        body = {
          ...body,
          order: {
            name: this.state.nameOrder,
            orderId: this.state.idCodeOrder,
          }
        }
      }
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
        const { addSupplierContract } = this.props;
        const { contract } = addSupplierContract;
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
    this.state.currentStage = currentStage;
    this.setState({ isEdit: index, open2: true });
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
      template: null,
      workCompleted: {},
      currency: 'VNĐ',
      VAT: false,
    };
    this.setState({ paymentOrder, currentStage, open2: false, isEdit: -1 });
  };

  handleSubmitForm = () => {
    const { deliverimentRequest, isEditDelivery, amountDelivery } = this.state;
    let { currentDeliverRequest } = this.state;
    if (isEditDelivery === -1) {
      currentDeliverRequest.products.forEach(pro => {
        const x = amountDelivery.findIndex(item => item.productId === pro.productId);
        amountDelivery[x].amount += pro.amount === '' ? 0 : parseInt(pro.amount, 10);
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

  handleChangeInputStage = e => {
    const { currentStage } = this.state;
    currentStage[e.target.name] = e.target.value;
    this.setState({ currentStage });
  };

  handleChangeInputDeliverRequest = e => {
    const { currentDeliverRequest } = this.state;
    currentDeliverRequest[e.target.name] = e.target.value;
    this.setState({ currentDeliverRequest });
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
      timePay: moment().format('YYYY-MM-DD'),
      amount: 0,
      workCompleted: {},
      currency: 'VNĐ',
      VAT: false,
    };
    this.setState({ currentStage, open2: true });
  };

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
    if (itemChoose.products && itemChoose.products.length > 0 && orderProductChooseAPI.length > 0) {
      itemChoose.products.forEach(item => {
        orderProductChooseAPI.forEach(pro => {
          if (pro._id === item.productId) {
            const x = orderProductChoose.find(n => n.productId === item.productId);
            products.push({
              productId: item.productId,
              name: item.name,
              amount: 0,
              price: pro.pricePolicy ? pro.pricePolicy.costPrice : 0,
              unit: pro.unit ? pro.unit.name : '',
              totalAmount: x.amount,
            });
          }
        });
      });
    }
    const currentDeliverRequest = {
      stage: '', // id của yêu cầu thanh toán paymentRequest
      timeDelivery: '',
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

  addToListOrder = index => {
    const { orderList } = this.state;
    const itemChoose = orderList[index];
    let totalMoney = 0;
    itemChoose.products.forEach(n => {
      totalMoney += (Number(n.costPrice) * Number(n.amount) * Number(100 - Number(n.discount) || 0)) / 100;
    });
    this.props.onSetEmpty();
    this.props.onGetProduct(itemChoose);
    this.props.onGetCustomer(itemChoose.supplier);
    this.setState({
      idCodeOrder: itemChoose._id,
      orderProductChoose: itemChoose.products ? itemChoose.products : [],
      open: false,
      orderList: [],
      itemChoose,
      nameOrder: itemChoose.name,
      totalMoney,
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

  choosePO = () => {
    this.setState({ open: true });
  };

  chooseOrder = () => {
    this.setState({ open: true });
  };

  handleChangeDate = e => {
    const name = 'startDay';
    const value = moment(e).format('YYYY-MM-DD');
    this.setState({ [name]: value });
  };

  handleChangeInput = (e, key) => {
    const name = e.target ? e.target.name : key;
    const value = e.target ? e.target.value : moment(e).format('YYYY-MM-DD');
    if (name === 'belong') {
      const item = this.props.addSupplierContract.allContract.find(item => item._id === e.target.value);
      if (item) {
        this.state.belongName = item.name;
        this.state.contractSigningDate = convertDatetimeToDate(item.contractSigningDate);
        this.state.startDay = convertDatetimeToDate(item.startDay);
        this.state.paymentOrder = item.paymentRequest;
        this.state.arrFile = item.otherRequest;

        // this.state.expirationDay = convertDatetimeToDate(item.expirationDay);
        this.setState({ [name]: value });

      }
      return;
    }
    this.setState({ [name]: value });

  };

  handleChangeTabList = (event, value) => {
    this.setState({ value });
  };

  handleAddSale = sale => {
    const choose = {
      taskId: sale._id,
      name: sale.name,
    };
    this.setState({ task: choose });
    this.getProjectTree(sale._id);
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

AddSupplierContract.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const Option = props => (
  <components.Option {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      {/* <Avatar src={props.data.avatar} /> */}
      <div style={{ marginTop: 10 }}>{props.data.name}</div>
    </div>
  </components.Option>
);

const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      {/* <Avatar style={{ height: 30, width: 30 }} src={props.data.avatar} /> */}
      <div style={{ marginTop: 5 }}>{props.data.name}</div>
    </div>
  </components.SingleValue>
);

const mapStateToProps = createStructuredSelector({
  addSupplierContract: makeSelectAddSupplierContract(),
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
    onGetProduct: params => {
      dispatch(getProductAct(params));
    },
    onGetCustomer: params => {
      dispatch(getCustomerAct(params));
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

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addSupplierContract', reducer });
const withSaga = injectSaga({ key: 'addSupplierContract', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddSupplierContract);
