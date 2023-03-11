/**
 *
 * CustomersPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Tabs, Tab, Avatar, Grid, Menu, MenuItem } from '@material-ui/core';
import GridUI from '@material-ui/core/Grid';
import { API_CUSTOMERS, API_TEMPLATE } from 'config/urlConfig';
import { injectIntl } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { withStyles } from '@material-ui/core/styles';
import avatarDefault from '../../images/default-avatar.png';
import ListAsync from '../../components/List';
import makeSelectDashboardPage, { makeSelectProfile } from '../Dashboard/selectors';
import { makeSelectCustomersPage, makeSelectAddCustomerPage } from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styles from './styles';
import CustomerDashboard from '../../components/CustomerDashboard';
import AdvanceFilterAndListFilterTags from '../../components/Filter/AdvanceFilterAndListFilterTags';
import SelectManagerDialog from '../../components/CustomDialog/SelectMangerDialog';
import VerticalDepartmentTree from '../../components/Filter/VerticalDepartmentTree';
import { clientId } from '../../variable';
import { fetchData } from '../../helper';
import { mergeData as mergeDataReport } from '../ReportReportCustomer/actions';
import { fetchAction, deleteCustomers, putConfig, changeIndex, mergeData, updateMultipleCustomers, createCampaign, changeTabAct } from './actions';
import { CUSTOMER_TYPE_CODE } from '../../utils/constants';
import { Fab } from 'components/LifetekUi';
import { Dehaze } from '@material-ui/icons';
import moment from 'moment';
import Kanban from '../KanbanPlugin';
import Automation from '../PluginAutomation/Loadable';
import { Dialog } from '../../components/LifetekUi';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
import CustomButton from 'components/CustomButtons/Button';
import LoadingIndicator from '../../components/LoadingIndicator';
import { putCustomer } from '../AddCustomerPage/actions';
import { changeSnackbar } from '../../containers/Dashboard/actions';

const newColumns = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === CUSTOMER_TYPE_CODE)) || {
    data: [],
  }
).data;
const groupCustomer = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S07')) || { data: [] }
).data;
const branchesCustomer = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'pckh')) || { data: [] }
).data;
const areasCustomer = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S10')) || { data: [] }
).data;
const contactMethod = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S06')) || { data: [] }
).data;
const typeProduct = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S02')) || { data: [] }
).data;
const career = (
  (JSON.parse(localStorage.getItem('crmSource')) && JSON.parse(localStorage.getItem('crmSource')).find(item => item.code === 'S12')) || { data: [] }
).data;

/* eslint-disable react/prefer-stateless-function */
export class CustomersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countCustomer: 0,
      openSelectManager: false,
      openRevokeManger: false,
      openCreateManger: false,
      anchorEl: null,
      advanceSearchQuery: {},
      selectedCustomers: [],
      emailTemplates: [],
      kanbanFilter: {},
      bos: [],
      kanbanData: {},
      openKanbanDialog: false,
      crmStatusSteps: [],
      totalCount: 0,
      pageDetail: {
        currentPage: 0,
        pageSize: 0,
        totalCount: 0,
      },
      customersList: [],
    };
  }

  componentDidMount() {
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST18')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus &&
      currentCrmStatus.data != 'undefined' &&
      currentCrmStatus.data.forEach(item => {
        switch (item.code) {
          case 1:
            laneStart.push(item);
            break;
          case 2:
            laneAdd.push(item);
            break;

          case 3:
            laneSucces.push(item);
            break;

          case 4:
            laneFail.push(item);
            break;

          default:
            break;
        }
      });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    this.setState({ crmStatusSteps: sortedKanbanStatus });

    this.props.listCustomer();

    fetchData(`${API_TEMPLATE}?clientId=${clientId}`)
      .then(templates => {
        const templatesItem = templates ? templates.filter(elm => elm.moduleCode === 'Customer' && elm.clientId === clientId) : [];
        this.setState({ emailTemplates: templatesItem });
      })
      .catch(() => { });

    fetch(`${API_CUSTOMERS}?status=1`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => this.setState({ countCustomer: data.count }));
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { customersPage } = props;
      let customersList = [];
      if (customersPage.allCustomers) {
        customersList = customersPage.allCustomers || [];
      }
      const totalCount = customersPage.count || 0;
      this.state.pageDetail.totalCount = customersPage.count || 0;
      this.state.pageDetail.currentPage = Number(customersPage.skip || 0) || 0;
      this.state.pageDetail.pageSize = customersPage.limit || 0;
      this.setState({ customersList, totalCount });
    }
  }

  componentDidUpdate(props) {
    const { customersPage } = props;
    if (customersPage.successDelete) {
      this.props.onResetNoti();
      this.state.onDelete = false;
    }
  }

  addColumn(columns) {
    return [...columns, { name: 'edit', title: 'Sửa', checked: true }];
  }

  getOrder(columns) {
    const columnOrder = [];

    // Method 1
    columns.sort((a, b) => a.order - b.order);
    columns.forEach(element => {
      columnOrder.push(element.name);
    });

    // Method 2
    // columnOrder = Array.from({ length: columns.length }, (u, v) => v);
    // columns.forEach(element => {
    //   columnOrder.splice(element.order, 1, element.name);
    // });
    return columnOrder;
  }

  mergeData = data => {
    this.props.mergeData(data);
  };

  mapFunctionCustomer = item => {
    const typeCustomer = newColumns.find(elm => elm.value === item['detailInfo.typeCustomer.typeOfCustomer']);
    const group = groupCustomer.find(elm => elm.value === item['detailInfo.typeCustomer.group']);
    const branches = branchesCustomer.find(elm => elm.value === item['detailInfo.typeCustomer.branches']);
    const areas = areasCustomer.find(elm => elm.value === item['provincial']);
    const careers = career.find(
      elm =>
        elm.value === item.originItem &&
        item.originItem.detailInfo &&
        item.originItem.detailInfo.typeCustomer &&
        item.originItem.detailInfo.typeCustomer.career &&
        Array.isArray(item.originItem.detailInfo.typeCustomer.career) &&
        item.originItem.detailInfo.typeCustomer.career.length > 0 &&
        item.originItem.detailInfo.typeCustomer.career[0],
    );
    const contactMethods = contactMethod.find(
      elm =>
        elm.value === item.originItem &&
        item.originItem.detailInfo &&
        item.originItem.detailInfo.typeCustomer &&
        item.originItem.detailInfo.typeCustomer.contactWays &&
        Array.isArray(item.originItem.detailInfo.typeCustomer.contactWays) &&
        item.originItem.detailInfo.typeCustomer.contactWays.length > 0 &&
        item.originItem.detailInfo.typeCustomer.contactWays[0],
    );
    const typeProducts = typeProduct.find(
      elm =>
        elm.value === item.originItem &&
        item.originItem.detailInfo &&
        item.originItem.detailInfo.typeCustomer &&
        item.originItem.detailInfo.typeCustomer.productType &&
        Array.isArray(item.originItem.detailInfo.typeCustomer.productType) &&
        item.originItem.detailInfo.typeCustomer.productType.length > 0 &&
        item.originItem.detailInfo.typeCustomer.productType[0],
    );
    const areas2 = areasCustomer.find(
      elm =>
        elm.value === item.originItem &&
        item.originItem.detailInfo &&
        item.originItem.detailInfo.typeCustomer &&
        item.originItem.detailInfo.typeCustomer.areas &&
        Array.isArray(item.originItem.detailInfo.typeCustomer.areas) &&
        item.originItem.detailInfo.typeCustomer.contactWays.areas > 0 &&
        item.originItem.detailInfo.typeCustomer.areas[0],
    );
    return {
      ...item,
      name: (
        // eslint-disable-next-line react/button-has-type
        <button style={{ color: '#0b99e0', cursor: 'pointer' }} onClick={e => this.handleReport(e, item)}>
          {item.name}
        </button>
      ),
      'detailInfo.typeCustomer.typeOfCustomer': typeCustomer ? typeCustomer.title : '',
      type: typeCustomer ? typeCustomer.title : '',
      provincial: areas ? areas.title : '',
      'detailInfo.typeCustomer.group': group ? group.title : '',
      'detailInfo.typeCustomer.branches': branches ? branches.title : '',
      'detailInfo.typeCustomer.contactWays': contactMethods ? contactMethods.title : '',
      'detailInfo.typeCustomer.career': careers ? careers.title : '',
      'detailInfo.typeCustomer.productType': typeProducts ? typeProducts.title : '',
      'detailInfo.typeCustomer.areas': areas2 ? areas2.title : '',
      // 'detailInfo.typeCustomer.contactWays': item.detailInfo.typeCustomer.contactWays ? item.detailInfo.typeCustomer.contactWays[0]: null,
      avatar: <Avatar src={item.avatar ? `${item.avatar}?allowDefault=true` : avatarDefault} />,
      gender: item.gender === 'male' ? 'Nam' : item.gender === 'female' ? 'Nữ' : 'Không xác định',
      createdBy: item['createdBy.name'],
      birthDay:
        item.birthDay && moment(item.birthDay, 'YYYY-MM-DD').isValid()
          ? moment(item.birthDay, 'YYYY-MM-DD').format(localStorage.getItem('dateFomat') || 'DD/MM/YYYY')
          : item.birthDay,
      managerEmployee: item['managerEmployee.name'],
      isTax: item.isTax === true ? 'true' : 'false',
      organizationUnitId: item.organizationUnitIdCode ? item.organizationUnitIdCode : item.organizationUnitId,
    };
  };

  check(dt) {
    if (!dt.managerEmployee) delete dt.managerEmployee;
    if (!dt.viewableEmployees) delete dt.viewableEmployees;
    return dt;
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleTab(tab) {
    this.props.onChangeTab(tab);
  }
  handlePutCustomer = (id, data) => {
    // fetchData(`${API_CUSTOMERS}/${id}`, "PUT", )
    fetchData(`${API_CUSTOMERS}/${id}`, 'PUT', data).then(() => {
      this.props.onChangeSnackbar({ status: true, message: 'Cập nhật thành công!', variant: 'success' });
    }).catch(() => {
      this.props.onChangeSnackbar({ status: true, message: 'Cập nhật thất bại!', variant: 'error' })
    })
  }
  callBack = (cmd, data) => {
    console.log(cmd, data)
    switch (cmd) {
      case 'create-bo':
        // console.log('xxx');
        // this.props.onAddBo(dot.object(data));
        this.props.history.push(`/crm/Customer/add`);
        break;
      case 'kanban-dragndrop-cus': {
        // fail
        console.log("sss")
        this.props.mergeData(data);
        // this.props.putCustomer(data._id, data)
        this.handlePutCustomer(data._id, data)

        break;
      }
      case 'quick-add': {
        this.props.history.push(`/crm/Customer/add`);
        // this.props.mergeData({ openDrawer: true });
        break;
      }
      case 'CommentDialog': {
        this.setState({ openKanbanDialog: true, kanbanData: data });
        break;
      }
      default:
        break;
    }
  };

  render() {
    const { classes, intl, customersPage, dashboardPage, profile } = this.props;
    const { allDepartment } = dashboardPage;
    const { tab, reload, updateMultipleSuccess } = customersPage;
    // const { reload, updateMultipleSuccess } = this.props.customersPage;
    const nameCallBack = 'cus';
    const Bt = props => (
      <CustomButton onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </CustomButton>
    );
    // const { filter } = customersPage;
    // console.log('VVVV', this.props.customersPage.typeCustomer);
    // const bussines = this.props.dashboardPage.roleCustomer.roles.find(i => i.code === 'BUSSINES').data;
    // const managerEmployee = bussines.find(i => i.name === 'managerEmployee').data;
    // const viewableEmployees = bussines.find(i => i.name === 'viewableEmployees').data;

    // const profile = this.props.dashboardPage.profile;
    return (
      <div>
        {/* <Tabs
          value={customersPage.valueForTabs}
          onChange={(e, index) => this.handleChangeIndex(index)}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="on"
        >
          <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Automation rules" />
          <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Dashboards" />
          <Tab
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label={`${intl.formatMessage(messages.danhsach || { id: 'danhsach', defaultMessage: 'danhsach' })}(${this.state.countCustomer})`}
          />
          <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Chia khách hàng" />
          <Tab disableRipple classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Kanban" />

          
          
        </Tabs> */}
        {customersPage.loading ? <LoadingIndicator /> : null}
        <Grid container style={{ width: '100%' }}>
          <Grid item md={12}>
            <Bt tab={4}>Kanban</Bt>
            <Bt tab={3}>Chia khách hàng</Bt>
            <Bt tab={0}>Danh sách</Bt>
            <Bt tab={1}>Dashboards</Bt>
            <Bt tab={2}>Automation rules</Bt>
          </Grid>

          <Grid item md={12}>
            {tab === 2 ? (
              <Automation
                code="ST18" // code của danh sách trạng thái kanban
                path="/crm/Customer" // path để lấy viewconfig (hiển thị danh sách các trường bắt trigger)
              />
            ) : null}
            {tab === 1 ? (
              <CustomerDashboard
                classes={classes}
                customers={customersPage.list}
                typeCustomer={customersPage.typeCustomer}
                introducedWay={customersPage.introducedWay}
                contractOfCustomer={customersPage.contractOfCustomer}
                bestRevenueCustomer={customersPage.bestRevenueCustomer}
              />
            ) : null}

            {tab === 0 ? (
              <ListAsync
                height="615px"
                deleteOption="customers"
                deleteUrl={`${API_CUSTOMERS}/remove-more`}
                apiUrl={API_CUSTOMERS}
                exportExcel
                code="Customer"
                kanbanKey="_id"
                share
                // advanceFilter={<AdvanceFilterAndListFilterTags onSearch={this.handleSearch} />}
                mapFunction={this.mapFunctionCustomer}
                kanban="ST18"
                ref={this.refCustomer}
                onChangeCountCustomer={value => this.onChangeCountCustomer(value)}
              />
            ) : null}
            {tab === 3 ? (
              <GridUI container item md={12} spacing={32}>
                <GridUI item md={3}>
                  <VerticalDepartmentTree
                    departments={allDepartment}
                    onChange={depart => {
                      try {
                        const { organizationUnitId, manageEmployeeId, ...rest } = this.state.advanceSearchQuery;
                        const newQuery = {
                          ...rest,
                        };
                        if (depart && depart._id) {
                          if (depart.username) {
                            // newQuery.manageEmployeeId = depart._id;
                            newQuery.viewableEmployees = { $in: depart._id };

                          } else {
                            newQuery.organizationUnitId = depart._id;
                          }
                        }
                        this.setState({ advanceSearchQuery: newQuery });
                      } catch (error) {
                        console.log('errr', error);
                      }
                    }}
                  />
                </GridUI>
                <GridUI item md={9}>
                  <MenuAction
                    handleClose={this.handleClose}
                    // openMenu={this.state.openMenu}
                    anchorEl={this.state.anchorEl}
                    openRevokeManger={this.openRevokeManger}
                    openSelectManager={this.onOpenSelectManager}
                    openCreateManger={this.openCreateManger}
                  />
                  <ListAsync
                    deleteOption="customers"
                    deleteUrl={`${API_CUSTOMERS}/remove-more`}
                    apiUrl={`${API_CUSTOMERS}/multiple`}
                    code="Customer"
                    share
                    disableSearch
                    reload={updateMultipleSuccess}
                    filter={this.state.advanceSearchQuery}
                    advanceFilter={
                      <Grid container spacing={24}>
                        <Grid item xs={8}>
                          <AdvanceFilterAndListFilterTags onSearch={this.handleSearch} org={allDepartment} />
                        </Grid>
                        <Grid item xs={4} style={{ alignItems: 'center', display: 'flex', justifyContent: 'flex-end' }}>
                          {/* <Button onClick={() => this.setState({openMenu: true})} variant="outlined" color="primary">
                        Hành động
                      </Button> */}
                          <Fab onClick={this.handleClick}>
                            <Dehaze />
                          </Fab>
                          {/* <Fab onClick={this.openRevokeManger}>
                        <Autorenew />
                      </Fab> */}
                          {/* <CustomButton onClick={this.onOpenSelectManager} color="primary">
                        Chọn người phụ trách
                      </CustomButton>
                      <CustomButton onClick={this.openRevokeManger} color="default">
                        Thu hồi khách hàng
                      </CustomButton> */}
                        </Grid>
                      </Grid>
                    }
                    mapFunction={this.mapFunctionCustomer}
                    kanban="ST18"
                    onSelectCustomers={this.handleChangeSelectedCustomers}
                    ref={this.refCustomer}
                    onChangeCountCustomer={value => this.onChangeCountCustomer(value)}
                  />
                </GridUI>
              </GridUI>
            ) : null}

            {tab === 4 ? (
              <Kanban
                isOpenSinglePage
                enableAdd
                propsAll={this.props}
                titleField="name" // tên trường sẽ lấy làm title trong kanban
                callBack={this.callBack} // sự kiện trả về kanban
                // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                // data={bos} // list dữ liệu
                reload={reload}
                path={API_CUSTOMERS}
                code="ST18" // code của danh sách trạng thái kanban
                nameCallBack={nameCallBack} // nhan dien callBack cua cac page khac nhau
                filter={this.state.kanbanFilter}
                customContent={customContent}
                customActions={[
                  {
                    action: 'comment',
                    // params: 'typeLine=4',
                  },
                ]}
                history={this.props.history}
                params="Customer"
              />
            ) : null}
          </Grid>
        </Grid>
        {/* <AddCustomerPage/> */}
        <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
          <BODialog
            setCoverTask={() => { }}
            profile={profile}
            taskId={this.state.kanbanData._id}
            // filterItem={innerFilterItem}
            data={this.state.kanbanData}
            API={API_CUSTOMERS}
            customContent={customContent}
          />
        </Dialog>
        <SelectManagerDialog
          open={this.state.openSelectManager}
          numberSelected={this.state.selectedCustomers.length}
          onSave={this.handleChangeManagerOfCustomers}
          onClose={this.onCloseSelectManager}
          role="select"
        />
        <SelectManagerDialog
          open={this.state.openRevokeManger}
          numberSelected={this.state.selectedCustomers.length}
          role="revoke"
          onSave={this.handleRevokeManagerOfCustomers}
          onClose={this.onCloseRevokeManager}
        />
        <SelectManagerDialog
          open={this.state.openCreateManger}
          numberSelected={this.state.selectedCustomers.length}
          role="create"
          onSave={this.handeCreateCampaign}
          templates={this.state.emailTemplates}
          onClose={this.onCloseCreateManager}
        />
        {/* {customersPage.valueForTabs === 1 ? <Automation path="/crm/Customer" code="ST18" kanbanStatus="String" /> : null} */}
      </div>
    );
  }

  handleReport = (e, item) => {
    try {
      localStorage.setItem('_isDisplay', JSON.stringify(item));
    } catch (error) {
      // fucking care
    }
    this.props.history.push('/reports');
    // this.props.mergeDataReport({ isDisplay: item });
  };

  handleChangeIndex = index => {
    this.props.handleChangeIndex(index);
  };

  handleChangeSelectedCustomers = newSelected => {
    this.setState({ selectedCustomers: newSelected });
  };

  handeCreateCampaign = props => {
    const { sendBy } = props;
    if (sendBy === 'email') {
      const { campaignName, title, template, enableSelectedAll } = props;
      if (!campaignName || !template) return;
      if (!enableSelectedAll && (!this.state.selectedCustomers || !this.state.selectedCustomers.length)) return;
      const newFilter = {
        ...this.state.advanceSearchQuery,
      };
      if (!enableSelectedAll) {
        newFilter.customerIds = this.state.selectedCustomers.map(c => c._id);
      }
      this.onCloseCreateManager();
      const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
      this.props.onCreateCampaign({
        filter: newFilter,
        enableSelectedAll,
        campaignName,
        template,
        title,
        viewConfig,
        sendBy,
      });
    } else if (sendBy === 'call') {
      const { campaignName, title, template, enableSelectedAll } = props;
      if (!campaignName || !template) return;
      if (!enableSelectedAll && (!this.state.selectedCustomers || !this.state.selectedCustomers.length)) return;
      const newFilter = {
        ...this.state.advanceSearchQuery,
      };
      if (!enableSelectedAll) {
        newFilter.customerIds = this.state.selectedCustomers.map(c => c._id);
      }
      this.onCloseCreateManager();
      const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
      this.props.onCreateCampaign({
        filter: newFilter,
        enableSelectedAll,
        campaignName,
        template,
        title,
        viewConfig,
        sendBy,
      });
    }
  };

  handleChangeManagerOfCustomers = ({
    employeeId,
    enableSelectedAll,
    isSetToManager,
    isOverrideManager,
    isSetToViewer,
    isOverrideViewer,
    isRevokeManager,
    isRevokeViewer,
    isRevokeAllViewer,
  }) => {
    if (!employeeId) return;
    if (!enableSelectedAll && (!this.state.selectedCustomers || !this.state.selectedCustomers.length)) return;
    const newFilter = {
      ...this.state.advanceSearchQuery,
    };
    if (!enableSelectedAll) {
      newFilter.customerIds = this.state.selectedCustomers.map(c => c._id);
    }
    this.onCloseSelectManager();
    this.props.onUpdateMultipleCustomers({
      filter: newFilter,
      employeeId,
      action: 'grant',
      enableSelectedAll,
      isSetToManager,
      isOverrideManager,
      isSetToViewer,
      isOverrideViewer,
      isRevokeManager,
      isRevokeViewer,
      isRevokeAllViewer,
    });
  };

  handleRevokeManagerOfCustomers = ({ enableSelectedAll, isRevokeManager, isRevokeViewer, isRevokeAllViewer }) => {
    // console.log('newValue', newValue);
    if (!enableSelectedAll && (!this.state.selectedCustomers || !this.state.selectedCustomers.length)) return;
    const newFilter = {
      ...this.state.advanceSearchQuery,
    };
    if (!enableSelectedAll) {
      newFilter.customerIds = this.state.selectedCustomers.map(c => c._id);
    }
    this.onCloseRevokeManager();
    this.props.onUpdateMultipleCustomers({
      filter: newFilter,
      action: 'revoke',
      enableSelectedAll,
      isRevokeManager,
      isRevokeViewer,
      isRevokeAllViewer,
    });
  };

  onOpenSelectManager = () => {
    this.setState({ openSelectManager: true });
  };

  onCloseSelectManager = () => {
    this.setState({ openSelectManager: false });
  };

  openRevokeManger = () => {
    this.setState({ openRevokeManger: true });
  };

  onCloseRevokeManager = () => {
    this.setState({ openRevokeManger: false });
  };

  openCreateManger = () => {
    this.setState({ openCreateManger: true });
  };

  onCloseCreateManager = () => {
    this.setState({ openCreateManger: false });
  };

  handleSearch = newQuery => {
    // console.log('handleSearch', newQuery);
    this.setState({ advanceSearchQuery: newQuery });
  };
}

const MenuAction = React.memo(({ handleClose, anchorEl, openRevokeManger, openSelectManager, openCreateManger }) => {
  return (
    <div>
      <Menu open={Boolean(anchorEl)} onClose={handleClose} anchorEl={anchorEl} keepMounted>
        <MenuItem onClick={openSelectManager}>Cập nhật thông tin</MenuItem>
        <MenuItem onClick={openRevokeManger}>Thu hồi quyền</MenuItem>
        <MenuItem onClick={openCreateManger}>Tạo chiến dịch</MenuItem>
      </Menu>

      {/* <div style={{ width: '100vw' }} id="divToPrint" /> */}
    </div>
  );
});

function TabContainer({ children, dir }) {
  return (
    <GridUI item md={12} sm={12} dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </GridUI>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

CustomersPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  customersPage: makeSelectCustomersPage(),
  addCustomerPage: makeSelectAddCustomerPage(),
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    listCustomer: () => dispatch(fetchAction()),
    mergeData: data => dispatch(mergeData(data)),
    // saveSetting: columns => dispatch(updateViewConfig(columns)),
    deleteCustomers: list => dispatch(deleteCustomers(list)),
    putConfig: columns => dispatch(putConfig(columns)),
    handleChangeIndex: index => dispatch(changeIndex(index)),
    mergeDataReport: data => dispatch(mergeDataReport(data)),
    onUpdateMultipleCustomers: data => dispatch(updateMultipleCustomers(data)),
    onCreateCampaign: data => dispatch(createCampaign(data)),
    onChangeTab: val => {
      dispatch(changeTabAct(val));
    },
    putCustomer: (id, data) => dispatch(putCustomer(id, data)),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'customersPage', reducer });
const withSaga = injectSaga({ key: 'customersPage', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(CustomersPage);

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
