import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import { GET_DATA } from './constants';
import { API_CRITERIA } from '../../config/urlConfig';
import { mergeData } from './actions';
import { serialize } from '../../helper';
// Individual exports for testing
function* getDataSaga(action) {
  try {
    const kpiDashboard = yield call(request, `${API_CRITERIA}/dashboard/${action.userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const query = serialize({ filter: { isDelete: false } });

    const kpis = yield call(request, `${API_CRITERIA}?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    // const queryKpiPlan = serialize({ filter: { year: new Date().getFullYear(), rangeId: profile._id } });
    // const planKpi = yield call(request, `${API_CRITERIA}/plan?${queryKpiPlan}`, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    const exChange = yield call(request, `${API_CRITERIA}/exchange`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    exChange.tendency.sort((a, b) => a.priority - b.priority);
    const newTen = exChange.tendency;
    let totalPercent = 0;
    console.log(kpis, 'kpiDashboard', API_CRITERIA)

    const newKpis = kpis.data.map(i => {
      const x = i.points.find(item => kpiDashboard[i.code] && item.to > kpiDashboard[i.code].point || !item.to);
      const trend = x ? x.trend : 0;
      const direction = newTen.find(it => it.name === trend);
      const y = direction ? direction.direction : 0;
      console.log(kpiDashboard, 'kpiDashboard',)
      totalPercent += (kpiDashboard && kpiDashboard[i.code] && kpiDashboard[i.code].point ? kpiDashboard[i.code].point : 0) > 100 ? 100 * (i.ratio || 0) * 0.01 : (kpiDashboard && kpiDashboard[i.code] && kpiDashboard[i.code].point ? kpiDashboard[i.code].point : 0) * (i.ratio || 0) * 0.01;
      return {
        ...i,
        reality: kpiDashboard[i.code] && kpiDashboard[i.code].relity || 0,
        plan: kpiDashboard[i.code] && kpiDashboard[i.code].plan || 0,
        point: kpiDashboard[i.code] && kpiDashboard[i.code].point || 0,
        trend: y,
      };
    });
    yield put(mergeData({ kpis: newKpis, totalPercent: totalPercent.toFixed(2) }));
  } catch (error) {
    console.log(error);

    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export default function* kpiPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getDataSaga);
}
