import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  withStyles,
  Paper,
  Typography,
  Grid,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  ExpansionPanelDetails as MuiExpansionPanelDetails,
  ExpansionPanelSummary as MuiExpansionPanelSummary,
  ExpansionPanel as MuiExpansionPanel,
  Checkbox,
  Avatar,
} from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { TextField, Autocomplete as Auto, KanbanStep, FileUpload, AsyncAutocomplete } from 'components/LifetekUi';
import { Cancel, ExpandMore, AddToPhotosRounded, ShopTwoRounded, DeleteRounded, Close } from '@material-ui/icons';
import { Breadcrumbs } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAddSalesQuotation from './selectors';
import reducer from './reducer';
import saga from './saga';
import { setState, getSale, mergeData, postSale, putSale, closeSales } from './actions';
import styles from './styles';
import Snackbar from '../../components/Snackbar';
import KanbanStepper from '../../components/KanbanStepper';
import TextFieldCode from '../../components/TextFieldCode';
import messages from './messages';
import { API_STOCK } from '../../config/urlConfig';
import { viewConfigCheckForm } from 'utils/common';
import CustomInputBase from '../../components/Input/CustomInputBase';
import CustomAppBar from 'components/CustomAppBar';
import { changeSnackbar } from '../Dashboard/actions';
import moment from 'moment';

function groupBy(objectArray, property) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!key) return acc;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

export class AddSalesQuotation extends React.Component {
  state = {
    // textButton: 'Đơn hàng',
    open: false,
    quantity: 0,
    salesColumns: JSON.parse(localStorage.getItem('viewConfig'))
      .find(item => item.code === 'SalesQuotation')
      .listDisplay.type.fields.type.columns.map(item => ({ ...item, name: item.name.replace(/\./g, '_') })),
    othersName: JSON.parse(localStorage.getItem('viewConfig'))
      .find(item => item.code === 'SalesQuotation')
      .listDisplay.type.fields.type.others.map(item => ({ ...item, name: item.name.substring(7) })),
    crmSource: JSON.parse(localStorage.getItem('crmSource')),
    listKanbanStatus: [],
    localMessages: {},
    codeDTCP: '',
    checkChanged: false,
    customerName: "",
    customerNameError: false,
  };

  componentWillReceiveProps(props) {
    if (props.addSalesQuotation) {
      const localMessages = viewConfigCheckForm('SalesQuotation', props.addSalesQuotation);
      this.setState({
        localMessages,
      });
    }
  }

  isEmptyObject = obj => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  checkRequest = value => {
    const { salesColumns } = this.state;
    const column = salesColumns.filter(data => data.name === value);
    if (!this.isEmptyObject(column)) {
      return column[0].checkedRequireForm;
    }
  };

  checkShowForm = value => {
    const { salesColumns } = this.state;
    const column = salesColumns.filter(data => data.name === value);
    if (!this.isEmptyObject(column)) {
      return column[0].checkedShowForm;
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  deleteProduct(id) {
    const products = this.props.addSalesQuotation.products;
    const newProduct = products.filter(item => item._id !== id);
    this.props.handleChange('products', newProduct);
  }

  changeCostPrice = _id => e => {
    if (e.target.value >= 0) {
      let snackbar = { ...this.props.addSalesQuotation.snackbar };
      let newCostPrice = {};
      // newCostPrice['costPrice'] = e.trg
      const newProducts = this.props.addSalesQuotation.products.map(
        i => (i._id === _id ? { ...i, pricePolicy: { ...i.pricePolicy, costPrice: e.target.value } } : i),
      );
      const currentProduct = newProducts.find(i => i._id === _id);
      if (currentProduct.costPrice < currentProduct.sourcePrice) {
        snackbar = {
          ...snackbar,
          status: true,
          message: 'Bạn đang bán hàng dưới giá vốn',
          variant: 'warning',
        };
      }
      this.props.mergeData({ products: newProducts, snackbar });
    }
  };

  changeQuantity = _id => e => {
    let snackbar = { ...this.props.addSalesQuotation.snackbar };
    if (e.target.value < 0) {
      snackbar = {
        ...snackbar,
        status: true,
        message: 'không được nhập số lượng nhỏ hơn 0',
        variant: 'warning',
      };
      this.props.mergeData({ snackbar });
      return;
    }
    const newProducts = this.props.addSalesQuotation.products.map(i => (i._id === _id ? { ...i, amount: e.target.value } : i));
    const currentProduct = newProducts.find(i => i._id === _id);
    if (currentProduct.total < currentProduct.amount) {
      snackbar = {
        ...snackbar,
        status: true,
        message: 'Số lượng yêu cầu không đủ. Bạn có thể bán hàng nhưng cần kiểm tra lại kho',
        variant: 'warning',
      };
    }
    this.props.mergeData({ products: newProducts, snackbar });
  };

  changeDiscount = _id => e => {
    const value = e.target.value;
    const snackbar = { ...this.props.addSalesQuotation.snackbar };
    if (value < 0 || value > 100) {
      snackbar.status = true;
      snackbar.message = 'Chiết khấu trong khoảng 0 - 100%';
      snackbar.variant = 'error';
      this.props.handleChange('snackbar', snackbar);
      return;
    }

    const newProducts = this.props.addSalesQuotation.products.map(i => (i._id === _id ? { ...i, discount: e.target.value } : i));
    const currentProduct = newProducts.find(i => i._id === _id);
    const newPrice = (1 - currentProduct.discount / 100) * currentProduct.costPrice;
    if (newPrice < currentProduct.sourcePrice) {
      snackbar.status = true;
      snackbar.message = 'Bạn đang bán hàng dưới giá vốn';
      snackbar.variant = 'warning';
    }
    this.props.mergeData({ products: newProducts, snackbar });
  };

  closeSnackbar = () => {
    const snackbar = { ...this.props.addSalesQuotation.snackbar };
    snackbar.status = false;
    this.props.handleChange('snackbar', snackbar);
  };

  //list product
  selectProduct = product => {
    if (!product) return;
    const { products } = this.props.addSalesQuotation;
    const snackbar = { ...this.props.addSalesQuotation.snackbar };
    const findPrroduct = products.findIndex(item => item._id === product._id);
    console.log(product, "hbdhbv")
    if (findPrroduct === -1) {
      const newProduct = [
        ...products,
        { ...product, productGroup: product.catalog ? product.catalog.name : '', amount: 1, unit: product.unit, isDisplaySourcePrice: true },
      ];
      if (product.total < 1) {
        snackbar.status = true;
        snackbar.message = 'Số lượng yêu cầu không đủ. Bạn vẫn có thể tiếp tục bán hàng nhưng cần kiểm tra lại kho';
        snackbar.variant = 'warning';
      }
      this.props.mergeData({ products: newProduct, snackbar });
    }
    // else newProduct = products.map(item => (item._id === product._id ? { ...item, amount: item.amount + 1 } : item));
  };
  selectExpenses = expense => {
    const { listProduct, customers } = this.props.addSalesQuotation;
    const productExpenses = expense.products;
    this.setState({ customerName: expense && expense.customer && expense.customer.name || "" })
    console.log(4444, expense);
    this.setState({ codeDTCP: expense._id });
    const findProduct = expense.products.map(i => i._id);
    const product = listProduct.filter(i => findProduct.includes(i._id));

    if (productExpenses && product) {
      const productItem = productExpenses.map(item => ({
        ...item,
        amount: item.amount,
        _id: item._id,
        name: item.name,
        costPrice: item.costPrice,
        sourcePrice: item.sourcePrice,
        // total: product.total,
        unit: product.unit,
        discount: item.discount,
        nameUnit: item.unit,
        // description: product.description,
        // code: product.code,
        isDisplaySourcePrice: true,
      }));
      const customerID = expense.customer ? expense.customer._id : '';

      if (customerID) {
        const item = customers.find(elm => elm._id === customerID);
        if (!item) {
          this.props.mergeData({ products: productItem });
          return;
        }
        const newCustomer = {
          ...item,
          name: item.name,
          customerId: item._id,
          customDebitAccount: item.detailInfo.options.customDebitAccount,
          debitAccount: item.detailInfo.options.debitAccount,
          customerLevel: item.detailInfo.typeCustomer.branches,
          avatar: item.avatar,
          representName: item.detailInfo.represent.name,
          representPosition: item.detailInfo.represent.position,
          representPhoneNumber: item.detailInfo.represent.phoneNumber,
          contactWays: item.detailInfo.typeCustomer.contactWays,
          group: item.detailInfo.typeCustomer.group,
          code: item.code,
        };
        this.props.mergeData({ products: productItem, customer: newCustomer });
      }
    }
  };

  selectCommision = employees => {
    this.props.handleChange('commissionGroup', employees);
  };

  selectCustomer = customer => {
    this.setState({ customerNameError: false })
    this.setState({ customerName: customer && customer.name })
    this.props.handleChange('customer', customer);
  };

  deleteCustomer = () => {
    this.setState({ customerName: "" })
    this.props.handleChange('customer', null);
  };

  handleChangeKanban = id => {
    // this.props.mergeData({ kanbanStatus: item._id });
    this.props.mergeData({ kanbanStatus: id });

  };

  setOthers = (name, value) => {
    const { others } = this.props.addSalesQuotation;
    const newOthers = { ...others };
    newOthers[name] = value;
    this.props.mergeData({ others: newOthers });
  };

  handleOthers = () => (
    <React.Fragment>
      {this.state.othersName.map(item => {
        switch (item.type) {
          case 'text':
          case 'number':
          case 'date':
            return (
              <TextField
                onChange={e => this.setOthers(item.name, e.target.value)}
                label={item.title}
                fullWidth
                type={item.type}
                defaultValue=""
                title={item.title}
                value={this.props.addSalesQuotation.others[item.name]}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            );
          default:
            return (
              <TextField
                value={this.props.addSalesQuotation.others[item.name]}
                onChange={e => this.setOthers(item.name, e.target.value)}
                label={item.title}
                fullWidth
                select
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {this.state.crmSource.find(el => el._id === item.type).data.map(ele => (
                  <MenuItem value={ele.value}>{ele.title}</MenuItem>
                ))}
              </TextField>
            );
        }
      })}
    </React.Fragment>
  );

  render() {
    // {console.log('mess', this.state.localMessages)}
    const { classes, addSalesQuotation, intl } = this.props;
    const { listKanbanStatus } = this.state;
    // console.log(listKanbanStatus,'listKanbanStatus');
    // console.log(this.state.kanbanStatus,'kanbanStatus');
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    // console.log('mg', this.props.mg);
    const names = {};
    this.state.salesColumns.forEach(item => {
      names[item.name] = item.title;
    });
    const dataGroup = groupBy(addSalesQuotation.products, 'group');
    const dataProduct = addSalesQuotation.products.filter(i => !i.group);

    const paymentLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
    const payment = paymentLocal && paymentLocal.find(item => item.code === 'S17') && paymentLocal.find(item => item.code === 'S17').data || [];
    // addSalesQuotation.kanbanStatus = '616f9e64262b8b3655aa3d91';
    const { snackbar, kanbanStatus, listMerge, dialogMerge, groupName } = addSalesQuotation;
    // console.log(kanbanStatus);
    const { quantity, open, localMessages } = this.state;
    const dataGroupRender = Object.keys(dataGroup).map(i => {
      return (
        <React.Fragment>
          {dataGroup[i].map((item, index) => {
            return (
              <TableRow style={{ borderTop: index ? null : 'black solid 1px' }} key={item._id}>
                <TableCell>
                  <div className={classes.productDetail}>
                    <Typography color="primary" variant="body1">
                      {item.name}
                    </Typography>
                    <Typography>Mô tả: {item.description}</Typography>
                    <Typography>Trong kho: {item.total}</Typography>
                    <Typography>Mã sản phẩm: {item.code}</Typography>
                    <Typography>{item.isDisplaySourcePrice ? `Giá vốn: ${item.sourcePrice}` : ''}</Typography>
                    {item.group ? (
                      <Typography>
                        Nhóm: {item.group}{' '}
                        <DeleteRounded onClick={() => this.removeFromGroup(item._id)} style={{ fontSize: '1rem', cursor: 'pointer' }} />
                      </Typography>
                    ) : (
                      ''
                    )}
                    {item.isSerial ? (
                      <Typography>serials: {Array.isArray(item.serials) && item.serials.map(it => it.serialNumber).toString()}</Typography>
                    ) : (
                      ''
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.supplier && item.supplier.name}</TableCell>
                <TableCell>
                  <TextField onChange={this.changeCostPrice(item._id)} type="number" value={item.pricePolicy ? item.pricePolicy.costPrice : 0} />
                </TableCell>
                <TableCell>
                  <TextField onChange={this.changeQuantity(item._id)} type="number" value={item.amount} />
                </TableCell>
                <TableCell>{item.unit && item.unit.name}</TableCell>

                <TableCell>
                  <TextField onChange={this.changeDiscount(item.pricePolicy._id)} type="number" value={item.discount ? item.discount : 0} />
                </TableCell>
                <TableCell>
                  {item.pricePolicy ? this.converttoMoney(item.pricePolicy.costPrice * (1 - item.discount / 100) * item.amount) : 0}VNĐ
                </TableCell>
                <TableCell>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <Cancel onClick={() => this.deleteProduct(item._id)} style={{ cursor: 'pointer' }} />
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell align="right" colSpan={7}>
              <Typography color="primary" variant="h5">
                {i}
              </Typography>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    });

    const dataRenderProduct = dataProduct.map(item => {
      // console.log(item,'itemitem');
      return (
        // console.log(item, 1234),
        <TableRow key={item._id}>
          <TableCell>
            <div className={classes.productDetail}>
              <Typography color="primary" variant="body1">
                {item.name}
              </Typography>
              <Typography>
                {intl.formatMessage(messages.mota || { id: 'mota', defaultMessage: 'mota' })}: {item.description}
              </Typography>
              <Typography>
                {intl.formatMessage(messages.trongkho || { id: 'trongkho', defaultMessage: 'trongkho' })}: {item.sellingPoint === undefined ? item.amount : item.sellingPoint && item.sellingPoint[0] && item.sellingPoint[0].amount}
              </Typography>
              <Typography>
                {intl.formatMessage(messages.masanpham || { id: 'masanpham', defaultMessage: 'masanpham' })}: {item.code}
              </Typography>
              <Typography>{(!item || item && item.isDisplaySourcePrice) === undefined ? `Giá vốn: ${item && item.sourcePrice}` : item && item.isDisplaySourcePrice === true ? `Giá vốn: ${item && item.pricePolicy && item.pricePolicy.sourcePrice}` : ''}</Typography>
              {item.group ? (
                <Typography>
                  {' '}
                  Nhóm: {item.group} <DeleteRounded />{' '}
                </Typography>
              ) : (
                ''
              )}
              {item.isSerial ? (
                <Typography>serials: {Array.isArray(item.serials) && item.serials.map(it => it.serialNumber).toString()}</Typography>
              ) : (
                ''
              )}
            </div>
          </TableCell>
          <TableCell>{item.supplier && item.supplier.name}</TableCell>
          <TableCell>
            <TextField
              onChange={this.changeCostPrice(item._id)}
              type="number"
              value={item.pricePolicy ? item.pricePolicy.costPrice : 0 || item.costPrice}
            />
          </TableCell>
          <TableCell>
            <TextField onChange={this.changeQuantity(item._id)} type="number" value={item.amount} />
          </TableCell>
          <TableCell>{(item.unit && item.unit.name) || item.nameUnit}</TableCell>
          <TableCell>
            <TextField onChange={this.changeDiscount(item._id)} type="number" value={item.discount ? item.discount : 0} />
          </TableCell>
          <TableCell>
            {item.discount
              ? item.pricePolicy
                ? this.converttoMoney(item.pricePolicy.costPrice * (1 - item.discount / 100) * item.amount)
                : 0
              : item.pricePolicy
                ? this.converttoMoney(item.pricePolicy.costPrice * (1 - 0 / 100) * item.amount)
                : 0 || item.discount
                  ? item.costPrice
                    ? this.converttoMoney(item.costPrice * (1 - item.discount / 100) * item.amount)
                    : 0
                  : item.costPrice
                    ? this.converttoMoney(item.costPrice * (1 - 0 / 100) * item.amount)
                    : 0}
            VNĐ
          </TableCell>
          <TableCell>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <Cancel onClick={() => this.deleteProduct(item._id)} style={{ cursor: 'pointer' }} />
              <AddToPhotosRounded
                onClick={() => this.mergeProduct(item._id)}
                style={{ cursor: 'pointer', color: listMerge.includes(item._id) ? 'red' : null }}
              />
            </span>
          </TableCell>
        </TableRow>
      )
    });
    return (
      <div style={this.props.miniActive ? { width: "calc(100vw - 80px)" } : { width: "calc(100vw - 260px)" }}>
        {/* <AppBar className={id === 'add' ? ( this.props.exchangingAgreementId ? classes.HearderappBarAddSale : classes.HearderappBarAddSale2) : classes.HearderappBarAddSaleEdit}>
        <Toolbar>
          <IconButton
            // className={id !== 'add' ? '' : ''}
            className={classes.BTNSALE}
            color="inherit"
            variant="contained"
            onClick={this.cancelOrder}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {id === 'add' ? 
                `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới báo giá Báo giá/Bán hàng' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật báo giá Báo giá/Bán hàng' })}`}
          </Typography>
          {addSalesQuotation.customer ? (
            <GridRight>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                <Button style={{margin: "0 5px"}} variant="outlined" color="inherit" onClick={this.onSave(1)}>
                  {intl.formatMessage(messages.banhang || { id: 'banhang', defaultMessage: 'banhang' })}
                </Button>
                <Button style={{margin: "0 5px"}} variant="outlined" color="inherit"  onClick={this.onSave(2)} >
                  {intl.formatMessage(messages.baogia || { id: 'baogia', defaultMessage: 'baogia' })}
                </Button>
                <Button style={{margin: "0 5px"}} variant="outlined" color="inherit" onClick={this.onSave(3)} >
                  {intl.formatMessage(messages.dathang || { id: 'dathang', defaultMessage: 'dathang' })}
                </Button>
              </div>
            </GridRight>
          ) : (
            <GridRight>
              <Button style={{margin: "0 5px"}} variant="outlined" color="inherit" onClick={this.onSave()}>
            {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
            </Button>
            </GridRight>
            )}
        </Toolbar>
        </AppBar> */}
        <CustomAppBar
          title={
            id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới báo giá Báo giá/Bán hàng' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật báo giá Báo giá/Bán hàng' })}`
          }
          onGoBack={() => {
            if (this.props.onClose)
              return this.props.onClose()
            this.cancelOrder()
          }}
          // onSubmit={this.onSave(addSalesQuotation.typeOfSalesQuotation)}
          disableAdd
          // onSubmit={this.onSave(addSalesQuotation.typeOfSalesQuotation)}
          moreButtons={
            // <div style={{ marginLeft: 10, display: 'flex', justifyContent: 'space-around' }}>
            //   <Button variant="outlined" color="inherit" onClick={this.onSave(2)}>
            //     {intl.formatMessage(messages.baogia || { id: 'baogia', defaultMessage: 'baogia' })}
            //   </Button>
            //   <Button style={{ marginLeft: 10 }} variant="outlined" color="inherit" onClick={this.onSave(3)}>
            //     {intl.formatMessage(messages.dathang || { id: 'dathang', defaultMessage: 'dathang' })}
            //   </Button>
            // </div>
            <div>
              <Button style={{ marginLeft: 10 }} variant="outlined" color="inherit" onClick={this.onSave(addSalesQuotation.typeOfSalesQuotation, 0)}>
                Lưu và đóng
              </Button>
              <Button style={{ marginLeft: 10 }} variant="outlined" color="inherit" onClick={this.onSave(addSalesQuotation.typeOfSalesQuotation, 1)}>
                Lưu và in
              </Button>
            </div>

          }
        />
        <Paper className={classes.breadcrumbs} style={{ display: 'none' }}>
          <Helmet>
            <title>
              {this.props.id
                ? this.props.id
                : this.props.match.params.id === 'add'
                  ? intl.formatMessage(messages.themmoibaogia || { id: 'themmoibaogia', defaultMessage: 'themmoibaogia' })
                  : intl.formatMessage(messages.chinhsuabaogia || { id: 'chinhsuabaogia', defaultMessage: 'chinhsuabaogia' })}
            </title>
            <meta name="description" content="Description of StockExportPage" />
          </Helmet>

          {this.props.id ? null : (
            <Breadcrumbs aria-label="Breadcrumb" style={{ display: 'none' }}>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/crm/SalesQuotation">
                {intl.formatMessage(messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' })}
              </Link>
              <Typography color="textPrimary">{intl.formatMessage(messages.baogia || { id: 'baogia', defaultMessage: 'baogia' })}</Typography>
            </Breadcrumbs>
          )}
        </Paper>
        {/* <div>
          <KanbanStepper
            listStatus={kanbanSteppers}
            onKabanClick={value => {
              this.props.mergeData({ kanbanStatus: value });
            }}
            activeStep={kanbanStatus}
          />
        </div> */}
        <Grid item md={12} style={{ marginTop: '5rem' }}>
          {/* <KanbanStep
            handleStepper={this.handleChangeKanban}
            kanbanStatus={kanbanStatus === '5fb8ccb2ee748c1c609d624b' ? '616f9e64262b8b3655aa3d91' : kanbanStatus}
            code="ST02"
          /> */}
          <KanbanStepper
            listStatus={listKanbanStatus}
            onKabanClick={(value) => {
              console.log(value, 'value')
              // this.setState({ kanbanStatus: value });
              this.handleChangeKanban(value)
            }}
            activeStep={kanbanStatus}
          />
        </Grid>

        <Grid style={{ display: 'flex', alignItems: 'stretch' }} container spacing={24}>
          <Grid md={8} item>
            {/* <TextField fullWidth label="Ten bao gia" /> */}
            <Paper className={classes.paper}>
              {/* {this.checkShowForm('')} */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {addSalesQuotation.order === 1 ? (
                  <AsyncAutocomplete value="" onChange={product => this.selectProduct(product)} url={API_STOCK} />
                ) : null}
                {addSalesQuotation.order === 2 ? (
                  <Auto
                    value={addSalesQuotation.expenses}
                    onChange={expenses => this.selectExpenses(expenses)}
                    suggestions={addSalesQuotation.expensess}
                  />
                ) : null}
                {addSalesQuotation.order === 3 ? (
                  <AsyncAutocomplete value="" onChange={product => {
                    this.selectProduct(product)
                  }} url={API_STOCK} filters={['code']}
                    // customOptionLabel={this.customOptionLabel}
                    optionLabel='code'
                  />
                ) : null}

                <TextField select value={addSalesQuotation.order} onChange={e => this.props.mergeData({ order: e.target.value })}>
                  <MenuItem value={3}>{intl.formatMessage(messages.madonhang || { id: 'madonhang', defaultMessage: 'madonhang' })}</MenuItem>
                  <MenuItem value={1}>{intl.formatMessage(messages.donhang || { id: 'donhang', defaultMessage: 'donhang' })}</MenuItem>
                  {this.props.addCustomer ? null : (
                    <MenuItem value={2}>{intl.formatMessage(messages.khotructiep || { id: 'khotructiep', defaultMessage: 'khotructiep' })}</MenuItem>
                  )}
                </TextField>
              </div>
            </Paper>
          </Grid>
          {/* <Grid md={4} item>
            <Paper style={{ display: 'flex', alignItems: 'center' }} className={classes.paper}>
              <div style={{ margin: '0 auto', width: '50%' }}>
                <Grid container direction="row" style={{ justifyContent: 'space-around' }}>
                  <Button onClick={this.cancelOrder} variant="outlined" color="secondary">
                    <Cancel style={{ marginRight: '5px' }} /> Hủy
                  </Button>
                </Grid>
              </div>
            </Paper>
          </Grid> */}
          <Grid md={4} item>
            <TextField select value={addSalesQuotation.typeOfSalesQuotation} onChange={e => {
              this.props.mergeData({ typeOfSalesQuotation: e.target.value })
              if (!this.state.checkChanged && (!id || id === 'add')) {
                const month = moment().format('M')
                const { customerName } = this.state
                console.log(customerName, 'customerName');
                switch (e.target.value) {
                  case 1:
                    this.props.mergeData({ name: `Bán hàng tháng ${month} ${customerName ? ` - ${customerName}` : ""}` })
                    break;
                  case 2:
                    this.props.mergeData({ name: `Báo giá tháng ${month} ${customerName ? ` - ${customerName}` : ""}` })
                    break;
                  case 3:
                    this.props.mergeData({ name: `Đặt hàng tháng ${month} ${customerName ? ` - ${customerName}` : ""}` })
                    break;
                  default:
                    break;
                }
              }
            }}
              fullWidth
            >
              <MenuItem value={1}>Bán Hàng</MenuItem>
              <MenuItem value={2}>Báo Giá</MenuItem>
              <MenuItem value={3}>Đặt hàng</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid md={8} item>
            <Paper className={classes.paper}>
              <div>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography color="primary" variant="h5">
                    {intl.formatMessage(messages.danhsachsanpham || { id: 'danhsachsanpham', defaultMessage: 'danhsachsanpham' })}
                  </Typography>
                  {listMerge.length ? <ShopTwoRounded onClick={this.openDialogMerge} style={{ cursor: 'pointer' }} /> : null}
                </span>

                <Table padding="checkbox">
                  <TableHead>
                    <TableRow style={{ background: '#F5F5F5', fontWeight: 'bold' }}>
                      <HeadCell> {intl.formatMessage(messages.ten || { id: 'ten', defaultMessage: 'ten' })}</HeadCell>
                      <HeadCell> NCC</HeadCell>
                      <HeadCell>{intl.formatMessage(messages.gia || { id: 'gia', defaultMessage: 'gia' })}</HeadCell>
                      <HeadCell> {intl.formatMessage(messages.soluong || { id: 'soluong', defaultMessage: 'soluong' })}</HeadCell>
                      <HeadCell>{intl.formatMessage(messages.donvitinh || { id: 'donvitinh', defaultMessage: 'donvitinh' })}</HeadCell>
                      <HeadCell> {intl.formatMessage(messages.chieukhau || { id: 'chieukhau', defaultMessage: 'chieukhau' })}</HeadCell>
                      <HeadCell>{intl.formatMessage(messages.tongdonhang || { id: 'tongdonhang', defaultMessage: 'tongdonhang' })}</HeadCell>
                      {/* <HeadCell /> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {addSalesQuotation.products.length ? (
                      dataGroupRender.concat(dataRenderProduct)
                    ) : (
                      <TableRow>
                        <TableCell className={classes.borderTable} colSpan="7">
                          <Typography color="secondary" variant="subtitle2">
                            {intl.formatMessage(messages.khongcomathangnao || { id: 'khongcomathangnao', defaultMessage: 'khongcomathangnao' })}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Typography style={{ padding: '20px 0px' }}>Thông tin thêm</Typography>
                {this.handleOthers()}
                <Typography style={{ padding: '20px 0px' }}>
                  {intl.formatMessage(messages.ghichu || { id: 'ghichu', defaultMessage: 'ghichu' })}:
                </Typography>
                <TextField
                  id="outlined-multiline-flexible"
                  // label="Multiline"
                  multiline
                  rows="4"
                  value={addSalesQuotation.description}
                  onChange={e => this.props.mergeData({ description: e.target.value })}
                  margin="normal"
                  variant="outlined"
                  className={classes.textField}
                  style={{ width: '100%' }}
                />

                <Paper>
                  <FileUpload name={this.props.addSalesQuotation.name} id={id} code="SalesQuotation" />
                </Paper>
              </div>
            </Paper>
          </Grid>
          <Grid md={4} style={{ display: 'flex', flexDirection: 'column' }} item>
            <Paper className={classes.paper}>
              <GridRight>
                <div style={{ width: '100%' }}>
                  {this.checkShowForm('name') && (
                    <CustomInputBase
                      error={this.props.addSalesQuotation.name === '' && this.checkRequest('name')}
                      helperText={this.props.addSalesQuotation.name === '' ? localMessages.name : null}
                      required={this.checkRequest('name')}
                      onChange={e => {
                        this.props.mergeData({ name: e.target.value })
                        if (!!e.target.value) {
                          this.setState({ checkChanged: true })
                        } else this.setState({ checkChanged: false })
                      }}
                      label={names.name}
                      margin="dense"
                      code={4}
                      value={addSalesQuotation.name}
                      fullWidth
                      variant="outlined"
                    />
                  )}

                  {this.checkShowForm('code') && (
                    <TextFieldCode
                      // error={addSalesQuotation.errorCode}
                      // helperText={addSalesQuotation.errorCode ? 'Mã Báo giá không được bỏ trống' : null}
                      onChange={this.changeCode}
                      label={names.code}
                      margin="dense"
                      code={4}
                      value={addSalesQuotation.code}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                </div>
              </GridRight>
              {addSalesQuotation.customer ? (
                <React.Fragment>
                  <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 5 }}>
                      <Avatar style={{ width: 100, height: 100 }} src={addSalesQuotation.customer.avatar} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 5 }}>
                      <Button onClick={this.deleteCustomer} color="secondary" variant="outlined">
                        {intl.formatMessage(messages.xoa || { id: 'xoa', defaultMessage: 'xoa' })}
                      </Button>
                    </div>
                  </div>
                  <GridRight>
                    <Typography variant="body1" color="primary">
                      Tên khách hàng
                    </Typography>
                    <Typography variant="subtitle1">{addSalesQuotation.customer.name}</Typography>
                  </GridRight>
                  {/* <GridRight>
                    <Typography variant="body1" color="primary">
                      {intl.formatMessage(messages.tkkhachno || { id: 'tkkhachno', defaultMessage: 'tkkhachno' })}
                    </Typography>
                    <Typography variant="subtitle1">{addSalesQuotation.customer.customDebitAccount}$</Typography>
                  </GridRight>
                  <GridRight>
                    <Typography variant="body1" color="primary">
                      {intl.formatMessage(messages.tknokhach || { id: 'tknokhach', defaultMessage: 'tknokhach' })}
                    </Typography>
                    <Typography variant="subtitle1">{addSalesQuotation.customer.debitAccount}$</Typography>
                  </GridRight> */}
                </React.Fragment>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {this.checkShowForm('customer_name') && (
                    <Auto
                      onChange={this.selectCustomer}
                      suggestions={addSalesQuotation.customers}
                      label={names.customer_name + " *"}
                      optionLabel="name"
                      optionValue="customerId"
                      fullWidth
                      // error={this.checkRequest('customer_name')}
                      error={this.state.customerNameError}
                      helperText={this.state.customerNameError ? 'Chọn tên khách hàng' : null}
                      required={this.checkRequest('customer_name')}
                    />
                  )}
                </div>
              )}
              <GridRight>
                <Typography variant="body1" color="primary">
                  {intl.formatMessage(messages.tongmathang || { id: 'tongmathang', defaultMessage: 'tongmathang' })}
                </Typography>
                <Typography variant="subtitle1">{addSalesQuotation.products.length}</Typography>
              </GridRight>
              <GridRight>
                <Typography variant="body1" color="primary">
                  {intl.formatMessage(messages.tongsanpham || { id: 'tongsanpham', defaultMessage: 'tongsanpham' })}
                </Typography>
                <Typography variant="subtitle1">{this.totalProduct()}</Typography>
              </GridRight>

              <GridRight>
                <div style={{ width: '100%' }}>
                  {this.checkShowForm('service') && (
                    <TextField
                      value={addSalesQuotation.service}
                      fullWidth
                      select
                      onChange={this.handleChange('service')}
                      label={names.service}
                      InputLabelProps={{ shrink: true }}
                      required={this.checkRequest('service')}
                      error={this.checkRequest('service') && addSalesQuotation.service === ''}
                      helperText={localMessages.service}
                    >
                      {addSalesQuotation.services.map(item => (
                        <MenuItem key={item.code} value={item.code}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </div>
              </GridRight>

              <GridRight>
                <div style={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    value={addSalesQuotation.salesman ? addSalesQuotation.salesman.name : null}
                    disabled
                    // label={intl.formatMessage(messages.nhanvienbanhang || { id: 'nhanvienbanhang', defaultMessage: 'nhanvienbanhang' })}
                    label={names.salesman_name}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </GridRight>
              <GridRight />
              {/* <GridRight>
                <div style={{ width: '15%' }}>
                  {this.checkShowForm('percentageDiscount') && <TextField
                    type="number"
                    value={addSalesQuotation.percentageDiscount}
                    onChange={e => this.handlePercentageDiscount(e)}
                    fullWidth
                    select
                    // label={names.percentageDiscount}
                    label='Đơn vị'
                    InputLabelProps={{ shrink: true }}
                    required={this.checkRequest("percentageDiscount")}
                    error={this.checkRequest("percentageDiscount") && addSalesQuotation.percentageDiscount === ''}
                    helperText={localMessages.percentageDiscount}
                  >
                    <MenuItem  key={0} value={'$'}>
                      $
                    </MenuItem >
                    <MenuItem  key={1} value={'%'}>
                      %
                    </MenuItem >
                  </TextField>}
                </div>
              </GridRight> */}
              <GridRight>
                <div style={{ width: '80%' }}>
                  {this.checkShowForm('priceDiscount') && (
                    <TextField
                      type="number"
                      onChange={e => {
                        if (addSalesQuotation.unit === 0 || addSalesQuotation.unit === 2) {
                          this.handlePriceDiscount(e);
                        } else {
                          this.handlePercentageDiscount(e);
                        }
                      }}
                      value={addSalesQuotation.unit === 0 || addSalesQuotation.unit === 2 ? addSalesQuotation.priceDiscount : addSalesQuotation.percentageDiscount}
                      fullWidth
                      label={names.priceDiscount}
                      InputLabelProps={{ shrink: true }}
                      required={this.checkRequest('priceDiscount')}
                      error={this.checkRequest('priceDiscount') && addSalesQuotation.priceDiscount === ''}
                      helperText={localMessages.priceDiscount}
                    />
                  )}
                </div>
                <div style={{ width: '15%' }}>
                  {this.checkShowForm('percentageDiscount') && (
                    <TextField
                      type="number"
                      value={addSalesQuotation.unit}
                      onChange={this.handleChange('unit')}
                      fullWidth
                      select
                      // label={names.percentageDiscount}
                      label="Đơn vị"
                      InputLabelProps={{ shrink: true }}
                      required={this.checkRequest('percentageDiscount')}
                      error={this.checkRequest('percentageDiscount') && addSalesQuotation.percentageDiscount === ''}
                      helperText={localMessages.percentageDiscount}
                    >
                      <MenuItem key={0} value={0}>
                        VNĐ
                      </MenuItem>
                      <MenuItem key={1} value={1}>
                        %
                      </MenuItem>
                      <MenuItem key={2} value={2}>
                        $
                      </MenuItem>
                    </TextField>
                  )}
                </div>
              </GridRight>
              {this.checkShowForm('rate') && (
                <GridRight>
                  <div style={{ width: '100%' }}>
                    <TextField
                      error={this.props.addSalesQuotation.rate === '' && this.checkRequest('rate')}
                      helperText={this.props.addSalesQuotation.rate === '' ? localMessages.rate : null}
                      // onChange={e => this.props.mergeData({ rate: e.target.value })}
                      onChange={e => this.handleRate(e)}
                      value={addSalesQuotation.rate}
                      fullWidth
                      label={names.rate}
                      margin="dense"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      type="number"
                      required={this.checkRequest('rate')}
                    />
                  </div>
                </GridRight>
              )}

              {addSalesQuotation.products.length ? (
                <React.Fragment>
                  <GridRight>
                    <Auto
                      name={intl.formatMessage(messages.chonnhanvien || { id: 'chonnhanvien', defaultMessage: 'chonnhanvien' })}
                      value={addSalesQuotation.commissionGroup}
                      suggestions={addSalesQuotation.employees}
                      isMulti
                      label={intl.formatMessage(messages.nhomhoahong || { id: 'nhomhoahong', defaultMessage: 'nhomhoahong' })}
                      onChange={this.selectCommision}
                      optionLabel="name"
                      optionValue="employeeId"
                    />
                  </GridRight>
                  <GridRight>
                    <div style={{ width: '100%' }}>
                      <TextField
                        value={addSalesQuotation.paymentType}
                        onChange={this.changePaymentType}
                        fullWidth
                        select
                        label="Hình thức thanh toán"
                      >
                        {payment.map(item => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </GridRight>
                  <GridRight>
                    <div style={{ width: '100%' }}>
                      <TextField
                        value={addSalesQuotation.currentPayment}
                        onChange={this.handleChange('currentPayment')}
                        type="number"
                        fullWidth
                        label="Thanh toán hiện tại"
                      />
                    </div>
                  </GridRight>

                  <GridRight>
                    <span />
                    <Button variant="outlined" onClick={this.addPayment} color="primary">
                      {intl.formatMessage(messages.thanhtoan || { id: 'thanhtoan', defaultMessage: 'thanhtoan' })}
                    </Button>
                  </GridRight>
                  <GridRight>
                    <div>
                      {addSalesQuotation.paymentAmount.map(item => {
                        const a = payment.find(ele => ele.value === item.paymentType);
                        return (
                          <p>
                            {a ? a.title : 'Phương thức bị xóa'}: {item.amount * 1}
                          </p>
                        );
                      })}
                    </div>
                  </GridRight>
                  <GridRight>
                    <Typography variant="subtitle1" color="primary">
                      {/* {intl.formatMessage(messages.tongsotienthanhtoan || { id: 'tongsotienthanhtoan', defaultMessage: 'tongsotienthanhtoan' })}
                     */}
                      {names.paymentAmount}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      {this.converttoMoney(this.getPayment())}
                      VNĐ
                    </Typography>
                  </GridRight>
                  <GridRight>
                    <Typography variant="subtitle1" color="primary">
                      {/* {intl.formatMessage(messages.tongdonhang || { id: 'tongdonhang', defaultMessage: 'tongdonhang' })} */}
                      {names.totalAmount}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      {this.converttoMoney(this.totalOrder())}
                      VNĐ
                    </Typography>
                  </GridRight>
                  <GridRight>
                    <Typography variant="subtitle1" color="primary">
                      {intl.formatMessage(messages.sotienno || { id: 'sotienno', defaultMessage: 'sotienno' })}
                    </Typography>
                    <Typography variant="subtitle1" color="secondary">
                      {this.converttoMoney(this.totalOrder() - this.getPayment())}
                      VNĐ
                    </Typography>
                  </GridRight>
                  <GridRight>
                    <MuiExpansionPanel style={{ width: '100%', boxShadow: 'none' }}>
                      <MuiExpansionPanelSummary expandIcon={<ExpandMore />}>
                        <Typography> {intl.formatMessage(messages.tuychonthem || { id: 'tuychonthem', defaultMessage: 'tuychonthem' })}</Typography>
                      </MuiExpansionPanelSummary>
                      <MuiExpansionPanelDetails style={{ width: '100%', padding: '0px' }}>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                          <TextField
                            className={classes.expandDetail}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            type="date"
                            fullWidth
                            label={names.deliveryDate}
                            value={addSalesQuotation.deliveryDate}
                            onChange={this.handleChange('deliveryDate')}
                          />
                          <TextField
                            className={classes.expandDetail}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            type="date"
                            fullWidth
                            label={names.expiredDate}
                            value={addSalesQuotation.expiredDate}
                            onChange={this.handleChange('expiredDate')}
                          />
                          <TextField
                            className={classes.expandDetail}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            type="datetime-local"
                            fullWidth
                            label={names.billDate}
                            value={addSalesQuotation.billDate}
                            onChange={this.handleChange('billDate')}
                          />
                          <div className={classes.expandDetail}>
                            <Checkbox
                              checked={addSalesQuotation.isChangeSalesDate}
                              onChange={this.handleChecked('isChangeSalesDate')}
                              color="primary"
                            />
                            {intl.formatMessage(messages.thaydoingayban || { id: 'thaydoingayban', defaultMessage: 'thaydoingayban' })}
                          </div>
                          {addSalesQuotation.isChangeSalesDate ? (
                            <TextField
                              className={classes.expandDetail}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              type="datetime-local"
                              fullWidth
                              label={names.salesDate}
                              value={addSalesQuotation.salesDate}
                              onChange={this.handleChange('salesDate')}
                            />
                          ) : null}
                        </div>
                      </MuiExpansionPanelDetails>
                    </MuiExpansionPanel>
                  </GridRight>
                  <GridRight>
                    <div style={{ width: '100%' }}>
                      <TextField
                        helperText={addSalesQuotation.templateError ? 'Chọn biểu mẫu để xuất hóa đơn' : null}
                        error={addSalesQuotation.templateError}
                        value={addSalesQuotation.template}
                        fullWidth
                        select
                        onChange={e => this.props.mergeData({ template: e.target.value, templateError: false })}
                        label={names.template}
                      >
                        {addSalesQuotation.templates.map(item => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </GridRight>
                </React.Fragment>
              ) : null}
            </Paper>
          </Grid>
        </Grid>
        <Dialog onClose={() => this.setState({ open: false })} open={open}>
          <DialogContent>
            <DialogContentText> {intl.formatMessage(messages.nhapsoluong || { id: 'nhapsoluong', defaultMessage: 'nhapsoluong' })}</DialogContentText>
            <TextField id="standard-name" label="Số lượng" value={quantity} onChange={this.handleChange('quantity')} margin="normal" />
            <DialogActions>
              <Button variant="outlined" color="primary">
                {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
              </Button>
              <Button onClick={() => this.setState({ open: false })} variant="outlined" color="primary">
                {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Dialog onClose={() => this.props.mergeData({ dialogMerge: false })} open={dialogMerge}>
          <DialogContent>
            <DialogContentText>Tạo nhóm </DialogContentText>
            <TextField onChange={e => this.props.mergeData({ groupName: e.target.value })} value={groupName} label="Tên nhóm" margin="dense" />
            <DialogActions>
              <Button onClick={this.addGroup} variant="outlined" color="primary">
                {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>

        <Snackbar open={snackbar.status} variant={snackbar.variant} message={snackbar.message} onClose={this.closeSnackbar} />
      </div>
    );
  }

  openDialogMerge = () => {
    this.props.mergeData({ dialogMerge: true });
  };

  // Tổng đơn hàng

  changeCode = e => {
    const rex = /^[a-zA-Z0-9]+[\s\w]{4,}$/;
    const value = e.target.value;
    const errorCode = !rex.test(value);
    this.props.mergeData({ code: value, errorCode });
  };

  changePaymentType = e => {
    const paymentsLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
    const payments = paymentsLocal && paymentsLocal.find(item => item.code === 'S17') && paymentsLocal.find(item => item.code === 'S17').data || [];
    const { paymentAmount } = this.props.addSalesQuotation;
    const value = e.target.value;
    const money = payments.find(item => item.value === value);
    let currentPayment = 0;
    if (money) {
      const cr = paymentAmount.find(item => item.paymentType === value);
      currentPayment = cr ? cr.amount : 0;
    }

    this.props.mergeData({ paymentType: value, currentPayment });
  };

  getPayment = () => {
    const { paymentAmount } = this.props.addSalesQuotation;
    let total = 0;
    paymentAmount.forEach(item => {
      total += item.amount * 1;
    });
    return total;
  };

  addPayment = () => {
    const { paymentAmount, currentPayment, paymentType } = this.props.addSalesQuotation;
    if (!paymentType || currentPayment <= 0) return;
    const index = paymentAmount.findIndex(item => item.paymentType === paymentType);
    if (index === -1) {
      const newPaymentAmount = [...paymentAmount, { paymentType, amount: currentPayment }];

      this.props.mergeData({ paymentAmount: newPaymentAmount });
    } else {
      const newPaymentAmount = [...paymentAmount];
      newPaymentAmount[index] = { ...newPaymentAmount[index], amount: currentPayment };
      this.props.mergeData({ paymentAmount: newPaymentAmount });
    }
  };

  converttoMoney(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  convertTemplate({ template, data, code }) {
    const result = [];
    const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    function getName(codeName, refName) {
      const list = viewConfig.find(item => item.code === codeName);
      if (list) {
        list.editDisplay.type.fields.type.columns.forEach(item => {
          const newItem = { ...item, name: `${refName}.${item.name}` };
          result.push(newItem);
        });
      }
    }

    const codes = viewConfig.find(item => item.code === code).editDisplay.type.fields.type.columns;
    codes.forEach(item => {
      if (item.type.includes('Objectid')) {
        const ref = item.type.substring(9);
        getName(ref, item.name);
      }
    });

    result.push(codes);
    result.forEach(item => {
      const replace = `{${item.name}}`;
      const regex = new RegExp(replace, 'g');
      template = template.replace(regex, data[item.name]);
    });
    return template;
  }

  totalOrder = () => {
    const addSalesQuotation = this.props.addSalesQuotation;
    let total = 0;
    addSalesQuotation.products.forEach(item => {
      if (item.pricePolicy) {
        if (item.discount) {
          total += item.amount * item.pricePolicy.costPrice * (1 - item.discount / 100);
        } else {
          total += item.amount * item.pricePolicy.costPrice;
        }
      }
    });
    let totalAfterDiscount = 0;
    if (addSalesQuotation.unit === 2) {
      totalAfterDiscount = total - (addSalesQuotation.priceDiscount * addSalesQuotation.rate);
    }
    else if (addSalesQuotation.unit === 0) {
      totalAfterDiscount = total - (addSalesQuotation.priceDiscount * addSalesQuotation.rate);
    }
    else if (addSalesQuotation.percentageDiscount !== "" && addSalesQuotation.percentageDiscount !== null) {
      totalAfterDiscount = total - ((total / 100) * addSalesQuotation.percentageDiscount * addSalesQuotation.rate);
      // totalAfterDiscount = total - ((1 - addSalesQuotation.percentageDiscount / 100) * addSalesQuotation.rate);
      // totalAfterDiscount = total - ((total/100) * (addSalesQuotation.priceDiscount * addSalesQuotation.rate));
    }

    return totalAfterDiscount;
  };

  cancelOrder = () => {
    this.props.mergeData({
      products: [],
      paymentAmount: [],
      percentageDiscount: 0,
      priceDiscount: 0,
    });
    const callback = this.props.callback ? this.props.callback : null;

    this.props.closeSales(callback);
  };

  totalProduct = () => {
    let total = 0;
    this.props.addSalesQuotation.products.forEach(item => {
      total += item.amount * 1;
    });
    return total;
  };

  handleChange = name => event => {
    this.props.handleChange(name, event.target.value);
  };

  handleChecked = name => event => {
    this.props.handleChange(name, event.target.checked);
  };

  mergeProduct = _id => {
    const { listMerge } = this.props.addSalesQuotation;
    const check = listMerge.includes(_id);
    let newListMerge;
    if (check) {
      newListMerge = listMerge.filter(i => i !== _id);
    } else {
      newListMerge = listMerge.concat(_id);
    }
    this.props.mergeData({ listMerge: newListMerge });
  };

  addGroup = () => {
    const { products, listMerge, groupName } = this.props.addSalesQuotation;
    const newProduct = products.map(i => (listMerge.includes(i._id) ? { ...i, group: groupName } : i));
    this.props.mergeData({ listMerge: [], products: newProduct, dialogMerge: false, groupName: '' });
  };

  mapInventory = items =>
    items.map(item => ({
      name: (
        <Button
          onClick={() =>
            this.addItem({
              name: item.name,
              sourcePrice: item.pricePolicy.sourcePrice,
              costPrice: item.pricePolicy ? item.pricePolicy.costPrice : 0,
              code: item.code,
              _id: item._id,
              discount: 0,
            })
          }
        >
          {item.name}
        </Button>
      ),
      code: item.code,
      sourcePrice: item.pricePolicy.sourcePrice,
      costPrice: item.pricePolicy ? item.pricePolicy.costPrice : 0,
      logo: <Avatar src={item.logo} />,
      amount: 1,
      _id: item._id,
    }));

  addItem(item) {
    this.props.mergeData({ openDrawer: false });
    const tabData = this.props.addExpensesPage.products.concat(item);
    this.props.handleChange('products', tabData);
  }

  componentDidMount() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    this.props.getSale(id, this.props.addCustomer, this.props.customerBoDialog);
    if (!id || id && id === 'add') {
      const month = moment().format('M')
      this.props.mergeData({ typeOfSalesQuotation: 1, name: `Bán hàng tháng ${month} ` })
    }
    try {
      const listKanBan = JSON.parse(localStorage.getItem('crmStatus'));

      let listKanbanStatus = listKanBan && listKanBan.find(p => p.code === 'ST02')
      console.log(listKanbanStatus, "listKanbanStatus")
      this.setState({ listKanbanStatus: listKanbanStatus && listKanbanStatus.data || [] })
      if (!this.state.isEditPage && listKanbanStatus && listKanbanStatus.data && Array.isArray(listKanbanStatus.data) && listKanbanStatus.data.length) {
        // kanbanStatus
        console.log(listKanbanStatus.data[0]._id, 'listKanbanStatus.data[0]._id ')
        // this.setState({ kanbanStatus: listKanbanStatus.data[0]._id })
        this.handleChangeKanban(listKanbanStatus.data[0]._id)

      }
    } catch (error) {
      console.log(error, 'error')
    }
  }
  componentDidUpdate(preProps, preState) {
    if (this.state.customerName !== preState.customerName) {
      const { addSalesQuotation } = this.props
      const typeOfSalesQuotation = addSalesQuotation.typeOfSalesQuotation
      const { customerName } = this.state
      console.log(typeOfSalesQuotation, "typeOfSalesQuotation")
      const month = moment().format('M')
      switch (typeOfSalesQuotation) {
        case 1:
          this.props.mergeData({ name: `Bán hàng tháng ${month} ${customerName ? ` - ${customerName}` : ""}` })
          break;
        case 2:
          this.props.mergeData({ name: `Báo giá tháng ${month} ${customerName ? ` - ${customerName}` : ""}` })
          break;
        case 3:
          this.props.mergeData({ name: `Đặt hàng tháng ${month} ${customerName ? ` - ${customerName}` : ""}` })
          break;
        default:
          break;
      }
    }
  }
  // Thêm san pham trong kho
  addProduct = data => {
    const newProducts = this.props.addSalesQuotation.products;
    const item = data.data;
    const tt = item.sellingPoint.find(item => item.organizationUnitId === this.props.addSalesQuotation.salePoint);
    const total = tt ? tt.amount : 0;
    const products = newProducts.concat({
      _id: item._id,
      name: item.name,
      costPrice: item.pricePolicy ? item.pricePolicy.costPrice : 0,
      sourcePrice: item.pricePolicy ? item.pricePolicy.sourcePrice : 0,
      total,
      unit: item.unit.unitId,
      discount: 0,
      nameUnit: item.unit.name,
      description: item.description,
      code: item.code,
      isDisplaySourcePrice: item.isDisplaySourcePrice,
      warrantyPeriod: item.warrantyPeriod,
    });
    this.props.mergeData({ products, openDrawer: false });
  };

  // Thêm khách hàng
  addCustomer = data => {
    const item = data;
    const newCustomers = {
      ...item,
      name: item.name,
      customerId: item._id,
      customDebitAccount: item.detailInfo.options.customDebitAccount,
      debitAccount: item.detailInfo.options.debitAccount,
      customerLevel: item.detailInfo.typeCustomer.branches,
      avatar: item.avatar,
      representName: item.detailInfo.represent.name,
      representPosition: item.detailInfo.represent.position,
      representPhoneNumber: item.detailInfo.represent.phoneNumber,
      contactWays: item.detailInfo.typeCustomer.contactWays,
      group: item.detailInfo.typeCustomer.group,
      code: item.code,
    };
    this.props.mergeData({ customer: newCustomers, openDrawerCustomer: false });
  };

  // Lưu đơn hàng
  onSave = (typeOfSalesQuotation, print) => () => {
    // if (this.props.addSalesQuotation.errorCode || this.props.addSalesQuotation.name === '') return;s
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const date = new Date();
    const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const addSalesQuotation = this.props.addSalesQuotation;
    if (!(addSalesQuotation && addSalesQuotation.products && addSalesQuotation.products.length)) {
      // console.log('Danh sách sản phẩm trống');
      this.props.onChangeSnackbar({ status: true, message: 'Vui lòng chọn Sản phẩm!', variant: 'error' });
      return;
    }
    if (!addSalesQuotation.template) {
      this.props.mergeData({ templateError: true });
      // console.log('Chưa chọn biểu mẫu hóa đơn');
      this.props.onChangeSnackbar({ status: true, message: 'Vui lòng chọn biểu mẫu để xuất hóa đơn!', variant: 'error' });
      return;
    }
    if (!(addSalesQuotation && addSalesQuotation.customer && addSalesQuotation.customer.name)) {
      this.setState({ customerNameError: true });
      this.props.onChangeSnackbar({ status: true, message: 'Vui lòng chọn tên khách hàng!', variant: 'error' });
      return;
    }
    let data = {
      callback: this.props.callback ? this.props.callback : null,
      convertTemplate: this.convertTemplate,
    };
    // data.costEstimate = this.state.codeDTCP;
    if (this.state.codeDTCP)
      data.costEstimate = this.state.codeDTCP;
    data.code = addSalesQuotation.code;
    data.name = addSalesQuotation.name;
    data.currentCrmStatus = 1;
    data.products = addSalesQuotation.products;
    data.salePoint = addSalesQuotation.salePoint;
    data.description = addSalesQuotation.description;
    data.rate = addSalesQuotation.rate;
    // LOẠI BÁN HÀNG
    // 1: Bán hàng, 2 :Báo giá, 3 :Đặt hàng
    // this.props.businessOpportunities truyen prop tu Bodialog
    data.template = addSalesQuotation.template;
    data.businessOpportunities = this.props.isTrading === false ? this.props.businessOpportunities : addSalesQuotation.businessOpportunities;
    data.exchangingAgreement = this.props.isTrading === true ? this.props.exchangingAgreementId : addSalesQuotation.exchangingAgreement;
    data.typeOfSalesQuotation = typeOfSalesQuotation;
    data.totalAmount = this.totalOrder();
    data.service = addSalesQuotation.service;
    data.customer = addSalesQuotation.customer;
    data.salesman = addSalesQuotation.salesman;
    data.others = addSalesQuotation.others;
    data.percentageDiscount = addSalesQuotation.percentageDiscount;
    data.priceDiscount = addSalesQuotation.priceDiscount;
    data.paymentType = addSalesQuotation.paymentType;
    data.paymentAmount = addSalesQuotation.paymentAmount;
    // data.costEstimate = addSalesQuotation.costEstimate;
    data.commissionGroup = addSalesQuotation.commissionGroup;
    data.expiredDate = addSalesQuotation.expiredDate ? addSalesQuotation.expiredDate : d.toISOString().substring(0, 10);
    data.deliveryDate = addSalesQuotation.deliveryDate ? addSalesQuotation.deliveryDate : d.toISOString().substring(0, 10);
    data.billDate = addSalesQuotation.billDate ? addSalesQuotation.billDate : d.toISOString().substring(0, 19);
    data.kanbanStatus = addSalesQuotation.kanbanStatus;
    if (addSalesQuotation.isChangeSalesDate) {
      data.salesDate = addSalesQuotation.salesDate ? addSalesQuotation.salesDate : d.toISOString().substring(0, 19);
    } else data.salesDate = d.toISOString().substring(0, 19);

    if (this.props.data) data = { ...data, ...this.props.data };
    console.log('data', data);
    if (Object.keys(this.state.localMessages).length === 0) {
      console.log('true');
      if (id === 'add') this.props.postSale(data, print);
      else this.props.putSale(id, data, print);
    } else {
      console.log('fail');
      const allMessages = Object.values(this.state.localMessages).join(', ');
      this.props.onChangeSnackbar({ status: true, message: allMessages, variant: 'error' });
    }
  };

  handlePercentageDiscount = e => {
    const value = e.target.value;
    const snackbar = { ...this.props.addSalesQuotation.snackbar };
    if (value < 0 || value > 100) {
      snackbar.status = true;
      snackbar.message = 'Giảm giá phần trăm trong khoảng 0 - 100%';
      snackbar.variant = 'error';
      this.props.handleChange('snackbar', snackbar);
      return;
    }
    this.props.mergeData({ percentageDiscount: e.target.value });
  };

  removeFromGroup = _id => {
    const products = this.props.addSalesQuotation.products.map(i => (i._id === _id ? { ...i, group: undefined } : i));
    this.props.mergeData({ products });
  };

  handlePriceDiscount = e => {
    const addSalesQuotation = this.props.addSalesQuotation;
    const snackbar = { ...this.props.addSalesQuotation.snackbar };
    let total = 0;
    addSalesQuotation.products.forEach(item => {
      total += item.amount * item.costPrice * (1 - item.discount / 100);
    });
    if (e.target.value < 0 || e.target.value > total) {
      snackbar.status = true;
      snackbar.message = 'Giảm giá lớn hơn 0 và nhỏ hơn tổng đơn hàng';
      snackbar.variant = 'error';
      this.props.handleChange('snackbar', snackbar);
      return;
    }
    this.props.mergeData({ priceDiscount: e.target.value });
  };
  handleRate = e => {
    const snackbar = { ...this.props.addSalesQuotation.snackbar };
    if (e.target.value < 0) {
      snackbar.status = true;
      snackbar.message = 'Tỉ lệ phải lớn hơn 0';
      snackbar.variant = 'error';
      this.props.handleChange('snackbar', snackbar);
      return;
    }
    this.props.mergeData({ rate: e.target.value });
  };
}

const GridRight = ({ children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0px', alignItems: 'flex-end' }}>{children}</div>
);

const HeadCell = props => <TableCell style={{ fontWeight: 'bold', color: 'black' }}>{props.children}</TableCell>;

AddSalesQuotation.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addSalesQuotation: makeSelectAddSalesQuotation(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleChange: (name, value) => dispatch(setState(name, value)),
    getSale: (id, addCustomer, customerBoDialog) => dispatch(getSale(id, addCustomer, customerBoDialog)),
    mergeData: data => dispatch(mergeData(data)),
    postSale: (data, print) => dispatch(postSale(data, print)),
    putSale: (id, data, print) => dispatch(putSale(id, data, print)),
    closeSales: callback => dispatch(closeSales(callback)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
// eslint-disable-next-line react/default-props-match-prop-types
AddSalesQuotation.defaultProps = { addCustomer: false };

const withReducer = injectReducer({ key: 'addSalesQuotation', reducer });
const withSaga = injectSaga({ key: 'addSalesQuotation', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddSalesQuotation);
