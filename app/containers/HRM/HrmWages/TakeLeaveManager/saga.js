// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_TAKE_LEAVE } from 'config/urlConfig';
import {
  addTakeLeaveManagerFailure,
  addTakeLeaveManagerSuccess,
  updateTakeLeaveManagerSuccess,
  updateTakeLeaveManagerFailure,
  deleteTakeLeaveManagerSuccess,
  deleteTakeLeaveManagerFailure,
  getAllVacationModeSuccess,
  getAllVacationModeFailure,
} from './actions';
import { ADD_TAKE_LEAVE_MANAGER, UPDATE_TAKE_LEAVE_MANAGER, DELETE_TAKE_LEAVE_MANAGER, GET_ALL_VACATION_MODE } from './constants';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { serialize, convertDatetime2Date } from 'utils/common';

// quan ly ngay nghi phep
export function* addTakeLeaveManagerSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    // console.log('saga', data)
    const res = yield call(request, `${API_TAKE_LEAVE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res && res.status === 1) {
      yield put(addTakeLeaveManagerSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Thêm mới dữ liệu thành công', status: true }));
    } else {
      yield put(addTakeLeaveManagerFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Thêm mới dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(addTakeLeaveManagerFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Thêm mới dữ liệu thất bại', status: true }));
  }
}
export function* updateTakeLeaveManagerSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    // debugger
    const newData = { ...data, date: convertDatetime2Date(data.date) };
    const res = yield call(request, `${API_TAKE_LEAVE}/${data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(newData),
    });
    if (res && res.status === 1) {
      yield put(updateTakeLeaveManagerSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Cập nhật dữ liệu thành công', status: true }));
    } else {
      yield put(updateTakeLeaveManagerFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Cập nhật dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(updateTakeLeaveManagerFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Cập nhật dữ liệu thất bại', status: true }));
  }
}
export function* deleteTakeLeaveManagerSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { ids } = action;
    const res = yield call(request, `${API_TAKE_LEAVE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify(ids),
    });
    if (res && res.status === 1) {
      yield put(deleteTakeLeaveManagerSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Xóa dữ liệu thành công', status: true }));
    } else {
      yield put(deleteTakeLeaveManagerFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Xóa dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(deleteTakeLeaveManagerFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Xóa dữ liệu thất bại', status: true }));
  }
}

export function* getAllVacationModeSaga() {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_SALARY_CATEGORY}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      const data = [...res.data];
      const getVacationMode = data.filter(item => item.code === 'HWS05');
      // console.log('1', getVacationMode)
      yield put(getAllVacationModeSuccess(getVacationMode[0].data));
    } else {
      yield put(getAllVacationModeFailure(res));
    }
  } catch (error) {
    yield put(getAllVacationModeFailure(error));
  }
}

export default function* takeLeaveManagementSaga() {
  // // ngay nghi phep
  yield takeLatest(ADD_TAKE_LEAVE_MANAGER, addTakeLeaveManagerSaga);
  yield takeLatest(UPDATE_TAKE_LEAVE_MANAGER, updateTakeLeaveManagerSaga);
  yield takeLatest(DELETE_TAKE_LEAVE_MANAGER, deleteTakeLeaveManagerSaga);
  yield takeLatest(GET_ALL_VACATION_MODE, getAllVacationModeSaga);
}
