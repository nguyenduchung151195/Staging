import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import {
  getCommandSuccess,
  getCommandFailed,
  createAdvanceRecordSuccess,
  createAdvanceRecordFailed,
  getAdvanceRecordByIdSuccess,
  getAdvanceRecordByIdFailed,
  updateAdvanceRecordSuccess,
  updateAdvanceRecordFailed,
  getAdvanceRecordSuccess,
  getAdvanceRecordFailed,
} from './actions';
import { GET_COMMAND, CREATE_ADVANCE_RECORD, GET_ADVANCE_RECORD_BY_ID, UPDATE_ADVANCE_RECORD } from './constants';
import { API_DOCS, API_RNE_ADVANCE } from '../../config/urlConfig';

export function* getCommand() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_DOCS}/LTCL01`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getCommandSuccess(data.data));
    } else {
      yield put(getCommandFailed({}));
    }
  } catch (err) {
    yield put(getCommandFailed(err));
  }
}

export function* getAdvanceRecord() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_RNE_ADVANCE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAdvanceRecordSuccess(data.data));
    } else {
      yield put(getAdvanceRecordFailed({}));
    }
  } catch (err) {
    yield put(getAdvanceRecordFailed(err));
  }
}

export function* getAdvanceRecordById(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE_ADVANCE}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAdvanceRecordByIdSuccess(data));
    } else {
      yield put(getAdvanceRecordByIdFailed({}));
    }
  } catch (err) {
    yield put(getAdvanceRecordByIdFailed(err));
  }
}

export function* createNewAdvanceRecord(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE_ADVANCE}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (data) {
      yield put(createAdvanceRecordSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
    } else {
      yield put(createAdvanceRecordFailed({}));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
    }
  } catch (err) {
    yield put(createAdvanceRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

export function* updateAdvanceRecord(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE_ADVANCE}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    if (data) {
      yield put(updateAdvanceRecordSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    } else {
      yield put(updateAdvanceRecordFailed({}));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
    }
  } catch (err) {
    yield put(updateAdvanceRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* addAdvancePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_COMMAND, getCommand);
  yield takeEvery(GET_COMMAND, getAdvanceRecord);
  yield takeEvery(CREATE_ADVANCE_RECORD, createNewAdvanceRecord);
  yield takeEvery(GET_ADVANCE_RECORD_BY_ID, getAdvanceRecordById);
  yield takeEvery(UPDATE_ADVANCE_RECORD, updateAdvanceRecord);
}
