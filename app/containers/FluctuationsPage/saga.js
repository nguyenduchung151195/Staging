import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { getIncreasesOrDecreasesSuccess, getIncreasesOrDecreasesFailure } from './actions';
import { API_INCREASES_OR_DECREASES } from 'config/urlConfig';
import { GET_INCREASES_OR_DECREASES } from './constants';
import request from '../../utils/request';

export function* getIncreasesOrDecreasesSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_INCREASES_OR_DECREASES}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })

    if (res && res.status === 1) {
      yield put(getIncreasesOrDecreasesSuccess(res.data));
    } else {
      yield put(getIncreasesOrDecreasesFailure(res))
    }
  } catch (error) {
    yield put(getIncreasesOrDecreasesFailure(error))
  }
}

// Individual exports for testing
export default function* fluctuationsPageSaga() {
  // See example in containers/HomePage/saga.js

  yield takeLatest(GET_INCREASES_OR_DECREASES, getIncreasesOrDecreasesSaga);
}
