// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_TIMEKEEPING, API_HRM_WAGES, API_HRM_TIMEKEEP_TYPE } from 'config/urlConfig';
import {
  getTimekeepingsSuccess,
  getTimekeepingsFailure,
  createWagesFailure,
  updateWagesSuccess,
  updateWagesFailure,
  deleteWagesSuccess,
  deleteWagesFailure,
  updateCellDataSuccess,
  updateCellDataFailure,
  getAllTimekeepTypeFailer,
  getAllTimekeepTypeSuccess,
} from './actions';
import { GET_TIMEKEEPINGS, UPDATE_WAGES, DELETE_WAGES, UPDATE_TIMEKEEPING_CELL, GET_ALL_TIMEKEEP_TYPE, GET_TIMEKEEP_TYPE_PAGE } from './constants';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { serialize } from '../../../../helper';

export function* createWages(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_HRM_WAGES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createWagesSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createWagesFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createWagesFailure(err));
  }
}

export function* updateWages(action) {
  try {
    const { hrmEmployeeId: wagesId, data } = action;
    const response = yield call(request, `${API_HRM_WAGES}/${wagesId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.success) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateWagesSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateWagesFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateWagesFailure(err));
  }
}

export function* deleteWages(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_WAGES}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.success) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteWagesSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteWagesFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteWagesFailure(err));
  }
}

export function* fetchTimekeepings(action) {

  try {
    const { data } = action;
    const { tableId, page, limit, ...rest } = data;
    const response = yield call(request, `${API_TIMEKEEPING}/${tableId ? tableId : 'currentMonth'}?${serialize(rest)}&limit=${limit ? limit : '10'}&skip=${page ? page * limit : '0'}&sort=-updatedAt&`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 1) {
      yield put(getTimekeepingsSuccess(response.data));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message, variant: 'error' }));
      yield put(getTimekeepingsFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message, variant: 'error' }));
    yield put(getTimekeepingsFailure(err));
  }
}

export function* getAllTimekeepTypeSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const timekeepType = yield call(request, `${API_HRM_TIMEKEEP_TYPE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (timekeepType && timekeepType.status === 1) {
      yield put(getAllTimekeepTypeSuccess(timekeepType.data));
    }
  } catch (err) {
    yield put(getAllTimekeepTypeFailer(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* updateCellData(action) {
  try {
    const { day, row } = action.data;
    const { _id: cellId, symbol, shifts } = day;
    const { _id: rowId } = row;
    const body = {
      symbol,
      shifts
    };
    const response = yield call(request, `${API_TIMEKEEPING}/update-cell/${rowId}/${cellId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateCellDataSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateCellDataFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateCellDataFailure(err));
  }
}

export default function* timekeepingPageSaga() {
  yield takeLatest(GET_TIMEKEEPINGS, fetchTimekeepings);
  yield takeLatest(UPDATE_WAGES, updateWages);
  yield takeLatest(DELETE_WAGES, deleteWages);
  yield takeLatest(UPDATE_TIMEKEEPING_CELL, updateCellData);
  yield takeLatest(GET_ALL_TIMEKEEP_TYPE, getAllTimekeepTypeSaga);
  yield takeLatest(GET_TIMEKEEP_TYPE_PAGE, fetchTimekeepings);
}
