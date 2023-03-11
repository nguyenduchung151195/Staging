import { takeLatest, call, put } from 'redux-saga/effects';
import { API_REPORT } from '../../config/urlConfig';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import { mergeData, getDataSuccess } from './actions';
import { GET_DATA } from './constants';
import { serialize } from '../../helper';
// Individual exports for testing
export function* getDataSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const filter = serialize({ filter: action.filter });
    const data = yield call(request, `${API_REPORT}/source?${filter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    let circleChart = [];
    if (data) {
      circleChart = data.data.map(item => ({
        country: item.name,
        litres: item.total,
      }));
    }

    yield put(mergeData({ circleChart }));
    yield put(getDataSuccess(circleChart));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}
export default function* reportSourceSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getDataSaga);
}
