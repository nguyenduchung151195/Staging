/**
 *
 * assetPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import classnames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withStyles, Grid, Paper, Typography, Tab, Tabs, Button, Stepper, Step, StepLabel } from '@material-ui/core';
import { Breadcrumbs } from '@material-ui/lab';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withSnackbar } from 'notistack';
import SwipeableViews from 'react-swipeable-views';
import { Link } from 'react-router-dom';
import LoadingIndicator from 'components/LoadingIndicator';
import saga from '../saga';
import reducer from '../reducer';
import makeSelectDetailAssetPage from '../selectors';
import styles from './styles';
import EditAssetInfo from './tabs/EditAssettInfo/Loadable';
import EditAssetAttribute from './tabs/EditAssetAttribute/Loadable';
import EditAssetAdditionalInfo from './tabs/EditAssetAdditionalInfo/Loadable';
import EditAssetDepreciation from './tabs/EditAssetDepreciation/Loadable';
import EditAssetTransfer from './tabs/EditAssetTransfer/Loadable';
import EditAssetEquipment from './tabs/EditAssetEquipment/Loadable';
import { getTagsAct, editAssetAct, resetNoti, getAssetAct, cleanup } from '../actions';
import request from '../../../../utils/request';
import { API_ASSET, API_ASSET_ALLOCATE_LOG } from '../../../../config/urlConfig';
import EditCustomSellingPoint from '../../../../components/EditCustomSellingPoint';
import { viewConfigName2Title, viewConfigCheckRequired, viewConfigHandleOnChange } from 'utils/common';
import makeSelectDashboardPage from '../../../Dashboard/selectors';
import messages from './messages';
import CustomAppBar from 'components/CustomAppBar';
import ListPage from '../../../../components/List';
import { MODULE_CODE } from '../../../../utils/constants';
import { changeSnackbar } from '../../../Dashboard/actions';
function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3, overflow: 'auto', height: 700 }}>
      {children}
    </Typography>
  );
}

/* eslint-disable react/prefer-stateless-function */
export class EditAssetPage extends React.Component {
  constructor(props) {
    super(props);
    this.assetInfo = React.createRef();
    this.setOfAttribute = React.createRef();
    this.equipments = React.createRef();
    this.othersAssetInfo = React.createRef();
    this.transfer = React.createRef();

    this.state = {
      isStock: '',
      value: 0,
      asset: {},
      tagsList: [],
      suppliersList: [],
      propertiesSet: [],
      calculateUnitList: [],
      categoryList: [],
      departmentList: [],
      agencyList: [],
      originList: [],
      setOfAttribute: {},
      othersAssetInfo: {},
      transfer: {},
      customSellingPoint: {},
      assetIds: [],
      fieldAdded: [],
      level: 0,
      checkRequired: viewConfigCheckRequired(MODULE_CODE.Asset, 'required'),
      checkShowForm: viewConfigCheckRequired(MODULE_CODE.Asset, 'showForm'),
      name2Title: viewConfigName2Title(MODULE_CODE.Asset),
      moduleCode: MODULE_CODE.Asset,
    };
  }

  componentDidMount() {
    const { match, dashboardPage, onGetAsset, onGetTags } = this.props;
    onGetTags();
    if (match.params.id && match.params.id !== 'add') {
      onGetAsset(match.params.id);
    } else {
      if (dashboardPage) {
        const isStock = dashboardPage.currentUser || '';
        if (dashboardPage.chooseStock !== '') {
          this.setState({ isStock: dashboardPage.chooseStock });
        } else {
          if (isStock !== '') {
            this.setState({ isStock: isStock.workingOrganization.type });
          }
        }
      }
    }

    const listViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const currentViewConfig = listViewConfig.find(item => item.code === MODULE_CODE.Asset);
    if (currentViewConfig && this.state.fieldAdded.length === 0) {
      const fieldAdded = currentViewConfig.listDisplay.type.fields.type.others;
      const addVaue = fieldAdded.map(item => ({
        ...item,
        value: '',
      }));
      this.setState({ fieldAdded: addVaue });
    }
  }

  componentWillUnmount() {
    this.props.cleanup();
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  componentDidUpdate(preProps) {
    const { match, assetPage, dashboardPage } = this.props;
    if (assetPage.successCreate !== preProps.assetPage.successCreate && assetPage.successCreate) {
      this.props.history.goBack();
    }

    if (match.params.id && match.params.id === 'add' && dashboardPage && preProps.dashboardPage != dashboardPage) {
      const isStock = dashboardPage.currentUser || '';
      if (dashboardPage.chooseStock !== '') {
        this.setState({ isStock: dashboardPage.chooseStock });
      } else {
        if (isStock !== '') {
          this.setState({ isStock: isStock.workingOrganization.type });
        }
      }
    }
  }

  goBack = () => {
    if (this.props.match.params.id === 'add') {
      const equipments = this.equipments.getData();
      if (equipments.length > 0) {
        request(API_ASSET, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: equipments }),
        }).then(respon => {
          // eslint-disable-next-line eqeqeq
          this.props.history.goBack();
        });
      } else {
        this.props.history.goBack();
      }
    } else {
      this.props.history.goBack();
    }
  };

  handleSubmit = () => {
    const assetInfo = this.assetInfo.getData();
    const attribute = this.setOfAttribute.getData();
    const depreciation = this.depreciation.getData();
    const othersAssetInfo = this.othersAssetInfo.getData();
    const transfer = this.transfer.getData();
    const equipments = this.equipments.getData();
    this.customSellingPoint.getData();
   
    if (assetInfo) {
      const id = this.props.match.params.id;
      const { customSellingPoint } = this.state;
      const others = {};
      if (othersAssetInfo.fieldAdded.length > 0) {
        othersAssetInfo.fieldAdded.forEach(item => {
          others[item.name.replace('others.', '')] = item.value;
        });
      }

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

      // eslint-disable-next-line no-unused-vars
      const body = {
        _id: id === 'add' ? undefined : id,
        ...assetInfo,
        ...attribute,
        ...depreciation,
        ...transfer,
        sellingPoint,
        allowedSellingOrganization: customSellingPoint.allowedSellingOrganization || [],
        allowedUsers: customSellingPoint.allowedUsers || [],
        assetIds: equipments,
        others,
      };
      const rex = /^[A-Za-z0-9]+$/;
      // if (
      //   body.name.trim() !== '' &&
      //   body.name.trim().length < 200 &&
      //   body.code.trim() !== '' &&
      //   rex.test(body.code.trim()) &&
      //   Object.keys(body.unit).length !== 0
      // ) {
      this.props.onEditAsset(body);
      // console.error(body);
      //}
    } else {
        this.props.onChangeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' });
    }
  };
  getLevelBy = value => {
    switch (Number(value)) {
      case 0:
        return 'Chưa cấp phát';
      case 1:
        return 'Đã cấp phát';
      case 2:
        return 'Thu hồi';
    }
  };

  mapFunctionProject = item => {
    return {
      ...item,
      level: item.level ? getLevelBy(item.level) : 'Chưa cấp phát',
      type: item['type.name'] || '',
    };
  };

  render() {
    const { value, isStock } = this.state;
    const { classes, theme, assetPage, match } = this.props;
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    
    return assetPage.isLoading === false ? (
      <div>
        <CustomAppBar title={id === 'add' ? 'Thêm mới quản lý tài sản' : 'cập nhật quản lý tài sản'} onGoBack={this.goBack} onSubmit={this.handleSubmit} />
        {/* <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/Stock/Asset">
              Tài sản
            </Link>
            <Typography color="textPrimary">Chi tiết tài sản</Typography>
          </Breadcrumbs>
        </Paper> */}
        {/* {(match.params.id === 'add' && isStock !== 'stock') && (
          <Paper className={classes.breadcrumbs}>
            <Typography style={{ color: 'red' }}>Vui lòng chọn mục kho để tiếp tục</Typography>
          </Paper>
        )} */}

        <Paper >
          {/* <Grid container spacing={24}> */}
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Tabs
                value={value}
                variant="scrollable"
                scrollButtons="on"
                onChange={this.handleChange}
                classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
              >
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Thông tin tài sản" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Thông số kĩ thuật" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Khấu hao" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Điều chuyển kho" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Cài đặt kho & điểm bán hàng" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Thông tin khác" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Thiết bị tài sản" />
                <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Nhật ký tài sản" />
              </Tabs>
              <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={this.state.value} onChangeIndex={this.handleChangeIndex}>
                <TabContainer dir={theme.direction}>
                  <EditAssetInfo
                    onRef={ref => (this.assetInfo = ref)}
                    asset={assetPage.asset}
                    suppliers={assetPage.suppliersList || []}
                    units={assetPage.calculateUnitList || []}
                    assetTypes={assetPage.assetTypes || []}
                    handleChangeIndex={this.handleChangeIndex}
                    onSubmit={this.handleSubmitInfo}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <EditAssetAttribute
                    onRef={ref => (this.setOfAttribute = ref)}
                    asset={assetPage.asset}
                    propertiesSet={assetPage.propertiesSet || []}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <EditAssetDepreciation
                    onRef={ref => (this.depreciation = ref)}
                    asset={assetPage.asset}
                    // isEdit={assetPage.isEdit}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <EditAssetTransfer
                    onRef={ref => (this.transfer = ref)}
                    asset={assetPage.asset}
                    // isEdit={assetPage.isEdit}
                  />
                </TabContainer>
                <TabContainer>
                  <EditCustomSellingPoint
                    onRef={ref => (this.customSellingPoint = ref)}
                    product={assetPage.asset || {}}
                    customSellingPoint={this.state.customSellingPoint}
                    isEdit={assetPage.isEdit}
                    agencyList={assetPage.agency ? assetPage.agency.data : []}
                    departmentList={assetPage.department || []}
                    // allowedSellingOrganization={this.state.allowedSellingOrganization}
                    checkRequired={this.state.checkRequired}
                    checkShowForm={this.state.checkShowForm}
                    moduleCode={this.state.moduleCode}
                    name2Title={this.state.name2Title}
                  />
                  
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <EditAssetAdditionalInfo
                    onRef={ref => (this.othersAssetInfo = ref)}
                    asset={assetPage.asset}
                    fieldAdded={this.state.fieldAdded}
                    // isEdit={assetPage.isEdit}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  <EditAssetEquipment
                    onRef={ref => (this.equipments = ref)}
                    asset={assetPage.asset}
                    suppliers={assetPage.suppliersList}
                    units={assetPage.calculateUnitList}
                  />
                </TabContainer>
                <TabContainer dir={theme.direction}>
                  {assetPage.asset && (
                    <ListPage
                      code="AssetAllocationHistory"
                      apiUrl={API_ASSET_ALLOCATE_LOG}
                      filter={{ assetId: assetPage.asset._id }}
                      disableEdit
                      disableAdd
                      // disableConfig
                      disableSearch
                      disableSelect
                      exportExcel
                    />
                  )}
                </TabContainer>
              </SwipeableViews>
            </Grid>
            {/* <Grid item xs={12}>
              <Grid container justify="flex-end">
                <Button variant="contained" color="primary" className={classes.button} onClick={this.handleSubmit}>
                  Lưu
                </Button>
                <Button variant="contained" className={classes.button} onClick={this.goBack}>
                  Hủy
                </Button>
              </Grid>
            </Grid> */}
          {/* </Grid> */}
        </Paper>

        {assetPage.loading ? <LoadingIndicator /> : ''}
      </div>
    ) : (
      <LoadingIndicator />
    );
  }
}

EditAssetPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
  theme: PropTypes.object,
};
TabContainer.propTypes = {
  children: PropTypes.object,
  dir: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  assetPage: makeSelectDetailAssetPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetTags: () => {
      dispatch(getTagsAct());
    },
    onEditAsset: body => {
      dispatch(editAssetAct(body));
    },
    onGetAsset: id => {
      dispatch(getAssetAct(id));
    },
    cleanup: () => {
      dispatch(cleanup());
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

const withReducer = injectReducer({ key: 'assetPage', reducer });
const withSaga = injectSaga({ key: 'assetPage', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles, { withTheme: true }),
)(EditAssetPage);
