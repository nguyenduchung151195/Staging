// import { take, call, put, select } from 'redux-saga/effects';

import { changeSnackbar } from 'containers/Dashboard/actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_OVER_TIME, API_PLAN_OT } from '../../../../config/urlConfig';
import {
  addOverTimeManagerFailure,
  addOverTimeManagerSuccess,
  addPlanOverTimeFailure,
  addPlanOverTimeSuccess,
  deleteOverTimeManagerFailure,
  deleteOverTimeManagerSuccess,
  updateOverTimeManagerFailure,
  updateOverTimeManagerSuccess,
  updatePlanOverTimeFailure,
  updatePlanOverTimeSuccess,
  deletePlanOverTimeFailure,
  deletePlanOverTimeSuccess,
} from './actions';
import { ADD_OVER_TIME_MANAGER, ADD_PLAN_OT, DELETE_OVER_TIME_MANAGER, DELETE_PLAN_OT, UPDATE_OVER_TIME_MANAGER, UPDATE_PLAN_OT } from './constants';

export function* addOverTimeManagerSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const res = yield call(request, `${API_OVER_TIME}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res && res.status === 1) {
      yield put(addOverTimeManagerSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Thêm mới dữ liệu thành công', status: true }));
    } else {
      yield put(addOverTimeManagerFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Thêm mới dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(addOverTimeManagerFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Thêm mới dữ liệu thất bại', status: true }));
  }
}

export function* updateOverTimeManagerSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const res = yield call(request, `${API_OVER_TIME}/${data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (res && res.status === 1) {
      yield put(updateOverTimeManagerSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Cập nhật dữ liệu thành công', status: true }));
    } else {
      yield put(updateOverTimeManagerFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Cập nhật dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(updateOverTimeManagerFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Cập nhật dữ liệu thất bại', status: true }));
  }
}
export function* deleteOverTimeManagerSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { ids } = action;
    const res = yield call(request, `${API_OVER_TIME}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify(action.data),
    });
    if (res && res.status === 1) {
      yield put(deleteOverTimeManagerSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Xóa dữ liệu thành công', status: true }));
    } else {
      yield put(deleteOverTimeManagerFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Xóa dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(deleteOverTimeManagerFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Xóa dữ liệu thất bại', status: true }));
  }
}

export function* addPlanOverTimeSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const newData = {
      startDate: data.startDate,
      endDate: data.endDate,
      join: data.join.map(item => ({ hrmEmployeeId: item._id })),
      taskId: data.taskId,
    };
    console.log('111', newData);
    const res = yield call(request, `${API_PLAN_OT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(newData),
    });
    console.log('222', res.data.join.length);
    if (res && res.status === 1 && res.data.join.length !== 0) {
      yield put(addPlanOverTimeSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Thêm mới dữ liệu thành công', status: true }));
    } else {
      yield put(addPlanOverTimeFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: 'Không được bỏ trống Nhân sự', status: true }));
    }
  } catch (error) {
    yield put(addPlanOverTimeFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Không được bỏ trống Dự án', status: true }));
  }
}

export function* updatePlanOverTimeSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const newData = {
      startDate: data.startDate,
      endDate: data.endDate,
      join: data.join.map(item => ({ hrmEmployeeId: item._id })),
      taskId: data.taskId,
    };

    const res = yield call(request, `${API_PLAN_OT}/${action.data && action.data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(newData),
    });

    if (res && res.status === 1) {
      yield put(updatePlanOverTimeSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Cập nhật dữ liệu thành công', status: true }));
    } else {
      yield put(updatePlanOverTimeFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Cập nhật dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(updatePlanOverTimeFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Cập nhật dữ liệu thất bại', status: true }));
  }
}

export function* deleteOverTimeSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { ids } = action;
    const res = yield call(request, `${API_PLAN_OT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify(action.data),
    });
    if (res && res.status === 1) {
      yield put(deletePlanOverTimeSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Xóa dữ liệu thành công', status: true }));
    } else {
      yield put(deletePlanOverTimeFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Xóa dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(deletePlanOverTimeFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Xóa dữ liệu thất bại', status: true }));
  }
}

export default function* overTimeManagerSaga() {
  // OT
  yield takeLatest(ADD_OVER_TIME_MANAGER, addOverTimeManagerSaga);
  yield takeLatest(UPDATE_OVER_TIME_MANAGER, updateOverTimeManagerSaga);
  yield takeLatest(DELETE_OVER_TIME_MANAGER, deleteOverTimeManagerSaga);

  // ke hoach OT
  yield takeLatest(ADD_PLAN_OT, addPlanOverTimeSaga);
  yield takeLatest(UPDATE_PLAN_OT, updatePlanOverTimeSaga);
  yield takeLatest(DELETE_PLAN_OT, deleteOverTimeSaga);
}
