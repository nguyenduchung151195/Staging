/**
 *
 * AddExpensesPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
// eslint-disable-next-line no-unused-vars
// import Buttons from 'components/CustomButtons/Button';
import {
  Tabs,
  Tab,
  Grid,
  Paper,
  withStyles,
  Typography,
  Button,
  Avatar,
  TableRow,
  TableCell,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Fab,
  Tooltip,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import messages from './messages';
import { Add, ShoppingCart, List as ListIcon, Cancel, Close } from '@material-ui/icons';
import { GroupingState, IntegratedGrouping } from '@devexpress/dx-react-grid';
import { injectIntl } from 'react-intl';
import { Grid as GridDev, Table, TableHeaderRow, TableGroupRow } from '@devexpress/dx-react-grid-material-ui';
import SwipeableViews from 'react-swipeable-views';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import AddNewProductPage from '../AddNewProductPage';
import injectSaga from 'utils/injectSaga';
import TextFieldCode from 'components/TextFieldCode';
import injectReducer from 'utils/injectReducer';
import { customerColumns } from '../../variable';
import CustomAppBar from 'components/CustomAppBar';

import makeSelectAddExpensesPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  handleChangeIndex,
  getExpense,
  putExpense,
  getDefault,
  changeExpense,
  handleChangeNameExpense,
  postExpense,
  saveRow,
  handleChange,
  toggleDrawer,
  handleDiscount,
  mergeData,
} from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import './style.scss';
import ListPage from '../../components/List/ListPage';
import ListLifetek from '../../components/List';
import List from '../../components/List/Edit';
import { Autocomplete, TextField, SwipeableDrawer, KanbanStep, FileUpload } from '../../components/LifetekUi';
import AddCustomerPage from '../AddCustomerPage';
import { API_CUSTOMERS } from '../../config/urlConfig';
import { convert2Money } from '../../helper';

import { viewConfigCheckForm } from 'utils/common';
import CustomInputBase from '../../components/Input/CustomInputBase';
function styleColumn(columns) {
  return columns.filter(o => o.type === 'number').map(i => ({ columnName: i.name, align: 'right' }));
}

const styles = () => ({
  root: {
    textTransform: 'none',
  },
});

const ListTab = ({ addRow, onChange, rows, columns, deleteRow, toolbar, extendRow, ...rest }) => (
  <div dir="ltr">
    <Grid dir="ltr" style={{ margin: '30px 0px' }} item md={12}>
      <List
        addRow={addRow}
        onChange={onChange}
        rows={rows}
        columns={columns}
        deleteRow={deleteRow}
        toolbar={toolbar}
        extendRow={extendRow}
        {...rest}
      />
    </Grid>
  </div>
);

/* eslint-disable react/prefer-stateless-function */
const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#635ee7',
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);
const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: 'black',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing.unit * 1,
    '&:focus': {
      opacity: 1,
    },
  },
}))(props => <Tab disableRipple {...props} />);

export class AddExpensesPage extends React.Component {
  state = {
    expensesColumns: JSON.parse(localStorage.getItem('viewConfig'))
      .find(item => item.code === 'CostEstimate')
      .listDisplay.type.fields.type.columns.map(item => ({ ...item, name: item.name.replace(/\./g, '_') })),
    othersName: JSON.parse(localStorage.getItem('viewConfig'))
      .find(item => item.code === 'CostEstimate')
      .listDisplay.type.fields.type.others.map(item => ({ ...item, name: item.name.substring(7) })),
    crmSource: JSON.parse(localStorage.getItem('crmSource')),
    localMessages: {},
  };

  componentWillReceiveProps(props) {
    if (props.addExpensesPage) {
      const localMessages = viewConfigCheckForm('CostEstimate', props.addExpensesPage);
      this.setState({
        localMessages,
      });
    }
  }

  addToolbar = () => (
    <React.Fragment>
      <Grid item md={3}>
        <StyledTabs
          value={this.props.addExpensesPage.productTab}
          onChange={(_e, productTab) => this.props.mergeData({ productTab })}
          indicatorColor="primary"
        >
          <StyledTab label="Dự tính" />
          <StyledTab label="Thực tế" />
        </StyledTabs>
      </Grid>
      <Grid style={{ display: 'flex', justifyContent: 'flex-end' }} item md={5}>
        <FormControlLabel
          control={<Checkbox checked={this.props.addExpensesPage.checkedSale} onChange={this.handleDiscount(2)} value="checkedB" color="primary" />}
          label="Hiển thị chính sách "
        />
        <FormControlLabel
          control={<Checkbox checked={this.props.addExpensesPage.checked} onChange={this.handleDiscount(1)} value="checkedB" color="primary" />}
          label="Hiển thị chiết khấu "
        />
      </Grid>
      <Grid style={{ display: 'flex', justifyContent: 'flex-end' }} item md={4}>
        <Tooltip title="Thêm mới">
          <Fab style={{ marginRight: 5 }} size="small" color="primary" onClick={() => this.props.toggleDrawer({ openDrawer: true, type: 2 })}>
            <Add />
          </Fab>
        </Tooltip>
        <Tooltip title="Mua sắm">
          <Fab size="small" color="primary" onClick={() => this.props.toggleDrawer({ openDrawer: true, type: 1 })}>
            <ShoppingCart />
          </Fab>
        </Tooltip>
      </Grid>
    </React.Fragment>
  );

  handleChangeCode = e => {
    const rex = /^[a-zA-Z0-9]+[\s\w]{4,}$/;
    const value = e.target.value;
    const errorCode = !rex.test(value);
    this.props.mergeData({ code: value, errorCode });
  };

  setOthers = (name, value) => {
    const { others } = this.props.addExpensesPage;
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
                value={this.props.addExpensesPage.others[item.name]}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            );
          default:
            return (
              <TextField
                value={this.props.addExpensesPage.others[item.name]}
                onChange={e => this.setOthers(item.name, e.target.value)}
                label={item.title}
                fullWidth
                select
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {this.state.crmSource.find(el => el._id === item.type)
                  ? this.state.crmSource.find(el => el._id === item.type).data.map(ele => <MenuItem value={ele.value}>{ele.title}</MenuItem>)
                  : null}
              </TextField>
            );
        }
      })}
    </React.Fragment>
  );

  setCustomer = () => {
    this.props.mergeData({ errorCustomer: false });
  };

  handleChangeKanban = item => {
    this.props.mergeData({ kanbanStatus: item._id });
  };

  handleBussi = value => {
    const customerId = value.customer.customerId ? value.customer.customerId : null;
    if (customerId)
      this.props.mergeData({
        businessOpportunities: value,
        customer: { _id: value.customer.customerId, name: value.customer.name, errorCustomer: false },
      });
    else {
      this.props.mergeData({ businessOpportunities: value, customer: null });
      this.props.changeSnackbar({ status: true, variant: 'warning', message: 'Cơ hôi kinh doanh không có khách hàng' });
    }
  };

  isEmptyObject = obj => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  checkRequest = value => {
    const { expensesColumns } = this.state;
    const column = expensesColumns.filter(data => data.name === value);
    if (!this.isEmptyObject(column)) {
      return column[0].checkedRequireForm;
    }
  };

  checkShowForm = value => {
    const { expensesColumns } = this.state;
    const column = expensesColumns.filter(data => data.name === value);
    if (!this.isEmptyObject(column)) {
      return column[0].checkedShowForm;
    }
  };

  handleGoBack = () => {
    if (this.props.history) {
      this.props.history.goBack();
    } else if (this.props.callback) {
      this.props.callback();
    }
  };
  closeCustomer = () => {
    this.props.toggleDrawer({ openDrawer: false });
  };
  render() {
    const names = {};
    const { classes, addExpensesPage, intl, miniActive } = this.props;
    const { expensesColumns, localMessages } = this.state;
    expensesColumns.forEach(item => {
      names[item.name] = item.title;
    });
    const data = addExpensesPage;
    const {
      totalColumns,
      otherCostsColumns,
      commissionColumns,
      transportColumns,
      laborColumns,
      productColumns,
      relityProductColumns,
      inventoryColumns,
      productTab,
      kanbanStatus,
    } = data;
    const { tab, openDrawer, type } = data;

    const productRows = data.products.map(item => ({
      ...item,
      totalSourcePrice: item.amount ? item.amount * item.sourcePrice : 0,
      totalCostPrice: item.amount ? item.amount * item.costPrice : 0,
      totalMarketPrice: item.amount ? item.amount * item.marketPrice : 0,
      discountAmount: (item.discount ? (item.discount / 100) * item.amount * item.costPrice : 0) * 1,
    }));
    const relityProductRows = data.relityProducts.map(item => ({
      ...item,
      totalSourcePrice: item.amount ? item.amount * item.sourcePrice : 0,
      totalCostPrice: item.amount ? item.amount * item.costPrice : 0,
      discountAmount: (item.discount ? (item.discount / 100) * item.amount * item.costPrice : 0) * 1,
    }));
    const extendRowProduct = this.totalProduct(productRows);
    const extendRelityProduct = this.totalProduct(relityProductRows);
    const laborRows = data.labors;
    const extendRowLabor = this.totalLabor(laborRows);
    const transportRows = data.transports;
    const extendRowTransport = this.totalTransport(transportRows);
    const commissionsRows = this.mapComiss(data.commissions);
    // const extendRowCommission = this.totalCommission(commissionsRows);
    const otherCostsRows = data.otherCosts.map(item => ({ ...item, total: item.amount * item.cost }));
    const extendRowOtherCost = this.totalOtherCost(otherCostsRows);
    const totalRows = this.getTotalRows();
    const inventoryRows = this.mapInventory(data.inventory);
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const profileName = this.props.addExpensesPage.profile ? this.props.addExpensesPage.profile.names : '';

    const idCustomer = this.props.customerBoDialog ? this.props.customerBoDialog.customerId : null;
    return (
      <Grid container md={12} style={{ width: 'calc(100vw - 260px)' }}>
        <CustomAppBar
          title={
            id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới dự toán chi phí' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật dự toán chi phí' })}`
          }
          onGoBack={this.props.onClose ? this.props.onClose : this.handleGoBack}
          onSubmit={this.saveProduct}
        />
        {/* <AppBar className={id === 'add' ? ( this.props.exchangingAgreementId ? 'HearderappBarAddExpense' : 'HearderappBarAddExpense2') : 'HearderappBarAddExpenseSP'}>
        <Toolbar>
          <IconButton
            className={id === 'add' ? 'BTNEXPENSE'  : 'BTNAddExpenseSP'}
            // className='BTNEXPENSE'
            color="inherit"
            variant="contained"
            onClick={this.handleGoBack}
            aria-label="Close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            {id === 'add'
              ? `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Thêm mới dự toán chi phí' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'Cập nhật dự toán chi phí' })}`}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={this.saveProduct}
          >
            {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'Lưu' })}
          </Button>
        </Toolbar>
        </AppBar> */}
        {/* <Paper style={{ padding: '10px', width: '100%', marginBottom: '10', display: "none" }}>
          {this.props.id ? null : (
            <Breadcrumbs aria-label="Breadcrumb">
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/crm/BusinessOpportunities">
                CRM
              </Link>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/crm/CostEstimate">
                Danh sách dự toán chi phí
              </Link>
              <Typography color="textPrimary">Thêm mới dự toán chi phí</Typography>
            </Breadcrumbs>
          )}
        </Paper> */}
        <Grid item md={12} style={{ marginTop: 55 }}>
          <KanbanStep handleStepper={this.handleChangeKanban} kanbanStatus={kanbanStatus} code="ST07" />
        </Grid>
        <Grid style={{ padding: 15, marginTop: 8 }} item md={6}>
          {this.checkShowForm('name') && (
            <CustomInputBase
              error={this.checkRequest('name') ? addExpensesPage.name === '' : false}
              helperText={addExpensesPage.name === '' && this.checkRequest('name') ? localMessages.name : null}
              required={this.checkRequest('name')}
              onChange={e => this.props.mergeData({ name: e.target.value })}
              label={names.name}
              margin="dense"
              code={4}
              value={addExpensesPage.name}
              fullWidth
              variant="outlined"
            />
          )}

          {this.checkShowForm('code') && (
            <TextFieldCode
              value={data.code}
              fullWidth
              variant="outlined"
              margin="dense"
              label={names.code}
              error={data.errorCode}
              // required
              code={3}
              onChange={this.handleChangeCode}
            />
          )}

          {this.props.isTrading !== true && this.checkShowForm('businessOpportunities') ? (
            <Autocomplete
              value={
                this.props.businessOpportunitiesId
                  ? data.businessOpportunitiess.find(item => item._id === this.props.businessOpportunitiesId)
                  : data.businessOpportunities
              }
              onChange={value => this.handleBussi(value)}
              suggestions={data.businessOpportunitiess}
              error={this.checkRequest('businessOpportunities') && data.businessOpportunities === null}
              fullWidth
              margin="normal"
              label={names.businessOpportunities}
              required={this.checkRequest('businessOpportunities')}
            />
          ) : null}
          {this.handleOthers()}
        </Grid>
        {this.checkShowForm('customer') && (
          <Grid style={{ padding: 15 }} item md={4}>
            {this.props.customerBoDialog && idCustomer === null ? (
              <Autocomplete
                value={data.customer}
                onChange={value => this.props.mergeData({ customer: value, errorCustomer: !Boolean(value) })}
                fullWidth
                suggestions={data.customers}
                margin="normal"
                label={names.customer}
                required={this.checkRequest('customer')}
                error={data.errorCustomer && this.checkRequest('customer')}
                helperText={data.errorCustomer && this.checkRequest('customer') ? 'Khách hàng không được để trống' : ''}
              />
            ) : this.props.customerBoDialog && idCustomer !== null ? (
              <Autocomplete value={data.customer} fullWidth suggestions={data.customers} margin="normal" label={names.customer} required />
            ) : data.customer ? (
              <Autocomplete value={data.customer} fullWidth suggestions={data.customers} margin="normal" label={names.customer} required />
            ) : (
              <Autocomplete
                value={data.customer}
                onChange={value => this.props.mergeData({ customer: value, errorCustomer: !Boolean(value) })}
                fullWidth
                suggestions={data.customers}
                margin="normal"
                label={names.customer}
                required={this.checkRequest('customer')}
                error={data.errorCustomer && this.checkRequest('customer')}
                helperText={data.errorCustomer && this.checkRequest('customer') ? 'Khách hàng không được để trống' : ''}
              />
            )}

            <Autocomplete
              style={{ marginTop: 26 }}
              value={data.sources}
              onChange={value => this.props.mergeData({ sources: value })}
              fullWidth
              isMulti
              optionValue="value"
              optionLabel="title"
              suggestions={this.state.crmSource.find(item => item.code === 'S18') ? this.state.crmSource.find(item => item.code === 'S18').data : []}
              margin="normal"
              label="NGUỒN VỐN"
            />
            <FileUpload name={this.props.addExpensesPage.name} id={id} code="CostEstimate" />
            <Typography variant="h6" color="primary">
              {names.createdBy}: {id === 'add' ? profileName : data.createdBy ? data.createdBy.name : ''}
            </Typography>
            {/* <Grid item md={12} style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', marginTop: 20 }}>
            <Button onClick={this.saveProduct} variant="contained" color="primary">
              Lưu lại
            </Button>
          </Grid> */}
          </Grid>
        )}
        <Grid item md={12}>
          <Tabs indicatorColor="primary" onChange={(e, value) => this.props.handleChangeIndex(value)} value={tab}>
            <Tab classes={{ root: classes.root }} disableRipple label="Sản phẩm /Dịch vụ" />
            <Tab classes={{ root: classes.root }} disableRipple label="Nhân công" />
            <Tab classes={{ root: classes.root }} disableRipple label="Vận chuyển/Triển khai" />
            <Tab classes={{ root: classes.root }} disableRipple label="Hoa hồng" />
            <Tab classes={{ root: classes.root }} disableRipple label="Khác" />
            <Tab classes={{ root: classes.root }} disableRipple label="Tổng hợp" />
          </Tabs>
          <SwipeableViews anchor="right" axis="x" index={tab} onChangeIndex={this.props.handleChangeIndex} width={window.innerWidth - 260}>
            <Grid container>
              {this.addToolbar()}
              {productTab ? (
                <ListTab
                  // addRow={this.addRow('products')}
                  onChange={this.changeTab('relityProducts')}
                  rows={relityProductRows}
                  columns={relityProductColumns}
                  deleteRow={this.deleteRowProduct}
                  extendRow={extendRelityProduct}
                  disableAdd
                />
              ) : (
                <ListTab
                  // addRow={this.addRow('products')}
                  onChange={this.changeTab('products')}
                  rows={productRows}
                  columns={productColumns}
                  deleteRow={this.deleteRowProduct}
                  extendRow={extendRowProduct}
                  disableAdd
                />
              )}
            </Grid>
            <ListTab
              addRow={this.addRow('labors')}
              onChange={this.changeTab('labors')}
              rows={laborRows}
              columns={laborColumns}
              deleteRow={this.deleteRow('labors')}
              extendRow={extendRowLabor}
            />
            <ListTab
              addRow={this.addRow('transports')}
              onChange={this.changeTab('transports')}
              rows={transportRows}
              columns={transportColumns}
              deleteRow={this.deleteRow('transports')}
              extendRow={extendRowTransport}
            />

            <Grid container>
              <Grid item md={6}>
                {/* <StyledTabs
                  value={this.props.addExpensesPage.productTab}
                  onChange={(_e, productTab) => this.props.mergeData({ productTab })}
                  indicatorColor="primary"
                >
                  <StyledTab label="Dự tính" />
                  <StyledTab label="Thực tế" />
                </StyledTabs> */}
              </Grid>
              <Grid style={{ display: 'flex', justifyContent: 'flex-end' }} item md={6}>
                <Fab onClick={() => this.props.mergeData({ openDrawer: true, type: 3 })} style={{ marginRight: 5 }} color="primary" size="small">
                  <Add />
                </Fab>
                <Fab onClick={() => this.props.mergeData({ openDrawer: true, type: 4 })} color="primary" size="small">
                  <ListIcon />
                </Fab>
              </Grid>
              <Grid item md={12}>
                <GridDev rows={this.calculeCo(commissionsRows)} columns={commissionColumns}>
                  <GroupingState grouping={[{ columnName: 'name' }]} />
                  <IntegratedGrouping />
                  <Table columnExtensions={styleColumn(commissionColumns)} />
                  <TableHeaderRow />
                  <TableGroupRow />
                </GridDev>
              </Grid>
            </Grid>
            <ListTab
              addRow={this.addRow('otherCosts')}
              onChange={this.changeTab('otherCosts')}
              rows={otherCostsRows}
              columns={otherCostsColumns}
              deleteRow={this.deleteRow('otherCosts')}
              extendRow={extendRowOtherCost}
            />
            <ListPage disableCheckbox rows={totalRows} columns={totalColumns} />
          </SwipeableViews>
        </Grid>
        <SwipeableDrawer
          onClose={() => this.props.toggleDrawer({ openDrawer: false })}
          open={openDrawer}
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
        >
          {type === 1 ? <ListPage disableCheckbox rows={inventoryRows} columns={inventoryColumns} /> : null}
          {type === 2 ? (
            <AddNewProductPage expense={() => this.props.toggleDrawer({ openDrawer: false })} miniActive={miniActive} propsAll={this.props} />
          ) : null}
          {type === 3 ? (
            <div style={{ width: miniActive ? window.innerWidth - 80 : window.innerWidth - 260 }}>
              <AppBar style={{ zIndex: 0 }}>
                <Toolbar>
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      this.props.toggleDrawer({ openDrawer: false });
                    }}
                    aria-label="Close"
                  >
                    <Close />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <AddCustomerPage closeCustomer={this.closeCustomer} callback={this.addCommision} id="add" miniActive={miniActive} />
            </div>
          ) : null}
          {type === 4 ? (
            <ListLifetek disableEdit disableSelect columns={customerColumns} mapFunction={this.mapFunction} apiUrl={API_CUSTOMERS} />
          ) : null}
        </SwipeableDrawer>
      </Grid>
    );
  }

  calculeCo = items =>
    items.map((item, index) => ({
      ...item,
      discount: <TextField variant="standard" value={item.discount} type="number" onChange={this.changeDiscountCommission(index)} />,
      discountPrice: convert2Money(item.discountPrice),
      cost: convert2Money(item.cost),
    }));

  changeDiscountCommission = index => e => {
    if (e.target.value > 100) {
      this.props.changeSnackbar({ status: true, variant: 'warning', message: 'Chiết khấu không được quá 100%' });
      return;
    }
    const { commissions } = this.props.addExpensesPage;
    const newComiss = [...commissions];
    const total = newComiss[index].discountPrice + newComiss[index].cost;
    newComiss[index] = {
      ...newComiss[index],
      discount: e.target.value,
      discountPrice: (e.target.value * total) / 100,
      cost: (1 - e.target.value / 100) * total,
    };
    this.props.mergeData({ commissions: newComiss });
  };

  mapFunction = item => ({ ...item, name: <Button onClick={() => this.addCommision(item)}>{item.name}</Button> });

  // Thêm hoa hồng
  addCommision = customer => {
    if (this.props.addExpensesPage.commissions.map(i => i.customerId).includes(customer._id)) {
      this.props.mergeData({ openDrawer: false });
      return;
    }

    const { commissions, products } = this.props.addExpensesPage;

    const withOutCustomers = commissions.filter(i => i.customerId !== customer._id);
    const comiss = [];
    products.forEach(product => {
      const tabComiss = this.caculateCommistion(customer, product);
      comiss.push(tabComiss);
    });
    const newComiss = withOutCustomers.concat(comiss);
    // console.log(newComiss);

    this.props.mergeData({ commissions: newComiss, openDrawer: false });
  };

  getTotalRows = () => {
    // totalColumns: [
    //   { name: 'list', title: 'Danh mục', checked: true, type: 'text' },
    //   { name: 'sourcePrice', title: 'Giá vốn', checked: true, type: 'text' },
    //   { name: 'costPrice', title: 'Giá bán', checked: true, type: 'text' },
    //   { name: 'marketPrice', title: 'Giá thị trường', checked: true, type: 'text' },
    //   { name: 'profit', title: 'Lợi nhuận', checked: true, type: 'text' },
    // ]

    const { products, transports, labors, otherCosts, commissions } = this.props.addExpensesPage;
    // console.log('TRTTYTYY', totalCost);
    const totalTabRow = [];
    let totalSourcePrice = 0;
    let totalCostPrice = 0;
    let totalMarketPrice = 0;

    products.forEach(item => {
      totalSourcePrice += item.sourcePrice * item.amount;
      totalCostPrice += item.costPrice * (1 - item.discount / 100) * item.amount;
      totalMarketPrice += item.marketPrice * item.amount;
    });
    const profit = totalCostPrice - totalSourcePrice;
    let percentageProfit = 0;
    if (totalCostPrice) {
      percentageProfit = (profit * 100) / totalCostPrice;
    }
    totalTabRow.push({
      list: 'Sản phẩm',
      sourcePrice: totalSourcePrice,
      costPrice: totalCostPrice,
      marketPrice: totalMarketPrice,
      profit: (
        <Tooltip title={`${percentageProfit}%`}>
          <p>{profit}</p>
        </Tooltip>
      ),
    });

    let totalLaborSourcePrice = 0;
    let totalLaborCostPrice = 0;

    labors.forEach(item => {
      totalLaborSourcePrice += item.sourcePrice;
      totalLaborCostPrice += item.costPrice;
    });

    const laborProfit = totalLaborCostPrice - totalLaborSourcePrice;
    // let laborPercentageProfit = 0;
    // if (totalCostPrice) {
    //   percentageProfit = (profit * 100) / totalCostPrice;
    // }
    totalTabRow.push({
      list: 'Nhân công',
      sourcePrice: totalLaborSourcePrice,
      costPrice: totalLaborCostPrice,
      marketPrice: 0,
      profit: laborProfit,
    });

    let totalTransportCostPrice = 0;
    // let totalTransportCostPrice = 0

    transports.forEach(item => {
      totalTransportCostPrice += item.cost;
      // totalTransportCostPrice += item.costPrice
    });

    const transportProfit = 0 - totalTransportCostPrice;
    // let laborPercentageProfit = 0;
    // if (totalCostPrice) {
    //   percentageProfit = (profit * 100) / totalCostPrice;
    // }
    totalTabRow.push({
      list: 'Vận chuyển/ triển khai',
      sourcePrice: totalTransportCostPrice,
      costPrice: 0,
      marketPrice: 0,
      profit: transportProfit,
    });

    let commissionProfit = 0;
    commissions.forEach(item => {
      commissionProfit -= item.discountPrice;
    });
    totalTabRow.push({
      list: 'Hoa hồng',
      sourcePrice: 0,
      costPrice: 0,
      marketPrice: 0,
      profit: commissionProfit,
    });

    // let totalOtherSourcePrice = 0;
    let totalOtherCostPrice = 0;

    otherCosts.forEach(item => {
      totalOtherCostPrice += item.cost * item.amount;
    });

    const otherProfit = 0 - totalOtherCostPrice;
    // let laborPercentageProfit = 0;
    // if (totalCostPrice) {
    //   percentageProfit = (profit * 100) / totalCostPrice;
    // }

    totalTabRow.push({
      list: 'Khác',
      sourcePrice: 0,
      costPrice: 0,
      marketPrice: 0,
      profit: otherProfit,
    });

    const total = profit + laborProfit + transportProfit + otherProfit + commissionProfit;
    const totalEx = totalCostPrice + totalLaborCostPrice;
    const percentTotal = totalEx ? `${((total * 100) / totalEx).toFixed(2)} %` : `0 %`;
    const newArr = [
      { list: 'Tổng', sourcePrice: 0, costPrice: 0, marketPrice: 0, profit: total },
      { list: 'Tổng lợi nhuận (%)', sourcePrice: '', costPrice: '', marketPrice: '', profit: percentTotal },
    ];
    return totalTabRow.concat(newArr);
  };

  // ------------------------------------ Sản phẩm / dịch vụ -------------------------------------------

  totalProduct(products) {
    let totalSource = 0;
    let totalCost = 0;
    let discountAmount = 0;
    products.forEach(item => {
      totalSource += item.totalSourcePrice;
      totalCost += item.totalCostPrice;
      // totalMarket += item.totalMarketPrice;
      discountAmount += ((1 * item.totalCostPrice) / 100) * (item.discount ? item.discount : 0);
    });

    if (this.props.addExpensesPage.checked)
      return (
        <React.Fragment>
          <TableRow>
            <TableCell colspan={9}>
              <Typography variant="subtitle1" gutterBottom>
                Tông số không có chiết khấu và thuế
              </Typography>
            </TableCell>
            <TableCell colspan={3}>
              <Typography style={{ textAlign: 'right' }} variant="subtitle1" gutterBottom>
                {this.converttoMoney(totalCost)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan={9}>
              <Typography variant="subtitle1" gutterBottom>
                Số tiền chiết khấu
              </Typography>
            </TableCell>
            <TableCell colspan={3}>
              <Typography style={{ textAlign: 'right' }} variant="subtitle1" gutterBottom>
                {this.converttoMoney(discountAmount)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colspan={9}>
              <Typography variant="subtitle1" gutterBottom>
                Tổng số tiền
              </Typography>
            </TableCell>
            <TableCell colspan={3}>
              <Typography style={{ textAlign: 'right' }} variant="subtitle1" gutterBottom>
                {this.converttoMoney(totalCost - discountAmount)}
              </Typography>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    return (
      <React.Fragment>
        <TableRow>
          <TableCell colspan={7}>
            <Typography variant="subtitle1" gutterBottom>
              Tổng giá vốn
            </Typography>
          </TableCell>
          <TableCell colSpan={3} style={{ textAlign: 'left' }}>
            <Typography style={{ textAlign: 'right' }} variant="subtitle1" gutterBottom>
              {this.converttoMoney(totalSource)}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colspan={7}>
            <Typography variant="subtitle1" gutterBottom>
              Tổng giá bán
            </Typography>
          </TableCell>
          <TableCell colspan={3} style={{ textAlign: 'left' }}>
            <Typography style={{ textAlign: 'right' }} variant="subtitle1" gutterBottom>
              {this.converttoMoney(totalCost)}
            </Typography>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  // ----------------------------------- Nhân công --------------------------------------

  totalLabor = labors => {
    let totalSource = 0;
    let totalCost = 0;
    labors.forEach(item => {
      totalSource += item.sourcePrice * 1;
      totalCost += item.costPrice * 1;
    });

    return (
      <React.Fragment>
        <TableRow>
          <TableCell colspan={3}>
            <Typography variant="subtitle1" gutterBottom>
              Tổng giá vốn
            </Typography>
          </TableCell>
          <TableCell colSpan={3} style={{ textAlign: 'left' }}>
            <Typography style={{ textAlign: 'right' }} variant="subtitle1" gutterBottom>
              {this.converttoMoney(totalSource)}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colspan={3}>
            <Typography variant="subtitle1" gutterBottom>
              Tổng giá bán
            </Typography>
          </TableCell>
          <TableCell colspan={3} style={{ textAlign: 'left' }}>
            <Typography style={{ textAlign: 'right' }} variant="subtitle1" gutterBottom>
              {this.converttoMoney(totalCost)}
            </Typography>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  // ------------------------ Vận chuyển/Triển khai ----------------------------

  totalTransport = transports => {
    let totalCost = 0;
    transports.forEach(item => {
      totalCost += item.cost * 1;
    });

    return (
      <React.Fragment>
        <TableRow>
          <TableCell colspan={4}>
            <Typography variant="subtitle1" gutterBottom>
              Tổng giá
            </Typography>
          </TableCell>
          <TableCell colSpan={3} style={{ textAlign: 'left' }}>
            <Typography style={{ textAlign: 'right' }} variant="subtitle1" gutterBottom>
              {this.converttoMoney(totalCost)}
            </Typography>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  // -------------------- Khác --------------------------

  totalOtherCost = otherCosts => {
    let totalCost = 0;
    otherCosts.forEach(item => {
      totalCost += item.total * 1;
    });

    return (
      <React.Fragment>
        <TableRow>
          <TableCell colspan={3}>
            <Typography variant="subtitle1" gutterBottom>
              Tổng giá
            </Typography>
          </TableCell>
          <TableCell colSpan={3} style={{ textAlign: 'left' }}>
            <Typography style={{ textAlign: 'right' }} variant="subtitle1" gutterBottom>
              {this.converttoMoney(totalCost)}
            </Typography>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  totalCommission = commissions => {
    let totalCost = 0;
    commissions.forEach(item => {
      totalCost += item.cost * 1;
    });

    return (
      <React.Fragment>
        <TableRow>
          <TableCell colspan={4}>
            <Typography variant="subtitle1" gutterBottom>
              Tổng giá
            </Typography>
          </TableCell>
          <TableCell colSpan={3} style={{ textAlign: 'left' }}>
            <Typography style={{ textAlign: 'right' }} variant="subtitle1" gutterBottom>
              {this.converttoMoney(totalCost)}
            </Typography>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  converttoMoney(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  onExecute = () => {
    this.state.onExecute();
    this.handleClose();
  };

  saveProduct = () => {
    const addExpensesPage = this.props.addExpensesPage;
    // if (addExpensesPage.name === '') return;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    let totalDiscount = 0;
    let totalSuggestionDiscount = 0;
    const commissionsTemplate = [];
    let estimateAmount = 0;
    let estimateQuantity = 0;
    addExpensesPage.products.forEach(item => {
      estimateQuantity += item.amount;
    });
    addExpensesPage.commissions.forEach(item => {
      estimateAmount += item.cost;
      const cid = commissionsTemplate.find(i => i.customerId === item.customerId);
      if (cid) {
        cid.cost += item.cost;
        cid.discountPrice += item.discountPrice;
        // eslint-disable-next-line no-multi-assign
        cid.suggestionDiscountPrice = cid.suggestionDiscountPrice += (item.suggestionDiscount * item.cost) / 100;
        // eslint-disable-next-line no-console
      } else {
        const sdp = (item.suggestionDiscount / 100) * item.cost;

        const newItem = { ...item, suggestionDiscountPrice: sdp };
        commissionsTemplate.push(newItem);
      }
    });
    const newCtp = commissionsTemplate.map(item => {
      const cost = item.cost ? item.cost : 1;
      return {
        ...item,
        discount: ((item.discountPrice * 100) / cost).toFixed(2),
        suggestionDiscount: ((item.suggestionDiscountPrice * 100) / cost).toFixed(2),
      };
    });
    newCtp.forEach(item => {
      totalDiscount += item.discount * 1;
      totalSuggestionDiscount += item.suggestionDiscount * 1;
    });
    const data = {
      code: addExpensesPage.code,
      commissions: addExpensesPage.commissions,
      labors: addExpensesPage.labors,
      name: addExpensesPage.name,
      products: addExpensesPage.products,
      transports: addExpensesPage.transports,
      otherCosts: addExpensesPage.otherCosts,
      relityProducts: addExpensesPage.relityProducts,
      totalDiscount,
      estimateAmount,
      estimateQuantity,
      commissionsTemplate: newCtp,
      totalSuggestionDiscount,
      // *this.props.businessOpportunitiesId* truyen từ dự toán chi phí trong cơ hội kinh doanh
      businessOpportunities: this.props.isTrading === false ? this.props.businessOpportunitiesId : addExpensesPage.businessOpportunities,
      callback: this.props.callback ? this.props.callback : null,
      others: addExpensesPage.others,
      customer: addExpensesPage.customer ? addExpensesPage.customer._id : null,
      exchangingAgreement: this.props.isTrading === true ? this.props.exchangingAgreementId : addExpensesPage.exchangingAgreement,
      kanbanStatus: addExpensesPage.kanbanStatus,
    };

    if (id === 'add') this.props.postExpense(data);
    else this.props.putExpense(id, data);
  };

  componentDidMount() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    this.props.getExpense(id, this.props.customerBoDialog, this.props.addCustomer, this.props.addExpensesPage.customer, this.props.data);
  }

  changeTab = name => data => {
    const tabData = this.props.addExpensesPage[name];
    const newTab = [...tabData];
    newTab[data.index] = { ...tabData[data.index], [data.name]: data.value };
    if (name === 'products') newTab[data.index] = this.caculateProduct(newTab[data.index]);
    this.props.handleChange(name, newTab);
  };

  deleteRow = name => index => {
    const tabData = this.props.addExpensesPage[name];
    const newTab = [...tabData];
    newTab.splice(index, 1);

    this.props.mergeData({ [name]: newTab });
  };

  deleteRowProduct = index => {
    const { products, relityProducts } = this.props.addExpensesPage;
    const newproducts = [...products];
    newproducts.splice(index, 1);
    const newRelityProducts = [...relityProducts];
    newRelityProducts.splice(index, 1);
    this.props.mergeData({ products: newproducts, relityProducts: newRelityProducts });
  };

  mapInventory = items =>
    items.map(item => ({
      name: (
        <Button
          onClick={() =>
            this.addItem({
              name: item.name,
              sourcePrice: item.pricePolicy.sourcePrice,
              costPrice: item.pricePolicy.costPrice,
              code: item.code,
              productId: item._id,
              discount: 0,
              marketPrice: 0,
            })
          }
        >
          {item.name}
        </Button>
      ),
      code: item.code,
      sourcePrice: item.pricePolicy.sourcePrice,
      costPrice: item.pricePolicy.costPrice,
      logo: <Avatar src={item.logo} />,
      amount: 1,
      _id: item._id,
    }));

  addItem(item) {
    this.props.toggleDrawer({ openDrawer: false });
    if (this.props.addExpensesPage.products.map(i => i.productId).includes(item.productId)) return;
    const tabData = this.props.addExpensesPage.products.concat(this.caculateProduct({ ...item, amount: 1 }));
    const relityProducts = this.props.addExpensesPage.products.concat({ ...item, amount: 1 });
    this.props.mergeData({ products: tabData, relityProducts });
  }

  caculateProduct(product) {
    const { commisionSales } = this.props.addExpensesPage;
    const date = new Date();
    function filterComission(item) {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      const gh = endDate - date > 0 && date - startDate > 0;
      const rule = item.rule === 1;
      return item.active === true && gh && rule;
    }
    const totalAmount = product.amount * 1 * product.costPrice;
    const newPolicy = commisionSales.filter(filterComission);
    let discount = 0;
    let salesPolicyId = null;
    let salesPolicyName = '';
    let sale = 1;
    const cms = newPolicy.filter(it => Array.isArray(it.product) && it.product.map(k => k._id).includes(product.productId));
    cms.forEach(e => {
      // eslint-disable-next-line eqeqeq
      const dc = e.sale == 1 ? e.percentageDiscount * 1 : ((e.priceDiscount * 1) / totalAmount) * 100;
      if (dc > discount) {
        discount = dc;
        salesPolicyId = e._id;
        sale = e.sale;
        salesPolicyName = e.name;
      }
    });

    const newPro = {
      ...product,
      discount,
      sale,
      salesPolicyId,
      salesPolicyName,
    };
    // console.log('ND', newPro);

    return newPro;
  }

  mapComiss = items =>
    items.map((item, index) => ({ ...item, action: <Cancel onClick={() => this.deleteComiss(index)} style={{ cursor: 'pointer' }} /> }));

  deleteComiss = index => {
    const { commissions } = this.props.addExpensesPage;
    const newComiss = commissions.filter((e, i) => i !== index);
    this.props.mergeData({ commissions: newComiss });
  };

  // Discount
  handleDiscount = type => e => {
    const data = this.props.addExpensesPage;
    let newColumn;
    switch (type) {
      case 1:
        if (e.target.checked)
          newColumn = data.productColumns.map(item => (['discount', 'discountAmount'].includes(item.name) ? { ...item, checked: true } : item));
        else newColumn = data.productColumns.map(item => (['discount', 'discountAmount'].includes(item.name) ? { ...item, checked: false } : item));
        this.props.mergeData({ productColumns: newColumn, checked: e.target.checked });
        break;
      case 2:
        if (e.target.checked)
          newColumn = data.productColumns.map(item => (['salesPolicyName'].includes(item.name) ? { ...item, checked: true } : item));
        else newColumn = data.productColumns.map(item => (['salesPolicyName'].includes(item.name) ? { ...item, checked: false } : item));
        // console.log(newColumn);

        this.props.mergeData({ productColumns: newColumn, checkedSale: e.target.checked });
        break;
      default:
        break;
    }
  };

  caculateCommistion(customer, product) {
    const { commisionSales, sources } = this.props.addExpensesPage;
    const date = new Date();
    function filterComission(item) {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      const gh = endDate - date > 0 && date - startDate > 0;
      const rule = item.rule === 6;
      return item.active && gh && rule;
    }
    const newCommisionSale = commisionSales.filter(filterComission);
    let discount = 0;
    const totalAmount = product.amount * product.costPrice;
    let salesPolicyId = null;
    let salesPolicyName = '';

    const cms = newCommisionSale.filter(it => it.product.map(k => k._id).includes(product.productId));
    cms.forEach(e => {
      let diti = true;
      if (e.condition === 1) {
        e.conditions.forEach(o => {
          if (o.value === 'customers' && o.conditionType === 1) diti = o.data.map(ii => ii._id).includes(customer._id) && diti;
          if (o.value === 'customers' && o.conditionType === 2) diti = !o.data.map(ii => ii._id).includes(customer._id) && diti;
          if (o.value === 'S18' && o.conditionType === 1)
            diti = o.data.map(ii => ii._id).filter(u => sources.map(z => z.value).includes(u)).length && diti;
          if (o.value === 'S18' && o.conditionType === 2)
            diti = !o.data.map(ii => ii._id).filter(u => sources.map(z => z.value).includes(u)).length && diti;
        });
      }
      if (e.condition === 0) {
        let chilDiti = !e.conditions.length;
        e.conditions.forEach(o => {
          if (o.value === 'customers' && o.conditionType === 1) chilDiti = o.data.map(ii => ii._id).includes(customer._id) || chilDiti;
          if (o.value === 'customers' && o.conditionType === 2) chilDiti = !o.data.map(ii => ii._id).includes(customer._id) || chilDiti;
          if (o.value === 'S18' && o.conditionType === 1)
            diti = o.data.map(ii => ii._id).filter(u => sources.map(z => z.value).includes(u)).length || chilDiti;
          if (o.value === 'S18' && o.conditionType === 2)
            diti = !o.data.map(ii => ii._id).filter(u => sources.map(z => z.value).includes(u)).length || chilDiti;
        });
        diti = chilDiti && diti;
      }
      // eslint-disable-next-line eqeqeq
      const dc = e.sale == 1 ? e.percentageDiscount * 1 : ((e.priceDiscount * 1) / totalAmount) * 100;
      if (diti && dc > discount) {
        discount = dc;
        salesPolicyId = e._id;
        salesPolicyName = e.name;
      }
    });

    const groups = this.state.crmSource.find(item => item.code === 'S07').data;
    const group = customer['detailInfo.typeCustomer.group'];
    const groupFind = groups.find(item => item.value === group);
    const groupName = groupFind ? groupFind.title : '';
    return {
      name: customer.name,
      customerId: customer._id,
      phone: customer.phoneNumber,
      organizationUnit: '',
      position: customer.position,
      address: customer.address,
      discount,
      cost: (1 - discount / 100) * totalAmount,
      note: '',
      group,
      groupName,
      salesPolicyId,
      salesPolicyName,
      productName: product.name,
      productId: product.productId,
      discountPrice: discount * 1 * totalAmount,
      suggestionDiscount: discount,
    };
  }

  addRow = name => () => {
    let data;
    switch (name) {
      case 'commissions':
        data = {
          name: '',
          phone: '',
          organizationUnit: '',
          adress: '',
          cost: '',
          note: '',
        };
        break;
      case 'transports':
        data = {
          name: '',
          phone: '',
          adress: '',
          cost: '',
          destination: '',
        };
        break;
      case 'products':
        data = {
          productId: '',
          name: '',
          amount: '',
          unit: '',
          sourcePrice: '',
          costPrice: '',
        };
        break;
      case 'labors':
        data = {
          name: '',
          phone: '',
          adress: '',
          sourcePrice: '',
          costPrice: '',
        };

        break;
      case 'otherCosts':
        data = {
          name: '',
          cost: '',
          amount: '',
          total: '',
        };

        break;
      default:
        break;
    }
    const tabData = this.props.addExpensesPage[name].concat(data);
    this.props.handleChange(name, tabData);
  };
}

AddExpensesPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  addExpensesPage: makeSelectAddExpensesPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleChangeIndex: index => dispatch(handleChangeIndex(index)),
    getExpense: (id, customerBoDialog, addCustomer, customer, data) => dispatch(getExpense(id, customerBoDialog, addCustomer, customer, data)),
    putExpense: (id, data) => dispatch(putExpense(id, data)),
    postExpense: data => dispatch(postExpense(data)),
    getDefault: () => dispatch(getDefault()),
    changeExpense: value => dispatch(changeExpense(value)),
    handleChangeNameExpense: (a, b) => dispatch(handleChangeNameExpense(a, b)),
    saveRow: (rows, name) => dispatch(saveRow(rows, name)),
    handleChange: (name, data) => dispatch(handleChange(name, data)),
    toggleDrawer: status => dispatch(toggleDrawer(status)),
    handleDiscount: (check, products) => dispatch(handleDiscount(check, products)),
    mergeData: data => dispatch(mergeData(data)),
    changeSnackbar: data => dispatch(changeSnackbar(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addExpensesPage', reducer });
const withSaga = injectSaga({ key: 'addExpensesPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(AddExpensesPage);
