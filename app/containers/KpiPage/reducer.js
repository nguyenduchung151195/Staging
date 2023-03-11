/*
 *
 * KpiPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_DATA_SUCCESS } from './constants';

export const initialState = fromJS({
  tab: 0,
  employees: [],
  employee: '',
  departments: [],
  profile: {},
  totalPercent: 0,
  kpis: [
    {
      code: 'khachhang',
      relity: 0,
      plan: 0,
      point: 0,
    },
    {
      code: 'hopdong',
      relity: 0,
      plan: 0,
      point: 0,
    },
    {
      code: 'doanhthu',
      relity: 0,
      plan: 0,
      point: 0,
    },
    {
      code: 'traodoi',
      relity: 0,
      plan: 0,
      point: 0,
    },
    {
      code: 'donhang',
      relity: 0,
      plan: 0,
      point: 0,
    },
    {
      code: 'duan',
      relity: 0,
      plan: 0,
      point: 0,
    },
  ],
  columnData: [
    {
      year: 'Doanh số',
      income: 81.5,
      code: 'khachhang',
    },
    {
      year: 'Khách hàng mới',
      income: 41.2,
      code: 'traodoi',
    },
    {
      year: 'Quy trình nội bộ ',
      income: 60.1,
      code: 'hopdong',
    },
    {
      year: 'Công việc dự án',
      income: 89.5,
      code: 'doanthu',
    },
    {
      year: 'Đơn hàng',
      income: 89.5,
      code: 'donhang',
    },
  ],
});

function kpiPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DATA_SUCCESS:
      return state
        .set('employees', action.employees)
        .set('departments', action.departments)
        .set('profile', action.profile);
    default:
      return state;
  }
}

export default kpiPageReducer;
