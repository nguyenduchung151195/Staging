import { takeEvery, call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_RNE, API_RNE_ADVANCE, API_RNE_REMBUR, API_PAYMENT, API_RNE_COUNT } from '../../config/urlConfig';
import {
  GET_ALL_RECORD,
  DELETE_RECORD,
  GET_ADVENCE_RECORD,
  DELETE_ADVENCE_RECORD,
  GET_REIBURSEMENT_RECORD,
  DELETE_REIBURSEMENT_RECORD,
  GET_PAYMENT_RECORD,
  DELETE_PAYMENT_RECORD,
  UPDATE_RECORD,
  UPDATE_RECORD_ADVANCE,
  UPDATE_RECORD_REIBURSEMENT,
  UPDATE_RECORD_PAYMENT
} from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import {
  getAllRecordSuccess,
  getAllRecordFailed,
  deleteRecordSuccess,
  deleteRecordFailed,
  getAdvanceRecordSuccess,
  getAdvanceRecordFailed,
  deleteAdvanceRecordSuccess,
  deleteAdvanceRecordFailed,
  getReibursementRecordSuccess,
  getReibursementRecordFailed,
  deleteReibursementRecordSuccess,
  deleteReibursementRecordFailed,
  getPaymentRecordSuccess,
  getPaymentRecordFailed,
  deletePaymentRecordSuccess,
  deletePaymentRecordFailed,
  getCountSuccess,
  getCountFailed,
  updateRecordSuccess,
  updateRecordFailure,
  updateRecordAdvanceSuccess,
  updateRecordAdvanceFailure,
  updateRecordReibursementSuccess,
  updateRecordReibursementFailure,
  updateRecordPaymentSuccess,
  updateRecordPaymentFailure,
} from './actions';

export function* getAllRecord(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE}?${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllRecordSuccess({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
    } else {
      yield put(getAllRecordFailed({}));
    }
  } catch (err) {
    yield put(getAllRecordFailed(err));
  }
}

export function* updateRecordSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_RNE}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.body)
    });
    if (res) {
      yield put(updateRecordSuccess(res.data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateRecordFailure(res));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateRecordFailure(err));
  }
}

export function* updateRecordAdvanceSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_RNE_ADVANCE}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.body)
    });
    if (res) {
      yield put(updateRecordAdvanceSuccess(res.data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateRecordAdvanceFailure(res));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateRecordAdvanceFailure(err));
  }
}

export function* updateRecordReibursementSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_RNE_REMBUR}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.body)
    });
    if (res) {
      yield put(updateRecordReibursementSuccess(res.data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateRecordReibursementFailure(res));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateRecordReibursementFailure(err));
  }
}

export function* updateRecordPaymentSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_PAYMENT}/${action.body._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.body)
    });
    if (res) {
      yield put(updateRecordPaymentSuccess(res.data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateRecordPaymentFailure(res));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateRecordPaymentFailure(err));
  }
}



export function* getAllAdvanceRecord(action) {
  const token = localStorage.getItem('token');
  let queryString;
  if (action.body) {
    queryString = `${API_RNE_ADVANCE}?skip=${action.body.skip}&limit=${action.body.limit}`;
  } else {
    queryString = `${API_RNE_ADVANCE}`;
  }
  try {
    const data = yield call(request, `${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAdvanceRecordSuccess({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
    } else {
      yield put(getAdvanceRecordFailed({}));
    }
  } catch (err) {
    yield put(getAdvanceRecordFailed(err));
  }
}

export function* getAllReibursementRecord(action) {
  const token = localStorage.getItem('token');
  let queryString;
  if (action.body) {
    queryString = `${API_RNE_REMBUR}?skip=${action.body.skip}&limit=${action.body.limit}`;
  } else {
    queryString = `${API_RNE_REMBUR}`;
  }
  try {
    const data = yield call(request, `${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getReibursementRecordSuccess({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
    } else {
      yield put(getReibursementRecordFailed({}));
    }
  } catch (err) {
    yield put(getReibursementRecordFailed(err));
  }
}

export function* getAllPaymentRecord(action) {
  const token = localStorage.getItem('token');
  let queryString;
  if (action.body) {
    queryString = `${API_PAYMENT}?skip=${action.body.skip}&limit=${action.body.limit}`;
  } else {
    queryString = `${API_PAYMENT}`;
  }
  try {
    const data = yield call(request, `${queryString}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getPaymentRecordSuccess({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
    } else {
      yield put(getPaymentRecordFailed({}));
    }
  } catch (err) {
    yield put(getPaymentRecordFailed(err));
  }
}

export function* deleteRecords(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body }),
    });
    if (data.success) {
      yield put(deleteRecordSuccess(data.data));
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      const dataNew = yield call(request, API_RNE, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (dataNew) {
        yield put(getAllRecordSuccess(dataNew.data));
      } else {
        yield put(getAllRecordFailed({}));
      }
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
      yield put(deleteRecordFailed());
    }
  } catch (err) {
    yield put(deleteRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}

export function* deleteAdvanceRecords(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE_ADVANCE}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body }),
    });
    if (data.success) {
      yield put(deleteAdvanceRecordSuccess(data.data));
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      const dataNew = yield call(request, API_RNE_ADVANCE, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (dataNew) {
        yield put(getAdvanceRecordSuccess(dataNew.data));
      } else {
        yield put(getAdvanceRecordFailed({}));
      }
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
      yield put(deleteAdvanceRecordFailed());
    }
  } catch (err) {
    yield put(deleteAdvanceRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}

export function* deleteReibursementRecords(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE_REMBUR}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body }),
    });
    if (data.success) {
      yield put(deleteReibursementRecordSuccess(data.data));
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      const dataNew = yield call(request, API_RNE_REMBUR, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (dataNew) {
        yield put(getReibursementRecordSuccess(dataNew.data));
      } else {
        yield put(getReibursementRecordFailed({}));
      }
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
      yield put(deleteReibursementRecordFailed());
    }
  } catch (err) {
    yield put(deleteReibursementRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}

export function* deletePaymentRecords(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_PAYMENT}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.body }),
    });
    if (data.success) {
      yield put(deletePaymentRecordSuccess(data.data));
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      const dataNew = yield call(request, API_PAYMENT, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (dataNew) {
        yield put(getPaymentRecordSuccess(dataNew.data));
      } else {
        yield put(getPaymentRecordFailed({}));
      }
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
      yield put(deletePaymentRecordFailed());
    }
  } catch (err) {
    yield put(deletePaymentRecordFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}

export function* getCount() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_RNE_COUNT}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getCountSuccess(data));
    }
  } catch (err) {
    yield put(getCountFailed(err));
  }
}

// Individual exports for testing
export default function* revenueAndExpenditureSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ALL_RECORD, getAllRecord);
  yield takeEvery(GET_ADVENCE_RECORD, getAllAdvanceRecord);
  yield takeEvery(GET_REIBURSEMENT_RECORD, getAllReibursementRecord);
  yield takeEvery(DELETE_RECORD, deleteRecords);
  yield takeEvery(DELETE_ADVENCE_RECORD, deleteAdvanceRecords);
  yield takeEvery(DELETE_REIBURSEMENT_RECORD, deleteReibursementRecords);
  yield takeEvery(GET_PAYMENT_RECORD, getAllPaymentRecord);
  yield takeEvery(GET_PAYMENT_RECORD, getCount);
  yield takeEvery(GET_ALL_RECORD, getCount);
  yield takeEvery(GET_ADVENCE_RECORD, getCount);
  yield takeEvery(GET_REIBURSEMENT_RECORD, getCount);
  yield takeEvery(DELETE_PAYMENT_RECORD, deletePaymentRecords);

  yield takeLatest(UPDATE_RECORD, updateRecordSaga);
  yield takeLatest(UPDATE_RECORD_ADVANCE, updateRecordAdvanceSaga);
  yield takeLatest(UPDATE_RECORD_REIBURSEMENT, updateRecordReibursementSaga);
  yield takeLatest(UPDATE_RECORD_PAYMENT, updateRecordPaymentSaga);
}
