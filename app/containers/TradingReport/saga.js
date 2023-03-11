import { call, put, takeLatest } from 'redux-saga/effects';
// import lodash from 'lodash';
import request from '../../utils/request';
import { API_TRADINGS, API_LOG } from '../../config/urlConfig';
import { getItemByRangeSuccess, getItemByRangeFailed, getLogsByRangeSuccess, getLogsByRangeFailed } from './actions';
import { GET_ITEM_BY_RANGE, GET_LOGS_BY_RANGE } from './constants';
import { serialize } from '../../utils/common';

export function* fetchGetAllBos(action) {
  let url = '';
  if (action.body) {
    url = `${API_TRADINGS}?${serialize(action.body)}`;
  } else {
    url = `${API_TRADINGS}`;
  }
  try {
    const data = yield call(request, url, {
      method: 'GET',
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem('token')}`,
      // },
    });

    if (data) {
      // console.log(data);
      yield put(getItemByRangeSuccess(data.data));
    }
  } catch (err) {
    yield put(getItemByRangeFailed(err));
  }
}

export function* fetchGetLogs(action) {
  try {
    const data = yield call(request, `${API_LOG}?${serialize({ ...action.body, limit: 2000 })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(getLogsByRangeSuccess(data.data));
    // console.log(mergeData);
  } catch (err) {
    yield put(getLogsByRangeFailed(err));
  }
}
// Individual exports for testing
export default function* tradingReportSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ITEM_BY_RANGE, fetchGetAllBos);
  yield takeLatest(GET_LOGS_BY_RANGE, fetchGetLogs);
}
