import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import { API_RNE_ADVANCE, UPLOAD_IMG_SINGLE, API_RNE_REMBUR } from '../../config/urlConfig';
import {
  getAdvanceSuccess,
  getAdvanceFailed,
  createReiburementRecordSuccess,
  createReiburementRecordFailed,
  getReibursementSuccess,
  getReibursementFailed,
  updateReiburementRecordSuccess,
  updateReiburementRecordFailed,
} from './actions';
import { GET_ADVANCE, CREATE_REIMBURSEMENT_RECORD, GET_REIMBURSEMENT_RECORD_BY_ID, UPDATE_REIMBURSEMENT_RECORD } from './constants';

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
      yield put(getAdvanceSuccess(data.data));
    } else {
      yield put(getAdvanceFailed({}));
    }
  } catch (err) {
    yield put(getAdvanceFailed(err));
  }
}

export function* getReibursementRecord(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE_REMBUR}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getReibursementSuccess(data));
    } else {
      yield put(getReibursementFailed({}));
    }
  } catch (err) {
    yield put(getReibursementFailed(err));
  }
}

export function* createReimburementRecord(action) {
  const token = localStorage.getItem('token');
  try {
    if (action.body.file === null) {
      action.body.file = '';
      const data1 = yield call(request, API_RNE_REMBUR, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.body),
      });
      if (data1) {
        yield put(createReiburementRecordSuccess(data1));
        yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      } else {
        yield put(createReiburementRecordFailed({}));
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
      const data = yield call(request, API_RNE_REMBUR, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.body),
      });
      if (data) {
        yield put(createReiburementRecordSuccess(data));
        yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      } else {
        yield put(createReiburementRecordFailed({}));
        yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
      }
    }
  } catch (err) {
    yield put(createReiburementRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

export function* updateReimburementRecord(action) {
  const token = localStorage.getItem('token');
  try {
    if (action.body.file === null) {
      action.body.file = action.body.fileRecived;
      const data1 = yield call(request, `${API_RNE_REMBUR}/${action.body.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.body),
      });
      if (data1) {
        yield put(updateReiburementRecordSuccess(data1));
        yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      } else {
        yield put(updateReiburementRecordFailed({}));
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
      const data = yield call(request, `${API_RNE_REMBUR}/${action.body.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.body),
      });
      if (data) {
        yield put(updateReiburementRecordSuccess(data));
        yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      } else {
        yield put(updateReiburementRecordFailed({}));
        yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
      }
    }
  } catch (err) {
    yield put(updateReiburementRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* addReimbursementRequirePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ADVANCE, getAdvanceRecord);
  yield takeEvery(CREATE_REIMBURSEMENT_RECORD, createReimburementRecord);
  yield takeEvery(UPDATE_REIMBURSEMENT_RECORD, updateReimburementRecord);
  yield takeEvery(GET_REIMBURSEMENT_RECORD_BY_ID, getReibursementRecord);
}
