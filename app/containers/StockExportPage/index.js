/* eslint-disable no-case-declarations */
/* eslint-disable no-unneeded-ternary */
/**
 *
 * StockExportPage
 *
 */
import React, { Suspense } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, TextField, MenuItem, Paper, Button, Tabs, Tab, Tooltip } from '@material-ui/core';
import moment from 'moment';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import dot from 'dot-object';
import makeSelectStockExportPage from './selectors';
import LoadingIndicator from '../../components/LoadingIndicator';
// import ExportStockDialog from '../../components/ExportStockDialog/Loadable';
import HOCTable from '../HocTable';
import reducer from './reducer';
import saga from './saga';
import { getAllItemsAct, updateItemsAct, getProductsAct, resetNoti, mergeStockExportPage } from './actions';
import { serialize } from '../../utils/common';
import ListPage from '../../components/List';
import { API_STOCK_EXPORT } from '../../config/urlConfig';
import { Add } from '@material-ui/icons';

const ExportStockDialog = React.lazy(() => import('../../components/ExportStockDialog/Loadable'));

// import messages from './messages';
const tempDate = new Date();
const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
  }`;
const datePrev = moment(date)
  .subtract(1, 'months')
  .format('YYYY-MM-DD');

const CustomType = props => {
  const item = dot.object(props.item);
  if (item.type === 0) return <div>Xuất theo hóa đơn</div>;
  if (item.type === 1) return <div>Xuất hàng trực tiếp</div>;
  if (item.type === 2) return <div>Trả hàng</div>;
  if (item.type === 3) return <div>Yêu cầu chuyển kho</div>;
  if (item.type === 4) return <div>Xuất hàng theo lô</div>;
  return <div>Xuất hàng hợp đồng</div>;
};

const CustomDate = props => {
  const item = dot.object(props.item);
  return <div>{`${moment(item.createdDate).format('MM-DD-YYYY hh:mm')}`}</div>;
};

const CustomStatus = props => {
  const item = dot.object(props.item);
  if (item.type === 3) {
    if (item.isImportedStock) return <div>Đã chuyển</div>;
    return <div>Chưa chuyển</div>;
  }
  return '';
};

const CustomFinished = props => {
  const item = dot.object(props.item);
  if (Number(item.state) === 0) return <div>Chưa phê duyệt</div>;
  if (Number(item.state) === 1 || Number(item.state) === 3)
    return (
      <Button color="primary" variant="outlined" onClick={props.customClick}>
        Xuất kho
      </Button>
    );
  if (Number(item.state) === 2) return <div>Không được duyệt</div>;
  if (Number(item.state) === 4) return <div>Hoàn thành</div>;
  return '';
};

/* eslint-disable react/prefer-stateless-function */
export class StockExportPage extends React.Component {
  state = {
    itemsList: [],
    type: -1,
    dayStart: datePrev,
    dayEnd: date,
    pageDetail: {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    },
    params: '',
    tab: 0,
    isClickEdit: false,
    skip: 0,
    limit: 10,
    openDialog: false,
    currentItem: null,          
  };

  componentDidUpdate(props) {
    if (props.stockExportPage.successUpdate) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isClickEdit: true, openDialog: false });
      this.props.onResetNoti();
    }
  }

  componentDidMount() {
    if (this.props.history.value) {
      this.setState({ tab: Number(this.props.history.value) });
      this.state.tab = Number(this.props.history.value);
      this.onGetAllItemsCustom({ skip: this.state.skip, limit: this.state.limit });
      this.props.history.value = undefined;
    }
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { stockExportPage } = props;
      const itemsList = stockExportPage.itemsList || [];
      this.state.pageDetail.totalCount = stockExportPage.count || 0;
      this.state.pageDetail.currentPage = Number(stockExportPage.skip || 0) || 0;
      this.state.pageDetail.pageSize = stockExportPage.limit || 0;
      this.setState({ itemsList });
      if (this.state.isClickEdit === true) {
        this.onGetAllItemsCustom({ skip: this.state.skip, limit: this.state.limit });
        this.state.isClickEdit = false;
      }
    }
  }

  mapFunction = item => {
    // console.log(item, 12);
    return {
      ...item,
      customer: item['customer.code'],
      paidList: item && item.originItem && item.originItem.paidList[0] &&  item.originItem.paidList[0].payMethod,
      type: item.type === 0 ? 'Xuất theo hóa đơn' :
      item.type === 1 ? 'Xuất theo hóa đơn' :
      item.type === 2 ? 'Xuất hàng trực tiếp' :
      item.type === 3 ? 'Trả hàng' :
      item.type === 4 ? 'Yêu cầu chuyển kho' :
      item.type === 5 ? 'Xuất hàng theo lô' : null,
      isImportedStock: item.isImportedStock === false ? "Chưa chuyển" : "Đã chuyển",
    };
  };

  render() {
    const { stockExportPage } = this.props;
    const { itemsList,dayStart, dayEnd, } = this.state;
    const start = `${dayStart}T00:00:00.000Z`;
    const end = `${dayEnd}T23:59:00.000Z`;
    const { successUpdate } = stockExportPage;
    const newItemsList = itemsList.map(item => dot.dot(item));
    return (
      <div>
        <Helmet>
          <title>Xuất kho</title>
          <meta name="description" content="Description of stockExportPage" />
        </Helmet>
        {stockExportPage.loading ? <LoadingIndicator /> : null}
        {/* {true ? <LoadingIndicator /> : null} */}
        <Paper style={{ width: '100%', padding: '20px' }}>
          <Grid container>
            {/* <Grid item md={12}>
              <TextField
                label="Loại"
                name="type"
                select
                value={this.state.type}
                onChange={this.handleChange('type')}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                style={{ width: '20%' }}
                color="primary"
                margin="normal"
              >
                <MenuItem value={-1}>Tất cả</MenuItem>
                <MenuItem value={0}>Xuất theo hóa đơn</MenuItem>
                <MenuItem value={1}>Xuất hàng trực tiếp</MenuItem>
                <MenuItem value={2}>Trả hàng</MenuItem>
                <MenuItem value={3}>Yêu cầu chuyển kho</MenuItem>
                <MenuItem value={4}>Xuất hàng theo lô</MenuItem>
              </TextField>
              &nbsp;&nbsp;
              <TextField
                label="Ngày bắt đầu"
                name="dayStart"
                type="date"
                value={this.state.dayStart}
                onChange={this.handleChange('dayStart')}
                InputProps={{ inputProps: { max: this.state.dayEnd } }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                style={{ width: '15%' }}
                color="primary"
                margin="normal"
              />
              &nbsp;&nbsp;
              <TextField
                label="Ngày kết thúc"
                name="dayEnd"
                type="date"
                value={this.state.dayEnd}
                onChange={this.handleChange('dayEnd')}
                InputProps={{ inputProps: { max: date, min: this.state.dayStart } }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                style={{ width: '15%' }}
                color="primary"
                margin="normal"
              />
              &nbsp;&nbsp;
              <Button
                color="primary"
                variant="outlined"
                style={{ width: '10%', marginTop: '17px', height: '55px' }}
                onClick={this.handleSearchByDay}
              >
                Thực hiện
              </Button>
            </Grid> */}
            <Grid item md={12}>
              <Tabs value={this.state.tab} onChange={this.handleChangeTab} indicatorColor="primary" textColor="primary">
                <Tab label="Xuất kho" />
                <Tab label="Yêu cầu xuất kho" />
              </Tabs>
            </Grid>
            <Grid item md={12}>
              <ListPage
                filter={{
                  // createdAt: {
                  //   $gte: start,
                  //   $lte: end,
                  // },
                  state: {$in:Number(this.state.tab) === 0 ? [4] : [0, 1, 2, 3]}
                 }}
                disableTodo={false}
                disableCreateTodo={false}
                disableSeenMail={false}
                disableSMS={false}
                disableRequest={false}
                defaultValue = {{state : Number(this.state.tab) === 0 ? 4 : 1}}
                apiUrl={API_STOCK_EXPORT}
                exportExcel
                code="StockExport"
                kanbanKey="_id"
                withPagination
                settingBar={[this.addItem()]}
                // onEdit={this.handleEditClick}
                onEdit={this.handleEditClick}
                disableAdd
                reload={successUpdate}
                mapFunction={this.mapFunction}
                path="/crm/StockExport"
                // showDepartmentAndEmployeeFilter
                height="600px"
                
              />
              {/* <HOCTable
                onRef={ref => (this.HOCTable = ref)}
                handleEditClick={this.handleEditClick}
                handleAddClick={this.handleAddClick}
                handleDeleteClick={this.handleDeleteClick}
                customColumns={[
                  {
                    columnName: 'type',
                    CustomComponent: CustomType,
                  },
                  {
                    columnName: 'isImportedStock',
                    CustomComponent: CustomStatus,
                  },
                  {
                    columnName: 'createdDate',
                    CustomComponent: CustomDate,
                  },
                  {
                    columnName: 'state',
                    CustomComponent: CustomFinished,
                  },
                ]}
                path="/crm/StockExport"
                collectionCode="StockExport"
                data={newItemsList}
                enableEdit
                enableDelete={false}
                // enableApproved
                pageDetail={this.state.pageDetail} // phân trang
                onGetAPI={this.onGetAllItemsCustom}
                enableServerPaging
              /> */}
            </Grid>
          </Grid>
        </Paper>
        {/* <FormattedMessage {...messages.header} /> */}
        <Suspense fallback={<LoadingIndicator />}>
          <ExportStockDialog
            open={this.state.openDialog}
            handleClose={this.handleCloseDialog}
            data={this.state.currentItem}
            productList={stockExportPage.productListById}
            onUpdateItem={this.props.updateItem}
          />
        </Suspense>
      </div>
    );
  }

  

  handleCloseDialog = () => {
    this.setState({ openDialog: false, currentItem: null });
  };

  handleChange = name => e => {
    if (name === 'type') {
      const { dayStart, dayEnd } = this.state;
      const start = `${dayStart}T00:00:00.000Z`;
      const end = `${dayEnd}T23:59:00.000Z`;
      const params = {
        filter: {
          type: e.target.value,
          createdAt: {
            $gte: start,
            $lte: end,
          },
          state: {
            $in: Number(this.state.tab) === 0 ? [4] : [0, 1, 2, 3],
          },
        },
        skip: 0,
        limit: 10,
      };
      const paramsX = {
        filter: {
          type: e.target.value,
          createdAt: {
            $gte: start,
            $lte: end,
          },
          state: {
            $in: Number(this.state.tab) === 0 ? [4] : [0, 1, 2, 3],
          },
        },
      };
      this.props.mergeStockExportPage({ successUpdate: false })
      this.setState({ params: serialize(paramsX) }, () => this.props.mergeStockExportPage({ successUpdate: true }));
      if (Number(e.target.value) === -1) {
        const params2 = serialize({
          filter: {
            createdAt: {
              $gte: start,
              $lte: end,
            },
          },
          state: {
            $in: Number(this.state.tab) === 0 ? [4] : [0, 1, 2, 3],
          },
          skip: 0,
          limit: 10,
        });
        const paramsY = serialize({
          filter: {
            createdAt: {
              $gte: start,
              $lte: end,
            },
            state: {
              $in: Number(this.state.tab) === 0 ? [4] : [0, 1, 2, 3],
            },
          },
        });
        this.props.onGetAllItems(serialize(params2));
        this.props.mergeStockExportPage({ successUpdate: false })
        this.setState({ params: serialize(paramsY) }, () => this.props.mergeStockExportPage({ successUpdate: true }));
      } else {
        this.props.onGetAllItems(serialize(params));
      }
      this.setState({ skip: 0, limit: 10 });
      const { pageDetail } = this.state;
      pageDetail.currentPage = 0;
      this.setState({ pageDetail });
    }
    this.props.mergeStockExportPage({ successUpdate: false })
    this.setState({ [name]: e.target.value }, () => this.props.mergeStockExportPage({ successUpdate: true }));
  };

  onGetAllItemsCustom = params1 => {
    this.setState({ skip: params1.skip, limit: params1.limit });
    const { params } = this.state;
    let body = '';
    body = serialize(params1);
    if (params !== '') {
      body += `&${params}`;
    } else {
      const paramsByTab = {
        filter: {
          state: {
            $in: Number(this.state.tab) === 0 ? [4] : [0, 1, 2, 3],
          },
        },
      };
      body += `&${serialize(paramsByTab)}`;
    }
    this.props.onGetAllItems(body);
  };

  handleSearchByDay = () => {
    const { dayStart, dayEnd, type } = this.state;
    const start = `${dayStart}T00:00:00.000Z`;
    const end = `${dayEnd}T23:59:00.000Z`;
    let func;
    let paramsX;
    if (type === -1) {
      func = {
        filter: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          state: {
            $in: Number(this.state.tab) === 0 ? [4] : [0, 1, 2, 3],
          },
        },
        skip: 0,
        limit: 10,
      };
      paramsX = {
        filter: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          state: {
            $in: Number(this.state.tab) === 0 ? [4] : [0, 1, 2, 3],
          },
        },
      };
    } else {
      func = {
        filter: {
          type,
          createdAt: {
            $gte: start,
            $lte: end,
          },
          state: {
            $in: Number(this.state.tab) === 0 ? [4] : [0, 1, 2, 3],
          },
        },
        skip: 0,
        limit: 10,
      };
      paramsX = {
        filter: {
          type,
          createdAt: {
            $gte: start,
            $lte: end,
          },
          state: {
            $in: Number(this.state.tab) === 0 ? [4] : [0, 1, 2, 3],
          },
        },
      };
    }
    const params = serialize(func);
    const { pageDetail } = this.state;
    pageDetail.currentPage = 0;
    this.setState({ pageDetail, skip: 0, limit: 10, params: paramsX});
    this.props.onGetAllItems(params);
  };

  handleChangeTab = (event, value) => {
    const { dayStart, dayEnd, type } = this.state;
    const start = `${dayStart}T00:00:00.000Z`;
    const end = `${dayEnd}T23:59:00.000Z`;
    let func;
    if (type === -1) {
      func = {
        filter: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          state: {
            $in: Number(value) === 0 ? [4] : [0, 1, 2, 3],
          },
        },
        skip: 0,
        limit: 10,
      };
      const paramsX = {
        filter: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          state: {
            $in: Number(value) === 0 ? [4] : [0, 1, 2, 3],
          },
        },
      };
      this.props.mergeStockExportPage({ successUpdate: false })
      this.setState({ params: serialize(paramsX) }, () => this.props.mergeStockExportPage({ successUpdate: true }));
    } else {
      func = {
        filter: {
          type,
          createdAt: {
            $gte: start,
            $lte: end,
          },
          state: {
            $in: Number(value) === 0 ? [4] : [0, 1, 2, 3],
          },
        },
        skip: 0,
        limit: 10,
      };
      const paramsY = {
        filter: {
          type,
          createdAt: {
            $gte: start,
            $lte: end,
          },
          state: {
            $in: Number(value) === 0 ? [4] : [0, 1, 2, 3],
          },
        },
      };
      this.props.mergeStockExportPage({ successUpdate: false })
      this.setState({ params: serialize(paramsY) }, () => this.props.mergeStockExportPage({ successUpdate: true }));

    }
    const params = serialize(func);
    const { pageDetail } = this.state;
    pageDetail.currentPage = 0;
    this.setState({ pageDetail });
    this.props.onGetAllItems(params);
    this.setState({ skip: 0, limit: 10 });
    this.props.mergeStockExportPage({ successUpdate: false })
    this.setState({ tab: value }, () => this.props.mergeStockExportPage({ successUpdate: true }));
  };

  handleAddClick = () => {
    this.props.history.value = Number(this.state.tab);
    this.props.history.push('/StockExport/add');
  };

  addItem = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddClick} />
    </Tooltip>
  );

  handleEditClick = item => {
    const { history } = this.props;
    this.props.history.value = Number(this.state.tab);
    history.push(`/StockExport/edit/${item._id}`);
  };
}

StockExportPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  // classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  stockExportPage: makeSelectStockExportPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllItems: pageDetail => {
      dispatch(getAllItemsAct(pageDetail));
    },
    updateItem: body => {
      dispatch(updateItemsAct(body));
    },
    getProductById: body => {
      dispatch(getProductsAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    mergeStockExportPage: val => {
      dispatch(mergeStockExportPage(val));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'stockExportPage', reducer });
const withSaga = injectSaga({ key: 'stockExportPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(StockExportPage);
