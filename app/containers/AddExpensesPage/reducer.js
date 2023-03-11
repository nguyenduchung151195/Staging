/*
 *
 * AddExpensesPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  HANDLE_CHANGE,
  GET_SUCCESS,
  GET_DEFAULT_SUCCESS,
  ADD_PRODUCT,
  TOOGLE_DRAWER,
  HANDLE_DISCOUNT,
  MERGE_DATA,
} from './constants';

export const initialState = fromJS({
  tab: 0,
  _id: null,
  products: [],
  relityProducts: [],
  transports: [],
  commissions: [],
  labors: [],
  otherCosts: [],
  code: '',
  name: '',
  openDrawer: false,
  users: [],
  inventory: [],
  type: 1,
  checked: false,
  businessOpportunities: null,
  businessOpportunitiess: [],
  exchangingAgreement: null,
  amount: 0,
  others: {},
  customers: [],
  customer: '',
  errorCode: true,
  checkedSale: false,
  errorCustomer: true,
  sources: [],
  productTab: 0,
  kanbanStatus: '',
  commisionSales: [],
  productColumns: [
    // { name: '_id', title: 'ID', checked: true },
    { name: 'order', title: 'STT', checked: true, type: 'order' },
    { name: 'name', title: 'Tên', checked: true, type: 'text' },
    { name: 'code', title: 'Mã', checked: true, type: 'text' },
    { name: 'sourcePrice', title: 'Giá xuất xưởng', checked: true, type: 'number' },
    { name: 'costPrice', title: 'Giá hóa đơn', checked: true, type: 'number' },
    { name: 'amount', title: 'Số lượng', checked: true, type: 'number' },
    { name: 'unit', title: 'Đơn vị tính', checked: true },
    { name: 'discount', title: 'Chiết khấu (%)', checked: false, type: 'number' },
    // { name: 'marketPrice', title: 'Giá thị trường', checked: true, type: 'number' },
    { name: 'salesPolicyName', title: 'Chính sách', checked: false, type: 'text' },
    { name: 'discountAmount', title: 'Số tiền chiết khấu', checked: false, type: 'text' },
    { name: 'totalSourcePrice', title: 'Tổng giá vốn', checked: true, type: 'text' },
    { name: 'totalCostPrice', title: 'Tổng giá bán', checked: true, type: 'text' },
  ],
  relityProductColumns: [
    // { name: '_id', title: 'ID', checked: true },
    { name: 'order', title: 'STT', checked: true, type: 'order' },
    { name: 'name', title: 'Tên', checked: true, type: 'text' },
    { name: 'code', title: 'Mã', checked: true, type: 'text' },
    { name: 'sourcePrice', title: 'Giá vốn', checked: true, type: 'text' },
    { name: 'costPrice', title: 'Giá bán', checked: true, type: 'number' },
    { name: 'amount', title: 'Số lượng', checked: true, type: 'number' },
    { name: 'unit', title: 'Đơn vị tính', checked: true },
    { name: 'discount', title: 'Chiết khấu (%)', checked: false, type: 'number' },
    { name: 'salesPolicyName', title: 'Chính sách', checked: false, type: 'text' },
    { name: 'discountAmount', title: 'Số tiền chiết khấu', checked: false, type: 'text' },
    { name: 'totalSourcePrice', title: 'Tổng giá vốn', checked: true, type: 'text' },
    { name: 'totalCostPrice', title: 'Tổng giá bán', checked: true, type: 'text' },
  ],

  laborColumns: [
    // { name: '_id', title: 'ID', checked: true },
    { name: 'order', title: 'STT', checked: true, type: 'order' },
    { name: 'name', title: 'Tên', checked: true },
    { name: 'phone', title: 'Số điện thoại', checked: true, type: 'number' },
    { name: 'adress', title: 'Địa chỉ', checked: true },
    { name: 'sourcePrice', title: 'Giá vốn', checked: true, type: 'number' },
    { name: 'costPrice', title: 'Giá bán', checked: true, type: 'number' },
  ],

  transportColumns: [
    // { name: '_id', title: 'ID', checked: true },
    { name: 'order', title: 'STT', checked: true, type: 'order' },
    { name: 'name', title: 'Tên đơn vị', checked: true },
    { name: 'phone', title: 'Số điện thoại', checked: true, type: 'number' },
    { name: 'adress', title: 'Điểm đi', checked: true },
    { name: 'destination', title: 'Điểm đến', checked: true },
    { name: 'cost', title: 'Chi phí', checked: true, type: 'number' },
  ],

  commissionColumns: [
    // { name: '_id', title: 'ID', checked: true },
    { name: 'name', title: 'Tên', checked: true },
    { name: 'productName', title: 'Sản phẩm', checked: true },
    { name: 'position', title: 'Chức vụ', checked: true },
    { name: 'phone', title: 'Số điện thoại', checked: true, type: 'number' },
    { name: 'organizationUnit', title: 'Tên đơn vị', checked: true },
    { name: 'adress', title: 'Địa chỉ', checked: true },
    { name: 'discount', title: 'CK(%)', checked: true, type: 'number' },
    { name: 'discountPrice', title: 'CK(VND)', checked: true, type: 'number' },
    { name: 'cost', title: 'Tổng tiền', checked: true, type: 'number' },
    { name: 'salesPolicyName', title: 'Chính sách', checked: true },
    { name: 'action', title: 'Hành động', checked: true },
  ],

  otherCostsColumns: [
    // { name: '_id', title: 'ID', checked: true },
    { name: 'order', title: 'STT', checked: true, type: 'order' },
    { name: 'name', title: 'Tên', checked: true },
    { name: 'cost', title: 'Số tiền', checked: true, type: 'number' },
    { name: 'amount', title: 'Số lượng', checked: true, type: 'number' },
    { name: 'total', title: 'Thành tiền', checked: true, type: 'number', disabled: true },
  ],

  totalColumns: [
    { name: 'list', title: 'Danh mục', checked: true, type: 'text' },
    { name: 'sourcePrice', title: 'Giá vốn', checked: true, type: 'text' },
    { name: 'costPrice', title: 'Giá bán', checked: true, type: 'text' },
    { name: 'marketPrice', title: 'Giá thị trường', checked: true, type: 'text' },
    { name: 'profit', title: 'Lợi nhuận', checked: true, type: 'text' },
  ],

  inventoryColumns: [
    { name: 'name', title: 'Tên sản phẩm', checked: true },
    { name: 'code', title: 'Mã sản phẩm', checked: true },
    { name: 'sourcePrice', title: 'Giá vốn', checked: true },
    { name: 'costPrice', title: 'Giá bán', checked: true },
    { name: 'logo', title: 'Ảnh sản phẩm', checked: true },
  ],
  activeKanban: 0,
});

function addExpensesPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case 'CHANGE_TAB':
      return state.set('tab', action.tab);
    case 'GET_EXPENSE_DEFAULT':
      return state.merge(initialState);
    case 'GET_EXPENSE':
      return state.set('_id', null);
    case 'CHANGE_EXPENSE':
      return state.set('createdBy', action.value);
    case GET_SUCCESS:
      action.data.products = action.data.products.map((item, index) => ({
        ...item,
        order: index + 1,
        code: action.products[index].code,
      }));
      return state
        .merge(action.data)
        .set('businessOpportunities', action.businessOpportunities)
        .set('inventory', action.inventory);
    case GET_DEFAULT_SUCCESS:
      return state
        .merge(initialState)
        .set('createdBy', { _id: action.profile._id, name: action.profile.name })
        .set('businessOpportunities', action.businessOpportunities)
        .set('inventory', action.inventory);
    case 'CHANGE_EXPENSE_VALUE':
      return state.set(action.data.name, action.data.value);
    case 'SAVE_EXPENSE_ROW':
      return state.set(action.b, action.a);
    case HANDLE_CHANGE:
      return state.set(action.name, action.data);
    case MERGE_DATA:
      return state.merge(action.data);
    case ADD_PRODUCT:
      return state.set('products', [...state.get('products').toJS(), action.data]).set('openDrawer', false);
    case TOOGLE_DRAWER:
      return state.merge(action.data);

    case HANDLE_DISCOUNT:
      return state.set('checked', action.checked).set('productColumns', action.data);

    default:
      return state;
  }
}

export default addExpensesPageReducer;
