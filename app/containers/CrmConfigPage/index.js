/**
 *
 * CrmConfigPage
 *
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import moment from 'moment';
import {
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  SwipeableDrawer,
  IconButton,
  Toolbar,
  AppBar,
  Fab,
  Menu,
  MenuItem,
  Grid,
} from '@material-ui/core';
import { Add, Close, Edit, Reorder, Delete } from '@material-ui/icons';
import { Breadcrumbs } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { locationColumns, taxColumns, taxVATColumns, currencyColumns } from 'variable';
import ListPage from 'containers/ListPage';
import makeSelectCrmConfigPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import TabContainer from '../../components/TabContainer';
import BusinessStatus from '../../components/BusinessStatus/index';
import Status from '../../components/Status';
import { changeSnackbar } from '../Dashboard/actions';

import {
  fetchAllStatusAction,
  addStatusAction,
  addCRMStatusAction,
  editCRMStatusAction,
  deleteCRMStatusAction,
  resetNotis,
  deleteStatusAction,
  updateStatusAction,
  updateStatusIndexAction,
  resetAllStatus,
  fetchAllSourcesAction,
  addSourceAction,
  editSourceAction,
  updateSourcesAction,
  deleteCRMSourcesAction,
  resetAllSources,
  // Currency
  fetchAllCurrency,
  addCurrencyAction,
  updateCurrencyAction,
  handleChangeNameCurrency,
  onChangeNameCurrency,
  handleDiscount,
  getCurrentCurrency,
  getMoney,
  getCurrencyDefault,
  changeBaseCurrency,
  // Location
  getLocation,
  addLocation,
  handleChangeLocation,
  getCurrentLocation,
  updateLocation,
  // Tax
  getTax,
  handleChangeTax,
  addTax,
  getCurrentTax,
  updateTax,
  handleSelectTax,
  getCurrentTaxVAT,
  addTaxLevel,
  handleChangeTaxLevel,
  getTaxlevel,
  updateTaxLevel,
} from './actions';
import Currency from '../../components/Currency';
import { API_LOCATION, API_CURRENCY, API_TAX } from '../../config/urlConfig';
import Location from '../../components/Location';
import Tax from '../../components/Tax';
import TaxVat from '../../components/TaxVat';
import CustomerVerticalTabList from '../../components/CustomVerticalTabList';
import DialogCreateEdit from '../../components/CustomDialog/DialogCreateEdit';
import ConfirmDialog from '../../components/CustomDialog/ConfirmDialog';

// const addSource = useCallback(() => {
//   this.props.onAddCRMSource(this.state.newSource)
// }, [this.state.newSource])

export class CrmConfigPage extends React.Component {
  state = {
    statusTabIndex: 0,
    sourceTabIndex: 0,
    tabIndex: 0,
    listStatus: [],
    listSource: [],
    newSource: '',
    newStatus: '',
    chooseId: '',
    openStatus: false,
    openSource: false,
    deleteStatus: false,
    deleteSource: false,
    returnStatus: false,
    returnSource: false,
    isEdit: false,
    openDrawer: false,
    openDrawerLocation: false,
    anchorEl: false,
    openTax: false,
    openDrawerTax: false,
    openDrawerTaxVAT: false,
    type: '',
  };

  componentDidMount() {
    const refs = window.location.href.split('/')[window.location.href.split('/').length - 1];
    this.setState({ type: refs });
    this.props.onGetCRMStatus(refs ? refs : this.state.type);
    this.props.onGetCRMSource(refs ? refs : this.state.type);
    this.props.getCurrency();
    this.props.getMoney();
    this.props.getLocation();
    this.props.getTax();
  }

  componentWillReceiveProps(props) {
    const { crmConfigPage } = props;
    if (crmConfigPage.listStatus !== undefined) {
      this.state.listStatus = crmConfigPage.listStatus;
    }

    if (crmConfigPage.sources !== undefined) {
      this.state.listSource = crmConfigPage.sources;
    }

    if (crmConfigPage.callAPIStatus === 1) {
      this.props.enqueueSnackbar(crmConfigPage.notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'success',
      });
    }
    if (crmConfigPage.callAPIStatus === 0) {
      this.props.enqueueSnackbar(crmConfigPage.notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
      });
    }
    this.props.onResetNotis();
  }

  mapFunction = item => ({
    ...item,
    base: item.base === false ? 'Không' : 'Có',
    reportingCurrency: item.reportingCurrency === false ? 'Không' : 'Có',
    defaultInvoicingCurrency: item.defaultInvoicingCurrency === false ? 'Không' : 'Có',
    name: (
      <Typography style={{ cursor: 'pointer' }} color="primary" onClick={() => this.getCurrency(item)}>
        {item.name}
      </Typography>
    ),
    setting: (
      <Button onClick={this.showBaseCurrency(item._id, item.base)}>
        <Reorder />
      </Button>
    ),
    edit: (
      <Fab color="primary" aria-label="Edit" size="small" onClick={() => this.getCurrency(item)}>
        <Edit />
      </Fab>
    ),
  });

  addItem = () => <Add onClick={this.handleClick}>Open Menu</Add>;

  // function status

  handleChange = (_, statusTabIndex) => this.setState({ statusTabIndex });

  handleChangeInputStatus = val => {
    this.setState({
      newStatus: val,
    });
  };

  handleOpenStatus = (item, isEdit) => {
    if (isEdit) {
      this.setState({
        openStatus: true,
        isEdit: isEdit,
        idChoose: item._id,
        newStatus: item.title,
      });
    } else {
      this.setState({
        openStatus: true,
        isEdit: isEdit,
        idChoose: '',
        newStatus: '',
      });
    }
  };

  handleCloseStatus = () => {
    this.setState({
      openStatus: false,
      isEdit: false,
      idChoose: '',
      newStatus: '',
    });
    this.props.onGetCRMStatus(this.state.type);
  };

  handleSubmitStatusAddEdit = () => {
    // console.log(this.state.listStatus.map(i => i.title));
    if (this.state.listStatus.map(i => i.title).includes(this.state.newStatus)) {
      changeSnackbar({ status: true, message: 'Thêm mới cấu hình thất bại', variant: 'error' });
      //   // return;
    }
    if (this.state.isEdit) {
      this.props.onEditCMRStatus(this.state.newStatus, this.state.idChoose, this.state.type);
    } else {
      this.props.onAddCRMStatus(this.state.newStatus, this.state.type);
    }
    this.handleCloseStatus();
  };

  handleOpenStatusDelete = item => {
    this.setState({
      deleteStatus: true,
      idChoose: item._id,
    });
  };

  handleCloseStatusDelete = () => {
    this.setState({
      deleteStatus: false,
      idChoose: '',
    });
  };

  handleSubmitStatusDelete = () => {
    this.props.onDeleteCRMStatus(this.state.idChoose, this.state.type);
    this.handleCloseStatusDelete();
  };

  handleOpenReturnStatus = () => {
    this.setState({
      returnStatus: true,
    });
  };

  handleCloseReturnStatus = () => {
    this.setState({
      returnStatus: false,
    });
  };

  handleSubmitStatusReturn = () => {
    this.props.onResetCRMStatus();
    this.handleCloseReturnStatus();
  };

  // function source

  handleChangeSource = (_, sourceTabIndex) => this.setState({ sourceTabIndex });

  handleChangeInputSource = val => {
    this.setState({
      newSource: val,
    });
  };

  handleOpenSource = (item, isEdit) => {
    console.log("sdvsdv")
    if (isEdit) {
      this.setState({
        openSource: true,
        isEdit: isEdit,
        idChoose: item._id,
        newSource: item.title,
      });
    } else {
      this.setState({
        openSource: true,
        isEdit: isEdit,
        idChoose: '',
        newSource: '',
      });
    }
  };

  handleCloseSource = () => {
    this.setState({
      openSource: false,
      isEdit: false,
      idChoose: '',
      newSource: '',
    });
  };

  handleSubmitSourceAddEdit = () => {
    if (this.state.listSource.map(i => i.title).includes(this.state.newSource)) {
      // return
      changeSnackbar({ status: true, message: 'Thêm mới cấu hình thất bại', variant: 'error' });
    }
    if (this.state.isEdit) {
      this.props.onEditCRMSource(this.state.newSource, this.state.idChoose, this.state.type);
    } else {
      this.props.onAddCRMSource(this.state.newSource, this.state.type);
    }
    this.handleCloseSource();
  };

  handleOpenSourceDelete = item => {
    this.setState({
      deleteSource: true,
      idChoose: item._id,
    });
  };

  handleCloseSourceDelete = () => {
    this.setState({
      deleteSource: false,
      idChoose: '',
    });
  };

  handleSubmitSourceDelete = () => {
    this.props.onDeleteCMRSource(this.state.idChoose, this.state.type);
    this.handleCloseSourceDelete();
  };

  handleOpenReturnSource = () => {
    this.setState({
      returnSource: true,
    });
  };

  handleCloseReturnSource = () => {
    this.setState({
      returnSource: false,
    });
  };

  handleSubmitSourceReturn = () => {
    this.props.onResetCRMSource();
    this.handleCloseReturnSource();
  };

  handleClick = () => {
    const openDrawer = this.state.openDrawer;
    this.setState({
      openDrawer: !openDrawer,
    });
    this.props.crmConfigPage._id;
  };

  addItemLocation = () => <Add onClick={this.handleClickLocation}>Open Menu</Add>;

  handleClickLocation = () => {
    const openDrawerLocation = this.state.openDrawerLocation;
    this.setState({
      openDrawerLocation: !openDrawerLocation,
    });
    this.props.crmConfigPage._id;
  };

  mapFunctionLocation = item => ({
    ...item,
    code: (
      <Typography style={{ cursor: 'pointer' }} color="primary" onClick={() => this.handleLocation(item)}>
        {item.code}
      </Typography>
    ),
    effective: item.effective === true ? 'Có' : 'Không',
    edit: (
      <Fab color="primary" aria-label="Edit" size="small" onClick={() => this.handleLocation(item)}>
        <Edit />
      </Fab>
    ),
  });

  handleLocation = item => {
    this.setState({
      openDrawerLocation: true,
    });
    this.props.getCurrentLocation(item);
  };

  addItemTax = () => <Add onClick={this.handleClickTax}>Open Menu</Add>;

  handleClickTax = () => {
    const openDrawerTax = this.state.openDrawerTax;
    this.setState({
      openDrawerTax: !openDrawerTax,
    });
    this.props.crmConfigPage._id;
  };

  mapFunctionTax = item => {
    return {
      ...item,
      updatedAt: moment(item.updatedAt).format('DD/MM/YYYY'),
      name: (
        <Typography style={{ cursor: 'pointer' }} color="primary" onClick={() => this.handleTax(item)}>
          {item.name}
        </Typography>
      ),
      edit: (
        <Fab color="primary" aria-label="Edit" size="small" onClick={() => this.handleTax(item)}>
          <Edit />
        </Fab>
      ),
    };
  };

  handleTax = item => {
    this.setState({
      openDrawerTax: true,
    });
    this.props.getCurrentTax(item);
  };

  addItemTaxVAT = () => <Add onClick={this.handleClickTaxVTA}>Open Menu</Add>;

  handleClickTaxVTA = () => {
    const openDrawerTaxVAT = this.state.openDrawerTaxVAT;
    this.setState({
      openDrawerTaxVAT: !openDrawerTaxVAT,
    });
    this.props.crmConfigPage._id;
  };

  mapFunctionTaxVAT = item => ({
    ...item,
    name: (
      <Typography style={{ cursor: 'pointer' }} color="primary" onClick={() => this.handleTaxVAT(item)}>
        {item.name}
      </Typography>
    ),
    effective: item.effective === true ? 'Có' : 'Không',
    edit: (
      <Fab color="primary" aria-label="Edit" size="small" onClick={() => this.handleTaxVAT(item)}>
        <Edit />
      </Fab>
    ),
  });

  handleTaxVAT = item => {
    this.setState({
      openDrawerTaxVAT: true,
    });
    this.props.getCurrentTax(item);
  };

  getCurrency = item => {
    this.setState({
      openDrawer: true,
    });
    this.props.getCurrentCurrency(item);
  };

  showBaseCurrency = (id, base) => event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
    this.props.changeBaseCurrency(id, base);
  };

  handleClose = () => {
    this.setState({
      anchorEl: false,
    });
  };

  setBaseCurrency = () => {
    const currentBase = this.props.crmConfigPage.currency.find(item => item._id === this.props.crmConfigPage.currencyId);
    if (currentBase) this.props.changeBaseCurrency(currentBase._id, currentBase.base);
    const newCurrentBase = { ...currentBase, base: true };
    this.props.onUpdateCurrency(newCurrentBase, this.props.crmConfigPage.currencyId);
    return null;
  };

  callBack = (cmd, data, param) => {
    switch (cmd) {
      case 'add-status':
        this.props.onAddCRMStatusItem(data, param._id, this.state.type);
        break;
      case 'delete-status':
        this.props.onDeleteCRMStatusItem(data, param._id, this.state.type);
        break;
      case 'update-status':
        this.props.onUpdateCRMStatus(data, param._id, this.state.type);
        break;
      case 'update-status-index':
        this.props.onUpdateCRMStatusIndex(data, param._id);
        break;
      case 'update-source':
        this.props.onUpdateCRMSource(data, param, this.state.type);
        break;
      default:
        break;
    }
  };

  render() {
    const {
      statusTabIndex,
      listSource,
      listStatus,
      tabIndex,
      sourceTabIndex,
      openDrawer,
      openDrawerLocation,
      openTax,
      openDrawerTax,
      openDrawerTaxVAT,
    } = this.state;
    const { classes } = this.props;
    const {
      currency,
      sort,
      faceValue,
      exchangeRate,
      code,
      nameCurrency,
      checked,
      money,
      name,
      reportingCurrency,
      defaultInvoicingCurrency,
      base,
      isHandmade,
    } = this.props.crmConfigPage;
    return (
      <div>
        <Helmet>
          <title>Cấu hình CRM</title>
          <meta name="description" content="Cấu hình CRM" />
        </Helmet>
        {/* <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/setting/Employee">
              CRM
            </Link>
            <Typography color="textPrimary">Cấu hình CRM</Typography>
          </Breadcrumbs>
        </Paper> */}
        <Tabs
          value={tabIndex}
          onChange={(event, value) => {
            this.setState({ tabIndex: value });
          }}
        >
          <Tab label="Kiểu trạng thái" />
          <Tab label="Kiểu loại" />
          {this.state.type === 'ConfigCRM' ? <Tab label="Tiền tệ" /> : null}
          {/* {this.state.type === 'ConfigCRM' ? <Tab label="Địa điểm" /> : null} */}
          {/* {this.state.type === 'ConfigCRM' ? <Tab label="Thuế" /> : null} */}
        </Tabs>
        {tabIndex === 0 && (
          <div className="my-3">
            <Paper className="py-3" style={{ height: '100%' }}>
              <Grid container>
                <Grid item container sm={6} md={4} xl={3}>
                  <Grid item>
                    <CustomerVerticalTabList
                      value={statusTabIndex}
                      data={listStatus}
                      onChange={this.handleChange}
                      onChangeAdd={this.handleOpenStatus}
                      onChangeEdit={this.handleOpenStatus}
                      onChangeDelete={this.handleOpenStatusDelete}
                      onChangeUndo={this.handleOpenReturnStatus}
                    />
                  </Grid>
                </Grid>
                {/* {console.log(listStatus.map(i => i.title))} */}
                <Grid item sm={6} md={8} xl={9}>
                  {listStatus.map((item, index) => {
                    let renderPaper;
                    if (statusTabIndex === index && listStatus[index] !== undefined) {
                      renderPaper = (
                        <TabContainer>
                          <BusinessStatus callBack={this.callBack} data={this.state.listStatus[index]} />
                        </TabContainer>
                      );
                    }
                    return renderPaper;
                  })}
                </Grid>
              </Grid>
            </Paper>
          </div>
        )}
        {tabIndex === 1 && (
          <div className="my-3">
            <Paper className="py-3" style={{ height: '100%', minHeight: 500 }}>
              <Grid container>
                <Grid item container sm={6} md={4} xl={3}>
                  <Grid item>
                    <CustomerVerticalTabList
                      value={sourceTabIndex}
                      data={listSource}
                      onChange={this.handleChangeSource}
                      onChangeAdd={this.handleOpenSource}
                      onChangeEdit={this.handleOpenSource}
                      onChangeDelete={this.handleOpenSourceDelete}
                      onChangeUndo={this.handleOpenReturnSource}
                    />
                  </Grid>
                </Grid>

                <Grid item sm={6} md={8} xl={9} style={{ minHeight: 500 }}>
                  {listSource.map((item, index) => {
                    let renderPaper;
                    if (sourceTabIndex === index && listSource[index] !== undefined) {
                      renderPaper = <Status callBack={this.callBack} data={this.state.listSource[index]} />;
                    }
                    return renderPaper;
                  })}
                </Grid>
              </Grid>
            </Paper>
          </div>
        )}
        {tabIndex === 2 && (
          <div
            className="my-3"
            style={{
              display: 'flex',
            }}
          >
            {!openDrawer ? (
              <Paper className="py-3" style={{ height: '100%' }}>
                <ListPage
                  disableEdit
                  disableAdd
                  deleteOption="data"
                  settingBar={[this.addItem()]}
                  columns={currencyColumns}
                  code="Currency"
                  apiUrl={API_CURRENCY}
                  mapFunction={this.mapFunction}
                />
              </Paper>
            ) : null}
          </div>
        )}
        <SwipeableDrawer anchor="right" onClose={() => this.setState({ openDrawer: false })} open={openDrawer} width={window.innerWidth - 260}>
          <div style={{ width: window.innerWidth - 260 }}>
            {/* <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => this.setState({ openDrawer: false })} aria-label="Close">
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar> */}
            <Currency
              reportingCurrency={reportingCurrency}
              defaultInvoicingCurrency={defaultInvoicingCurrency}
              base={base}
              isHandmade={isHandmade}
              name={name}
              money={money}
              onSave={data => this.onSave(data)}
              onUpdate={data => this.onUpdate(data)}
              onCLoseCurrency={() => this.onCLoseCurrency()}
              currency={currency}
              sort={sort}
              exchangeRate={exchangeRate}
              code={code}
              faceValue={faceValue}
              nameCurrency={nameCurrency}
              checked={checked}
              handleChangeNameCurrency={(a, b) => this.handleChangeNameCurrency(a, b)}
              onChangeNameCurrency={data => this.props.onChangeNameCurrency(data)}
              handleDiscount={(name, checked) => this.props.handleDiscount(name, checked)}
              fetchCurrency={data => this.props.fetchCurrency(data)}
              propsAll={this.props}
              onChangeSnackbar={this.props.onChangeSnackbar}
            />
          </div>
        </SwipeableDrawer>
        {/* {tabIndex === 3 && (
          <div
            className="my-3"
            style={{
              display: 'flex',
            }}
          >
            {!openDrawerLocation ? (
              <Paper className="py-3" style={{ height: '100%' }}>
                <ListPage
                  disableAdd
                  disableEdit
                  deleteOption="data"
                  settingBar={[this.addItemLocation()]}
                  columns={locationColumns}
                  disableConfig
                  apiUrl={API_LOCATION}
                  mapFunction={this.mapFunctionLocation}
                />
              </Paper>
            ) : null}
          </div>
        )} */}
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawerLocation: false })}
          open={openDrawerLocation}
          width={window.innerWidth - 260}
        >
          <div style={{ width: window.innerWidth - 260 }}>
            {/* <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => this.setState({ openDrawerLocation: false })} aria-label="Close">
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar> */}
            <Location
              crmConfigPage={this.props.crmConfigPage}
              handleChangeLocation={(a, b) => this.props.handleChangeLocation(a, b)}
              onSaveLocation={data => {
                this.onSaveLocation(data);
              }}
              onCloseLocation={() => {
                this.onCloseLocation();
              }}
              propsAll={this.props}
            />
          </div>
        </SwipeableDrawer>
        {/* {tabIndex === 4 && (
          <div
            className="my-3"
            style={{
              display: 'flex',
            }}
          >
            {!openDrawerTax && !openDrawerTaxVAT ? (
              <Paper className="py-3" style={{ height: '100%' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  style={{ marginLeft: 25, marginBottom: 10 }}
                  onClick={() => this.setState({ openTax: !openTax })}
                >
                  {openTax === false ? 'Thuế hóa đơn' : 'Thuế giá trị gia tăng(VAT)'}
                </Button>
                {openTax === false ? (
                  <ListPage
                    disableAdd
                    disableEdit
                    deleteOption="data"
                    settingBar={[this.addItemTax()]}
                    columns={taxColumns}
                    disableConfig
                    apiUrl={API_TAX}
                    mapFunction={this.mapFunctionTax}
                    filterFunction={item => item.isBillTax === true}
                  />
                ) : (
                  <ListPage
                    disableAdd
                    disableEdit
                    deleteOption="data"
                    settingBar={[this.addItemTaxVAT()]}
                    columns={taxVATColumns}
                    disableConfig
                    apiUrl={API_TAX}
                    mapFunction={this.mapFunctionTaxVAT}
                    filterFunction={item => item.isVATTax === true}
                  />
                )}
              </Paper>
            ) : null}
          </div>
        )} */}
        <SwipeableDrawer anchor="right" onClose={() => this.setState({ openDrawerTax: false })} open={openDrawerTax} width={window.innerWidth - 260}>
          <div style={{ width: window.innerWidth - 260 }}>
            {/* <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => this.setState({ openDrawerTax: false })} aria-label="Close">
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar> */}
            <Tax
              onCLoseTax={() => this.onCLoseTax()}
              crmConfigPage={this.props.crmConfigPage}
              handleChangeTax={(a, b) => this.props.handleChangeTax(a, b)}
              onSaveTax={data => this.onSaveTax(data)}
              handleSelectTax={value => this.props.handleSelectTax(value)}
              handleDiscount={(name, checked) => this.props.handleDiscount(name, checked)}
              SaveTaxLevel={data => this.SaveTaxLevel(data)}
              handleChangeTaxLevel={(name, data) => this.props.handleChangeTaxLevel(name, data)}
              getTaxlevel={(taxLevel, index) => this.props.getTaxlevel(taxLevel, index)}
              updateTaxLevel={id => this.props.updateTaxLevel(this.props.crmConfigPage, id)}
              propsAll={this.props}
            />
          </div>
        </SwipeableDrawer>
        <SwipeableDrawer
          anchor="right"
          onClose={() => this.setState({ openDrawerTaxVAT: false })}
          open={openDrawerTaxVAT}
          width={window.innerWidth - 260}
        >
          <div style={{ width: window.innerWidth - 260 }}>
            {/* <AppBar style={{ position: 'relative' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => this.setState({ openDrawerTaxVAT: false })} aria-label="Close">
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar> */}
            <TaxVat
              crmConfigPage={this.props.crmConfigPage}
              handleDiscount={(name, checked) => this.props.handleDiscount(name, checked)}
              handleChangeTax={(a, b) => this.props.handleChangeTax(a, b)}
              onSaveTax={data => this.onSaveTax(data)}
              onCLoseTax={() => this.onCLoseTax()}
              propsAll={this.props}
            />
          </div>
        </SwipeableDrawer>

        {/* ---------------- kiểu loại add + edit ----------------------  */}
        {
          this.state.openSource && <DialogCreateEdit
            openModal={this.state.openSource}
            handleClose={this.handleCloseSource}
            title={'Kiểu loại'}
            label={'Tên cấu hình loại'}
            isEdit={this.state.isEdit}
            value={this.state.newSource}
            onChangeInput={this.handleChangeInputSource}
            handleEdit={this.handleSubmitSourceAddEdit}
            handleAdd={this.handleSubmitSourceAddEdit}
            data={listSource}
            onChangeSnackbar={this.props.onChangeSnackbar}
          />
        }


        {/* ---------------- kiểu loại delete ----------------------  */}

        <ConfirmDialog
          open={this.state.deleteSource}
          handleClose={this.handleCloseSourceDelete}
          description={'Bạn có chắc chắn xóa kiểu loại này không?'}
          handleSave={this.handleSubmitSourceDelete}
          confirmText={'Xóa'}
        />

        {/* ---------------- kiểu trạng thái add + edit ----------------------  */}
        {
          this.state.openStatus && <DialogCreateEdit
            openModal={this.state.openStatus}
            handleClose={this.handleCloseStatus}
            title={'Trạng thái'}
            label={'Tên cấu hình trạng thái'}
            isEdit={this.state.isEdit}
            value={this.state.newStatus}
            onChangeSnackbar={this.props.onChangeSnackbar}
            onChangeInput={this.handleChangeInputStatus}
            handleAdd={this.handleSubmitStatusAddEdit}
            handleEdit={this.handleSubmitStatusAddEdit}
            data={listStatus}
          />
        }


        {/* ---------------- kiểu trạng thái delete ----------------------  */}

        <ConfirmDialog
          open={this.state.deleteStatus}
          handleClose={this.handleCloseStatusDelete}
          description={'Bạn có chắc chắn xóa trạng thái này không?'}
          handleSave={this.handleSubmitStatusDelete}
          confirmText={'Xóa'}
        />

        <Menu id="simple-menu" anchorEl={this.state.anchorEl} keepMounted open={this.state.anchorEl} onClose={this.handleClose}>
          <MenuItem onClick={this.setBaseCurrency}>Làm cơ sở tiền tệ</MenuItem>
        </Menu>

        {/* ------------------------------- hoàn tác trạng thái -------------------------------------- */}

        <ConfirmDialog
          open={this.state.returnStatus}
          handleClose={this.handleCloseReturnStatus}
          description={'Bạn có chắc chắn hoàn tác kiểu trạng thái không?'}
          handleSave={this.handleSubmitStatusReturn}
        />

        <Menu id="simple-menu" anchorEl={this.state.anchorEl} keepMounted open={this.state.anchorEl} onClose={this.handleClose}>
          <MenuItem onClick={this.setBaseCurrency}>Làm cơ sở tiền tệ</MenuItem>
        </Menu>

        {/* ------------------------------- hoàn tác loại -------------------------------------- */}

        <ConfirmDialog
          open={this.state.returnSource}
          handleClose={this.handleCloseReturnSource}
          description={'Bạn có chắc chắn hoàn tác kiểu loại không?'}
          handleSave={this.handleSubmitSourceReturn}
        />
      </div>
    );
  }
  // CURRENCY

  onSave = data => {
    this.props.onAddCurrent(data);
    this.setState({
      openDrawer: false,
    });
    this.props.getCurrencyDefault();
  };

  onUpdate = data => {
    const id = this.props.crmConfigPage._id;
    if (id) {
      this.props.onUpdateCurrency(data, id);
    } else {
      this.props.onAddCurrent(data);
    }
    this.setState({
      openDrawer: false,
    });
    this.props.getCurrencyDefault();
  };

  onCLoseCurrency = () => {
    this.setState({
      openDrawer: false,
    });
    this.props.getCurrencyDefault();
  };

  handleChangeNameCurrency = (a, b) => {
    this.props.handleChangeNameCurrency(a, b);
  };

  // LOCATION

  onSaveLocation = data => {
    const id = this.props.crmConfigPage._id;
    if (id) {
      this.props.updateLocation(data, id);
    } else {
      this.props.addLocation(data);
    }
    this.setState({
      openDrawerLocation: false,
    });

    this.props.getCurrencyDefault();
  };

  onCloseLocation = () => {
    this.setState({
      openDrawerLocation: false,
    });
    this.props.getCurrencyDefault();
  };

  // Tax

  onSaveTax = data => {
    const id = this.props.crmConfigPage.idTax;
    if (id) {
      this.props.onUpdateTax(data, id);
    } else {
      this.props.addTax(data);
    }
    this.setState({
      openDrawerTax: false,
      openDrawerTaxVAT: false,
    });
    this.props.getCurrencyDefault();
  };

  onCLoseTax = () => {
    this.setState({
      openDrawerTax: false,
      openDrawerTaxVAT: false,
    });
    this.props.getCurrencyDefault();
  };

  SaveTaxLevel = data => {
    const id = this.props.crmConfigPage._id;
    if (id) {
      this.props.addTaxLevel(data, id);
    }
  };
}

CrmConfigPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  crmConfigPage: makeSelectCrmConfigPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    onGetCRMStatus: type => {
      dispatch(fetchAllStatusAction(type));
    },
    onAddCRMStatusItem: (data, id, types) => {
      dispatch(addStatusAction(data, id, types));
    },
    onDeleteCRMStatusItem: (statusId, id, types) => {
      dispatch(deleteStatusAction(statusId, id, types));
    },
    onUpdateCRMStatus: (data, id, types) => {
      dispatch(updateStatusAction(data, id, types));
    },
    onUpdateCRMStatusIndex: (data, id) => {
      dispatch(updateStatusIndexAction(data, id));
    },
    onAddCRMStatus: (title, type) => {
      dispatch(addCRMStatusAction(title, type));
    },
    onEditCMRStatus: (body, id, types) => {
      dispatch(editCRMStatusAction(body, id, types));
    },
    onDeleteCRMStatus: (id, types) => {
      dispatch(deleteCRMStatusAction(id, types));
    },
    onResetCRMStatus: () => {
      dispatch(resetAllStatus());
    },
    // SOURCE
    onGetCRMSource: type => {
      dispatch(fetchAllSourcesAction(type));
    },
    onAddCRMSource: (title, type) => {
      dispatch(addSourceAction(title, type));
    },
    onEditCRMSource: (body, id, types) => {
      dispatch(editSourceAction(body, id, types));
    },
    onUpdateCRMSource: (newData, param, types) => {
      dispatch(updateSourcesAction(newData, param, types));
    },
    onDeleteCMRSource: (id, types) => {
      dispatch(deleteCRMSourcesAction(id, types));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
    onResetCRMSource: () => {
      dispatch(resetAllSources());
    },
    // Currency
    getCurrency: () => {
      dispatch(fetchAllCurrency());
    },
    onAddCurrent: data => {
      dispatch(addCurrencyAction(data));
    },
    onUpdateCurrency: (data, id) => {
      dispatch(updateCurrencyAction(data, id));
    },
    handleChangeNameCurrency: (a, b) => {
      dispatch(handleChangeNameCurrency(a, b));
    },
    onChangeNameCurrency: newCurency => {
      dispatch(onChangeNameCurrency(newCurency));
    },
    handleDiscount: (name, checked) => {
      dispatch(handleDiscount(name, checked));
    },
    getCurrentCurrency: currentCurrency => {
      dispatch(getCurrentCurrency(currentCurrency));
    },
    getMoney: () => {
      dispatch(getMoney());
    },
    getCurrencyDefault: () => {
      dispatch(getCurrencyDefault());
    },
    changeBaseCurrency: (currencyId, base) => {
      dispatch(changeBaseCurrency(currencyId, base));
    },
    // Location

    getLocation: () => {
      dispatch(getLocation());
    },
    addLocation: data => {
      dispatch(addLocation(data));
    },
    handleChangeLocation: (a, b) => {
      dispatch(handleChangeLocation(a, b));
    },
    getCurrentLocation: currentLocation => {
      dispatch(getCurrentLocation(currentLocation));
    },
    updateLocation: (data, id) => {
      dispatch(updateLocation(data, id));
    },

    // Tax
    getTax: () => {
      dispatch(getTax());
    },

    handleChangeTax: (a, b) => {
      dispatch(handleChangeTax(a, b));
    },
    addTax: data => {
      dispatch(addTax(data));
    },
    onUpdateTax: (data, id) => {
      dispatch(updateTax(data, id));
    },
    getCurrentTax: currentTax => {
      dispatch(getCurrentTax(currentTax));
    },
    handleSelectTax: value => {
      dispatch(handleSelectTax(value));
    },
    getCurrentTaxVAT: currentTaxVAT => {
      dispatch(getCurrentTaxVAT(currentTaxVAT));
    },
    addTaxLevel: (data, id) => {
      dispatch(addTaxLevel(data, id));
    },
    handleChangeTaxLevel: (name, data) => dispatch(handleChangeTaxLevel(name, data)),
    getTaxlevel: (taxLevel, index) => {
      dispatch(getTaxlevel(taxLevel, index));
    },
    updateTaxLevel: (crmConfigPage, id) => {
      const data = {
        effective: crmConfigPage.effective,
        typeCustomer: crmConfigPage.typeCustomer,
        priceTax: crmConfigPage.priceTax,
        order: crmConfigPage.order,
        selectLocation: crmConfigPage.selectLocation,
        level: crmConfigPage.level,
      };
      const taxRates = [...crmConfigPage.taxRates];
      taxRates[crmConfigPage.index] = data;
      dispatch(updateTaxLevel(taxRates, id));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'crmConfigPage', reducer });
const withSaga = injectSaga({ key: 'crmConfigPage', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(CrmConfigPage);
