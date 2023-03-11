/**
 *
 * AddNewProductPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import classnames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withStyles, Grid, Paper, Typography, Tab, Tabs, Button, AppBar, Toolbar } from '@material-ui/core';
import { Edit, GpsFixed, Person, ExpandMore, Close } from '@material-ui/icons';

import { Breadcrumbs } from '@material-ui/lab';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { injectIntl } from 'react-intl';
// import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
// import SearchIcon from '@material-ui/icons/Search';
import { withSnackbar } from 'notistack';
import SwipeableViews from 'react-swipeable-views';
// import Accordion from 'components/Accordion/Accordion';
import { Link } from 'react-router-dom';
// import ImageUpload from 'components/CustomUpload/ImageUpload';
import saga from './saga';
import reducer from './reducer';
import makeSelectDetailProductPage, { makeSelectDashboardPage } from './selectors';
import styles from './styles';
import LoadingIndicator from '../../components/LoadingIndicator';
import ProductInfo from '../../components/ProductInfo';
import SetOfAttribute from '../../components/SetOfAttribute';
import PricePolicy from '../../components/PricePolicy';
import CustomSellingPoint from '../../components/CustomSellingPoint';
import CustomAppBar from 'components/CustomAppBar';

import ExtendedInformation from '../../components/ExtendedInformation';
import OthersProductInfo from '../../components/OthersProductInfo';
import { getTagsAct, addNewProductAct, resetNoti } from './actions';
import messages from './messages';
import { viewConfigCheckRequired, viewConfigName2Title, viewConfigCheckForm } from 'utils/common';
import dot from 'dot-object';
import { changeSnackbar } from '../Dashboard/actions';
function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3, overflow: 'auto', height: 700 }}>
      {children}
    </Typography>
  );
}
/* eslint-disable react/prefer-stateless-function */
export class AddNewProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.productInfo = React.createRef();
    this.setOfAttribute = React.createRef();
    this.pricePolicy = React.createRef();
    this.customSellingPoint = React.createRef();
    this.extendedInformation = React.createRef();
    this.othersProductInfo = React.createRef();
    this.state = {
      isStock: '',
      value: 0,
      tagsList: [],
      suppliersList: [],
      propertiesSet: [],
      calculateUnitList: [],
      categoryList: [],
      departmentList: [],
      agencyList: [],
      originList: [],

      productInfo: {},
      setOfAttribute: {},
      pricePolicy: {},
      customSellingPoint: {},
      extendedInformation: {},
      othersProductInfo: {},
      fieldAdded: [],
      moduleCode: 'Stock',
      checkShowForm: viewConfigCheckRequired('Stock', 'showForm'),
      checkRequired: viewConfigCheckRequired('Stock', 'required'),
      localMessages: {},
      name2Title: {},
      reload: new Date() * 1,
      disableAdd: false,
    };
  }
  componentWillMount() {
    this.props.onGetTags();
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  componentDidMount() {
    const name2Title = viewConfigName2Title('Stock');
    this.setState({
      name2Title,
    });
    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.find(item => item.code === 'Stock');
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
  }

  componentWillReceiveProps(props) {
    const { addNewProductPage, dashboardPage } = props;
    // this.setState({
    const tagsList = addNewProductPage.tagsList || [];
    const suppliersList = addNewProductPage.suppliersList || [];
    const propertiesSet = addNewProductPage.propertiesSet || [];
    const calculateUnitList = addNewProductPage.calculateUnitList || [];
    const categoryList = addNewProductPage.categoryList || [];
    const departmentList = addNewProductPage.department || [];
    const agencyList = addNewProductPage.agency || {};
    const originList = addNewProductPage.originList || [];
    if (addNewProductPage.loading === false) {
      this.state.tagsList = tagsList.map(item => ({
        name: item.name,
        id: item._id,
      }));
      this.state.suppliersList = suppliersList.map(item => ({
        name: item.name,
        id: item._id,
      }));
      this.state.calculateUnitList = calculateUnitList.map(item => ({
        name: item.name,
        id: item._id,
      }));
      this.state.categoryList = categoryList.map(item => ({
        name: item.name,
        id: item._id,
        child: item.child,
      }));
      this.state.originList = originList.map(item => ({
        name: item.name,
        id: item._id,
      }));
      this.state.propertiesSet = propertiesSet;
      this.state.departmentList = departmentList;
      this.state.agencyList = agencyList.data || [];
    }
    // if (dashboardPage.chooseStock !== '') {
    //   this.setState({ isStock: dashboardPage.chooseStock });
    // } else {
    //   if (isStock !== '') {
    //     this.setState({ isStock: isStock.workingOrganization.type });
    //   }
    // }

    // });
  }

  componentDidUpdate() {
    const { addNewProductPage, dashboardPage } = this.props;
    // this.setState({
    const tagsList = addNewProductPage.tagsList || [];
    const suppliersList = addNewProductPage.suppliersList || [];
    const propertiesSet = addNewProductPage.propertiesSet || [];
    const calculateUnitList = addNewProductPage.calculateUnitList || [];
    const categoryList = addNewProductPage.categoryList || [];
    const departmentList = addNewProductPage.department || [];
    const agencyList = addNewProductPage.agency || {};
    const originList = addNewProductPage.originList || [];
    if (addNewProductPage.loading === false) {
      this.state.tagsList = tagsList.map(item => ({
        name: item.name,
        id: item._id,
      }));
      this.state.suppliersList = suppliersList.map(item => ({
        name: item.name,
        id: item._id,
      }));
      this.state.originList = originList.map(item => ({
        name: item.name,
        id: item._id,
      }));
      this.state.calculateUnitList = calculateUnitList.map(item => ({
        name: item.name,
        id: item._id,
      }));
      this.state.categoryList = categoryList.map(item => ({
        name: item.name,
        id: item._id,
        child: item.child,
      }));
      this.state.propertiesSet = propertiesSet;
      this.state.departmentList = departmentList;
      this.state.agencyList = agencyList.data || [];
    }

    if (addNewProductPage.successCreate) {
      this.props.enqueueSnackbar(
        this.props.intl.formatMessage(messages.thaoTacThanhCong || { id: 'thaoTacThanhCong', defaultMessage: 'thaoTacThanhCong' }),
        {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        },
      );

      if (!(this.props.expense || this.props.callback)) this.props.history.goBack();
      this.props.onResetNoti();
    }
    if (addNewProductPage.error) {
      this.props.enqueueSnackbar(
        addNewProductPage.message ||
        this.props.intl.formatMessage(messages.thaoTacThatBai || { id: 'thaoTacThatBai', defaultMessage: 'thaoTacThatBai' }),
        {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        },
      );
      this.props.onResetNoti();
      this.setState({ reload: new Date() * 1 })
    }
  }

  render() {

    const { value, isStock } = this.state;
    const { classes, theme, addNewProductPage, intl, dashboardPage, miniActive } = this.props;
    const stock = this.props && this.props.match && this.props.match.path;
    const addStock = stock && stock.slice(stock.length - 3, stock.length);
    // const addStock = this.props && this.props.match.params.id;

    return addNewProductPage.loading === false ? (
      <Grid container md={12} style={{ width: 'calc(100vw - 260px)' }}>
        {/* <AppBar className={addStock !== 'add' ? classes.HearderappBarAddNewProducSP : classes.HearderappBarAddNewProduc}>
              <Toolbar>
                <IconButton
                  // className={id !== 'add' ? '' : ''}
                  className={addStock !== 'add' ? classes.BTNAddNewProducSP : classes.BTNAddNewProduc}
                  color="inherit"
                  variant="contained"
                  onClick={() => this.props.history && this.props.history.goBack()}
                  aria-label="Close"
                >
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className="flex" style={{ flex: 1 }}>
                  {addStock === 'add' || this.state.productInfo === true
                    ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới sản phẩm' })}`
                    : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật sản phẩm' })}`}
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
          width={miniActive ? window.innerWidth - 80 : window.innerWidth - 260}
          title={
            addStock === 'add' || this.state.productInfo === true || addStock === undefined
              ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới sản phẩm' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật sản phẩm' })}`
          }
          onGoBack={() => {
            if (this.props.expense) {
              return this.props.expense()
            }
            this.props.history && this.props.history.goBack()
          }}
          
          onSubmit={this.handleSubmit}
          disableAdd={this.state.disableAdd}
        />
        <Paper className={classes.breadcrumbs} style={{ display: 'none' }}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/Stock">
              {intl.formatMessage(messages.kho || { id: 'kho', defaultMessage: 'kho' })}
            </Link>
            <Typography color="textPrimary">
              {intl.formatMessage(messages.chiTietSanPham || { id: 'chiTietSanPham', defaultMessage: 'chiTietSanPham' })}
            </Typography>
          </Breadcrumbs>
        </Paper>
        {/* {this.state.isStock !== 'stock' && (
          <Paper className={classes.breadcrumbs}>
            <Typography style={{ color: 'red' }}>Vui lòng chọn mục kho để tiếp tục</Typography>
          </Paper>
        )} */}

        <Grid container spacing={24}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Paper className={classes.paper} >
              <Tabs
                value={value}
                variant="scrollable"
                scrollButtons="on"
                onChange={this.handleChange}
                classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
              >
                <Tab
                  disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  label={intl.formatMessage(messages.thongTinSanPham || { id: 'thongTinSanPham', defaultMessage: 'thongTinSanPham' })}
                />
                <Tab
                  disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  label={intl.formatMessage(messages.boThuocTinh || { id: 'boThuocTinh', defaultMessage: 'boThuocTinh' })}
                />
                <Tab
                  disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  label={intl.formatMessage(messages.chinhSachGia || { id: 'chinhSachGia', defaultMessage: 'chinhSachGia' })}
                />
                <Tab
                  disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  label={intl.formatMessage(messages.tuyChinhDiemBanHang || { id: 'tuyChinhDiemBanHang', defaultMessage: 'tuyChinhDiemBanHang' })}
                />
                <Tab
                  disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  label={intl.formatMessage(messages.thongTinMoRong || { id: 'thongTinMoRong', defaultMessage: 'thongTinMoRong' })}
                />
                <Tab
                  disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  label={intl.formatMessage(messages.thongTinKhac || { id: 'thongTinKhac', defaultMessage: 'thongTinKhac' })}
                />
                {/* <Grid style={{ position: 'absolute', right: 0, bottom: '10px' }}>
                  <Button variant="contained" color="primary" className={classes.button} onClick={this.handleSubmit}>
                    {intl.formatMessage(messages.luu || { id: 'luu', defaultMessage: 'luu' })}
                  </Button>
                  <Button variant="contained" className={classes.button} onClick={this.goBack}>
                    {intl.formatMessage(messages.huy || { id: 'huy', defaultMessage: 'huy' })}
                  </Button>
                </Grid> */}
                {/* <Grid style={{ position: 'absolute', right: 0, bottom: '10px' }}>
                  <Button variant="contained" color="primary" className={classes.button} onClick={this.handleSubmit}>
                    Lưu
                  </Button>
                  <Button variant="contained" className={classes.button} onClick={this.goBack}>
                    Hủy
                  </Button>
                </Grid> */}
              </Tabs>
              <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                anchor="right"
                index={this.state.value}
                onChangeIndex={this.handleChangeIndex}

              >
                <TabContainer dir={theme.direction}>
                  <ProductInfo
                    onRef={ref => (this.productInfo = ref)}
                    productInfo={this.state.productInfo}
                    tagsList={this.state.tagsList}
                    suppliersList={this.state.suppliersList}
                    calculateUnitList={this.state.calculateUnitList}
                    categoryList={this.state.categoryList}
                    handleIsServices={this.handleIsServices}
                    originList={this.state.originList}
                    intl={intl}
                    messages={messages}
                    handleChangeIndex={this.handleChangeIndex}
                    moduleCode={this.state.moduleCode}
                    checkShowForm={this.state.checkShowForm}
                    checkRequired={this.state.checkRequired}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <SetOfAttribute
                    onRef={ref => (this.setOfAttribute = ref)}
                    setOfAttribute={this.state.setOfAttribute}
                    propertiesSet={this.state.propertiesSet}
                    intl={intl}
                    messages={messages}
                    moduleCode={this.state.moduleCode}
                    checkShowForm={this.state.checkShowForm}
                    checkRequired={this.state.checkRequired}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <PricePolicy
                    onRef={ref => (this.pricePolicy = ref)}
                    pricePolicy={this.state.pricePolicy}
                    agencyList={this.state.agencyList}
                    intl={intl}
                    messages={messages}
                    moduleCode={this.state.moduleCode}
                    checkShowForm={this.state.checkShowForm}
                    checkRequired={this.state.checkRequired}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction} >
                  <CustomSellingPoint
                    onRef={ref => (this.customSellingPoint = ref)}
                    customSellingPoint={this.state.customSellingPoint}
                    agencyList={this.state.agencyList}
                    departmentList={this.state.departmentList}
                    intl={intl}
                    messages={messages}
                    moduleCode={this.state.moduleCode}
                    checkShowForm={this.state.checkShowForm}
                    checkRequired={this.state.checkRequired}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <ExtendedInformation
                    onRef={ref => (this.extendedInformation = ref)}
                    extendedInformation={this.state.extendedInformation}
                    calculateUnitList={this.state.calculateUnitList}
                    intl={intl}
                    messages={messages}
                    moduleCode={this.state.moduleCode}
                    checkShowForm={this.state.checkShowForm}
                    checkRequired={this.state.checkRequired}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <OthersProductInfo
                    onRef={ref => (this.othersProductInfo = ref)}
                    othersProductInfo={this.state.othersProductInfo}
                    fieldAdded={this.state.fieldAdded}
                    moduleCode={this.state.moduleCode}
                    checkShowForm={this.state.checkShowForm}
                    checkRequired={this.state.checkRequired}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
              </SwipeableViews>
            </Paper>
            {/* <Button disabled={isStock !== 'stock'} variant="contained" color="primary" className={classes.button} onClick={this.handleSubmit}>
              Lưu
            </Button>
            <Button variant="contained" className={classes.button}>
              Hủy
            </Button> */}
          </Grid>
        </Grid>
        {addNewProductPage.loading ? <LoadingIndicator /> : ''}
      </Grid>
    ) : (
      <LoadingIndicator />
    );
  }

  goBack = () => {
    if (!(this.props.expense || this.props.callback)) {
      this.props.history.push({
        pathname: '/Stock',
        state: { typeOfRecord: this.props.location.state.typeOfRecord },
      });
    }
  };

  handleIsServices = () => {
    this.customSellingPoint.handleChangeIsService();
  };

  handleSubmit = () => {
    this.setState({ disableAdd: true });
    setTimeout(() => {
      this.setState({ disableAdd: false });
    }, 3000);
    this.productInfo.getData();
    this.setOfAttribute.getData();
    this.pricePolicy.getData();
    this.customSellingPoint.getData();
    this.extendedInformation.getData();
    this.othersProductInfo.getData();
    const { productInfo, setOfAttribute, pricePolicy, customSellingPoint, extendedInformation, othersProductInfo } = this.state;

    if (Object.keys(productInfo).length !== 0) {
      let size = '';
      if (productInfo.data.size !== '') {
        size = productInfo.data.size;
      }
      let unit = {};
      if (productInfo.data.calculateUnit !== '') {
        unit = {
          name: this.state.calculateUnitList[productInfo.data.calculateUnit].name,
          unitId: this.state.calculateUnitList[productInfo.data.calculateUnit].id,
        };
      }

      let catalog = {};
      if (productInfo.data.productCate !== '') {
        catalog = {
          name: productInfo.data.categoryList[productInfo.data.productCate].name,
          catalogId: productInfo.data.categoryList[productInfo.data.productCate].id,
        };
      }

      const serials = [];
      productInfo.data.serialList.forEach(item => {
        serials.push({
          serialNumber: item.serialName,
          price: item.value,
        });
      });

      let supplier = {};
      if (productInfo.data.supplier !== '') {
        supplier = {
          name: this.state.suppliersList[productInfo.data.supplier].name,
          supplierId: this.state.suppliersList[productInfo.data.supplier].id,
        };
      }

      let origin = {};
      if (productInfo.data.origin !== '') {
        origin = {
          name: this.state.originList[productInfo.data.origin].name,
          originId: this.state.originList[productInfo.data.origin].id,
        };
      }

      const agentPrice = [];
      pricePolicy.data.agencyList.forEach(item => {
        agentPrice.push({
          name: item.name,
          changePrice: item.option,
          costPrice: item.value,
        });
      });
      const taxs = [];
      pricePolicy.data.taxOption.forEach(item => {
        taxs.push({
          name: item.option.name,
          percent: item.option.value,
        });
      });
      const pricePolicyRaw = {
        sourcePrice: pricePolicy.data.costPrice,
        profitRate: pricePolicy.data.profitRate,
        costPrice: pricePolicy.data.sellPrice,
        agentPrice,
        taxs,
      };
      const sellingPoint = [];
      customSellingPoint.data.forEach(item => {
        const agentPrice = [];
        item.agencyCustom.forEach(agency => {
          agentPrice.push({
            name: agency.name,
            changePrice: agency.option,
            costPrice: agency.value,
          });
        });
        const sellingPointPricePolicy = {
          status: item.isCustom,
          sourcePrice: item.costPrice,
          costPrice: item.sellPrice,
          agentPrice,
        };
        const sale = {
          status: item.isSale,
          salePrice: item.salePrice,
          startDayForSale: item.startDayForSale,
          endDayOfSale: item.endDayForSale,
        };
        const taxs = [];
        if (item.taxOptions.length > 0) {
          item.taxOptions.forEach(tax => {
            taxs.push({
              name: tax.option.name,
              percent: tax.option.value,
            });
          });
        }

        const taxTitle = {
          status: item.isCustomTax,
          taxs,
        };
        sellingPoint.push({
          name: item.name,
          organizationUnitId: item.id,
          amount: item.currentQuantity,
          additions: 0,
          miximumSell: item.orderLimit,
          maximumLimit: item.maximumLimit,
          adress: item.address,
          sellingPointPricePolicy,
          sale,
          taxTitle,
        });
      });

      const unitChange = [];
      extendedInformation.data.convertUnitArr.forEach(item => {
        unitChange.push({
          from: {
            unit: item.nameUnitOriginal,
            unitId: item.idUnitOriginal,
          },
          to: {
            unitId: item.idUnitExchange,
            unit: item.nameUnitExchange,
          },
          numberExchange: item.numberExchange,
          sourcePrice: item.costPriceAfterExchange,
          costPrice: item.sellPriceAfterExchange,
        });
      });
      const additionalItems = [];
      extendedInformation.data.codeOptions.forEach(item => {
        additionalItems.push(item.key);
      });
      const otherInfo = {
        taxInclude: extendedInformation.data.statusPrice,
        commission: {
          status: extendedInformation.data.statusTitleMoney,
          titleMoney: extendedInformation.data.titleMoney,
          methodMoney: extendedInformation.data.methodMoney,
          promotionPrice: extendedInformation.data.commission,
        },
        maximumLimit: extendedInformation.data.maximumLimit > 0 ? extendedInformation.data.maximumLimit : 0,
        limitOrder: extendedInformation.data.orderLimit > 0 ? extendedInformation.data.orderLimit : 0,
        isSale: extendedInformation.data.isSale,
        salePrice: extendedInformation.data.salePrice,
        startDayForSale: extendedInformation.data.startDayForSale,
        endDayForSale: extendedInformation.data.endDayForSale,
        isUnitChange: extendedInformation.data.transferUnit,
        expirationDate: extendedInformation.data.dateExpire,
        unitChange,
        additionalItems,
      };
      const others = {};
      if (othersProductInfo.data.fieldAdded.length > 0) {
        othersProductInfo.data.fieldAdded.forEach(item => {
          others[item.name.replace('others.', '')] = item.value;
        });
      }
      
      // eslint-disable-next-line no-unused-vars
      const body = {
        avatar: productInfo.data.avatar,
        avatarURL: productInfo.data.avatarURL,
        name: productInfo.data.name,
        code: productInfo.data.code,
        barcode: productInfo.data.barcode,
        isService: productInfo.data.optionsInfo.isServices,
        isDescription: productInfo.data.optionsInfo.isDescribe,
        isDisplaySourcePrice: productInfo.data.optionsInfo.displayCaptital,
        isSerial: productInfo.data.optionsInfo.isSeri,
        tags: productInfo.data.tags !== '' ? this.state.tagsList[productInfo.data.tags].id : null ,
        size,
        unit: unit !== {} ? unit : {},
        catalog,
        serials,
        origin,
        // description: productInfo.data.describe,
        description: productInfo.data.description,
        supplier,
        attributeSet: setOfAttribute.data || {},
        pricePolicy: pricePolicyRaw,
        sellingPoint,
        otherInfo,
        expense: this.props.expense,
        callback: this.props.callback,
        others,
        warrantyPeriod: productInfo.data.warrantyPeriod,
        warrantyPeriodUnit: productInfo.data.warrantyPeriodUnit,
        allowedSellingOrganization: customSellingPoint.allowedSellingOrganization,
        allowedUsers: customSellingPoint.allowedUsers || [],
      };

      let messages = {};
      messages = Object.assign(productInfo.data.localMessages, pricePolicy.data.localMessages, extendedInformation.data.localMessages);
      console.log(messages, "messages")
      if (Object.keys(messages).length === 0) {
        this.props.onAddNewProduct(body);
      } else {
        this.props.onChangeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' });
      }
      // const rex = /^[A-Za-z0-9]+$/;
      // if (
      //   body.name.trim() !== '' &&
      //   body.name.trim().length < 200 &&
      //   body.code.trim() !== '' &&
      //   rex.test(body.code.trim()) &&
      //   Object.keys(body.unit).length !== 0
      // ) {
      //   this.props.onAddNewProduct(body);
      // }
    }
    // if (this.props.expense) this.props.expense();
  };
}

AddNewProductPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
  theme: PropTypes.object,
};
TabContainer.propTypes = {
  children: PropTypes.object,
  dir: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  addNewProductPage: makeSelectDetailProductPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetTags: () => {
      dispatch(getTagsAct());
    },
    onAddNewProduct: body => {
      dispatch(addNewProductAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'addNewProductPage', reducer });
const withSaga = injectSaga({ key: 'addNewProductPage', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles, { withTheme: true }),
)(AddNewProductPage);
