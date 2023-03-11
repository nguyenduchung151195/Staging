/**
 *
 * StockImportPage
 *
 */
import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, TextField, MenuItem, Paper, Button } from '@material-ui/core';
import moment from 'moment';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import dot from 'dot-object';
import HOCTable from '../HocTable';
import makeSelectStockImportPage from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import { changeTabAct, getAllItemsAct } from './actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import { serialize } from '../../utils/common';
import ListPage from '../../components/List';
import { API_STOCK_IMPORT } from '../../config/urlConfig';
import Kanban from '../KanbanPlugin';
import CustomButton from 'components/CustomButtons/Button';

function formatNumber(num) {
  if (num) return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return '';
}

const tempDate = new Date();
const date = `${tempDate.getFullYear()}-${tempDate.getMonth() + 1 < 10 ? `0${tempDate.getMonth() + 1}` : tempDate.getMonth() + 1}-${
  tempDate.getDate() < 10 ? `0${tempDate.getDate()}` : tempDate.getDate()
}`;
const datePrev = moment(date)
  .subtract(1, 'months')
  .format('YYYY-MM-DD');

const CustomAmount = props => {
  const item = dot.object(props.item);
  return <div>{formatNumber(Number(item.total))}</div>;
};

const CustomDate = props => {
  const item = dot.object(props.item);
  return <div>{`${moment(item.createdDate).format('MM-DD-YYYY hh:mm')}`}</div>;
};

const CustomFinished = props => {
  const item = dot.object(props.item);
  if (item.type === 0) {
    if (item.isFinished) return <div>Hoàn thành</div>;
    return <div>Chưa nhập hàng</div>;
  }
  return '';
};

const CustomType = props => {
  const item = dot.object(props.item);
  if (item.type === 0) return <div>Đơn đặt hàng</div>;
  if (item.type === 1) return <div>Nhập hàng PO</div>;
  if (item.type === 2) return <div>Nhập hàng trực tiếp</div>;
  if (item.type === 3) return <div>Xác nhận chuyển kho</div>;
  return <div>Chuyển kho</div>;
};
/* eslint-disable react/prefer-stateless-function */
export class StockImportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      reload: false,
      kanbanFilter: {},
    };
  }

  // componentWillMount() {
  //   this.props.onGetAllItems('');
  // }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { stockImportPage } = props;
      const itemsList = stockImportPage.itemsList || [];
      this.state.pageDetail.totalCount = stockImportPage.count || 0;
      this.state.pageDetail.currentPage = Number(stockImportPage.skip || 0) || 0;
      this.state.pageDetail.pageSize = stockImportPage.limit || 0;
      this.setState({ itemsList });
    }
  }

  mapFunction = item => {
    // console.log(item,'itemitem');
    return {
      ...item,
      ['employee.code']: item && item['employee.code'] || '',
      remaining: item && item.remaining || item && item.total,
      organizationUnitName: item && item['toStock.name'] ||'',
      paidList: item && item.originItem && item.originItem.paidList[0] &&  item.originItem.paidList[0].payMethod ||'',
      type:
        item.type === 0
          ? 'Đơn đặt hàng'
          : item.type === 1
            ? 'Nhập hàng PO'
            : item.type === 2
              ? 'Nhập hàng trực tiếp'
              : item.type === 3
                ? 'Xác nhận chuyển kho'
                : item.type === 4
                  ? 'Chuyển kho'
                  : null,
    };
  };

  handleTab(tab) {
    this.props.onChangeTab(tab);
  }

  render() {
    const { stockImportPage } = this.props;
    const { itemsList, dayStart, dayEnd } = this.state;
    const start = `${dayStart}T00:00:00.000Z`;
    const end = `${dayEnd}T23:59:00.000Z`;
    const { tab, successDelete } = stockImportPage;
    const newItemsList = itemsList.map(item => dot.dot(item));
    const Bt = props => (
      <CustomButton onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </CustomButton>
    );
    return (
      <div>
        <Helmet>
          <title>Nhập kho</title>
          <meta name="description" content="Description of stockImportPage" />
        </Helmet>
        {stockImportPage.loading ? <LoadingIndicator /> : null}
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
                <MenuItem value={0}>Đơn đặt hàng</MenuItem>
                <MenuItem value={1}>Nhập hàng PO</MenuItem>
                <MenuItem value={2}>Nhập hàng trực tiếp</MenuItem>
                <MenuItem value={3}>Xác nhận chuyển kho</MenuItem>
              </TextField>
              &nbsp;&nbsp; */}
            {/* <TextField
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
            {/* <Grid item md={12}>
              <Bt tab={1}>Kanban</Bt>
              <Bt tab={0}>Danh sách</Bt>
            </Grid> */}
            <Grid item md={12}>
              {/* {tab === 1 ? (
                <Kanban
                  isOpenSinglePage
                  enableAdd
                  titleField="name"
                  // callBack={this.callBack}
                  path={API_STOCK_IMPORT}
                  code="ST04"
                  reload={successDelete}
                  filter={this.state.kanbanFilter}
                  customContent={customContent}
                  customActions={[
                    {
                      action: 'comment',
                        // params: 'typeLine=4',
                    },
                  ]}
                  history={this.props.history}
                  params="/crm/StockImport"
                />
              ) : null}
              {tab === 0 ? (
                
              ) : null} */}
              <ListPage
                apiUrl={API_STOCK_IMPORT}
                //apiUrl={`${API_STOCK_IMPORT}`}
                filter={{
                  // createdAt: {
                  //   $gte: start,
                  //   $lte: end,
                  // },
                  state: { $in: Number(this.state.tab) === 0 ? [4] : [0, 1, 2, 3] },
                }}
                disableTodo={false}
                disableCreateTodo={false}
                disableSeenMail={false}
                disableSMS={false}
                disableRequest={false}
                exportExcel
                code="StockImport"
                kanban="ST04"
                kanbanKey="_id"
                withPagination
                onEdit={this.handleEditClick}
                onDelete={this.handleDeleteClick}
                reload={successDelete}
                mapFunction={this.mapFunction}
                showDepartmentAndEmployeeFilter
                height = "650px"
              />

              {/* <HOCTable
                onRef={ref => (this.HOCTable = ref)}
                handleEditClick={this.handleEditClick}
                handleAddClick={this.handleAddClick}
                handleDeleteClick={this.handleDeleteClick}
                customColumns={[
                  {
                    columnName: 'total',
                    CustomComponent: CustomAmount,
                  },
                  {
                    columnName: 'isFinished',
                    CustomComponent: CustomFinished,
                  },
                  {
                    columnName: 'type',
                    CustomComponent: CustomType,
                  },
                  {
                    columnName: 'createdDate',
                    CustomComponent: CustomDate,
                  },
                ]}
                path="/crm/StockImport"
                collectionCode="StockImport"
                data={newItemsList}
                enableEdit
                enableDelete={false}
                enableApproved
                pageDetail={this.state.pageDetail} // phân trang
                onGetAPI={this.onGetAllItemsCustom}
                enableServerPaging
              /> */}
            </Grid>
          </Grid>
        </Paper>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  handleSearchByDay = () => {
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
        },
        skip: 0,
        limit: 5,
      };
      const paramsX = {
        filter: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      };
      this.setState({ params: serialize(paramsX), successDelete: true });
    } else {
      func = {
        filter: {
          type,
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
        skip: 0,
        limit: 5,
      };
      console.log(type);
      const paramsY = {
        filter: {
          type,
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      };
      this.setState({ params: serialize(paramsY), successDelete: true });
    }
    const params = serialize(func);
    this.props.onGetAllItems(params);
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
        },
      };
      const paramsX = {
        filter: {
          type: e.target.value,
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      };
      this.setState({ params: serialize(paramsX), successDelete: true });
      if (Number(e.target.value) === -1) {
        const params2 = serialize({
          filter: {
            createdAt: {
              $gte: start,
              $lte: end,
            },
          },
        });
        const paramsY = serialize({
          filter: {
            createdAt: {
              $gte: start,
              $lte: end,
            },
          },
        });
        this.props.onGetAllItems(serialize(params2));
        this.setState({ params: serialize(paramsY), successDelete: true });
      } else {
        this.props.onGetAllItems(serialize(params));
      }
    }
    this.setState({ [name]: e.target.value, successDelete: true });
  };

  onGetAllItemsCustom = params1 => {
    const { params } = this.state;
    let body = '';
    body = serialize(params1);
    if (params !== '') {
      body += `&${params}`;
    }
    this.props.onGetAllItems(body);
  };

  handleAddClick = () => {
    this.props.history.push('/StockImport/add');
  };

  handleEditClick = item => {
    const { history } = this.props;
    history.push(`/StockImport/edit/${item._id}`);
  };
}

StockImportPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  // classes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  stockImportPage: makeSelectStockImportPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllItems: params => {
      dispatch(getAllItemsAct(params));
    },
    onChangeTab: val => {
      dispatch(changeTabAct(val));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'stockImportPage', reducer });
const withSaga = injectSaga({ key: 'stockImportPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  // withStyles(styles),
)(StockImportPage);
const customContent = [
  {
    title: 'Giám sát',
    fieldName: 'supervisor.name',
    type: 'string',
  },
  {
    title: 'Khách hàng',
    fieldName: 'customer.name',
    type: 'string',
  },
  {
    title: 'Giá trị',
    fieldName: 'value.amount',
    type: 'number',
  },
];
