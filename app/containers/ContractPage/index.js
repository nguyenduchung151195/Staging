/**
 *
 * Contract
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import {
  Tabs,
  Tab,
  Grid,
  Select,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  MenuItem,
  FormControl,
  Button,
  // Badge,
  OutlinedInput,
  Tooltip,
} from '@material-ui/core';
import moment from 'moment';
import CustomButton from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import Progressbar from 'react-progressbar';
import injectReducer from 'utils/injectReducer';
import dot from 'dot-object';
import HOCTable from '../HocTable';
// import lodash from 'lodash';
// import MainDialog from './component/ContractDialog';
import makeSelectContract from './selectors';
import reducer from './reducer';
import saga from './saga';
import Automation from '../PluginAutomation';
import { serialize } from '../../utils/common';
// import Table from './component/table';
import makeSelectMeetingPage from './selectors';

import './styles.scss';
import { getContract, deleteContract, UpdateStatusAct, changeTabAct, mergeDataContract } from './actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import Kanban from '../KanbanPlugin';
import { GET_CONTRACT } from '../../config/urlConfig';
import messages from './messages';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';
import { Dialog, Grid as GridLife } from '../../components/LifetekUi';
/* eslint-disable react/prefer-stateless-function */
import ListPage from '../../components/List';
import { Add } from '@material-ui/icons';
import makeSelectDashboardPage from '../Dashboard/selectors';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },

  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
    paddingLeft: 0,
  },
});
const CustomCatalog = () => <div />;
const Catalogcontract = props => (
  <div>
    {props.item.catalogContract === '0'
      ? 'Hợp đồng nguyên tắc'
      : props.item.catalogContract === '1'
        ? 'Hợp đồng kinh tế'
        : props.item.catalogContract === '2'
          ? 'Hợp đồng thời vụ'
          : 'Hợp đồng bảo hành bảo trì'}
  </div>
);
const CustomKanbanStatus = props => {
  const propsFromTable = props.kanbanProps.slice();
  const laneStart = [];
  const laneAdd = [];
  const laneSucces = [];
  const laneFail = [];

  propsFromTable.forEach(item => {
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
  const itemFromTable = Object.assign({}, props.item);
  const kanbanStatusNumber = sortedKanbanStatus.findIndex(n => String(n._id) === String(itemFromTable.kanbanStatus));
  const kanbanValue = ((kanbanStatusNumber + 1) / propsFromTable.length) * 100;
  return (
    <div>
      {sortedKanbanStatus[kanbanStatusNumber] !== undefined ? (
        <Progressbar color={sortedKanbanStatus[kanbanStatusNumber].color} completed={kanbanValue} />
      ) : (
        <span>Không xác định</span>
      )}
    </div>
  );
};
const TypeContract = props => {
  if (props.item.typeContract === '1') {
    return <div>HĐ Khách hàng</div>;
  }
  if (props.item.typeContract === '2') {
    return <div>HĐ Nhà Cung cấp</div>;
  }
  return <div />;
};

// const CustomResponsible = props => {
//   const name = dot
//     .object(props.item)
//     .responsible.map(elm => elm.name)
//     .join(', ');

//   return <p> {name}</p>;
// };

export class Contract extends React.Component {
  state = {
    value: 0,
    typeContract: 1,
    catalogContract: 0,
    filter: {
      filter: {
        typeContract: 1,
      },
    },
    contracts: [],
    onDelete: false,
    idDelete: [],
    crmStatusSteps: [],
    pageDetail: {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    },
    listContractTypes: [],
    kanbanFilter: {
      typeContract: 1,
    },
    kanbanData: {},
    openKanbanDialog: false,
    typeContractQuery: false,
    tabTask: 0,
    reload: new Date() * 1
  };

  componentDidMount() {
    // this.props.onGetContracts();
    // const { filter } = this.state;
    // const query = serialize(filter);
    // this.props.onGetContracts(query);
    const listCrmSource = JSON.parse(localStorage.getItem('crmSource')) || [];
    const contractTypeSource = listCrmSource.find(i => i.code === 'S15');
    let newListContractTypes = [];
    if (contractTypeSource) {
      newListContractTypes = contractTypeSource.data;
    }
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST05')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus && currentCrmStatus.data && currentCrmStatus.data.forEach(item => {
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
    this.setState({ crmStatusSteps: sortedKanbanStatus, listContractTypes: newListContractTypes });
    if (this.props.history.value) {
      if (this.props.history.value === 1) {
        const filter = {
          filter: {
            typeContract: 1,
          },
        };
        this.state.filter = filter;
        this.setState({ filter });
      } else {
        const filter = {
          filter: {
            typeContract: 2,
          },
        };
        this.state.filter = filter;
        this.setState({ filter });
      }
      this.setState({ typeContract: this.props.history.value });
      this.props.history.value = undefined;
    }
    // this.props.mergeDataContract({
    //   dashboard: 0,
    // });
  }

  handleChange = name => event => {
    if (this.state.filter.expirationDay) {
      delete this.state.filter.filter.expirationDay;
    }
    if (event.target.value) {
      this.state.filter.filter[name] = event.target.value;
      // const { filter } = this.state;
    } else {
      delete this.state.filter.filter[name];
      // const { filter } = this.state;
    }
    this.state.filter.skip = 0;
    this.state.filter.limit = 10;
    const query = serialize(this.state.filter);
    this.props.onGetContracts(query);
    const pageDetail = {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    };
    this.props.mergeDataContract({ reload: false });
    this.setState({ [name]: event.target.value, value: 0, pageDetail }, () => this.props.mergeDataContract({ reload: true }));
  };

  handleTab(tab) {
    this.props.onChangeTab(tab);
  }

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'create-bo':
        // this.props.onAddBo(dot.object(data));
        this.props.history.push(`/crm/Contract/add/${this.state.typeContract}`);
        break;
      case 'update-bo':
        break;
      case 'kanban-dragndrop-con': {
        // const { contracts } = this.state;
        // const currentCard = contracts[contracts.findIndex(d => d._id === data.cardId)]; // tìm cơ hội kinh doanh hiện tại
        // currentCard.kanbanStatus = data.newKanbanStatus;
        this.props.onUpdate(data);
        break;
      }
      case 'update-viewconfig': {
        const localStorageViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
        const currentViewConfigIndex = localStorageViewConfig.findIndex(d => d.path === '/crm/BusinessOpportunities');
        const { others } = localStorageViewConfig[currentViewConfigIndex].listDisplay.type.fields.type;
        const newOthers = [...others, ...data];
        localStorageViewConfig[currentViewConfigIndex].listDisplay.type.fields.type.others = newOthers;
        localStorage.setItem('viewConfig', JSON.stringify(localStorageViewConfig));
        this.props.onEditViewConfig(localStorageViewConfig[currentViewConfigIndex]);
        break;
      }
      case 'quick-add': {
        if (this.state.typeContract === 2) {
          this.props.history.push(`/crm/Contract/supplier/add/${this.state.typeContract}`);
        } else {
          this.props.history.push(`/crm/Contract/add/${this.state.typeContract}`);
        }
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

  handleAddClick = () => {
    if (this.state.typeContract === 2) {
      this.props.history.push(`/crm/Contract/supplier/add/${this.state.typeContract}`);
    } else {
      this.props.history.push(`/crm/Contract/add/${this.state.typeContract}`);
    }
  };

  addItem = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddClick} />
    </Tooltip>
  );

  handleEdiClick = props => {
    // this.props.history.push(`/crm/Contract/edit/${props._id}`);
    if (this.state.typeContract === 2) {
      this.props.history.push(`/crm/Contract/supplier/edit/${props._id}`);
    } else {
      this.props.history.push(`/crm/Contract/edit/${props._id}`);
    }
  };

  handleDeleteClick = props => {
    const { contracts } = this.state;
    const ids = [];
    props.forEach(index => {
      ids.push(contracts[index]._id);
    });
    this.setState({ idDelete: ids, onDelete: true });
    // this.props.onDeleteContract({ ids });
  };

  handleDelete = () => {
    this.setState({ onDelete: false });
    const { filter } = this.state;
    const query = serialize(filter);
    const pageDetail = {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    };
    this.setState({ pageDetail });
    this.props.onDeleteContract({ ids: this.state.idDelete, query });
  };

  handleChangeTabList = (event, value) => {
    this.props.mergeDataContract({ reload: false })
    if (value === 3) this.state.typeContractQuery = "expired"
    else this.state.typeContractQuery = ""
    if (value === 0 || value === 3) {
      delete this.state.filter.type;
      delete this.state.filter.filter.expirationDay;
    } else if (value === 1) {
      this.state.filter.type = 1;
      delete this.state.filter.filter.expirationDay;
    } else {
      delete this.state.filter.type;
      this.state.filter.filter.expirationDay = {
        $lt: moment().format(),
      };
    }
    this.state.filter.skip = 0;
    this.state.filter.limit = 10;
    const pageDetail = {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    };
    this.props.onGetContracts(serialize(this.state.filter));
    this.setState({ value, pageDetail });
    this.props.mergeDataContract({
      dashboard: 0,
    });
    this.setState({ reload: new Date() * 1 }, () =>
      this.props.mergeDataContract({ reload: true }),
    );
  };

  changeContractType = typeContract => {
    const { filter } = this.state;
    filter.filter.typeContract = typeContract;
    if (filter.type) {
      delete filter.type;
    }
    if (filter.filter.expirationDay) {
      delete filter.filter.expirationDay;
    }
    filter.skip = 0;
    filter.limit = 10;
    const query = serialize(filter);
    this.props.onGetContracts(query);
    const pageDetail = {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    };
    this.props.mergeDataContract({ reload: false });
    const newKanbanFilter = this.state.kanbanFilter || {};
    newKanbanFilter.typeContract = typeContract;
    //this.setState({ typeContract, filter, value: 0, pageDetail }), () => this.props.mergeDataContract({ reload: true });
    this.setState({ typeContract, filter, value: 0, pageDetail, kanbanFilter: newKanbanFilter }, () =>
      this.props.mergeDataContract({ reload: true }),
    );
  };

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { contract } = props;

      if (props.contract.dashboard === 1) {
        this.state.contracts = contract.contractDashboard || [];
        this.state.pageDetail.totalCount = contract.contractDashboard.length || 0;
        this.state.pageDetail.currentPage = Number(contract.contractDashboard.skip || 0) || 0;
        this.state.pageDetail.pageSize = contract.contractDashboard.limit || 0;
      } else {
        this.state.contracts = contract.contracts || [];
        this.state.pageDetail.totalCount = contract.count || 0;
        this.state.pageDetail.currentPage = Number(contract.skip || 0) || 0;
        this.state.pageDetail.pageSize = contract.limit || 0;
      }
    }
  }

  mapFunction = item => {
    let label = item.catalogContract;
    const value = this.state.listContractTypes.find(t => t.value === `${item.catalogContract}`);
    if (value) {
      label = value.title;
    }
    return {
      ...item,
      catalogContract: label,
      customerId: item.customerIdName || item.customerId,
      createdBy: item.createdByName || item.createdBy,
      'exchangingAgreement.exchangingAgreementId': item.exchangingAgreementCode ? item.exchangingAgreementCode : null,
      'order.orderId': item.orderCode ? item.orderCode : null,
      typeContract: item.typeContract == '1' ? 'HĐ KHÁCH HÀNG' : 'HĐ NCC',
    };
  };
  customDataExport = data => {
    console.log(data,'datadata');
    let dataa = []
    data.map((el) => {
      dataa.push({
        ...el,
        contractSigningDate: moment(el.contractSigningDate).format("DD/MM/YYYY"),
        expirationDay: moment(el.expirationDay).format("DD/MM/YYYY"),
        needExtension: moment(el.needExtension).format("DD/MM/YYYY"),
        startDay: moment(el.startDay).format("DD/MM/YYYY"),
        customerId: el.customerIdName || '',
        // customerIdName: el.customerIdName || 'ddddsss',
        // contractSigningDate: moment(el.contractSigningDate).format("DD/MM/YYYY"),
        // hrmEmployeeId: el.name || '',
        // "organizationUnit.name": el.organizationUnit && el.organizationUnit.name || "",
        // identityCardNumber: el.identityCardNumber,
        // birthday: el.birthday && moment(el.birthday).format('DD/MM/YYYY') || '',
        // gender: el.gender && (el.gender === '0' ? 'Nam' : 'Nữ') || '',
        // 'position.title': el.position && el.position.title || "",
        // 'title.title': el.title && el.title.title || "",
        // 'role.title': el.role && el.role.title || "",
        // salary: el.salary || '',
        // allowance: el.allowance || '',
        // contractStartDateIndefinite: el.contractStartDateIndefinite && moment(el.contractStartDateIndefinite).format('DD/MM/YYYY') || '',
        // 'contractType.title': el.contractType && el.contractType.title || "",
        // contractStartDate: el.contractStartDate && moment(el.contractStartDate).format('DD/MM/YYYY') || '',
        // contractEndDate: el.contractEndDate && moment(el.contractEndDate).format('DD/MM/YYYY') || '',
        // insuranceStartDate: el.insuranceStartDate && moment(el.insuranceStartDate).format('DD/MM/YYYY') || '',
        // insuranceEndDate: el.insuranceEndDate && moment(el.insuranceEndDate).format('DD/MM/YYYY') || '',
        // startTimeToxic: el.startTimeToxic && moment(el.startTimeToxic).format('DD/MM/YYYY') || '',
        // endTimeToxic: el.endTimeToxic && moment(el.endTimeToxic).format('DD/MM/YYYY') || '',
        // note: el.note || '',
      })
    })
    return dataa || []
  };
  render() {
    const { classes, contract, intl, profile, dashboardPage } = this.props;
    const { tab, reload } = this.props.contract;
    const { listContractTypes } = this.state;

    const Bt = props => (
      <CustomButton onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </CustomButton>
    );
    const newContracts = this.state.contracts && Array.isArray(this.state.contracts) && this.state.contracts.map(item => dot.dot(item)) || []
    const nameCallBack = 'con';
    const roles = dashboardPage.role.roles;

    const roleCrmCustomerContract = roles && roles.find(item => item.codeModleFunction === 'crmCustomerContract');
    const roleModuleCrmCustomerContract = roleCrmCustomerContract && roleCrmCustomerContract.methods ? roleCrmCustomerContract.methods : [];

    const roleCrmSupplierContract = roles && roles.find(item => item.codeModleFunction === 'crmSupplierContract');
    const roleModuleCrmSupplierContract = roleCrmSupplierContract && roleCrmSupplierContract.methods ? roleCrmSupplierContract.methods : [];
    return (
      <div>
        {/* {contract.loading ? <LoadingIndicator /> : null} */}
        <Grid container style={{ marginTop: '-5px' }}>
          <Grid
            item
            sm="12"
            style={{
              justifyContent: 'flex-end',
              display: 'flex',
              marginTop: '1rem',
            }}
          >
            {(roleModuleCrmCustomerContract.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
              <Button
                onClick={() => {
                  this.changeContractType(1);
                  this.setState({ tabTask: 0 })
                }}
                className="mx-2"
                variant={this.state.typeContract === 1 ? 'contained' : 'outlined'}
                color="primary"
              >
                {intl.formatMessage(messages.typeCustomer || { id: 'typeCustomer', defaultMessage: 'typeCustomer' })}
              </Button>
            ) : null}
            {(roleModuleCrmSupplierContract.find(elm => elm.name === 'GET') || { allow: false }).allow === true ? (
              <Button
                onClick={() => {
                  this.changeContractType(2);
                  this.setState({ tabTask: 1 })
                }}
                className="mx-2"
                variant={this.state.typeContract === 2 ? 'contained' : 'outlined'}
                color="primary"
              >
                {intl.formatMessage(messages.typeSupplier || { id: 'typeSupplier', defaultMessage: 'typeSupplier' })}
              </Button>
            ) : null}
          </Grid>
        </Grid>
        <Grid container className="p-3" style={{ marginTop: '-15px' }}>
          {/* <Grid item sm={2}>
            <FormControl fullWidth>
              <Select
                // variant="outlined"
                value={this.state.catalogContract}
                onChange={this.handleChange('catalogContract')}
                input={<OutlinedInput name="catalogContract" id="age-native-label-placeholder" />}
              >
                <MenuItem selected value={0}>
                  {intl.formatMessage(messages.typeContract || { id: 'typeContract', defaultMessage: 'typeContract' })}
                </MenuItem>
                {listContractTypes.map(i => (
                  <MenuItem value={i.value}>{i.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}
          <Grid className="px-3" item sm={2} />
          <Grid item sm={2} />
          <Grid item sm={6} className="text-right">
            <Bt tab={1}>Kanban</Bt>
            <Bt tab={0}>{intl.formatMessage(messages.list || { id: 'list', defaultMessage: 'list' })}</Bt>
            <Bt tab={2}>Automations</Bt>
            {/* <Button
              onClick={() => {
                this.changeContractType(1);
              }}
              className="mx-2"
              variant={this.state.typeContract === 1 ? 'contained' : 'outlined'}
              color="primary"
            >
              {intl.formatMessage(messages.typeCustomer || { id: 'typeCustomer', defaultMessage: 'typeCustomer' })}
            </Button>
            <Button
              onClick={() => {
                this.changeContractType(2);
              }}
              className="mx-2"
              variant={this.state.typeContract === 2 ? 'contained' : 'outlined'}
              color="primary"
            >
              {intl.formatMessage(messages.typeSupplier || { id: 'typeSupplier', defaultMessage: 'typeSupplier' })}
            </Button> */}
          </Grid>
          <Grid item sm={12} className="mt-3">
            <Tabs
              value={this.state.value}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.handleChangeTabList}
              style={{ marginBottom: '10px' }}
            >
              <Tab value={0}
                label={
                  // <Badge color="primary" badgeContent={this.props.contract.contractCount} max={9999}>
                  <Typography className={classes.padding}>
                    {intl.formatMessage(messages.listOfContract || { id: 'listOfContract', defaultMessage: 'listOfContract' })}
                  </Typography>
                  // </Badge>
                }
              />
              {/* <Tab
              value={1}
                style={this.state.catalogContract !== 1 ? {} : { display: 'none' }}
                label={
                  // <Badge color="primary" badgeContent={this.props.contract.cycleCount} max={9999}>
                  <Typography className={classes.padding}>
                    {intl.formatMessage(messages.serviceCycle || { id: 'serviceCycle', defaultMessage: 'serviceCycle' })}
                  </Typography>
                  // </Badge>
                }
              /> */}
              <Tab value={2}
                label={
                  // <Badge color="primary" badgeContent={this.props.contract.contractExpireCount} max={9999}>
                  <Typography className={classes.padding}>
                    {intl.formatMessage(messages.contractExpired || { id: 'contractExpired', defaultMessage: 'contractExpired' })}
                  </Typography>
                  // </Badge>
                }
              />

              <Tab
                value={3}
                label={
                  // <Badge color="primary" badgeContent={this.props.contract.contractExpireCount} max={9999}>
                  <Typography className={classes.padding}>HỢP ĐỒNG CẦN GIA HẠN</Typography>
                  // </Badge>
                }
              />
            </Tabs>

            {/* {this.state.value === 0 && ( */}
            {/* -------------------- Bảng --------------------- */}

            {tab === 1 ? (
              <>
                {
                  this.state.typeContract === 2 && <Kanban
                    isOpenSinglePage
                    enableAdd
                    titleField="name"
                    callBack={this.callBack}
                    path={`${GET_CONTRACT}`}
                    code="ST253"
                    reload={reload}
                    filter={this.state.kanbanFilter}
                    customContent={customContent}
                    nameCallBack={nameCallBack}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params={`Contract/${this.state.typeContract === 2 ? 'supplier/' : ''}edit`}
                  />
                }


                {
                  this.state.typeContract === 1 && <Kanban
                    isOpenSinglePage
                    enableAdd
                    titleField="name"
                    callBack={this.callBack}
                    path={`${GET_CONTRACT}`}
                    code="ST05"
                    reload={reload}
                    filter={this.state.kanbanFilter}
                    customContent={customContent}
                    nameCallBack={nameCallBack}
                    customActions={[
                      {
                        action: 'comment',
                        // params: 'typeLine=4',
                      },
                    ]}
                    history={this.props.history}
                    params={`Contract/${this.state.typeContract === 2 ? 'supplier/' : ''}edit`}
                  />
                }


              </>
            ) : null}

            {tab === 0 ? (

              <>
                {
                  this.state.typeContract === 2 ? <>
                    <ListPage
                      height="475px"
                      filterQuery
                      showDepartmentAndEmployeeFilter
                      apiUrl={`${GET_CONTRACT}?typeContract=${this.state.typeContractQuery}`}
                      defaultValue={this.state.filter.filter}
                      filter={this.state.filter.filter}
                      exportExcel
                      code="Contract"
                      // kanban="ST05"
                      // kanbanSecondary='ST253'
                      kanban="ST253"
                      kanbanStart={9}
                      kanbanKey="_id"
                      withPagination
                      mapFunction={this.mapFunction}
                      settingBar={[this.addItem()]}
                      onEdit={this.handleEdiClick}
                      disableAdd
                      listContractTypes={listContractTypes}
                      reload={reload}
                      customDataExport={data => this.customDataExport(data)}
                    />
                  </> : null

                }
                {
                  this.state.typeContract === 1 ? <>
                    <ListPage
                      height="475px"
                      filterQuery
                      showDepartmentAndEmployeeFilter
                      apiUrl={`${GET_CONTRACT}?typeContract=${this.state.typeContractQuery}`}
                      defaultValue={this.state.filter.filter}
                      filter={this.state.filter.filter}
                      exportExcel
                      code="Contract"
                      // kanban="ST05"
                      // kanbanSecondary='ST253'
                      kanban="ST05"
                      kanbanKey="_id"
                      withPagination
                      mapFunction={this.mapFunction}
                      settingBar={[this.addItem()]}
                      onEdit={this.handleEdiClick}
                      disableAdd
                      listContractTypes={listContractTypes}
                      reload={reload}
                      customDataExport={data => this.customDataExport(data)}
                    />
                  </> : null

                }
              </>

            ) : null}
            {tab === 2 ? (
              <GridLife>
                <Automation dashboardPage={this.props.dashboardPage} path="/crm/Contract" code="ST05" codeModule="Contract" kanbanStatus="String" />
              </GridLife>
            ) : null}

            {tab === 3 ? (
              <ListPage
                apiUrl={`${GET_CONTRACT}`}
                filter={this.state.filter.filter}
                exportExcel
                code="Contract"
                kanban="ST05"
                kanbanKey="_id"
                withPagination
                mapFunction={this.mapFunction}
                settingBar={[this.addItem()]}
                onEdit={this.handleEdiClick}
                disableAdd
                reload={reload}
              />
            ) : null}
          </Grid>
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
            <Button color="primary" onClick={() => this.handleDelete()}>
              Đồng ý
            </Button>
            <Button onClick={this.handleCloseDelete} color="primary" autoFocus>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
          <BODialog
            setCoverTask={() => { }}
            profile={profile}
            taskId={this.state.kanbanData._id}
            // filterItem={innerFilterItem}
            data={this.state.kanbanData}
            API={GET_CONTRACT}
            customContent={customContent}
          />
        </Dialog>
      </div>
    );
  }

  onGetContractsCustom = params1 => {
    let { filter } = this.state;
    filter.skip = params1.skip;
    filter.limit = params1.limit;
    delete filter.skip;
    delete filter.limit;
    filter = {
      ...filter,
      ...params1,
    };
    if (this.props.history.value) {
      filter.filter.typeContract = this.props.history.value;
      this.props.onGetContracts(serialize(filter));
    } else {
      this.props.onGetContracts(serialize(filter));
    }
  };

  handleCloseDelete = () => {
    this.setState({ onDelete: false });
  };
}

Contract.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  contract: makeSelectContract(),
  profile: makeSelectEditProfilePage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetContracts: query => {
      dispatch(getContract(query));
    },
    onDeleteContract: body => {
      dispatch(deleteContract(body));
    },
    onUpdate: body => {
      dispatch(UpdateStatusAct(body));
    },
    onChangeTab: val => {
      dispatch(changeTabAct(val));
    },
    mergeDataContract: val => {
      dispatch(mergeDataContract(val));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'contract', reducer });
const withSaga = injectSaga({ key: 'contract', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles, { withTheme: true }),
)(Contract);
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
