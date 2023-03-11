/**
 *
 * StockConfigPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Paper, Tabs, Tab, Typography, withStyles } from '@material-ui/core';
import { Breadcrumbs } from '@material-ui/lab';
import SwipeableViews from 'react-swipeable-views';
import { Link } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withSnackbar } from 'notistack';
import makeSelectStockConfigPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import Category from '../../components/Category';
import LabelList from '../../components/LabelList';
import UnitStock from '../../components/UnitStock';
import Services from '../../components/Services';
import Origin from '../../components/InventoryOrigin';
import AssetType from '../../components/AssetType';

import { changeSnackbar } from '../Dashboard/actions';

// import Providers from '../../components/Provider';
import {
  fetchAllUnitsAction,
  addUnitAction,
  deleteUnitsAction,
  updateUnitsAction,
  getAllServicesAction,
  addServiceAction,
  deleteServicesAction,
  fetchAllCategoryAction,
  resetNotis,
  updateServiceAction,
  addCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  fetchAllTagsAction,
  addTagAction,
  deleteTagsAction,
  updateTagsAction,
  fetchAllAssetTypeAction,
  addAssetTypeAction,
  deleteAssetTypeAction,
  updateAssetTypeAction,
  addOriginAction,
  updateOriginAction,
  deleteOriginAction,
  fetchAllOriginAction,
} from './actions';
function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

/* eslint-disable react/prefer-stateless-function */
export class StockConfigPage extends React.Component {
  state = {
    value: 0,
    listUnits: [],
    listServices: [],
    listCategories: [],
    listTags: [],
    listOrigin: [],
    listAssetType: [],
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  componentDidMount() {
    this.props.onGetUnits();
    this.props.onGetServices();
    this.props.onGetCategories();
    this.props.onGetOrigins();
    this.props.onGetTags();
    this.props.onGetAssetType();
    if (this.props.location.state) {
      const newValue = this.props.location.state.index;
      this.setState({ value: newValue })
    }
    console.log('this.props', this.props);
  }
  componentWillReceiveProps(props) {
    const { stockConfigPage } = props;
    this.state.listAssetType = stockConfigPage.assetTypes;
  }

  componentWillUpdate(props) {
    const { stockConfigPage } = props;
    // console.log(11111, stockConfigPage);
    this.state.listUnits = stockConfigPage.units;
    this.state.listServices = stockConfigPage.services;
    this.state.listCategories = stockConfigPage.categories;
    this.state.listOrigin = stockConfigPage.origins;

    // if (this.state.listCategories !== undefined) {
    //   const treedata = getTreeFromFlatData({
    //     flatData: this.state.listCategories.map(node => ({ ...node, title: node.name, expanded: true })),
    //     getKey: node => node._id, // resolve a node's key
    //     getParentKey: node => node.parent, // resolve a node's parent's key
    //     rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
    //   });
    //   this.state.treeData = treedata;
    //   console.log(JSON.stringify(this.state.treeData));
    // }

    this.state.listTags = stockConfigPage.tags;
    this.state.listAssetType = stockConfigPage.assetTypes;

    if (stockConfigPage.callAPIStatus === 1) {
      this.props.enqueueSnackbar(stockConfigPage.notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'success',
      });
    }
    if (stockConfigPage.callAPIStatus === 0) {
      this.props.enqueueSnackbar(stockConfigPage.notiMessage, {
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

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'add-unit': {
        this.props.onAddUnit(data);
        break;
      }
      case 'update-unit': {
        this.props.onUpdateUnit(data);
        break;
      }
      case 'delete-unit': {
        this.props.onDeleteUnit(data._id);

        break;
      }
      case 'add-service': {
        this.props.onAddService(data);
        break;
      }
      case 'update-service': {
        this.props.onUpdateService(data);
        break;
      }
      case 'delete-services': {
        this.props.onDeleteServices(data);

        break;
      }
      case 'add-category': {
        this.props.onAddCategory(data);

        break;
      }
      case 'update-category': {
        this.props.onUpdateCategory(data);

        break;
      }
      case 'delete-category': {
        this.props.onDeleteCategory(data._id);

        break;
      }
      case 'add-tag': {
        this.props.onAddTag(data);

        break;
      }
      case 'update-tag': {
        this.props.onUpdateTag(data);

        break;
      }
      case 'delete-tag': {
        this.props.onDeleteTag(data._id);

        break;
      }
      case 'add-asset-type': {
        this.props.onAddAssetType(data);
        break;
      }
      case 'update-asset-type': {
        this.props.onUpdateAssetType(data);

        break;
      }
      case 'delete-asset-type': {
        this.props.onDeleteAssetType(data._id);

        break;
      }
      case 'add-origin': {
        this.props.onAddOrigin(data);

        break;
      }
      case 'update-origin': {
        this.props.onUpdateOrigin(data);

        break;
      }
      case 'delete-origin': {
        this.props.onDeleteOrigin(data._id);

        break;
      }
      default:
        break;
    }
  };

  render() {
    const { classes, theme } = this.props;
    const { value } = this.state;
    return (
      <div >
        <Helmet>
          <title>Cấu hình kho</title>
          <meta name="description" content="Description of StockConfigPage" />
        </Helmet>
        <Paper className={classes.breadcrumbs}>
          <Breadcrumbs aria-label="Breadcrumb">
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
              Dashboard
            </Link>
            <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/stock">
              Kho
            </Link>
            <Typography color="textPrimary">Cấu hình kho</Typography>
          </Breadcrumbs>
        </Paper>
        <Paper className={classes.paper}>
          <Tabs
            value={value}
            variant="scrollable"
            scrollButtons="on"
            onChange={this.handleChange}
            classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          >
            <Tab disableRipple value={0} classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Danh mục" />
            <Tab disableRipple value={1} classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Loại" />
            <Tab disableRipple value={2} classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Loại tài sản" />
            <Tab disableRipple value={3} classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Dịch vụ" />
            <Tab disableRipple value={4} classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Đơn vị tính" />
            <Tab disableRipple value={5} classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Xuất xứ" />
            {/* <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Đại lý" /> */}
          </Tabs>
          <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={this.state.value} onChangeIndex={this.handleChangeIndex} width={window.innerWidth - 260}>
            <TabContainer dir={theme.direction}>
              {
                this.state.value === 0 && <Category callBack={this.callBack} data={this.state.listCategories} />
              }
            </TabContainer>
            <TabContainer dir={theme.direction}>
              {
                this.state.value === 1 && <LabelList onChangeSnackbar={this.props.onChangeSnackbar} callBack={this.callBack} data={this.state.listTags} />
              }
            </TabContainer>
            <TabContainer dir={theme.direction}>
              {
                this.state.value === 2 && <AssetType callBack={this.callBack} data={this.state.listAssetType} />
              }
            </TabContainer>
            <TabContainer dir={theme.direction}>
              {
                this.state.value === 3 && (this.state.listServices ? <Services callBack={this.callBack} data={this.state.listServices} /> : '')
              }
            </TabContainer>
            <TabContainer dir={theme.direction}>
              {
                this.state.value === 4 && <UnitStock data={this.state.listUnits} callBack={this.callBack} />
              }
            </TabContainer>
            <TabContainer dir={theme.direction}>
              {
                this.state.value === 5 && <Origin callBack={this.callBack} data={this.state.listOrigin} />
              }
            </TabContainer>
          </SwipeableViews>
        </Paper>
      </div>
    );
  }
}

StockConfigPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object,
  theme: PropTypes.object,
};

TabContainer.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  dir: PropTypes.string,
  children: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  stockConfigPage: makeSelectStockConfigPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetUnits: () => {
      dispatch(fetchAllUnitsAction());
    },
    onAddUnit: data => {
      dispatch(addUnitAction(data));
    },
    onDeleteUnit: unit => {
      dispatch(deleteUnitsAction(unit));
    },
    onUpdateUnit: unit => {
      dispatch(updateUnitsAction(unit));
    },
    onGetServices: () => {
      dispatch(getAllServicesAction());
    },
    onAddService: data => {
      dispatch(addServiceAction(data));
    },
    onUpdateService: service => {
      dispatch(updateServiceAction(service));
    },
    onDeleteServices: serviceIds => {
      dispatch(deleteServicesAction(serviceIds));
    },
    onGetCategories: () => {
      dispatch(fetchAllCategoryAction());
    },
    onAddCategory: data => {
      dispatch(addCategoryAction(data));
    },
    onUpdateCategory: category => {
      dispatch(updateCategoryAction(category));
    },
    onDeleteCategory: category => {
      dispatch(deleteCategoryAction(category));
    },
    onGetTags: () => {
      dispatch(fetchAllTagsAction());
    },
    onAddTag: data => {
      dispatch(addTagAction(data));
    },
    onGetAssetType: () => {
      dispatch(fetchAllAssetTypeAction());
    },
    onAddAssetType: data => {
      dispatch(addAssetTypeAction(data));
    },
    onDeleteAssetType: tag => {
      dispatch(deleteAssetTypeAction(tag));
    },
    onUpdateAssetType: tag => {
      dispatch(updateAssetTypeAction(tag));
    },
    onDeleteTag: tag => {
      dispatch(deleteTagsAction(tag));
    },
    onUpdateTag: tag => {
      dispatch(updateTagsAction(tag));
    },
    onGetOrigins: () => {
      dispatch(fetchAllOriginAction());
    },
    onAddOrigin: data => {
      dispatch(addOriginAction(data));
    },
    onUpdateOrigin: origin => {
      dispatch(updateOriginAction(origin));
    },
    onDeleteOrigin: origin => {
      dispatch(deleteOriginAction(origin));
    },
    onResetNotis: () => {
      dispatch(resetNotis());
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

const withReducer = injectReducer({ key: 'stockConfigPage', reducer });
const withSaga = injectSaga({ key: 'stockConfigPage', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles, { withTheme: true }),
)(StockConfigPage);
