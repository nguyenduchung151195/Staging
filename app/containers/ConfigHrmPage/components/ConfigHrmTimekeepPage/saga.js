// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, select, takeLatest } from 'redux-saga/effects';

// import lodash from 'lodash';
import request from 'utils/request';
import { API_HRM_HOLIDAY, API_HRM_TIMEKEEP_TYPE, API_HRM_SYMBOL } from '../../../../config/urlConfig';
import { changeSnackbar } from '../../../Dashboard/actions';
import {
  getAllHoliday,
  getAllHolidayFailer,
  getAllHolidaySuccess,
  getAllTimekeepTypeSuccess,
  getAllTimekeepTypeFailer,
  getAllSymbol,
  getAllSymbolSuccess,
  getAllSymbolFailer,
  addTimekeepTypeSuccess,
  addTimekeepTypeFailer,
  addHolidayFailer,
  addHolidaySuccess,
  deleteHolidaySuccess,
  deleteSymbolSuccess,
  addSymbolSuccess,
  deleteSymbolFailer,
  deleteTimekeepTypeSuccess,
  deleteTimekeepTypeFailer,
  updateSymbolFailer,
  updateSymbolSuccess,
  updateHolidaySuccess,
  updateHolidayFailer,
  updateTimekeepTypeSuccess,
  updateTimekeepTypeFailer,
  getAllTimekeepType,
  addSymbolFailer,
} from './actions';
import {
  GET_ALL_HOLIDAY,
  GET_ALL_TIMEKEEP_TYPE,
  GET_ALL_SYMBOL,
  ADD_HOLIDAY,
  ADD_TIMEKEEP_TYPE,
  ADD_SYMBOL,
  UPDATE_HOLIDAY,
  DELETE_HOLIDAY,
  DELETE_TIMEKEEP_TYPE,
  DELETE_SYMBOL,
  UPDATE_SYMBOL,
  UPDATE_TIMEKEEP_TYPE,
} from './constants';

export function* getAllHolidaySaga(action) {
  const token = localStorage.getItem('token');

  try {
    const holidays = yield call(request, `${API_HRM_HOLIDAY}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (holidays && holidays.status === 1) {
      yield put(getAllHolidaySuccess(holidays.data));
    }
  } catch (err) {
    yield put(getAllHolidayFailer(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
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
export function* getAllSymbolSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const symbol = yield call(request, `${API_HRM_SYMBOL}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (symbol && symbol.status === 1) {
      yield put(getAllSymbolSuccess(symbol.data));
    }
  } catch (err) {
    yield put(getAllSymbolFailer(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

// add
export function* addHolidaySaga(action) {
  const { data } = action;
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_HOLIDAY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thành công' }));
      yield put(addHolidaySuccess(data));
      yield put(getAllHoliday());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
      yield put(addHolidayFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
    yield put(addHolidayFailer(error));
  }
}
export function* addTimekeepTypeSaga(action) {
  const { data } = action;
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_TIMEKEEP_TYPE}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thành công' }));
      yield put(addTimekeepTypeSuccess(data));
      yield put(getAllTimekeepType());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'thêm mới thất bại' }));
      yield put(getAllTimekeepType(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
    yield put(addTimekeepTypeFailer(error));
  }
}
export function* addSymbolSaga(action) {
  const { data } = action;
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_SYMBOL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res && res == 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thành công' }));
      yield put(addSymbolSuccess(data));
      yield put(getAllSymbol());
    } else {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thất bại' }));
      yield put(addSymbolFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thất bại' }));
    yield put(addSymbolFailer(error));
  }
}

// update
export function* updateHolidaySaga(action) {
  const { data } = action;
  const token = localStorage.getItem('token');
  console.log(action);
  try {
    const res = yield call(request, `${API_HRM_HOLIDAY}/${data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật thành công' }));
      yield put(updateHolidaySuccess(data));
      yield put(getAllHoliday());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
      yield put(updateHolidayFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
    yield put(updateHolidayFailer(error));
  }
}
export function* updateTimekeepTypeSaga(action) {
  const token = localStorage.getItem('token');
  const { data } = action;

  try {
    const res = yield call(request, `${API_HRM_TIMEKEEP_TYPE}/${data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(data.data),
    });
    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật thành công' }));
      yield put(updateTimekeepTypeSuccess(data));
      yield put(getAllTimekeepType());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
      yield put(updateTimekeepTypeFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
    yield put(updateTimekeepTypeFailer(error));
  }
}
export function* updateSymbolSaga(action) {
  const { data: actionData } = action;
  const { _id, data: symbolRecord } = actionData;
  const { symbol, description, list: data } = symbolRecord;
  const body = {
    symbol,
    description,
    data,
  };
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_SYMBOL}/${_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(body),
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật thành công' }));
      yield put(updateSymbolSuccess(body));
      yield put(getAllSymbol());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
      yield put(updateSymbolFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
    yield put(updateSymbolFailer(error));
  }
}

// delete
export function* deleteHolidaySaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_HOLIDAY}/${action._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Xóa thành công' }));
      yield put(deleteHolidaySuccess(action._id));
      yield put(getAllHoliday());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
      yield put(deleteHolidayFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
    yield put(deleteHolidayFailer(error));
  }
}
export function* deleteTimekeepTypeSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_TIMEKEEP_TYPE}/${action._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Xóa thành công' }));
      yield put(deleteTimekeepTypeSuccess(action._id));
      yield put(getAllTimekeepType());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
      yield put(deleteTimekeepTypeFailer(data));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
    yield put(deleteTimekeepTypeFailer(error));
  }
}
export function* deleteSymbolSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_SYMBOL}/${action._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Xóa thành công' }));
      yield put(deleteSymbolSuccess(action._id));
      yield put(getAllSymbol());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
      yield put(deleteSymbolFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
    yield put(deleteSymbolFailer(error));
  }
}

// Individual exports for testing
export default function* configHrmTimekeepPageSaga() {
  yield takeLatest(GET_ALL_HOLIDAY, getAllHolidaySaga);
  yield takeLatest(GET_ALL_TIMEKEEP_TYPE, getAllTimekeepTypeSaga);
  yield takeLatest(GET_ALL_SYMBOL, getAllSymbolSaga);
  yield takeLatest(ADD_HOLIDAY, addHolidaySaga);
  yield takeLatest(ADD_TIMEKEEP_TYPE, addTimekeepTypeSaga);
  yield takeLatest(ADD_SYMBOL, addSymbolSaga);

  yield takeLatest(UPDATE_HOLIDAY, updateHolidaySaga);
  yield takeLatest(UPDATE_TIMEKEEP_TYPE, updateTimekeepTypeSaga);
  yield takeLatest(UPDATE_SYMBOL, updateSymbolSaga);

  yield takeLatest(DELETE_HOLIDAY, deleteHolidaySaga);
  yield takeLatest(DELETE_TIMEKEEP_TYPE, deleteTimekeepTypeSaga);
  yield takeLatest(DELETE_SYMBOL, deleteSymbolSaga);
}
