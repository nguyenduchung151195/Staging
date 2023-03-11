import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import {
  getCommandSuccess,
  getCommandFailed,
  createPaymentRecordSuccess,
  createPaymentRecordFailed,
  getPaymentRecordByIdSuccess,
  getPaymentRecordByIdFailed,
  updatePaymentRecordSuccess,
  updatePaymentRecordFailed,
  getAdvanceRecordSuccess,
  getAdvanceRecordFailed,
} from './actions';
import { GET_COMMAND, CREATE_PAYMENT_RECORD, GET_PAYMENT_RECORD_BY_ID, UPDATE_PAYMENT_RECORD } from './constants';
import { API_DOCS, API_RNE_ADVANCE, API_PAYMENT, UPLOAD_IMG_SINGLE } from '../../config/urlConfig';

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

export function* getPaymentRecordById(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_PAYMENT}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getPaymentRecordByIdSuccess(data));
    } else {
      yield put(getPaymentRecordByIdFailed({}));
    }
  } catch (err) {
    yield put(getPaymentRecordByIdFailed(err));
  }
}

export function* createNewPaymentRecord(action) {
  const token = localStorage.getItem('token');
  try {
    if (!action.body.file || action.body.file === null) {
      action.body.file = '';
      const data1 = yield call(request, API_PAYMENT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.body),
      });
      if (data1) {
        yield put(createPaymentRecordSuccess(data1));
        yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      } else {
        yield put(createPaymentRecordFailed({}));
        yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
      }
    } else {
      const formData = new FormData();
      formData.append('file', action.body.file);
      const upload = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {},
        body: formData,
      });
      action.body.file = upload.url;
      const data = yield call(request, API_PAYMENT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.body),
      });
      if (data) {
        yield put(createPaymentRecordSuccess(data));
        yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      } else {
        yield put(createPaymentRecordFailed({}));
        yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
      }
    }
  } catch (err) {
    yield put(createPaymentRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

export function* updatePaymentRecord(action) {
  const token = localStorage.getItem('token');
  try {
    if (!action.body.file || action.body.file === null) {
      action.body.file = action.body.fileRecived;
      const data1 = yield call(request, `${API_PAYMENT}/${action.body.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.body),
      });
      if (data1) {
        yield put(updatePaymentRecordSuccess(data1));
        yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      } else {
        yield put(updatePaymentRecordFailed({}));
        yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
      }
    } else {
      const formData = new FormData();
      formData.append('file', action.body.file);
      const upload = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {},
        body: formData,
      });
      action.body.file = upload.url;
      const data = yield call(request, `${API_PAYMENT}/${action.body.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.body),
      });
      if (data) {
        yield put(updatePaymentRecordSuccess(data));
        yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      } else {
        yield put(updatePaymentRecordFailed({}));
        yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
      }
    }
  } catch (err) {
    yield put(updatePaymentRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* addPaymentPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_COMMAND, getCommand);
  yield takeEvery(GET_COMMAND, getAdvanceRecord);
  yield takeEvery(CREATE_PAYMENT_RECORD, createNewPaymentRecord);
  yield takeEvery(GET_PAYMENT_RECORD_BY_ID, getPaymentRecordById);
  yield takeEvery(UPDATE_PAYMENT_RECORD, updatePaymentRecord);
}
