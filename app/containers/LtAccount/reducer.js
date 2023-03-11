import { fromJS } from 'immutable';
import { CREATE_ACCOUNT_REQUESTED, CREATE_ACCOUNT_REQUESTED_SUCCEEDED, CREATE_ACCOUNT_REQUESTED_FAILED, MERGE_DATA } from './constants';

export const initialState = fromJS({
  loading: false,
  totalCount: 20,
  pageSize: 20,
  pageSizes: [15, 30, 50],
  currentPage: 0,
  rows: [],
  columns: [
    { name: 'recordId', title: 'ID', checked: false },
    { name: 'username', title: 'Tên người dùng', checked: true, width: 160 },
    { name: 'accountStatus', title: 'Trạng thái', checked: true },
    { name: 'moduleName', title: 'Module tương ứng', checked: true, width: 160 },
    { name: 'moduleCode', title: 'Mã module', checked: true },
    { name: 'accountName', title: 'Họ và tên', checked: true },
    { name: 'accountPhone', title: 'Số điện thoại', checked: true },
    { name: 'accountEmail', title: 'Email', checked: true },
  ],
  open: false,
  search: '',
  allId: [],
  deleteDialog: false,
  openDialog: false,
  isEditting: false,
  message: '',
  snackbar: {},
});

function accountRequestReducer(state = initialState, action) {
  switch (action.type) {
    // case CREATE_ACCOUNT_REQUESTED:
    //   return state.set('loading', true).set('createAccountRequestSuccess', null);
    // case CREATE_ACCOUNT_REQUESTED_SUCCEEDED:
    //   return state.set('loading', false).set('createAccountRequestSuccess', true);
    // case CREATE_ACCOUNT_REQUESTED_FAILED:
    //   return state.set('loading', false).set('createAccountRequestSuccess', false);

    case MERGE_DATA:
      return state.merge(action.data);

    default:
      return state;
  }
}

export default accountRequestReducer;
