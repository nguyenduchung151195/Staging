// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_USERS, API_SOURCE_HRMCONFIG, API_HRM_REPORT, API_INCREASES_OR_DECREASES, API_LATE_AND_LEAVE, API_HRM_BY_MONTH, API_WAGE_BY_MONTH } from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { getApiSuccess, getIncreasesOrDecreasesSuccess, getIncreasesOrDecreasesFailure , getLateSuccess, getLateFailure, getHrmFailure, getHrmSuccess, getWageSuccess, getWageFailure} from './actions';
import { GET_API, GET_INCREASES_OR_DECREASES, GET_LATE, GET_HRM_BY_MONTH, GET_WAGE_BY_MONTH } from './constants';

export function* getApiSaga() {
  try {
    const headersOptions = {
      method: 'GET',
      headers: {
        'Contetn-Type': 'application/json'
      },

    }
    const personnel = yield call(request, API_HRM_REPORT, headersOptions);
    const category = yield call(request, API_SOURCE_HRMCONFIG, headersOptions);
    yield put(getApiSuccess(personnel, category));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

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

export function* getLateSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_LATE_AND_LEAVE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })

    if (res && res.status === 1) {
      console.log(res,'ress')
      yield put(getLateSuccess(res.data));
    } else {
      yield put(getLateFailure(res))
    }
  } catch (error) {
    yield put(getLateFailure(error))
  }
}

export function* getHrmSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_BY_MONTH}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })

    if (res && res.status === 1) {
      console.log(res,'ress')
      yield put(getHrmSuccess(res.data));
    } else {
      yield put(getHrmFailure(res))
    }
  } catch (error) {
    yield put(getHrmFailure(error))
  }
}
export function* getWageSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_WAGE_BY_MONTH}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })

    if (res && res.status === 1) {
      yield put(getWageSuccess(res.data));
    } else {
      yield put(getWageFailure(res))
    }
  } catch (error) {
    yield put(getWageFailure(error))
  }
}

export default function* reportHrmPageSaga() {
  yield takeLatest(GET_API, getApiSaga);
  yield takeLatest(GET_INCREASES_OR_DECREASES, getIncreasesOrDecreasesSaga);
  yield takeLatest(GET_LATE, getLateSaga);
  yield takeLatest(GET_HRM_BY_MONTH, getHrmSaga);
  yield takeLatest(GET_WAGE_BY_MONTH, getWageSaga);
}
