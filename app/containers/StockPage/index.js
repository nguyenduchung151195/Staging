/* eslint-disable no-console */
/**
 *
 * StockPage
 *
 */

import React, { memo } from 'react';
import { compact } from 'lodash';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import classNames from 'classnames';
import {
  Paper,
  withStyles,
  Typography,
  Button,
  // Grid as GridUI,
  Checkbox,
  Drawer,
  // TextField,
  // Menu,
  // MenuItem,
  // ListItemIcon,
  // ListItemText,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Grid,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Slide,
  Badge,
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
} from '@material-ui/core';
import { Add, FilterList } from '@material-ui/icons';
import { injectIntl } from 'react-intl';
import TableUI from '@material-ui/core/Table';
import { Close, ExpandMore, LocationCity } from '@material-ui/icons';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import { withSnackbar } from 'notistack';
// import { SortingState, IntegratedSorting, IntegratedFiltering, PagingState, IntegratedPaging } from '@devexpress/dx-react-grid';
// import { Grid, DragDropProvider, Table, TableHeaderRow, TableColumnReordering, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import moment from 'moment';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import PositionedSnackbar from 'components/PositionedSnackbar';
import dot from 'dot-object';
import { Link } from 'react-router-dom';
import makeSelectStockPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import LoadingIndicator from '../../components/LoadingIndicator';
import { convertString1, spreadObjectLv1 } from '../../utils/common';
import styles from './styles';
import ProductInforDrawer from '../../components/ProductInforDrawer';
import {
  getAllProductAct,
  deleteProductAct,
  resetNoti,
  getAllProductByStockAct,
  editProductAct,
  getCategory,
  getAllLowerLimitProduct,
  getAllUpperLimitProduct,
} from './actions';
import HOCTable from '../HocTable_Stock';
import messages from './messages';
import request from '../../utils/request';
import {
  API_TAG_STOCK,
  API_SUPPLIERS,
  API_ADD_NEW_PRODUCT,
  API_LOWER_LIMIT_STOCK,
  API_UPPER_LIMIT_STOCK,
  API_BILLS,
  API_STOCK,
} from '../../config/urlConfig';
import ListPage from '../../components/List';
import makeSelectDashboardPage from '../Dashboard/selectors';

const allId = [];

/* eslint-disable react/prefer-stateless-function */
const CustomName = props => (
  <Typography
    component="div"
    style={{ fontSize: '13px', cursor: 'pointer', color: '#0795db' }}
    onClick={() => props.callBack('custom-click', props.item.originItem, 'name')}
  // onClick={() => props.customClick('name')}
  >
    {props.item.name}
  </Typography>
);
const CustomCatalog = props => <div>{props.item.catalog ? props.item.catalog.name : ''}</div>;
const CustomSourePrice = props => {
  const item = dot.object(props.item);
  return <div>{item.pricePolicy ? item.pricePolicy.sourcePrice : ''}</div>;
};
// const CustomCostPrice = props => <div>{props.item.pricePolicy ? props.item.pricePolicy.costPrice : ''}</div>;
const CustomSize = memo(props => {
  const item = dot.object(props.item);
  return <div>{item.size ? item.size : ''}</div>;
});

const CustomTags = memo(props => {
  const item = dot.object(props.item);
  if (item.tags && item.tags.length > 0) {
    return <div>{item.tags.join(', ')}</div>;
  }
  return <div />;
});

const CustomTotal = memo(props => {
  const item = dot.object(props.item);
  if (!item.isService) {
    let amount = 0;
    let text = 0;
    if (item.sellingPoint) {
      item.sellingPoint.forEach(item1 => {
        amount += item1.amount;
      });
      text = `${amount} ${item.unit ? item.unit.name : ''}`;
    }
    return (
      <Typography
        component="div"
        style={{ fontSize: '13px', cursor: 'pointer', color: '#0795db' }}
        // onClick={() => props.customClick('total')}
        onClick={() => props.callBack('custom-click', props.item.originItem, 'total')}
      >
        {text}
      </Typography>
    );
  }
  return <Typography component="div">là dịch vụ</Typography>;
});

const CustomAvt = memo(props => (
  <Grid>
    {props.item.logo ? (
      <React.Fragment>
        <Avatar onMouseOver={() => this.mouseOver(props.item._id)} onMouseOut={() => this.mouseOut(props.item._id)} src={props.item.logo} />
        <div style={{ display: 'none' }} id={props.item._id}>
          <div style={{ backgroundImage: `url(${props.item.logo})` }} />
        </div>
      </React.Fragment>
    ) : (
      ''
    )}
  </Grid>
));

const CustomInventory = memo(props => {
  const item = dot.object(props.item);
  if (!item.isService) {
    return (
      <Typography
        style={{ fontSize: '13px', cursor: 'pointer', color: '#0795db' }}
        // onClick={() => props.customClick('inventory')}
        onClick={() => props.callBack('custom-click', props.item.originItem, 'inventory')}
      >
        Hàng tồn kho
      </Typography>
    );
  }
  return <Typography component="div">là dịch vụ</Typography>;
});

const CustomAmount = memo(props => {
  const { intl, stock } = props;
  const item = dot.object(props.item);
  if (!item.isService) {
    if (item.sellingPoint) {
      let amount = 0;
      if (stock === 0) {
        item.sellingPoint.forEach(item => {
          amount += item.amount;
        });
      } else {
        const x = item.sellingPoint.find(n => {
          if (stock === n.organizationUnitId) return true;
        });
        if (x) {
          amount = x.amount;
        }
      }
      const text = `${amount} ${item.unit ? item.unit.name : ''}`;
      return <Typography component="div">{text}</Typography>;
    }
    return <Typography component="div">0</Typography>;
  }
  return <Typography component="div">{intl.formatMessage(messages.laDichVu || { id: 'laDichVu', defaultMessage: 'laDichVu' })}</Typography>;
});

function Transition(props) {
  return <Slide direction="left" {...props} />;
}
export class StockPage extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.HOCTable = React.createRef();
    this.state = {
      valueOfTab: 0,
      onDelete: false,
      filterType: [],
      arrDelete: [],
      categoryList: [],
      openDetail: false,
      openToEdit: false,
      stock: 0,
      brand: 0,
      supplier: 0,
      groupProduct: 0,
      tab: 0,
      dataBackup: [],
      suppliersList: [],
      allStock: [],
      currentProduct: {},
      anchorEl: false,
      currentPage: 0,
      pageSize: 5,
      pageSizes: [15, 30, 50],
      data: [],
      allLowerLimitProduct: [],
      allUpperLimitProduct: [],
      allLowerLimitProductBackup: [],
      allUpperLimitProductBackup: [],
      columns: [
        { name: 'codePro', title: 'Mã sản phẩm' },
        { name: 'barCode', title: 'Mã vạch' },
        { name: 'cate', title: 'Tên	Danh mục' },
        { name: 'name', title: 'Tên Sản Phẩm' },
        { name: 'image', title: 'Ảnh Sản Phẩm' },
        { name: 'sizePro', title: 'Kích thước' },
        { name: 'salePrice', title: 'Giá bán' },
        { name: 'costPrice', title: 'Giá vốn' },
        { name: 'amount', title: 'Số lượng' },
        { name: 'amountTotal', title: 'Tổng số lượng' },
        { name: 'inventory', title: 'Hàng tồn kho' },
        { name: 'action', title: 'HÀNH ĐỘNG' },
        { name: 'status', title: 'TRẠNG THÁI' },
      ],
      tableColumnExtensions: [{ columnName: 'codePro', width: 100 }],

      columnOrder: [
        'codePro',
        'barCode',
        'cate',
        'name',
        'image',
        'sizePro',
        'salePrice',
        'costPrice',
        'amount',
        'amountTotal',
        'inventory',
        'status',
        'action',
      ],
      selected: [],
      selectAll: false,
      openSnackbar: false,
      message: { content: '', type: null },
      // dialogStatus: false,
      // handleDialog: false,
      // rowsPerPage: 5, // số hàng hiển thị trên một bảng
      // page: 0, // trang hiện tại
      inventory: [
        {
          name: 'Bếp từ',
          address: 'Hà Nội',
          amount: 100,
        },
        {
          name: 'Bếp từ',
          address: 'Hà Nội',
          amount: 100,
        },
        {
          name: 'Bếp từ',
          address: 'Hà Nội',
          amount: 100,
        },
      ],
      stockList: [],
    };
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeColumnOrder = this.changeColumnOrder.bind(this);
  }

  componentDidMount() {
    this.setState({ tab: this.props.location.state === undefined ? 0 : this.props.location.state.typeOfRecord });
    this.props.onGetCategory();
    const token = localStorage.getItem('token');
    Promise.all([
      request(API_TAG_STOCK, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      request(API_SUPPLIERS, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ])
      .then(responses => {
        const [brand, { data: suppliers }] = responses;
        this.setState({ filterType: brand, suppliersList: suppliers });
      })
      .catch(console.log);
  }

  timer = null;

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleDrawer = () => {
    const { openDetail } = this.state;
    this.setState({
      openDetail: !openDetail,
    });
  };

  addCheckbox = id => <Checkbox checked={this.state.selected.includes(id)} color="primary" value={id} onClick={() => this.handleSelect(id)} />;

  addCheckboxAll = () => <Checkbox checked={this.state.selectAll} onClick={() => this.handleSelectAll()} />;

  changeColumnOrder(newOrder) {
    this.setState({ columnOrder: newOrder });
  }

  handleSelect(id) {
    const { selected } = this.state;
    const index = this.state.selected.findIndex(i => i === id);
    if (index === -1) selected.push(id);
    else selected.splice(index, 1);
    this.setState({ selected });
  }

  handleSelectAll() {
    const selectAll = !this.state.selectAll;
    if (this.state.selectAll) {
      this.setState({ selected: [], selectAll });
    } else {
      this.setState({ selected: allId, selectAll });
    }
  }

  handleChange(e) {
    const { columns } = this.state;
    const currentColumn = columns.find(column => column.name === e.target.name);
    currentColumn.title = e.target.value;
    this.setState({ columns });
  }

  onCloseSnackbar = () => {
    this.setState({ openSnackbar: false });
  };

  callSnackbar = () => {
    this.setState({ openSnackbar: true });
  };

  handleDeleteItem() {
    if (this.state.selected.length !== 0) {
      const { rows, selected } = this.state;
      const newRows = rows.filter(row => !selected.includes(row.id));
      this.setState({ rows: newRows, selected: [], message: { content: 'Deleted succesfully', type: 'success' } });
      this.callSnackbar();
    }
  }

  // Đóng/Mở dialog setting
  // handleDisplay(display) {
  //   this.setState({ dialogStatus: display });
  // }
  /* eslint-disable */

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleDialog = () => {
    const { openInventory } = this.state;
    this.setState({ openInventory: !openInventory });
  };

  callBack = (cmd, data, msg) => {
    const dataNew = dot.object(data);
    switch (cmd) {
      case 'custom-click':
        switch (msg) {
          case 'name':
            this.setState({ openDetail: true, currentProduct: dataNew });
            break;
          case 'total':
            this.setState({ openInventory: true, currentProduct: dataNew });
            break;
          case 'inventory':
            this.setState({ openToEdit: true, currentProduct: dataNew });

            break;
        }
        break;

      default:
        break;
    }
  };
  handleAddClick = () => {
    this.props.history.value = this.state.tab;
    this.props.history.push({
      pathname: '/Stock/add',
      state: { typeOfRecord: this.state.tab, add: true },
    });
  };

  addClick = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddClick} />
    </Tooltip>
  );
  // searchClick = () => (
  //   <Tooltip title="Thêm mới" aria-label="add">
  //     <FilterList onClick={this.handleAddClick} />
  //   </Tooltip>
  // );
  // handleDeleteClick = () => {
  //   this.HOCTable.current.getWrappedInstance();
  // };

  mouseOver = id => {
    document.getElementById(id).style.display = 'block';
  };
  mouseOut = id => {
    document.getElementById(id).style.display = 'none';
  };

  componentWillMount() {
    this.props.onGetAllProduct();
    this.props.onGetAllUpperLimitProduct();
    this.props.onGetAllLowerLimitProduct();
  }

  handleMultiLevelCategories = (chil, level, categoriesListUpdate) => {
    if (chil.length > 0) {
      chil.forEach(item => {
        const newItem = {
          padding: `${level}`,
          id: item._id,
          name: item.name,
        };
        categoriesListUpdate.push(newItem);
        if (item.child) {
          this.handleMultiLevelCategories(item.child, level + 20, categoriesListUpdate);
        }
      });
    }
    return categoriesListUpdate;
  };

  componentWillReceiveProps(props) {
    if (props.stockPage.categoryList) {
      let categoriesListUpdate = [];
      props.stockPage.categoryList.forEach(unit => {
        const newItem = {
          id: unit._id,
          name: unit.name,
          code: unit.code,
        };
        categoriesListUpdate.push(newItem);
        if (unit.child) {
          categoriesListUpdate = this.handleMultiLevelCategories(unit.child, 20, categoriesListUpdate);
        }
        this.setState({ categoryList: categoriesListUpdate });
      });
    }

    // if (props.stockPage.allProduct) {
    //   let listFilterType = props.stockPage.allProduct.map(item => {
    //     return item.supplier;
    //   });
    //   let result = compact(listFilterType).map(item => {
    //     return item.name;
    //   });
    //   this.setState({ filterType: [...new Set(result)] }, () => {
    //     console.log('this.state.filterType', this.state.filterType);
    //   });
    // }

    this.state.stockList = props.dashboardPage.allStock || [];
    if (props !== this.props) {
      const { stockPage } = props;
      const { allProduct = [], allUpperLimitProduct = [], allLowerLimitProduct = [] } = stockPage;
      if (props.history.value) {
        this.setState({ valueOfTab: props.history.value });
        props.history.value = undefined;
      }
      if (allProduct) {
        const dataBackup = stockPage.allProduct || [];
        const allStock = stockPage.allStock || [];
        this.state.allStock = [];
        allStock.forEach(unit => {
          const newItem = {
            id: unit._id,
            name: unit.name,
            code: unit.code,
            parent: unit.parent,
            level: unit.level,
            type: unit.type,
            hiden: false,
            priority: unit.priority,
            oUFunction: unit.oUFunction,
            duty: unit.duty,
            note: unit.note,
            accoutingBranchCode: unit.accountingDepartmentCode || '',
            accountingDepartmentCode: unit.accoutingBranchCode || '',
          };
          if (newItem.type === 'stock' || newItem.type === 'salePoint') {
            this.state.allStock.push(newItem);
          }
          if (unit.child) {
            this.listChil(unit.child, 20);
          }
        });
        this.setState({
          data: allProduct,
          allUpperLimitProduct,
          allUpperLimitProductBackup: allUpperLimitProduct,
          allLowerLimitProduct,
          allLowerLimitProductBackup: allLowerLimitProduct,
          dataBackup: dataBackup,
        });
      }
    }
  }

  listChil = (chil, level) => {
    if (chil.length > 0) {
      chil.forEach(item => {
        const newItem = {
          padding: `${level}`,
          id: item._id,
          name: item.name,
          code: item.code,
          type: item.type,
          parent: item.parent,
          level: item.level,
          hiden: false,
          priority: item.priority,
          oUFunction: item.oUFunction,
          duty: item.duty,
          note: item.note,
          accoutingBranchCode: item.accountingDepartmentCode || '',
          accountingDepartmentCode: item.accoutingBranchCode || '',
        };
        if (newItem.type === 'stock' || newItem.type === 'salePoint') {
          this.state.allStock.push(newItem);
        }
        if (item.child) {
          this.listChil(item.child, level + 20);
        }
      });
    }
  };

  componentDidUpdate() {
    const { stockPage } = this.props;
    if (stockPage.successDelete) {
      this.props.enqueueSnackbar('Xóa thành công!', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      // this.onDeleteSuccess();
      this.state.onDelete = false;
      this.props.onResetNoti();
    } else if (stockPage.error) {
      this.props.enqueueSnackbar('Thao tác thất bại!', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      this.props.onResetNoti();
    }
  }

  // onDeleteSuccess = () => {
  //   this.HOCTable.callBack('delete-success');
  // };

  mouseOver = id => {
    // this.setState({ hoverAvt: true, currentLogo: logo });
    document.getElementById(id).style.display = 'block';
  };

  mouseOut = id => {
    document.getElementById(id).style.display = 'none';
  };

  customFunction = data => {
    let newData = [];
    // console.log(111111, data);
    try {
      newData = data.map((item, index) => (
        // console.log(item, 'ite'),
        {
        ...item,
        name: <CustomName item={item} callBack={this.callBack} />,
        // tags: <CustomTags item={item.originItem} />,
        tags: item && item.originItem && item.originItem.tags && item.originItem.tags.name,
        size: <CustomSize item={item.originItem} />,
        logo: <CustomAvt item={item} />,
        'origin.originId': item.originCode ? item.originCode : null,
        'otherInfo.endDayForSale': item['otherInfo.endDayForSale'] ? moment(item['otherInfo.endDayForSale']).format('DD/MM/YYYY') : null,
        // sellingPoint: <CustomAmount item={item.originItem} intl={this.props.intl} stock={this.state.stock} />,
        total: <CustomTotal item={item.originItem} callBack={this.callBack} />,
        inventory: <CustomInventory item={item} callBack={this.callBack} />,
        catalog: item.catalogCode ? item.catalogCode : null,
        origin: item.originCode ? item.originCode : null,
        supplier: item.supplierCode ? item.supplierCode : null,
        unit: item['unit.name'] ? item['unit.name'] : null,
      }));
    } catch (err) {
      console.log(err, '');
    }
    return newData;
  };

  render() {
    const {
      rows,
      columns,
      tableColumnExtensions,
      columnOrder,
      openSnackbar,
      message,
      pageSizes,
      anchorEl,
      inventory,
      expanded,
      pageSize,
      suppliersList,
      data,
      currentPage,
      tab,
    } = this.state;
    const { classes, stockPage, intl, dashboardPage } = this.props;
    const { successDelete } = stockPage;
    let currentPoint = {};
    if (Object.keys(this.state.currentProduct).length > 0) {
      currentPoint =
        Array.isArray(this.state.currentProduct.sellingPoint) &&
        this.state.currentProduct.sellingPoint.find(item => item.organizationUnitId === this.state.stock);
    }

    const extraColumns = [
      { checked: true, name: 'total', order: 46, title: 'TỔNG SỐ LƯỢNG' },
      { checked: true, name: 'inventory', order: 47, title: 'HÀNG TỒNG KHO' },
    ];

    let dataNew = [];
    if (Number(this.state.tab) === 0) {
      dataNew = this.state.data.map(item => dot.dot(item));
    } else if (Number(this.state.tab) === 1) {
      dataNew = this.state.allLowerLimitProduct.map(item => dot.dot(item));
    } else {
      dataNew = this.state.allUpperLimitProduct.map(item => dot.dot(item));
    }

    const roles = dashboardPage.role.roles;

    const roleStockAboveTheLimit = roles && roles.find(item => item.codeModleFunction === 'stockAboveTheLimit');
    const roleModuleStockAboveTheLimit = roles && roleStockAboveTheLimit && roleStockAboveTheLimit.methods ? roleStockAboveTheLimit.methods : [];

    const roleStockBelowLimit = roles && roles.find(item => item.codeModleFunction === 'stockBelowLimit');
    const roleModuleStockBelowLimit = roleStockBelowLimit && roleStockBelowLimit.methods ? roleStockBelowLimit.methods : [];

    return (
      <div>
        {stockPage.loading ? <LoadingIndicator /> : ''}
        {this.state.openToEdit === false ? (
          <React.Fragment>
            {/* <Paper className={classes.breadcrumbs}>
              <Breadcrumbs aria-label="Breadcrumb">
                <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                  Dashboard
                </Link>
                <Typography color="textPrimary">{intl.formatMessage(messages.kho || { id: 'kho', defaultMessage: 'kho' })}</Typography>
              </Breadcrumbs>
            </Paper> */}
            <Paper>
              {/* <TextField
                select
                label={intl.formatMessage({ id: 'app.containers.StockPage.thuongHieu' })}
                name="brand"
                variant="outlined"
                value={this.state.brand}
                onChange={this.handleChangeInputFollowType}
                style={{
                  width: '12%',
                  marginLeft: '20px',
                  marginTop: 20,
                  textAlign: 'left',
                }}
                margin="normal"
              >
                <MenuItem value={0}>{intl.formatMessage({ id: 'app.containers.StockPage.allBrand' })}</MenuItem>
                {this.state.filterType.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item.name}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </TextField>
              <TextField
                select
                label={intl.formatMessage({ id: 'app.containers.StockPage.supplier' })}
                name="supplier"
                variant="outlined"
                value={this.state.supplier}
                onChange={this.handleChangeInputFollowType}
                style={{
                  width: '12%',
                  marginLeft: '20px',
                  marginTop: 20,
                  textAlign: 'left',
                }}
                margin="normal"
              >
                <MenuItem value={0}>{intl.formatMessage({ id: 'app.containers.StockPage.allSupplier' })}</MenuItem>
                {this.state.suppliersList.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </TextField>
              <TextField
                select
                label={intl.formatMessage({ id: 'app.containers.StockPage.nhomsanpham' })}
                name="groupProduct"
                variant="outlined"
                value={this.state.groupProduct}
                onChange={this.handleChangeInputFollowType}
                style={{
                  width: '12%',
                  marginLeft: '20px',
                  marginTop: 20,
                  textAlign: 'left',
                }}
                margin="normal"
              >
                <MenuItem value={0}>{intl.formatMessage({ id: 'app.containers.StockPage.allGroupProduct' })}</MenuItem>
                {this.state.categoryList.map(item => (
                  <MenuItem key={item.id} value={item} style={item.padding !== 0 ? { paddingLeft: `${parseInt(item.padding, 10) * 1.5}px` } : {}}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField> */}

              <Tabs value={this.state.tab} onChange={this.handleChange} indicatorColor="primary">
                <Tab
                  label={
                    <Badge color="primary" badgeContent={this.state.data.length} max={9999}>
                      <Typography className={classes.padding}>
                        {intl.formatMessage(messages.danhSach || { id: 'danhSach', defaultMessage: 'danhSach' })}
                      </Typography>
                    </Badge>
                  }
                />
                {/* Dưới hạn mức */}
                {(roleModuleStockBelowLimit.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
                  <Tab
                    label={
                      <Badge color="primary" badgeContent={this.state.allLowerLimitProduct.length} max={9999}>
                        <Typography className={classes.padding}>
                          {intl.formatMessage(messages.duoiHanMuc || { id: 'duoiHanMuc', defaultMessage: 'duoiHanMuc' })}
                        </Typography>
                      </Badge>
                    }
                  />
                ) : null}

                {/* Trên hạn mức */}
                {(roleModuleStockAboveTheLimit.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
                  <Tab
                    label={
                      <Badge color="primary" badgeContent={this.state.allUpperLimitProduct.length} max={9999}>
                        <Typography className={classes.padding}>
                          {intl.formatMessage(messages.trenHanMuc || { id: 'trenHanMuc', defaultMessage: 'trenHanMuc' })}
                        </Typography>
                      </Badge>
                    }
                  />
                ) : null}
              </Tabs>
              {/* {this.state.tab === 0 ? ( */}
              {/* {this.state.tab === 0 && (<TabContainer> */}
              <Grid style={{ paddingTop: 10 }}>
                {/* <HOCTable
                  collectionCode={'Stock'}
                  onRef={ref => (this.HOCTable = ref)}
                  callBack={this.callBack}
                  handleEditClick={this.handleEditClick}
                  handleAddClick={this.handleAddClick}
                  handleDeleteClick={this.handleDeleteClick}
                  customColumns={[
                    {
                      columnName: 'logo',
                      CustomComponent: CustomAvt,
                    },
                    //   {
                    //     columnName: 'category',
                    //     CustomComponent: CustomCatalog,
                    //   },
                    {
                      columnName: 'tags',
                      CustomComponent: CustomTags,
                    },
                    {
                      columnName: 'name',
                      CustomComponent: CustomName,
                    },
                    // {
                    //   columnName: 'pricePolicy.sourcePrice',
                    //   CustomComponent: CustomSourePrice,
                    // },
                    //   {
                    //     columnName: 'sellPrice',
                    //     CustomComponent: CustomCostPrice,
                    //   },
                    {
                      columnName: 'size',
                      CustomComponent: CustomSize,
                    },
                    {
                      columnName: 'total',
                      CustomComponent: CustomTotal,
                    },
                    {
                      columnName: 'sellingPoint',
                      CustomComponent: CustomAmount,
                    },
                    //   {
                    //     columnName: 'inventory',
                    //     CustomComponent: CustomInventory,
                    //   },
                  ]}
                  extraColumns={[
                    {
                      columnName: 'total',
                      columnTitle: 'Tổng số lượng',
                      CustomComponent: CustomTotal,
                    },
                    {
                      columnName: 'inventory',
                      columnTitle: 'Hàng tồn kho',
                      CustomComponent: CustomInventory,
                    },
                  ]}
                  path={'/crm/Stock'}
                  data={dataNew}
                  enableEdit
                  disableSearchServer
                  handleSearchCustom={this.handleSearchCustom}
                  disableSearchField={[
                    'updateAt',
                    'createdAt',
                    'otherInfo.commission.titleMoney',
                    'otherInfo.commission.methodMoney',
                    'otherInfo.endDayForSale',
                    'otherInfo.startDayForSale',
                    'otherInfo.expirationDate',
                    'logo',
                    'warrantyPeriod',
                  ]}
                /> */}
              </Grid>
              {tab === 0 && (
                <ListPage
                  code="Stock"
                  codeModule="stockListProduct"
                  // parentCode="stock"
                  apiUrl={API_ADD_NEW_PRODUCT}
                  withPagination
                  onEdit={row => {
                    this.handleEditClick(row);
                  }}
                  height="650px"
                  settingBar={[this.addClick()]}
                  settingSearch
                  disableAdd
                  exportExcel
                  kanban="ST01"
                  onDelete={this.handleDelete}
                  reload={successDelete}
                  // showDepartmentAndEmployeeFilter
                  extraColumns={extraColumns}
                  customFunction={this.customFunction}
                  filter={this.state.filter ? this.state.filter : ''}
                  filterType={this.state.filterType}
                  suppliersList={this.state.suppliersList}
                  categoryList={this.state.categoryList}
                />
              )}

              {tab === 1 && (
                <ListPage
                  code="Stock"
                  height="655px"
                  codeModule="stockBelowLimit"
                  // parentCode="hrm"
                  onEdit={row => {
                    this.handleEditClick(row);
                  }}
                  settingBar={[this.addClick()]}
                  disableAdd
                  exportExcel
                  onDelete={this.handleDelete}
                  reload={successDelete}
                  apiUrl={API_STOCK}
                  limitStatus="below"
                  customFunction={this.customFunction}
                  filter={this.state.filter ? this.state.filter : ''}
                />
              )}
              {tab === 2 && (
                <ListPage
                  code="Stock"
                  codeModule="stockAboveTheLimit"
                  height="655px"
                  // parentCode="hrm"
                  onEdit={row => {
                    this.handleEditClick(row);
                  }}
                  settingBar={[this.addClick()]}
                  disableAdd
                  exportExcel
                  onDelete={this.handleDelete}
                  reload={successDelete}
                  apiUrl={API_STOCK}
                  limitStatus="above"
                  customFunction={this.customFunction}
                  filter={this.state.filter ? this.state.filter : ''}
                />
              )}
            </Paper>
            {openSnackbar ? <PositionedSnackbar message={message} onClose={this.onCloseSnackbar} /> : null}
            <Drawer anchor="right" open={this.state.openDetail} onClose={this.toggleDrawer} className={classes.detailProduct}>
              <div tabIndex={0} role="button" className={classes.detailProduct}>
                <ProductInforDrawer product={this.state.currentProduct} currentStock={this.state.stock} onClose={this.toggleDrawer} />
              </div>
            </Drawer>

            <Dialog open={this.state.openInventory} onClose={this.handleDialog}>
              <DialogTitle id="alert-dialog-title">Số lượng chi tiết</DialogTitle>
              <DialogContent style={{ width: 600 }}>
                <TableUI>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Điểm bán hàng</TableCell>
                      <TableCell>Số lượng</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(this.state.currentProduct).length > 0 && this.state.currentProduct.sellingPoint
                      ? this.state.currentProduct.sellingPoint.map((item, index) => {
                        let amount = item.amount;
                        let text = '';
                        let listUnit = this.state.currentProduct.otherInfo ? this.state.currentProduct.otherInfo.unitChange : [];
                        if (listUnit.length > 0) {
                          // let unitArr = [];
                          const numberExchange = [];
                          if (this.state.currentProduct.unit && this.state.currentProduct.unit.unitId === listUnit[0].from.unitId) {
                            listUnit = listUnit.reverse();
                          }
                          listUnit.forEach(item => {
                            numberExchange.push(item.numberExchange);
                          });
                          let number = [];
                          if (numberExchange.length > 1) {
                            for (let i = 0; i < numberExchange.length; i++) {
                              let x = numberExchange[i];
                              for (let j = i + 1; j < numberExchange.length; j++) {
                                x *= numberExchange[j];
                              }
                              number.push(x);
                            }
                          } else number = numberExchange;
                          listUnit.forEach((item, index) => {
                            const unit = parseInt(amount / number[index], 10);
                            amount %= number[index];
                            if (text !== '') {
                              text += `, ${unit} ${item.to.unit}`;
                            } else text += `${unit} ${item.to.unit}`;
                            if (index === listUnit.length - 1 && amount !== 0) {
                              if (text !== '') {
                                text += `, ${amount} ${item.from.unit}`;
                              } else text += `${amount} ${item.from.unit}`;
                            }
                          });
                        } else text = `${amount} ${this.state.currentProduct.unit ? this.state.currentProduct.unit.name : ''}`;
                        return (
                          <TableRow>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{text}</TableCell>
                          </TableRow>
                        );
                      })
                      : ''}
                  </TableBody>
                </TableUI>
              </DialogContent>
            </Dialog>
          </React.Fragment>
        ) : (
          <Dialog
            classes={{ paperFullScreen: classes.paperFullScreen }}
            fullScreen
            maxWidth="md"
            fullWidth
            open={this.state.openToEdit}
            onClose={this.handleCloseEdit}
            aria-labelledby="form-dialog-title"
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton color="inherit" onClick={this.handleCloseEdit} aria-label="Close">
                  <Close />
                </IconButton>
                <Typography variant="h6" color="inherit" className={classes.flex}>
                  Chỉnh sửa hàng tồn kho
                </Typography>
                <Button color="inherit" variant="outlined" onClick={this.onSaveToEdit}>
                  Lưu
                </Button>
              </Toolbar>
            </AppBar>
            {/* {this.state.stock === 0
            this.state.currentProduct.sellingPoint
          } */}
            <DialogContent style={{ marginTop: 90, paddingTop: 10 }}>
              <Typography component="pre" style={{ fontSize: '20px', marginBottom: 10 }}>
                Mã vạch: {this.state.currentProduct.barcode || ''}
              </Typography>
              <Typography component="pre" style={{ fontSize: '20px', marginBottom: 10 }}>
                Tên hàng hóa(dịch vụ): {this.state.currentProduct.name || ''}
              </Typography>
              <Typography component="pre" style={{ fontSize: '20px', marginBottom: 10 }}>
                Nhóm sản phẩm: {this.state.currentProduct.catalog ? this.state.currentProduct.catalog.name : ''}
              </Typography>
              {this.state.stock === 0 ? (
                this.state.currentProduct.sellingPoint ? (
                  this.state.currentProduct.sellingPoint.map((place, index) => {
                    const stock = this.state.stockList.find(n => n.id === place.organizationUnitId);
                    return (
                      <ExpansionPanel expanded={expanded === place.organizationUnitId} onChange={this.handleChangeExpan(place.organizationUnitId)}>
                        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                          {' '}
                          <LocationCity />
                          <b>
                            &nbsp;
                            {stock ? stock.name : place.name}
                          </b>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <Grid container>
                            <Grid md={6}>
                              <Typography style={{ textAlign: 'left', fontSize: '14px', marginLeft: '15px' }}>
                                Số lượng hiện tại:{' '}
                                {`${place.amount} ${place.additions < 0 ? '-' : '+'} ${place.additions < 0 ? -place.additions : place.additions
                                  } = ${parseInt(place.amount, 10) + parseInt(place.additions === '' ? 0 : place.additions, 10)}`}
                              </Typography>
                              <TextField
                                label="Thêm bớt hàng tồn kho"
                                className={classes.textField}
                                onChange={e => this.handleChangeInputBasicInfo(index, 'additions', e)}
                                name="additions"
                                style={{ width: '100%' }}
                                variant="outlined"
                                type="number"
                                margin="normal"
                              />
                            </Grid>
                          </Grid>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    );
                  })
                ) : (
                  ''
                )
              ) : (
                <React.Fragment>
                  <Typography component="pre" style={{ fontSize: '20px', marginBottom: 10 }}>
                    Số lượng hiện tại:{' '}
                    {`${currentPoint.amount} ${currentPoint.additions < 0 ? '-' : '+'} ${currentPoint.additions < 0 ? -currentPoint.additions : currentPoint.additions
                      } = ${parseInt(currentPoint.amount, 10) + parseInt(currentPoint.additions === '' ? 0 : currentPoint.additions, 10)}`}
                  </Typography>
                  <TextField
                    label="Thêm bớt hàng tồn kho"
                    className={classes.textField}
                    onChange={e => this.handleChangeInputBasicInfoOnlyStock('additions', currentPoint, e)}
                    name="additions"
                    style={{ width: '100%' }}
                    variant="outlined"
                    type="number"
                    margin="normal"
                  />
                  <TextField
                    label="Ghi chú"
                    className={classes.textField}
                    onChange={e => this.handleChangeInputBasicInfoOnlyStock('noteLog', currentPoint, e)}
                    name="noteLog"
                    style={{ width: '100%' }}
                    variant="outlined"
                    margin="normal"
                  />
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ngày</TableCell>
                        <TableCell>Nhân viên</TableCell>
                        <TableCell>Số lượng thay đổi</TableCell>
                        <TableCell>Ghi chú</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentPoint.logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(item => {
                        item.createdAt = new Date(item.createdAt);
                        return (
                          <TableRow>
                            <TableCell>{`${item.createdAt.getDate() < 10 ? `0${item.createdAt.getDate()}` : `${item.createdAt.getDate()}`}-${item.createdAt.getMonth() + 1 < 10 ? `0${item.createdAt.getMonth() + 1}` : `${item.createdAt.getMonth() + 1}`
                              }-${item.createdAt.getFullYear()}  ${item.createdAt.getHours()}:${item.createdAt.getMinutes()}:${item.createdAt.getSeconds()}`}</TableCell>
                            <TableCell>{item.createdBy.name}</TableCell>
                            <TableCell>{item.addition}</TableCell>
                            <TableCell>{item.noteLog}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </React.Fragment>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  onSaveToEdit = () => {
    const { currentProduct } = this.state;
    currentProduct.sellingPoint.forEach(item => {
      if (parseInt(item.additions, 10) > 0) {
        item.amount += parseInt(item.additions, 10);
        item.additions = 0;
        item.noteLog = item.noteLog === '' ? 'Chỉnh sửa số lượng bằng tay' : item.noteLog;
      }
    });
    this.props.onEdit(currentProduct, this.state.stock);
    this.setState({ openToEdit: false });
  };

  handleChangeInputBasicInfoOnlyStock = (name, currentPoint, e) => {
    currentPoint[name] = e.target.value;
    const { currentProduct } = this.state;
    const currentPointIndex = currentProduct.sellingPoint.findIndex(item => item.organizationUnitId === this.state.stock);
    currentProduct.sellingPoint[currentPointIndex] = currentPoint;
    this.setState({ currentProduct });
  };

  handleChangeInputBasicInfo = (index, name, e) => {
    const { currentProduct } = this.state;
    currentProduct.sellingPoint[index][name] = e.target.value;
    this.setState({ currentProduct });
  };

  timerSearch = null;

  handleSearchCustom = (searchString, fieldsDisable) => {
    // console.log('searchString', searchString, 'fieldsDisable', fieldsDisable);
    clearTimeout(this.timerSearch);
    this.timerSearch = setTimeout(() => {
      const searchStringFormat = convertString1(searchString);
      let dataSource;
      if (Number(this.state.tab) === 0) {
        dataSource = this.state.dataBackup;
      } else if (Number(this.state.tab) === 1) {
        dataSource = this.state.allLowerLimitProductBackup;
      } else {
        dataSource = this.state.allUpperLimitProductBackup;
      }
      const x = dataSource.map(spreadObjectLv1).filter(item => {
        for (let i = 0; i < fieldsDisable.length; i++) {
          if (convertString1(item[fieldsDisable[i]]).indexOf(searchStringFormat) !== -1) return true;
        }
        return false;
      });
      if (Number(this.state.tab) === 0) {
        this.setState({ data: x });
      } else if (Number(this.state.tab) === 1) {
        this.setState({ allLowerLimitProduct: x });
      } else {
        this.setState({ allUpperLimitProduct: x });
      }
    }, 400);
  };

  handleChangeExpan = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleCloseEdit = () => {
    this.setState({ openToEdit: false });
  };

  handleChange = (event, value) => {
    this.setState({ tab: value });
  };

  handleDelete = item => {
    // const { data } = this.state;
    // const arrDelete = [];
    // item.forEach(n => {
    //   arrDelete.push(data[n]._id);
    // });
    if (Array.isArray(item) && item.length) {
      this.props.onDelete(item);
      // this.setState({ onDelete: true, arrDelete: item });
    }
  };

  handleCloseDelete = () => {
    this.setState({ onDelete: false });
  };

  handleEditClick = item => {
    this.props.history.value = this.state.tab;
    const { history } = this.props;
    history.push({
      pathname: `/Stock/edit/${item._id}`,
      state: { typeOfRecord: this.state.tab, add: false },
    });
  };

  findItemNested = (arr, name, nestingKey) =>
    arr.reduce((a, item) => {
      if (a) return a;
      if (item.name === name) return item;
      if (item[nestingKey]) return this.findItemNested(item[nestingKey], name, nestingKey);
    }, null);

  filterProductFollowCategoriesAndBrand() {
    const { brand, supplier, groupProduct } = this.state;
    const { stockPage = {} } = this.props;
    const { allProduct = [], categoryList } = stockPage;

    let elementMatch = this.findItemNested(categoryList, groupProduct.name, 'child');

    const allNames = [];
    JSON.stringify([elementMatch], (key, value) => {
      if (key === 'name') allNames.push(value);
      return value;
    });
    let filteredProducts = allProduct;
    if (groupProduct !== 0) {
      filteredProducts = filteredProducts.filter(item => {
        if ((!!item.catalog && item.catalog.name === groupProduct.name) || (!!item.catalog && allNames.includes(item.catalog.name))) {
          return true;
        }
      });
    }

    if (supplier !== 0) {
      filteredProducts = filteredProducts.filter(item => {
        if (!!item.supplier && item.supplier.name === supplier) {
          return true;
        }
      });
    }

    if (brand !== 0) {
      filteredProducts = filteredProducts.filter(item => {
        if (Array.isArray(item.tags) && item.tags.includes(brand)) {
          return true;
        }
      });
    }

    this.setState({ data: filteredProducts });
  }

  handleChangeInputFollowType = e => {
    // this.setState({ [e.target.name]: e.target.value }, () => {
    //   this.filterProductFollowCategoriesAndBrand();
    // });
    const {
      target: { name, value },
    } = e;

    const { filter } = this.state;
    let newFilter = { ...filter };
    if (name === 'brand' && value !== 0) newFilter['tags'] = value;
    else if (name === 'brand' && value === 0) delete newFilter['tags'];
    if (name === 'groupProduct' && value !== 0) newFilter['catalog.catalogId'] = value.id;
    else if (name === 'groupProduct' && value === 0) delete newFilter['catalog.catalogId'];
    if (name === 'supplier' && value !== 0) newFilter['supplier.supplierId'] = value._id;
    else if (name === 'supplier' && value === 0) delete newFilter['supplier.supplierId'];

    this.setState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
      filter: newFilter,
    }));
  };
}

StockPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  stockPage: makeSelectStockPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllProduct: () => {
      dispatch(getAllProductAct());
    },
    onGetAllUpperLimitProduct: () => {
      dispatch(getAllUpperLimitProduct());
    },
    onGetAllLowerLimitProduct: () => {
      dispatch(getAllLowerLimitProduct());
    },
    onGetProductByStock: id => {
      dispatch(getAllProductByStockAct(id));
    },
    onGetCategory: () => {
      dispatch(getCategory());
    },
    onDelete: body => {
      dispatch(deleteProductAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onEdit: (body, id) => {
      dispatch(editProductAct(body, id));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true },
);

const withReducer = injectReducer({ key: 'stockPage', reducer });
const withSaga = injectSaga({ key: 'stockPage', saga });

export default compose(
  injectIntl,
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(StockPage);
