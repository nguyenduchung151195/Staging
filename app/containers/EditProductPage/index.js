/**
 *
 * editProductPage
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
import messages from './messages';
import CustomAppBar from 'components/CustomAppBar';
import { API_STOCK } from '../../config/urlConfig';
// import InputBase from '@material-ui/core/InputBase';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
// import SearchIcon from '@material-ui/icons/Search';
import { withSnackbar } from 'notistack';
import SwipeableViews from 'react-swipeable-views';
// import Accordion from 'components/Accordion/Accordion';
import { Link } from 'react-router-dom';
// import ImageUpload from 'components/CustomUpload/ImageUpload';
import ListPage from '../../components/List';
import saga from './saga';
import reducer from './reducer';
import makeSelectDetailProductPage from './selectors';
import styles from './styles';
import LoadingIndicator from '../../components/LoadingIndicator';
import EditProductInfo from '../../components/EditProductInfo';
import EditSetOfAttributeForProduct from '../../components/EditSetOfAttributeForProduct';
import IconButton from '@material-ui/core/IconButton';

import EditPricePolicy from '../../components/EditPricepolicy';
import EditCustomSellingPoint from '../../components/EditCustomSellingPoint';
import EditExtendedInformation from '../../components/EditExtendedInformation';
import OthersProductInfo from '../../components/OthersProductInfo';
import { getTagsAct, editProductAct, resetNoti, getProductAct } from './actions';
import { viewConfigCheckForm, viewConfigCheckRequired, viewConfigHandleOnChange } from 'utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import { viewConfigName2Title } from '../../utils/common';
function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3, overflow: 'hidden' }}>
      {children}
    </Typography>
  );
}
/* eslint-disable react/prefer-stateless-function */
export class editProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.productInfo = React.createRef();
    this.setOfAttribute = React.createRef();
    this.pricePolicy = React.createRef();
    this.customSellingPoint = React.createRef();
    this.extendedInformation = React.createRef();
    this.othersProductInfo = React.createRef();
    this.state = {
      value: 0,
      product: {},
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
      allowedSellingOrganization: [],
      moduleCode: 'Stock',
      checkRequired: viewConfigCheckRequired('Stock', 'required'),
      checkShowForm: viewConfigCheckRequired('Stock', 'showForm'),
      name2Title: {},
      disableAdd: false,
    };
  }

  componentWillUnmount() {
    this.state.product = {};
  }

  componentWillMount() {
    this.props.onGetTags();
    const { match } = this.props;
    if (match.params.id) {
      this.props.onGetProduct(match.params.id);
    }
  }

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

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  componentWillReceiveProps(props) {
    const { editProductPage } = props;
    // console.log(88888, editProductPage);
    // this.setState({

    if (editProductPage.product) {
      // this.state.product = editProductPage.product || {};
      this.setState({
        product: editProductPage.product,
        // customSellingPoint: editProductPage.product.sellingPoint,
      });
    }

    const tagsList = editProductPage.tagsList || [];
    const suppliersList = editProductPage.suppliersList || [];
    const propertiesSet = editProductPage.propertiesSet || [];
    const calculateUnitList = editProductPage.calculateUnitList || [];
    const categoryList = editProductPage.categoryList || [];
    const departmentList = editProductPage.department || [];
    const agencyList = editProductPage.agency || {};
    const originList = editProductPage.originList || [];
    // const allowedSellingOrganization = (editProductPage.product && editProductPage.product.allowedSellingOrganization) || [];

    if (editProductPage.loading === false) {
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
      // this.setState({
      //   allowedSellingOrganization,
      // });
    }
    // });
  }

  componentDidUpdate(props) {
    const { editProductPage } = props;
    if (editProductPage.product) {
      this.state.product = editProductPage.product || {};
    }

    if (this.props.editProductPage.successCreate) {
      this.props.enqueueSnackbar('Thao tác thành công!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.history.goBack();
      this.props.onResetNoti();
    }
    if (this.props.editProductPage.error) {
      this.props.enqueueSnackbar('Thao tác thất bại!', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.onResetNoti();
    }
    // this.setState({
    const tagsList = editProductPage.tagsList || [];
    const suppliersList = editProductPage.suppliersList || [];
    const propertiesSet = editProductPage.propertiesSet || [];
    const calculateUnitList = editProductPage.calculateUnitList || [];
    const categoryList = editProductPage.categoryList || [];
    const departmentList = editProductPage.department || [];
    const agencyList = editProductPage.agency || {};
    const originList = editProductPage.originList || [];
    if (editProductPage.loading === false) {
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
    // console.log('xxxx', editProductPage.successCreate);
  }

  mapLog(item) {
    return item;
  }

  render() {
    const { value } = this.state;
    const { classes, theme, editProductPage, intl } = this.props;
    const nameAdd = this.props ? this.props : this.props.match.path;
    const stock = nameAdd.match.path;
    const addStock = stock.slice(stock.length - 3, nameAdd.length);
    return editProductPage.loading === false ? (
      <div>
        <CustomAppBar
          title={
            addStock === 'add'
              ? `${intl.formatMessage(messages.themmoi || { id: 'themmoi', defaultMessage: 'Thêm mới kho' })}`
              : `${intl.formatMessage(messages.chinhsua || { id: 'chinhsua', defaultMessage: 'cập nhật sản phẩm' })}`
          }
          onGoBack={this.goBack}
          onSubmit={this.handleSubmit}
          disableAdd={this.state.disableAdd}
        />
        <Paper className={classes.breadcrumbs} style={{ display: 'none' }}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/Stock">
              Kho
            </Link>
            <Typography color="textPrimary">Chi tiết sản phẩm</Typography>
          </Breadcrumbs>
        </Paper>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Paper className={classes.paper}>
              <Tabs
                value={value}
                variant="scrollable"
                scrollButtons="on"
                onChange={this.handleChange}
                classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
              >
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Thông tin sản phẩm" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Bộ thuộc tính" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Chính sách giá" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Cài đặt kho & điểm bán hàng" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Thông tin mở rộng" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Thông tin khác" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Lịch sử" />
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
                index={this.state.value}
                onChangeIndex={this.handleChangeIndex}
                width={window.innerWidth - 260}
              >
                <TabContainer dir={theme.direction}>
                  <EditProductInfo
                    onRef={ref => (this.productInfo = ref)}
                    product={this.state.product}
                    productInfo={this.state.productInfo}
                    tagsList={this.state.tagsList}
                    isEdit={editProductPage.isEdit}
                    suppliersList={this.state.suppliersList}
                    calculateUnitList={this.state.calculateUnitList}
                    categoryList={this.state.categoryList}
                    handleIsServices={this.handleIsServices}
                    originList={this.state.originList}
                    handleChangeIndex={this.handleChangeIndex}
                    checkRequired={this.state.checkRequired}
                    checkShowForm={this.state.checkShowForm}
                    moduleCode={this.state.moduleCode}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <EditSetOfAttributeForProduct
                    onRef={ref => (this.setOfAttribute = ref)}
                    product={this.state.product}
                    isEdit={editProductPage.isEdit}
                    setOfAttribute={this.state.setOfAttribute}
                    propertiesSet={this.state.propertiesSet}
                    checkRequired={this.state.checkRequired}
                    checkShowForm={this.state.checkShowForm}
                    moduleCode={this.state.moduleCode}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <EditPricePolicy
                    onRef={ref => (this.pricePolicy = ref)}
                    product={this.state.product}
                    pricePolicy={this.state.pricePolicy}
                    isEdit={editProductPage.isEdit}
                    agencyList={this.state.agencyList}
                    checkRequired={this.state.checkRequired}
                    checkShowForm={this.state.checkShowForm}
                    moduleCode={this.state.moduleCode}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <EditCustomSellingPoint
                    onRef={ref => (this.customSellingPoint = ref)}
                    product={this.state.product}
                    customSellingPoint={this.state.customSellingPoint}
                    isEdit={editProductPage.isEdit}
                    agencyList={this.state.agencyList}
                    departmentList={this.state.departmentList}
                    // allowedSellingOrganization={this.state.allowedSellingOrganization}
                    checkRequired={this.state.checkRequired}
                    checkShowForm={this.state.checkShowForm}
                    moduleCode={this.state.moduleCode}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <EditExtendedInformation
                    onRef={ref => (this.extendedInformation = ref)}
                    product={this.state.product}
                    extendedInformation={this.state.extendedInformation}
                    isEdit={editProductPage.isEdit}
                    calculateUnitList={this.state.calculateUnitList}
                    checkRequired={this.state.checkRequired}
                    checkShowForm={this.state.checkShowForm}
                    moduleCode={this.state.moduleCode}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <OthersProductInfo
                    onRef={ref => (this.othersProductInfo = ref)}
                    othersProductInfo={this.state.othersProductInfo}
                    product={this.state.product}
                    fieldAdded={this.state.fieldAdded}
                    checkRequired={this.state.checkRequired}
                    checkShowForm={this.state.checkShowForm}
                    moduleCode={this.state.moduleCode}
                    name2Title={this.state.name2Title}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <>
                    {this.state.product._id && (
                      <ListPage
                        parentCode="Stock"
                        disableEdit
                        disableAdd
                        disableSelect
                        disableSearch
                        code="InventoryLog"
                        apiUrl={`${API_STOCK}/log/list`}
                        filter={{ productId: this.state.product._id }}
                        mapFunction={this.mapLog}
                      />
                    )}
                  </>
                </TabContainer>
              </SwipeableViews>
            </Paper>
            {/* <Button variant="contained" color="primary" className={classes.button} onClick={this.handleSubmit}>
              Lưu
            </Button>
            <Button variant="contained" className={classes.button}>
              Hủy
            </Button> */}
          </Grid>
        </Grid>
        {editProductPage.loading ? <LoadingIndicator /> : ''}
      </div>
    ) : (
      <LoadingIndicator />
    );
  }

  goBack = () => {
    this.props.history.push({
      pathname: '/Stock',
      state: { typeOfRecord: this.props.location.state.typeOfRecord },
    });
  };

  handleIsServices = () => {
    this.customSellingPoint.handleChangeIsService();
  };

  handleSubmit = () => {
    this.setState({ disableAdd: true });
    setTimeout(() => {
      this.setState({ disableAdd: false });
    }, 3000);
    const { editProductPage } = this.props;
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
      // let tags = {}
      // if (productInfo.data.tags !== '') {
      //   tags = {
      //     name: this.state.tagsList[productInfo.data.tags].bane,
      //     tagsId: this.state.tagsList[productInfo.data.tags].id
      //   }
      // }
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
          amount: parseInt(item.currentQuantity, 10) + parseInt(item.inventoryChange, 10),
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
      
      let salePrice = 0
      
      if (extendedInformation.data.salePrice) {
        salePrice = extendedInformation.data.salePrice
        salePrice = salePrice.toString().replaceAll(",", "")
      }
      const otherInfo = {
        taxInclude: extendedInformation.data.statusPrice,
        commission: {
          status: extendedInformation.data.statusTitleMoney,
          titleMoney: extendedInformation.data.titleMoney,
          methodMoney: extendedInformation.data.methodMoney,
          promotionPrice: extendedInformation.data.commission,
        },
        limitOrder: extendedInformation.data.orderLimit > 0 ? extendedInformation.data.orderLimit : 0,
        maximumLimit: extendedInformation.data.maximumLimit > 0 ? extendedInformation.data.maximumLimit : 0,
        isSale: extendedInformation.data.isSale,
        // salePrice: extendedInformation.data.salePrice,
        salePrice: salePrice,
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
      // console.log(productInfo);
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
        tags: productInfo.data.tags !== '' ? this.state.tagsList[productInfo.data.tags].id : [],
        unit,
        id: this.props.match.params.id,
        catalog,
        serials,
        origin,
        size,
        description: productInfo.data.description,
        supplier,
        attributeSet: setOfAttribute.data || {},
        pricePolicy: pricePolicyRaw,
        sellingPoint: editProductPage && editProductPage.product && editProductPage.product.sellingPoint,
        otherInfo,
        logo: productInfo.data.avatarURL,
        others,
        warrantyPeriod: productInfo.data.warrantyPeriod,
        allowedSellingOrganization: customSellingPoint.allowedSellingOrganization || [],
        allowedUsers: customSellingPoint.allowedUsers || [],
      };
      // console.log('body',body);
      // console.log('customSellingPoint',customSellingPoint);
      // console.log(body, "body")
      let messages = {};
      messages = Object.assign(productInfo.data.localMessages, pricePolicy.data.localMessages, extendedInformation.data.localMessages);
      if (Object.keys(messages).length === 0) {
        this.props.onEditproduct(body);
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
      //   this.props.onEditproduct(body);
      // }
    }
  };
}

editProductPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
  theme: PropTypes.object,
};
TabContainer.propTypes = {
  children: PropTypes.object,
  dir: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  editProductPage: makeSelectDetailProductPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetTags: () => {
      dispatch(getTagsAct());
    },
    onEditproduct: body => {
      dispatch(editProductAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onGetProduct: id => {
      dispatch(getProductAct(id));
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

const withReducer = injectReducer({ key: 'editProductPage', reducer });
const withSaga = injectSaga({ key: 'editProductPage', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles, { withTheme: true }),
)(editProductPage);
