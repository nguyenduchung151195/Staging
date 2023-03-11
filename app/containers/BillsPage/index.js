/**
 *
 * BillsPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core';
import Progressbar from 'react-progressbar';
import CustomButton from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import dot from 'dot-object';
import Kanban from '../KanbanPlugin';
import HOCTable from '../HocTable';
import { API_BILLS } from '../../config/urlConfig';
import makeSelectBillsPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getAllBillsAct, updateBillStatusAct, deleteBillsAct, resetNoti, changeTabAct } from './actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
import { Dialog } from '../../components/LifetekUi';
// import messages from './messages';
import { tableToExcel, tableToPDF } from 'helper';
import FomatDataBill from './components/format';
import ListPage from '../../components/List';

function formatNumber(num) {
  if (num) return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return '';
}

const CustomTotal = props => {
  const item = dot.object(props.item);
  return <div>{formatNumber(item.total)}</div>;
};

const CustomRemaining = props => {
  const item = dot.object(props.item);
  return <div>{formatNumber(item.remaining)}</div>;
};

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

const payMethodLocal = JSON.parse(localStorage.getItem('crmSource')) || null;
const payMethod = payMethodLocal ? payMethodLocal.find(item => item.code === 'S17').data : [];

/* eslint-disable react/prefer-stateless-function */
export class BillsPage extends React.Component {
  state = {
    crmStatusSteps: [],
    billsList: [],
    onDelete: false,
    arrDelete: [],
    totalCount: 0,
    pageDetail: {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    },
    kanbanFilter: {},
    kanbanData: {},
    idBill: null,
    openViewDialog: false,
    openKanbanDialog: false,
    html: [],
  };

  // componentWillMount() {
  // this.props.onGetAllBills(); // { skip: 0, limit: 10 }
  // }

  componentDidMount() {
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST04')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
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
  }

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { billsPage } = props;
      let billsList = [];
      if (billsPage.allBills) {
        billsList = billsPage.allBills || [];
      }
      const totalCount = billsPage.count || 0;
      this.state.pageDetail.totalCount = billsPage.count || 0;
      this.state.pageDetail.currentPage = Number(billsPage.skip || 0) || 0;
      this.state.pageDetail.pageSize = billsPage.limit || 0;
      this.setState({ billsList, totalCount });
    }
  }

  componentDidUpdate(props) {
    const { billsPage } = props;
    if (billsPage.successDelete) {
      this.props.onResetNoti();
      this.state.onDelete = false;
    }
  }

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'create-bo':
        // console.log('xxx');
        // this.props.onAddBo(dot.object(data));
        this.props.history.push(`/crm/Contract/add/${this.state.typeContract}`);
        break;
      case 'update-bo':
        // console.log(data);
        break;
      case 'kanban-dragndrop': {
        // const { billsList } = this.state;
        // const currentCard = billsList[billsList.findIndex(d => d._id === data.cardId)]; // tìm cơ hội kinh doanh hiện tại
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

      case 'CommentDialog': {
        this.setState({ openKanbanDialog: true, kanbanData: data });
        break;
      }

      default:
        break;
    }
  };
  openBill = id => {
    this.setState({ idBill: id, openViewDialog: true });
  };
  mapFunction = item => {
    const pays = Array.isArray(item.originItem.paidList)
      ? item.originItem.paidList.map(i => {
          const payMethodFound = payMethod.find(elm => elm.value === i.payMethod);
          if (payMethodFound) return payMethodFound.title;
          return '';
        })
      : [];
    return {
      ...item,
      name: (
        <button onClick={() => this.openBill(item._id)} type="button" style={{ cursor: 'pointer', color: '#2196f3' }}>
          {item.name}
        </button>
      ),
      'customer.customerId': item.customerCode ? item.customerCode : null,
      'saleQuotation.saleQuotationId': item.saleQuotationCode ? item.saleQuotationCode : null,
      'sellEmployee.employeeId': item.sellEmployeeCode ? item.sellEmployeeCode : null,
      'contract.contractId': item.contractCode ? item.contractCode : null,
      'exchangingAgreement.exchangingAgreementId': item.exchangingAgreementCode ? item.exchangingAgreementCode : null,
      'supplier.supplierId': item.supplierCode ? item.supplierCode : null,
      paidList: pays.filter(Boolean).join(', '),
    };
  };

  render() {
    const { billsList } = this.state;
    const { billsPage, profile } = this.props;
    const { tab, reload } = this.props.billsPage;
    const Bt = props => (
      <CustomButton onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </CustomButton>
    );
    const newBillsList = billsList.map(item => dot.dot(item));
    return (
      <div
      // style={
      //   this.state.tab === 1
      //     ? {
      //         backgroundImage: 'linear-gradient(#130CB7, #52E5E7)',
      //         padding: '16px 24px',
      //       }
      //     : {
      //         backgroundColor: '#fff',
      //         padding: '16px 24px',
      //       }
      // }
      >
        {billsPage.loading ? <LoadingIndicator /> : null}
        <Grid container style={{ width: '100%' }}>
          <Grid item md={12}>
            <Bt tab={1}>Kanban</Bt>
            <Bt tab={0}>Danh sách</Bt>
          </Grid>
          <Grid item md={12}>
            {tab === 1 ? (
              <Kanban
                isOpenSinglePage
                enableTotal
                titleField="name"
                callBack={this.callBack}
                path={API_BILLS}
                code="ST04"
                reload={reload}
                filter={this.state.kanbanFilter}
                customContent={customContent}
                customActions={[
                  {
                    action: 'comment',
                    // params: 'typeLine=4',
                  },
                ]}
                history={this.props.history}
                params="Bill/edit"
              />
            ) : null}
            {tab === 0 ? (
              <ListPage
                height="610px"
                showDepartmentAndEmployeeFilter
                apiUrl={API_BILLS}
                exportExcel
                code="Bill"
                kanban="ST04"
                kanbanKey="_id"
                withPagination
                mapFunction={this.mapFunction}
                customUrl={item => `Bill/edit`}
              />
            ) : null}
          </Grid>
        </Grid>
        {/* <Dialog open={this.state.openViewDialog} onClose={this.handleCloseView} dialogAction={false} title={'Hóa đơn'}> */}
        <FomatDataBill id={this.state.idBill} open={this.state.openViewDialog} onClose={this.handleCloseView} />
        {/* </Dialog> */}
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
              lưu
            </Button>
            <Button variant="outlined" onClick={this.handleCloseDelete} color="secondary" autoFocus>
              hủy
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
          <BODialog
            setCoverTask={() => {}}
            profile={profile}
            taskId={this.state.kanbanData._id}
            // filterItem={innerFilterItem}
            data={this.state.kanbanData}
            API={API_BILLS}
            customContent={customContent}
          />
        </Dialog>
        {/* <FormattedMessage {...messages.header} /> */}
      </div>
    );
  }

  // handleChangePage = (currentPage, pageSize) => {
  //   this.props.onGetAllBills({ skip: Number(currentPage) * Number(pageSize), limit: pageSize });
  //   // this.state.skip = Number(currentPage) * Number(pageSize);
  //   this.props.onGetAllBills('');
  // };

  handleDelete = () => {
    this.props.onDelete(this.state.arrDelete);
  };

  handleCloseDelete = () => {
    this.setState({ onDelete: false });
  };
  handleCloseView = () => {
    // console.log('22222222');
    this.setState({ openViewDialog: false });
    // const content = tableToPDF('reportsHrmAboutExpireCotract');
    // this.setState({ html: [content] });
  };

  handleDeleteClick = item => {
    const { billsList } = this.state;
    const arrDelete = [];
    item.forEach(n => {
      arrDelete.push(billsList[n]._id);
    });
    this.setState({ onDelete: true, arrDelete });
  };

  handleTab(tab) {
    this.props.onChangeTab(tab);
  }

  handleEdiClick = item => {
    this.props.history.push(`/crm/Bill/edit/${item._id}`);
  };

  handleAddClick = () => {
    this.props.history.push(`/crm/Bill/add`);
  };
}

BillsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  billsPage: makeSelectBillsPage(),
  profile: makeSelectEditProfilePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetAllBills: pageDetail => {
      dispatch(getAllBillsAct(pageDetail));
    },
    onUpdate: body => {
      dispatch(updateBillStatusAct(body));
    },
    onDelete: body => {
      dispatch(deleteBillsAct(body));
    },
    onResetNoti: () => {
      dispatch(resetNoti());
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

const withReducer = injectReducer({ key: 'billsPage', reducer });
const withSaga = injectSaga({ key: 'billsPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(BillsPage);
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
