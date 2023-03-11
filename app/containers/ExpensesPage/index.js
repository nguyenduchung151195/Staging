/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * ExpensesPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid } from '@material-ui/core';
import CustomButton from 'components/CustomButtons/Button';
// import Kanban from 'components/LifetekUi/Planner/PlanDemo';
import Kanban from '../KanbanPlugin';
import { API_EXPENSES } from 'config/urlConfig';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import ListPage from '../../components/List';
import AddExpensesPage from '../../containers/AddExpensesPage';
import { Dialog, SwipeableDrawer } from '../../components/LifetekUi';
import makeSelectExpensesPage from './selectors';
import { getCost, mergeData, getData, updateExpense } from './actions';
import reducer from './reducer';
import saga from './saga';
import { convert2Money } from '../../helper';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
import { makeSelectProfile } from '../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */
export class ExpensesPage extends React.Component {
  state = {
    tab: 0,
    kanbanFilter: {},
    kanbanData: {},
    openKanbanDialog: false,
  };

  componentDidMount() {
    this.props.getCost();
    this.props.getData();
  }

  ItemComponent = data => (
    <div
      style={{
        padding: '20px 5px',
        margin: '20px 5px',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }} className="kanban" onClick={() => this.handleExpenses(data._id)}>
        {data.code}
      </p>
      <p className="kanban-planner">
        Khách hàng: <b> {data.customer ? data.customer.name : ''}</b>
      </p>
      <p className="kanban-planner">
        Tổng tiền dự kiến: <b>{convert2Money(data.estimateAmount)} VNĐ</b>
      </p>
    </div>
  );

  handleExpenses = id => {
    this.props.mergeData({ id, addDialog: true });
  };

  mapFunction = item => {
    try {
      return {
        ...item,
        businessOpportunities: item && item['businessOpportunities.name'] ? item['businessOpportunities.name'] : null,
        exchangingAgreement: item && item['exchangingAgreement.name'] ? item['exchangingAgreement.name'] : null,
        salesQuotation: item && item['salesQuotation.name'] ? item['salesQuotation.name'] : null,
        createdBy: item['createdBy.name'],
        customer: item['customer.name'],
      };
    } catch (err) {
      console.log(err);
    }
  };

  kanbanCallback = (cmd, data) => {
    switch (cmd) {
      case 'kanban-dragndrop-cos': {
        this.props.onUpdateExpense(data);
        break;
      }
      case 'CommentDialog': {
        this.setState({ openKanbanDialog: true, kanbanData: data });
        break;
      }
      default:
        break;
    }
    // if (cmd === 'kanban-dragndrop') {
    //   this.props.onUpdateExpense(data);
    //   return;
    // }
    // if (cmd === 'kanban-dragndrop-cos') {
    //   this.props.onUpdateExpense(data);
    // return;
    // }
    // if (cmd === 'CommentDialog') {
    //   this.setState({ openKanbanDialog: true, kanbanData: data });
    // return;
    // }
  };

  render() {
    const { tab } = this.state;
    const { addDialog, kanbanStatus, reload, id } = this.props.expensesPage;
    const { profile } = this.props;

    const Bt = props => (
      <CustomButton
        onClick={() => this.setState({ tab: props.tab })}
        {...props}
        color={props.tab === tab ? 'gradient' : 'simple'}
        right
        round
        size="sm"
      >
        {props.children}
      </CustomButton>
    );
    const nameCallBack = 'cos';
    return (
      <div>
        <Helmet>
          <title>Dự toán - chi phí</title>
          <meta name="description" content="Description of ExpensesPage" />
        </Helmet>

        <Grid container>
          <Grid item md={12}>
            <Bt tab={1}>Kanban</Bt>
            <Bt tab={0}>Danh sách</Bt>
          </Grid>
          <Grid style={{ margin: ' 0px' }} item md={12}>
            {tab === 0 ? (
              <ListPage
                height="610px"
                showDepartmentAndEmployeeFilter
                exportExcel
                code="CostEstimate"
                deleteOption="costEstimates"
                kanban="ST07"
                kanbanKey="_id"
                withPagination
                apiUrl={API_EXPENSES}
                mapFunction={this.mapFunction}
                reload={reload}
              />
            ) : null}
            {tab === 1 ? (
              <Kanban
                isOpenSinglePage
                enableTotal
                titleField="name" // tên trường sẽ lấy làm title trong kanban
                callBack={this.kanbanCallback} // sự kiện trả về kanban
                // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
                // data={bos} // list dữ liệu
                reload={reload}
                path={API_EXPENSES}
                code="ST07" // code của danh sách trạng thái kanban
                filter={this.state.kanbanFilter}
                customContent={customContent}
                nameCallBack={nameCallBack}
                styleKb={window.innerWidth > 1500 ? '20vw' : null}
                customActions={[
                  {
                    action: 'comment',
                    // params: 'typeLine=4',
                  },
                ]}
                history={this.props.history}
                params="CostEstimate"
              />
            ) : // <Kanban
            //   itemComponent={this.ItemComponent}
            //   reload={reload}
            //   addItem={this.addExpense}
            //   module="crmStatus"
            //   code="ST07"
            //   apiUrl={API_EXPENSES}
            // />
            null}
          </Grid>
        </Grid>
        <SwipeableDrawer onClose={() => this.props.mergeData({ addDialog: false, id: 'add' })} open={addDialog} width={window.innerWidth - 260}>
          <AddExpensesPage callback={this.callback} data={{ kanbanStatus }} id={id} />
        </SwipeableDrawer>
        <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
          <BODialog
            setCoverTask={() => {}}
            profile={profile}
            taskId={this.state.kanbanData._id}
            // filterItem={innerFilterItem}
            data={this.state.kanbanData}
            API={API_EXPENSES}
            customContent={customContent}
          />
        </Dialog>
      </div>
    );
  }

  addExpense = id => {
    this.props.mergeData({ addDialog: true, kanbanStatus: id });
  };

  callback = () => {
    this.props.mergeData({ addDialog: false, reload: this.props.expensesPage.reload + 1 });
  };
}

const mapStateToProps = createStructuredSelector({
  expensesPage: makeSelectExpensesPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getCost: () => dispatch(getCost()),
    mergeData: data => dispatch(mergeData(data)),
    getData: () => dispatch(getData()),
    onUpdateExpense: data => dispatch(updateExpense(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'expensesPage', reducer });
const withSaga = injectSaga({ key: 'expensesPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ExpensesPage);
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
