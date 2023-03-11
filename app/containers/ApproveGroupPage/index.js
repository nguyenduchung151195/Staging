/* eslint-disable no-alert */
/**
 *
 * ApproveGroupPage
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
// import { rowsApproved, columnsApproved } from 'variable';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { clientId } from 'variable';
// import HocTable from '../HocTable';
import { withSnackbar } from 'notistack';
// import from '@material-ui/core/Paper';
import { Add, Edit, Delete } from '@material-ui/icons';
import {
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
  // MenuItem,
  // TextField,
  // Button,

  // FormControlLabel,
  Checkbox,
  Fab,
  Paper,
} from '@material-ui/core';
import { PagingState, IntegratedPaging } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel, Toolbar } from '@devexpress/dx-react-grid-material-ui';
// import { Link } from 'react-router-dom';
import makeSelectApproveGroupPage from './selectors';
import { getApproveGroupsAction, resetNotis, deleteApproveGroupsAction } from './actions';
import reducer from './reducer';
import saga from './saga';
import { set } from 'dot-object';

/* eslint-disable react/prefer-stateless-function */
const columns = [
  { name: 'name', title: 'Tên nhóm' },
  { name: 'code', title: 'Code' },
  { name: 'group', title: 'Nhân viên' },
  { name: 'activity', title: 'Hoạt động'},
  { name: 'actions', title: 'Hành động' },
];
const CustomGroup = props => (
  <div>
    {props.rowData.group.map(employee => (
      <div>{employee.name}</div>
    ))}
  </div>
);
export class ApproveGroupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listApproveGroup: [],
      pageSizes: [10, 25, 50],
      pageSize: 10,
      currentPage: 0
    };
  }

  componentDidMount() {
    this.props.onGetApproveGroups();
  }

  componentWillReceiveProps(props) {
    const { ApproveGroupPage } = props;
    if (ApproveGroupPage.approveGroups !== undefined) {
      this.state.listApproveGroup = ApproveGroupPage.approveGroups;
      // console.log(this.state.listApproveGroup);
    }
    if (ApproveGroupPage.callAPIStatus === 1) {
      this.props.enqueueSnackbar(ApproveGroupPage.notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        action: this.action,
        variant: 'success',
      });
      this.props.onResetNotis();
    }
    if (ApproveGroupPage.callAPIStatus === 0) {
      this.props.enqueueSnackbar(ApproveGroupPage.notiMessage, {
        persist: false,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
        action: this.action,
      });
      this.props.onResetNotis();
    }
  }

  render() {
    const { listApproveGroup, pageSizes, pageSize, currentPage} = this.state;

    const newRows = listApproveGroup.map(item => {
      const newItem = Object.assign({}, item);
      newItem.group = <CustomGroup rowData={item} />;
      
      return {
        ...newItem,
        activity: (
          <Checkbox
            checked={item.approveType}
            color="primary"
            inputProps={{
              'aria-label': 'secondary checkbox',
            }}
          />
        ),
        actions: (
          <div>
            <Fab
              size="small"
              color="primary"
              onClick={() => {
                this.handleEdiClick(item);
                // this.callBack('edit-click', item);
              }}
            >
              <Edit fontSize="small" />
            </Fab>
            <Fab
              onClick={() => {
                // eslint-disable-next-line no-restricted-globals
                const r = confirm('Bạn có muốn xóa phê duyệt này?');
                if (r) {
                  this.props.onDeleteApproveGroup(item);
                }
              }}
              className="mx-3"
              size="small"
              color="secondary"
            >
              <Delete fontSize="small" />
            </Fab>
          </div>
        ),
      };
    });
    // console.log(newRows);
    return (
      <div>
        <Paper>
          <Grid rows={newRows} columns={columns} filter={{ $or: [{ clientId }, { clientId: 'ALL' }] }}>
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={page =>this.setState({currentPage: page})}
            pageSize={pageSize}
            onPageSizeChange={size =>this.setState({pageSize: size})}
          />
            {/* <PagingState defaultCurrentPage={0} pageSize={10} /> */}
            <IntegratedPaging />
            <Table />
            <TableHeaderRow />
            <PagingPanel messages={{ rowsPerPage: 'Số dòng hiển thị' }} pageSizes={pageSizes} />
            {/* <PagingPanel/> */}
            <Toolbar
              rootComponent={({ children }) => (
                <div className="p-3">
                  <div style={{ float: 'left' }}>{children}</div>
                  <div style={{ float: 'right' }}>
                    <div className="text-right align-item-center">
                      <div>
                        <Fab
                          className="mx-2"
                          onClick={() => {
                            this.handleAddClick();
                          }}
                          size="small"
                          color="primary"
                          aria-label="Add"
                        >
                          <Add />
                        </Fab>
                      </div>

                      <div className="clearfix" />
                    </div>
                  </div>
                  <div style={{ clear: 'both' }} />
                </div>
              )}
            />
          </Grid>
        </Paper>
      </div>
    );
  }

  handleAddClick = () => {
    this.props.history.push(`/setting/approved/add`);
  };

  handleEdiClick = props => {
    this.props.history.push(`/setting/approved/${props._id}`);
  };

  handleDeleteClick = props => {
    const { orders } = this.state;
    const ids = [];
    props.forEach(index => {
      ids.push(orders[index]._id);
    });
    // this.setState({ idDelete: ids, onDelete: true });
    // this.props.onDeleteContract({ ids });
  };
}

const mapStateToProps = createStructuredSelector({
  ApproveGroupPage: makeSelectApproveGroupPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetApproveGroups: () => {
      dispatch(getApproveGroupsAction());
    },
    onResetNotis: () => {
      dispatch(resetNotis());
    },
    onDeleteApproveGroup: approveGroup => {
      dispatch(deleteApproveGroupsAction(approveGroup));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'ApproveGroupPage', reducer });
const withSaga = injectSaga({ key: 'ApproveGroupPage', saga });

export default compose(
  withSnackbar,
  withReducer,
  withSaga,
  withConnect,
)(ApproveGroupPage);
