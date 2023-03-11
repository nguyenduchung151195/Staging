/*
 *
 * CriteriaPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_DATA_SUCCESS,
  ADD_SET_CRITERIA_SUCCESS,
  GET_DEFAULT,
  ADD_CRITERIA_SUCCESS,
  PUT_CRITERIA_SUCCESS,
  GET_ITEM_SUCCESS,
  GET_ITEM,
} from './constants';

export const initialState = fromJS({
  id: 'add',
  _id: '',
  data: '',
  openDialog: false,
  name: '',
  code: '',
  active: false,
  openDrawer: false,
  criterionType: '',
  ranges: '',
  formula: '',
  plan: '',
  checkRanges: false,
  employees: '',
  tableLimit: [],
  detailRanges: [{ id: '', plan: '' }],
  columnsLimit: [{ name: 'employees', type: 'text ', title: ['Nhân viên', 'Khách hàng', 'Nhà cung cấp', 'Danh mục', 'Danh mục', 'Sản phẩm'] }],
  departments: [],
  ratio: 0,
  unit: '',
  order: 0,
  frequency: '',
  note: '',
  points: [
    { name: 'to', type: 'number', title: 'Khoảng giá trị hệ số hoàn thành (K)' },
    { name: 'point', type: 'number', title: 'Điểm' },
    { name: 'trend', type: 'text ', title: 'Xu hướng' },
  ],
  employeess: [],
  newArray: [],
  tab: 0,
  criterias: [],
  expected: '',
  setChild: '',
  rangeType: 1,
  customers: [],
  suppliers: [],
  products: [],
  categoryStock: [],
  formulaType: 1,
  isDelete: true,
});

function criteriaPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DATA_SUCCESS:
      return state
        .set('departments', action.departments)
        .set('employeess', action.employeess)
        .set('criterias', action.criterias)
        .set('customers', action.customers)
        .set('suppliers', action.suppliers)
        .set('categoryStock', action.categoryStock)
        .set('products', action.products);

    case ADD_SET_CRITERIA_SUCCESS:
      return state.set('data', action.data);
    case ADD_CRITERIA_SUCCESS:
      return state.set('data', action.data);
    case PUT_CRITERIA_SUCCESS:
      return state.set('data', action.data);
    case GET_DEFAULT:
      return state
        .set('name', '')
        .set('code', '')
        .set('ratio', 0)
        .set('unit', '')
        .set('frequency', '')
        .set('expected', '')
        .set('note', '');
    case GET_ITEM:
      return state.set('id', action.id);
    case GET_ITEM_SUCCESS:
      return state.merge(action.data);
    default:
      return state;
  }
}

export default criteriaPageReducer;
