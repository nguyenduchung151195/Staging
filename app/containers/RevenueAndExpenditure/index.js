/**
 *
 * RevenueAndExpenditure
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  withStyles,
  Grid,
  Paper,
  Tabs,
  Tab,
  Typography,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  // Button,
  TextField,
  MenuItem,
  Tooltip,
} from '@material-ui/core';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import dot from 'dot-object';
import HOCTable from '../HocTable';
import makeSelectRevenueAndExpenditure from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import moment from 'moment';
import Kanban from '../KanbanPlugin';
import {
  getAllRecordAct,
  deleteRecordAct,
  resetNoti,
  getAdvanceRecordAct,
  resetList,
  deleteAdvanceRecordAct,
  getReibursementRecordAct,
  deleteReibursementRecordAct,
  getPaymentRecordAct,
  deletePaymentRecordAct,
  updateRecord,
  updateRecordAdvance,
  updateRecordReibursement,
  updateRecordPayment,
  mergeDataRevenueAndExpenditure,
  changeTabAct,
} from './actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import { serialize } from '../../utils/common';
import messages from './messages';
import { injectIntl } from 'react-intl';
import Button from 'components/CustomButtons/Button';
import { API_RNE, API_RNE_REMBUR, API_PAYMENT, API_RNE_ADVANCE } from '../../config/urlConfig';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';
import makeSelectDashboardPage from 'containers/Dashboard/selectors';
import ListPage from '../../components/List';
import { Add } from '@material-ui/icons';

function formatNumber(num) {
  if (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  return '';
}

const CustomAmount = props => {
  const item = dot.object(props.item);
  return <div>{formatNumber(Number(item.amount))}</div>;
};

const CustomTax = props => {
  const item = dot.object(props.item);
  return <div>{formatNumber(item.tax)}</div>;
};

const CustomCostType = props => {
  const item = dot.object(props.item);
  if (Number(item.costType) === 0) return <div>Chi phí nội bộ</div>;
  if (Number(item.costType) === 1) return <div>Chi phí nhập hàng</div>;
  return <div>Chi phí bán hàng</div>;
};

const CustomType = props => {
  const item = dot.object(props.item);
  if (Number(item.type) === 1) return <div>Chi</div>;
  return <div>Thu</div>;
};
const crmSource = JSON.parse(localStorage.getItem('crmSource')) || [];
const expenseTypeSource = crmSource.find(item => item.code === 'S24') || {};
const CustomExpenseType = props => {
  const item = dot.object(props.item);
  if (expenseTypeSource.data) {
    const foundExpense = expenseTypeSource.data.find(s => s.value === item.expenseType);
    if (foundExpense) return foundExpense.title;
  }
  return item.expenseType;
};

/* eslint-disable react/prefer-stateless-function */
export class RevenueAndExpenditure extends React.Component {
  state = {
    valueOfTab: 0,
    kanbanFilter: {
      status: 1,
    },
    recordList: [],
    advanceList: [],
    reibursementList: [],
    paymentList: [],
    onDelete: false,
    arrDelete: [],
    valueOfFilter: -1,
    pageDetail: {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    },
    body: '',
    kanbanData: {},
    openKanbanDialog: false,
    settingRole: {},
    AdvanceRequire: {},
    ReimbursementRequire: {},
    PaymentRequire: {},
    synModuleLogRole: {},
  };

  // componentWillMount() {
  //   this.props.onGetAllRecord('');
  // }
  componentDidMount() {
    const { dashboardPage } = this.props;
    const { role = {} } = dashboardPage;
    const { roles } = role;
    if (!Object.keys(this.state.settingRole).length) {
      const getRole = moduleCode => {
        // console.log(moduleCode)
        const roleCode = roles.find(item => item.codeModleFunction === moduleCode);
        const newRoleModule = roleCode.methods ? roleCode.methods : [];
        let getRole = newRoleModule.find(elm => elm.name === 'GET');
        let putRole = newRoleModule.find(elm => elm.name === 'PUT');
        getRole = getRole && getRole.allow;
        putRole = putRole && putRole.allow;
        // console.log(getRole,moduleCode,'dddd')
        return { getRole, putRole };
      };
      if (roles) {
        // this.setState({ synModuleLogRole: getRole('SynModuleLog')});
        // this.setState({ settingRole: getRole('RevenueExpenditure')});
        this.setState({ AdvanceRequire: getRole('AdvanceRequire') });
        this.setState({ ReimbursementRequire: getRole('ReimbursementRequire') });
        this.setState({ PaymentRequire: getRole('PaymentRequire') });
        // setSettingRole(getRole('setting'));
      }
    }
  }
  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { revenueAndExpenditure } = props;
      if (revenueAndExpenditure.recordList) {
        const recordList = revenueAndExpenditure.recordList || [];
        this.setState({ recordList });
      }
      if (revenueAndExpenditure.advanceRecordList) {
        const advanceRecordList = revenueAndExpenditure.advanceRecordList || [];
        this.setState({ advanceList: advanceRecordList });
      }
      if (revenueAndExpenditure.reibursementRecordList) {
        const reibursementList = revenueAndExpenditure.reibursementRecordList || [];
        this.setState({ reibursementList });
      }
      if (revenueAndExpenditure.paymentRecordList) {
        const paymentList = revenueAndExpenditure.paymentRecordList || [];
        this.setState({ paymentList });
      }
      this.state.pageDetail.totalCount = revenueAndExpenditure.count || 0;
      this.state.pageDetail.currentPage = Number(revenueAndExpenditure.skip || 0) || 0;
      this.state.pageDetail.pageSize = revenueAndExpenditure.limit || 0;

      if (props.history.value) {
        this.setState({ valueOfTab: props.history.value });
        props.history.value = undefined;
      }
    }
  }

  componentDidUpdate(props) {
    const { revenueAndExpenditure } = props;
    if (revenueAndExpenditure.successDelete) {
      this.props.onResetNoti();
      this.state.onDelete = false;
    }
  }
  handleTab(tab) {
    this.props.onChangeTab(tab);
  }

  callBack = (cmd, data) => {
    const { valueOfTab } = this.state;

    switch (cmd) {
      case 'quick-add': {
        if (valueOfTab === 0 || valueOfTab === 1 || valueOfTab === 2) {
          this.props.history.value = this.state.valueOfTab;
          const { history } = this.props;
          history.push({
            pathname: `/RevenueExpenditure/add`,
            state: { typeOfRecord: this.state.valueOfTab },
          });
          // this.props.history.push(`/RevenueExpenditure/add`);
        } else if (valueOfTab === 3) {
          this.props.history.push(`/RevenueExpenditure/advance/add`);
        } else if (valueOfTab === 4) {
          this.props.history.push(`/RevenueExpenditure/reimbursement/add`);
        } else if (valueOfTab === 5) {
          this.props.history.push(`/RevenueExpenditure/payment/add`);
        }

        // this.props.mergeData({ openDrawer: true });
        break;
      }

      case 'kanban-dragndrop':
        if (valueOfTab === 0 || valueOfTab === 1 || valueOfTab === 2) {
          this.props.updateRecord(data);
        } else if (valueOfTab === 3) {
          this.props.updateRecordAdvance(data);
        } else if (valueOfTab === 4) {
          this.props.updateRecordReibursement(data);
        } else if (valueOfTab === 5) {
          this.props.updateRecordPayment(data);
        }
        break;
      case 'CommentDialog': {
        this.setState({ openKanbanDialog: true, kanbanData: data });
        break;
      }
      default:
        break;
    }
  };
  mapFunctionAdvance = item => {
    // console.log(item,'itemitemitemitem');
    return {
      ...item,
      NAME: item.name,
      ['advancePerson.name']: item['advancePerson.name'],
    };
  };
  mapFunction = item => {
    return {
      ...item,
      bank: item['bank.name'] || '',
      ['performedBy.code']: item['performedBy.employeeId.name'] || item['performedBy.name'] || '',
      createDate: moment(item.createDate).format('MM/DD/yyyy'),
      createdAt: moment(item.createdAt).format('MM/DD/yyyy'),
      type: item.type === 0 ? 'Thu' : 'Chi',
      costType: item.costType === 0 ? 'Chi phí nội bộ' : 'Chi phí nhập hàng',
      payMethod: item.payMethod == 0 ? 'Tiền mặt' : item.payMethod == 1 ? 'Chuyển khoản' : item.payMethod == 2 ? 'Thẻ quà tặng' : 'khác',
    };
  };

  render() {
    const { classes, revenueAndExpenditure, intl, profile } = this.props;
    const { valueOfTab, recordList, advanceList, reibursementList, paymentList } = this.state;
    const { reload, tab } = revenueAndExpenditure;
    const newRecordList = recordList.map(item => dot.dot(item));
    const newAdvanceList = advanceList.map(item => dot.dot(item));
    const newReibursementList = reibursementList.map(item => dot.dot(item));
    const newPaymentList = paymentList.map(item => dot.dot(item));
    const Bt = props => (
      <Button
        onClick={() => {
          // this.setState({ tab: props.tab });
          this.handleTab(props.tab);
        }}
        {...props}
        color={props.tab === tab ? 'gradient' : 'simple'}
        right
        round
        size="sm"
      >
        {props.children}
      </Button>
    );

    return (
      <div>
        {revenueAndExpenditure.loading ? <LoadingIndicator /> : null}
        <Helmet>
          <title>Tài chính nội bộ </title>
          <meta name="description" content="Description of RevenueAndExpenditure" />
        </Helmet>
        <Grid>
          <Paper className={classes.paper}>
            <Tabs value={valueOfTab} indicatorColor="primary" onChange={this.handleChangeTabValue}>
              <Tab
                label={
                  <Badge color="primary" badgeContent={revenueAndExpenditure.internalCost || 0} max={9999}>
                    <Typography className={classes.padding}>Nội bộ</Typography>
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge color="primary" badgeContent={revenueAndExpenditure.importCost || 0} max={9999}>
                    <Typography className={classes.padding}>Nhập hàng</Typography>
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge color="primary" badgeContent={revenueAndExpenditure.exportCost || 0} max={9999}>
                    <Typography className={classes.padding}>Bán hàng</Typography>
                  </Badge>
                }
              />
              {/* {console.log(this.state.AdvanceRequire,this.state.ReimbursementRequire,this.state.PaymentRequire,'ffffff')} */}
              {this.state.AdvanceRequire && this.state.AdvanceRequire.getRole ? (
                <Tab
                  label={
                    <Badge color="primary" badgeContent={revenueAndExpenditure.advanceRequire || 0} max={9999}>
                      <Typography className={classes.padding}>Tạm ứng</Typography>
                    </Badge>
                  }
                />
              ) : null}
              {this.state.ReimbursementRequire && this.state.ReimbursementRequire.getRole ? (
                <Tab
                  label={
                    <Badge color="primary" badgeContent={revenueAndExpenditure.reimbursementRequire || 0} max={9999}>
                      <Typography className={classes.padding}>Hoàn ứng</Typography>
                    </Badge>
                  }
                />
              ) : null}
              {this.state.PaymentRequire && this.state.PaymentRequire.getRole ? (
                <Tab
                  label={
                    <Badge color="primary" badgeContent={revenueAndExpenditure.paymentRequire || 0} max={9999}>
                      <Typography className={classes.padding}>Thanh toán</Typography>
                    </Badge>
                  }
                />
              ) : null}
            </Tabs>
            {valueOfTab === 0 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <>
                    {/* <TextField
                     select
                     onChange={this.handleChangeFilter}
                     value={this.state.valueOfFilter}
                     variant="outlined"
                     margin="normal"
                     style={{ width: '200px' }}
                   >
                     <MenuItem value={-1}>Tất cả</MenuItem>
                     <MenuItem value={1}>Chi</MenuItem>
                     <MenuItem value={0}>Thu</MenuItem>
                   </TextField> */}
                    <ListPage
                      height="620px"
                      code="RevenueExpenditure"
                      apiUrl={API_RNE}
                      exportExcel
                      kanban="ST19"
                      kanbanKey="_id"
                      withPagination
                      reload={reload}
                      onEdit={this.handleEditClick}
                      settingBar={[this.addClick()]}
                      disableAdd
                      filter={{
                        costType: this.state.valueOfTab,
                      }}
                      mapFunction={this.mapFunction}
                      configImport={[{ type: "0:Thu;1:Chi" }]}
                      typeTab={[{ costType: 0 }]}
                    />
                    {/* <HOCTable
                     disableImport
                     enablePaging={false}
                     onRef={ref => (this.HOCTable = ref)}
                     handleEditClick={this.handleEditClick}
                     handleAddClick={this.handleAddClick}
                     handleDeleteClick={this.handleDeleteClick}
                     customColumns={[
                       {
                         columnName: 'amount',
                         CustomComponent: CustomAmount,
                       },
                       {
                         columnName: 'tax',
                         CustomComponent: CustomTax,
                       },
                       {
                         columnName: 'type',
                         CustomComponent: CustomType,
                       },
                       {
                         columnName: 'costType',
                         CustomComponent: CustomCostType,
                       },
                       {
                         columnName: 'expenseType',
                         CustomComponent: CustomExpenseType,
                       },
                     ]}
                     path="/crm/RevenueExpenditure"
                     collectionCode="RevenueExpenditure"
                     disableSearchField={['updateAt', 'createdAt', 'payMethod']}
                     dialogTitle="Thu chi"
                     data={newRecordList}
                     enableEdit
                     enableApproved
                     pageDetail={this.state.pageDetail} // phân trang
                     onGetAPI={this.onGetAllItemsCustom}
                     enableServerPaging
                   /> */}
                  </>
                )}
                {tab === 1 && (
                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    // enableTotal
                    enableAdd
                    callBack={this.callBack}
                    titleField="reason" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_RNE}`}
                    code={valueOfTab === 0 ? 'ST19' : valueOfTab === 1 ? 'ST250' : 'ST251'} // code của danh sách trạng thái kanban
                    type={{ typeOfRecord: this.state.valueOfTab }}
                    filter={{
                      costType: this.state.valueOfTab,
                    }}
                    // customFilter={
                    //   <React.Fragment>
                    //      <Grid container spacing={16}>
                    //       <Grid item xs={4}>
                    //             <DepartmentAndEmployee
                    //               department={this.state.kanbanFilter.organizationUnit}
                    //               employee={this.state.kanbanFilter.employee ? this.state.kanbanFilter.employee : ''}
                    //               onChange={this.handleChangeDepartmentAndEmployeeKanban}
                    //               profile={profile}
                    //             />
                    //           </Grid>
                    //      </Grid>
                    //   </React.Fragment>
                    // }
                    customContent={customContent1}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/edit"

                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => { }}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_RNE}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
            {valueOfTab === 1 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <>
                    {/* <TextField
                     select
                     onChange={this.handleChangeFilter}
                     value={this.state.valueOfFilter}
                     variant="outlined"
                     margin="normal"
                     style={{ width: '200px' }}
                   >
                     <MenuItem value={-1}>Tất cả</MenuItem>
                     <MenuItem value={1}>Chi</MenuItem>
                     <MenuItem value={0}>Thu</MenuItem>
                   </TextField> */}
                    <ListPage
                      height="620px"
                      code="RevenueExpenditure"
                      apiUrl={API_RNE}
                      exportExcel
                      kanban="ST250"
                      kanbanKey="_id"
                      withPagination
                      reload={reload}
                      onEdit={this.handleEditClick}
                      settingBar={[this.addClick()]}
                      disableAdd
                      filter={{
                        costType: this.state.valueOfTab,
                      }}
                      mapFunction={this.mapFunction}
                      configImport={[{ type: "0:Thu;1:Chi" }]}
                      typeTab={[{ costType: 1 }]}

                    />
                    {/* <HOCTable
                     disableImport
                     enablePaging={false}
                     onRef={ref => (this.HOCTable = ref)}
                     handleEditClick={this.handleEditClick}
                     handleAddClick={this.handleAddClick}
                     handleDeleteClick={this.handleDeleteClick}
                     customColumns={[
                       {
                         columnName: 'amount',
                         CustomComponent: CustomAmount,
                       },
                       {
                         columnName: 'tax',
                         CustomComponent: CustomTax,
                       },
                       {
                         columnName: 'type',
                         CustomComponent: CustomType,
                       },
                       {
                         columnName: 'costType',
                         CustomComponent: CustomCostType,
                       },
                       {
                         columnName: 'expenseType',
                         CustomComponent: CustomExpenseType,
                       },
                     ]}
                     path="/crm/RevenueExpenditure"
                     collectionCode="RevenueExpenditure"
                     disableSearchField={['updateAt', 'createdAt', 'payMethod']}
                     dialogTitle="Thu chi"
                     data={newRecordList}
                     enableEdit
                     enableApproved
                     pageDetail={this.state.pageDetail} // phân trang
                     onGetAPI={this.onGetAllItemsCustom}
                     enableServerPaging
                   /> */}
                  </>
                )}
                {tab === 1 && (
                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    // enableTotal
                    enableAdd
                    callBack={this.callBack}
                    titleField="reason" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_RNE}`}
                    code={valueOfTab === 0 ? 'ST19' : valueOfTab === 1 ? 'ST250' : 'ST251'} // code của danh sách trạng thái kanban
                    type={{ typeOfRecord: this.state.valueOfTab }}
                    filter={{
                      costType: this.state.valueOfTab,
                    }}
                    // customFilter={
                    //   <React.Fragment>
                    //      <Grid container spacing={16}>
                    //       <Grid item xs={4}>
                    //             <DepartmentAndEmployee
                    //               department={this.state.kanbanFilter.organizationUnit}
                    //               employee={this.state.kanbanFilter.employee ? this.state.kanbanFilter.employee : ''}
                    //               onChange={this.handleChangeDepartmentAndEmployeeKanban}
                    //               profile={profile}
                    //             />
                    //           </Grid>
                    //      </Grid>
                    //   </React.Fragment>
                    // }
                    customContent={customContent}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/edit"
                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => { }}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_RNE}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
            {valueOfTab === 2 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <>
                    {/* <TextField
                     select
                     onChange={this.handleChangeFilter}
                     value={this.state.valueOfFilter}
                     variant="outlined"
                     margin="normal"
                     style={{ width: '200px' }}
                   >
                     <MenuItem value={-1}>Tất cả</MenuItem>
                     <MenuItem value={1}>Chi</MenuItem>
                     <MenuItem value={0}>Thu</MenuItem>
                   </TextField> */}
                    <ListPage
                      height="620px"
                      code="RevenueExpenditure"
                      apiUrl={API_RNE}
                      exportExcel
                      kanban="ST251"
                      kanbanKey="_id"
                      withPagination
                      reload={reload}
                      onEdit={this.handleEditClick}
                      settingBar={[this.addClick()]}
                      disableAdd
                      filter={{
                        costType: this.state.valueOfTab,
                      }}
                      mapFunction={this.mapFunction}
                      configImport={[{ type: "0:Thu;1:Chi" }]}
                      typeTab={[{ costType: 2 }]}
                    />
                    {/* <HOCTable
                     disableImport
                     enablePaging={false}
                     onRef={ref => (this.HOCTable = ref)}
                     handleEditClick={this.handleEditClick}
                     handleAddClick={this.handleAddClick}
                     handleDeleteClick={this.handleDeleteClick}
                     customColumns={[
                       {
                         columnName: 'amount',
                         CustomComponent: CustomAmount,
                       },
                       {
                         columnName: 'tax',
                         CustomComponent: CustomTax,
                       },
                       {
                         columnName: 'type',
                         CustomComponent: CustomType,
                       },
                       {
                         columnName: 'costType',
                         CustomComponent: CustomCostType,
                       },
                       {
                         columnName: 'expenseType',
                         CustomComponent: CustomExpenseType,
                       },
                     ]}
                     path="/crm/RevenueExpenditure"
                     collectionCode="RevenueExpenditure"
                     disableSearchField={['updateAt', 'createdAt', 'payMethod']}
                     dialogTitle="Thu chi"
                     data={newRecordList}
                     enableEdit
                     enableApproved
                     pageDetail={this.state.pageDetail} // phân trang
                     onGetAPI={this.onGetAllItemsCustom}
                     enableServerPaging
                   /> */}
                  </>
                )}
                {tab === 1 && (
                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    // enableTotal
                    enableAdd
                    callBack={this.callBack}
                    titleField="reason" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_RNE}`}

                    type={{ typeOfRecord: this.state.valueOfTab }}
                    code={valueOfTab === 0 ? 'ST19' : valueOfTab === 1 ? 'ST250' : 'ST251'} // code của danh sách trạng thái kanban
                    filter={{
                      costType: this.state.valueOfTab,
                    }}
                    // customFilter={
                    //   <React.Fragment>
                    //      <Grid container spacing={16}>
                    //       <Grid item xs={4}>
                    //             <DepartmentAndEmployee
                    //               department={this.state.kanbanFilter.organizationUnit}
                    //               employee={this.state.kanbanFilter.employee ? this.state.kanbanFilter.employee : ''}
                    //               onChange={this.handleChangeDepartmentAndEmployeeKanban}
                    //               profile={profile}
                    //             />
                    //           </Grid>
                    //      </Grid>
                    //   </React.Fragment>
                    // }
                    customContent={customContent}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/edit"
                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => { }}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_RNE}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
            {valueOfTab === 3 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <ListPage
                    height="620px"
                    code="AdvanceRequire"
                    apiUrl={API_RNE_ADVANCE}
                    exportExcel
                    // kanban="ST19"
                    kanban="ST254"
                    kanbanKey="_id"
                    withPagination
                    reload={reload}
                    onEdit={this.handleEditAdvanceClick}
                    settingBar={[this.addAdvanceClick()]}
                    disableAdd
                    mapFunction={this.mapFunctionAdvance}
                  />
                  // <HOCTable
                  //   disableImport
                  //   enablePaging={false}
                  //   onRef={ref => (this.HOCTable = ref)}
                  //   handleEditClick={this.handleEditAdvanceClick}
                  //   handleAddClick={this.handleAddAdvanceClick}
                  //   handleDeleteClick={this.handleDeleteClick}
                  //   customColumns={[]}
                  //   path="/crm/AdvanceRequire"
                  //   collectionCode="AdvanceRequire"
                  //   disableSearchField={['updateAt', 'createdAt', 'advanceDate', 'approvalStatus']}
                  //   data={newAdvanceList}
                  //   enableEdit
                  //   enableApproved
                  //   pageDetail={this.state.pageDetail} // phân trang
                  //   onGetAPI={this.props.onGetAdvanceRecord}
                  //   enableServerPaging
                  // />
                )}
                {tab === 1 && (
                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    enableTotal
                    callBack={this.callBack}
                    titleField="code" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_RNE_ADVANCE}`}
                    code="ST254" // code của danh sách trạng thái kanban
                    filter={this.state.kanbanFilter}
                    // customFilter={
                    //   <React.Fragment>
                    //      <Grid container spacing={16}>
                    //       <Grid item xs={4}>
                    //             <DepartmentAndEmployee
                    //               department={this.state.kanbanFilter.organizationUnit}
                    //               employee={this.state.kanbanFilter.employee ? this.state.kanbanFilter.employee : ''}
                    //               onChange={this.handleChangeDepartmentAndEmployeeKanban}
                    //               profile={profile}
                    //             />
                    //           </Grid>
                    //      </Grid>
                    //   </React.Fragment>
                    // }
                    customContent={customContentAd}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/advance/edit"
                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => { }}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_RNE_ADVANCE}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
            {valueOfTab === 4 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <ListPage
                    height="620px"
                    code="ReimbursementRequire"
                    apiUrl={API_RNE_REMBUR}
                    exportExcel
                    kanban="ST255"
                    kanbanKey="_id"
                    withPagination
                    reload={reload}
                    onEdit={this.handleEditReimbursementClick}
                    settingBar={[this.addReimbursementClick()]}
                    disableAdd
                    mapFunction={this.mapFunction}
                  />
                  // <HOCTable
                  //   disableImport
                  //   enablePaging={false}
                  //   onRef={ref => (this.HOCTable = ref)}
                  //   handleEditClick={this.handleEditReimbursementClick}
                  //   handleAddClick={this.handleAddReimbursementClick}
                  //   handleDeleteClick={this.handleDeleteClick}
                  //   customColumns={[]}
                  //   disableSearchField={['updateAt', 'createdAt', 'file', 'approvalStatus']}
                  //   path="/crm/ReimbursementRequire"
                  //   collectionCode="ReimbursementRequire"
                  //   data={newReibursementList}
                  //   enableEdit
                  //   // enableApproved
                  //   pageDetail={this.state.pageDetail} // phân trang
                  //   onGetAPI={this.props.onGetReibursementRecord}
                  //   enableServerPaging
                  // />
                )}
                {tab === 1 && (

                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    enableTotal
                    callBack={this.callBack}
                    titleField="code" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_RNE_REMBUR}`}
                    code="ST255" // code của danh sách trạng thái kanban
                    filter={this.state.kanbanFilter}
                    customContent={customContentRei}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/reimbursement/edit"
                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => { }}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_RNE_REMBUR}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
            {valueOfTab === 5 ? (
              <TabContainer>
                <Grid container>
                  <Grid item sm={12}>
                    <Bt tab={1}>Kanban</Bt>
                    <Bt tab={0}>Danh sách</Bt>
                  </Grid>
                </Grid>
                {tab === 0 && (
                  <ListPage
                    height="620px"
                    code="PaymentRequire"
                    apiUrl={API_PAYMENT}
                    exportExcel
                    kanban="ST256"
                    kanbanKey="_id"
                    withPagination
                    reload={reload}
                    onEdit={this.handleEditPaymentClick}
                    settingBar={[this.addPaymentClick()]}
                    disableAdd
                  // mapFunction={this.mapFunction}
                  />
                  // <HOCTable
                  //   disableImport
                  //   enablePaging={false}
                  //   onRef={ref => (this.HOCTable = ref)}
                  //   handleEditClick={this.handleEditPaymentClick}
                  //   handleAddClick={this.hanldeAddPaymentClick}
                  //   handleDeleteClick={this.handleDeleteClick}
                  //   customColumns={[]}
                  //   path="/crm/PaymentRequire"
                  //   disableSearchField={['updateAt', 'createdAt', 'file', 'approvalStatus']}
                  //   collectionCode="PaymentRequire"
                  //   data={newPaymentList}
                  //   enableEdit
                  //   enableApproved
                  //   pageDetail={this.state.pageDetail} // phân trang
                  //   onGetAPI={this.props.onGetPaymentRecord}
                  //   enableServerPaging
                  // />
                )}
                {tab === 1 && (
                  <Kanban
                    dashboardPage={this.props.dashboardPage}
                    isOpenSinglePage
                    statusType="crmStatus"
                    enableTotal
                    callBack={this.callBack}
                    titleField="code" // tên trường sẽ lấy làm title trong kanban
                    // callBack={this.callBack} // sự kiện trả về kanban
                    // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                    // data={bos} // list dữ liệu
                    reload={reload}
                    path={`${API_PAYMENT}`}
                    code="ST256" // code của danh sách trạng thái kanban
                    filter={this.state.kanbanFilter}
                    customContent={customContentPayment}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params="RevenueExpenditure/payment/edit"
                  />
                )}
                <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
                  <BODialog
                    setCoverTask={() => { }}
                    profile={profile}
                    taskId={this.state.kanbanData._id}
                    // filterItem={innerFilterItem}
                    data={this.state.kanbanData}
                    API={API_PAYMENT}
                    customContent={customContent}
                  />
                </Dialog>
              </TabContainer>
            ) : (
              ''
            )}
          </Paper>
        </Grid>
        <Dialog
          open={this.state.onDelete}
          onClose={this.handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Bạn có chắc chắn muốn xóa?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={() => this.handleDelete()}>
              LƯU
            </Button>
            <Button variant="outlined" onClick={this.handleCloseDelete} color="secondary" autoFocus>
              hủy
            </Button>
          </DialogActions>
        </Dialog>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  onGetAllItemsCustom = params1 => {
    let body = '';
    body = serialize(params1);
    const { valueOfFilter } = this.state;
    let { valueOfTab } = this.state;
    if (this.props.history.value) {
      valueOfTab = this.props.history.value;
    }
    let params = {
      filter: {
        costType: valueOfTab,
      },
    };
    if (Number(valueOfFilter) !== -1) {
      params = {
        filter: {
          costType: valueOfTab,
          type: valueOfFilter,
        },
      };
    }
    body += `&${serialize(params)}`;
    this.setState({ body });
    this.props.onGetAllRecord(body);
  };

  handleChangeFilter = e => {
    const filter = {
      filter: {
        type: e.target.value,
        costType: this.state.valueOfTab,
      },
      skip: 0,
      limit: 5,
    };
    if (Number(e.target.value) === -1) {
      const filter1 = {
        filter: {
          costType: this.state.valueOfTab,
        },
        skip: 0,
        limit: 5,
      };
      this.props.onGetAllRecord(serialize(filter1));
    } else {
      this.props.onGetAllRecord(serialize(filter));
    }
    this.setState({ valueOfFilter: e.target.value });
  };

  handleDelete = () => {
    const { valueOfTab } = this.state;
    if (valueOfTab === 0 || valueOfTab === 1 || valueOfTab === 2) {
      this.props.onDelete(this.state.arrDelete);
    }
    if (valueOfTab === 3) {
      this.props.onDeleteAdvance(this.state.arrDelete);
    }
    if (valueOfTab === 4) {
      this.props.onDeleteReibursement(this.state.arrDelete);
    }
    if (valueOfTab === 5) {
      this.props.onDeletePayment(this.state.arrDelete);
    }
  };

  handleCloseDelete = () => {
    this.setState({ onDelete: false });
  };

  handleDeleteClick = item => {
    const { recordList, advanceList, reibursementList, valueOfTab, paymentList } = this.state;
    const arrDelete = [];
    if (valueOfTab === 0 || valueOfTab === 1 || valueOfTab === 2) {
      item.forEach(n => {
        arrDelete.push(recordList[n]._id);
      });
    } else if (valueOfTab === 3) {
      item.forEach(n => {
        arrDelete.push(advanceList[n]._id);
      });
    } else if (valueOfTab === 4) {
      item.forEach(n => {
        arrDelete.push(reibursementList[n]._id);
      });
    } else {
      item.forEach(n => {
        arrDelete.push(paymentList[n]._id);
      });
    }
    this.setState({ onDelete: true, arrDelete });
  };

  handleChangeTabValue = (event, value) => {
    this.setState({ tab: 0 });
    const pageDetail = {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    };
    if (Number(value) === 3) {
      this.props.onResetList();
      // this.props.onGetAdvanceRecord();
      this.setState({ recordList: [], reibursementList: [], paymentList: [] });
    } else if (Number(value) === 0 || Number(value) === 1 || Number(value) === 2) {
      this.props.onResetList();
      const { valueOfFilter } = this.state;
      const filter = {
        filter: {
          type: valueOfFilter,
          costType: value,
        },
        skip: 0,
        limit: 5,
      };
      if (Number(valueOfFilter) === -1) {
        const filter1 = {
          filter: {
            costType: value,
          },
          skip: 0,
          limit: 5,
        };
        this.setState({ body: serialize(filter1), reload: true });
        this.props.onGetAllRecord(serialize(filter1));
      } else {
        this.setState({ body: serialize(filter), reload: true });
        this.props.onGetAllRecord(serialize(filter));
      }
      this.setState({ advanceList: [], reibursementList: [], paymentList: [] });
    } else if (Number(value) === 4) {
      this.props.onResetList();
      // this.props.onGetReibursementRecord();
      this.setState({ recordList: [], advanceList: [], paymentList: [] });
    } else if (Number(value) === 5) {
      this.props.onResetList();
      // this.props.onGetPaymentRecord();
      this.setState({ recordList: [], advanceList: [], reibursementList: [] });
    }
    this.setState({ valueOfTab: value, pageDetail, reload: true });
  };

  handleEditClick = item => {
    this.props.history.value = this.state.valueOfTab;
    const { history } = this.props;
    history.push({
      pathname: `/RevenueExpenditure/edit/${item._id}`,
      state: { typeOfRecord: this.state.valueOfTab, add: false, dataItem: item },
    });
  };

  handleEditAdvanceClick = item => {

    this.props.history.value = this.state.valueOfTab;
    const { history } = this.props;
    history.push({
      pathname: `/RevenueExpenditure/advance/edit/${item._id}`,
      state: { typeOfRecord: this.state.valueOfTab, add: false, dataItem: item },
    });
  };

  handleEditReimbursementClick = item => {
    this.props.history.value = this.state.valueOfTab;
    const { history } = this.props;
    history.push({
      pathname: `/RevenueExpenditure/reimbursement/edit/${item._id}`,
      state: { typeOfRecord: this.state.valueOfTab, add: false, dataItem: item },
    });
  };

  handleEditPaymentClick = item => {
    this.props.history.value = this.state.valueOfTab;
    const { history } = this.props;
    history.push({
      pathname: `/RevenueExpenditure/payment/edit/${item._id}`,
      state: { typeOfRecord: this.state.valueOfTab, add: false, dataItem: item },
    });
  };

  hanldeAddPaymentClick = () => {
    this.props.history.value = this.state.valueOfTab;
    this.props.history.push({
      pathname: '/RevenueExpenditure/payment/add',
      state: { typeOfRecord: this.state.valueOfTab, add: true },
    });
  };

  addPaymentClick = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.hanldeAddPaymentClick} />
    </Tooltip>
  );

  handleAddReimbursementClick = () => {
    this.props.history.value = this.state.valueOfTab;
    this.props.history.push({
      pathname: '/RevenueExpenditure/reimbursement/add',
      state: { typeOfRecord: this.state.valueOfTab, add: true },
    });
  };

  addReimbursementClick = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddReimbursementClick} />
    </Tooltip>
  );

  handleAddClick = () => {
    this.props.history.value = this.state.valueOfTab;
    this.props.history.push({
      pathname: '/RevenueExpenditure/add',
      state: { typeOfRecord: this.state.valueOfTab, add: true },
    });
  };

  addClick = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddClick} />
    </Tooltip>
  );

  handleAddAdvanceClick = () => {
    this.props.history.value = this.state.valueOfTab;
    this.props.history.push({
      pathname: '/RevenueExpenditure/advance/add',
      state: { typeOfRecord: this.state.valueOfTab, add: true },
    });
  };

  addAdvanceClick = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddAdvanceClick} />
    </Tooltip>
  );
}

RevenueAndExpenditure.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  revenueAndExpenditure: makeSelectRevenueAndExpenditure(),
  profile: makeSelectEditProfilePage(),
  dashboardPage: makeSelectDashboardPage(),
});

function TabContainer(props) {
  return <Grid>{props.children}</Grid>;
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllRecord: params => {
      dispatch(getAllRecordAct(params));
    },
    onDelete: body => {
      dispatch(deleteRecordAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
    },
    onResetList: () => {
      dispatch(resetList());
    },
    onGetAdvanceRecord: body => {
      dispatch(getAdvanceRecordAct(body));
    },
    onGetPaymentRecord: body => {
      dispatch(getPaymentRecordAct(body));
    },
    onDeleteAdvance: body => {
      dispatch(deleteAdvanceRecordAct(body));
    },
    onGetReibursementRecord: body => {
      dispatch(getReibursementRecordAct(body));
    },
    onDeleteReibursement: body => {
      dispatch(deleteReibursementRecordAct(body));
    },
    onDeletePayment: body => {
      dispatch(deletePaymentRecordAct(body));
    },
    updateRecord: body => dispatch(updateRecord(body)),
    updateRecordAdvance: body => dispatch(updateRecordAdvance(body)),
    updateRecordReibursement: body => dispatch(updateRecordReibursement(body)),
    updateRecordPayment: body => dispatch(updateRecordPayment(body)),
    mergeDataRevenueAndExpenditure: val => {
      dispatch(mergeDataRevenueAndExpenditure(val));
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

const withReducer = injectReducer({ key: 'revenueAndExpenditure', reducer });
const withSaga = injectSaga({ key: 'revenueAndExpenditure', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(RevenueAndExpenditure);
const customContent1 = [
  {
    title: 'Nhân viên',
    fieldName: 'performedBy.name',
    type: 'string',
  },
  {
    title: 'Giá trị',
    fieldName: 'amount',
    type: 'number',
  },
];
const customContent = [
  {
    title: 'Nhân viên',
    fieldName: 'performedBy.name',
    type: 'string',
  },
  {
    title: 'Khách hàng',
    fieldName: 'customer.name',
    type: 'string',
  },
  {
    title: 'Giá trị',
    fieldName: 'amount',
    type: 'number',
  },
];
const customContentPayment = [
  {
    title: 'Mã đơn hàng',
    fieldName: 'code',
    type: 'string',
  },
  {
    title: 'Nhân viên',
    fieldName: 'advancePerson.name',
    type: 'string',
  },
  {
    title: 'Tổng số tiền',
    fieldName: 'totalPayment',
    type: 'number',
  },
];
const customContentRei = [
  {
    title: 'Tên tạm ứng',
    fieldName: 'advanceRequireNumber.name',
    type: 'string',
  },
  {
    title: 'Nhân viên',
    fieldName: 'advancePerson.name',
    type: 'string',
  },
  {
    title: 'Số tiền hoàn ứng',
    fieldName: 'totalAmount',
    type: 'number',
  },
];
const customContentAd = [
  {
    title: 'Mã tạm ứng',
    fieldName: 'code',
    type: 'string',
  },
  {
    title: 'Nhân viên',
    fieldName: 'advancePerson.name',
    type: 'string',
  },
  {
    title: 'Tổng số tiền',
    fieldName: 'items[0].amount',
    type: 'number',
  },
];