// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
// import lodash from 'lodash';
import request from 'utils/request';
import {
  API_HRM_HOLIDAY,
  API_HRM_SYMBOL,
  API_HRM_TIMEKEEP_TYPE,
  API_TIMEKEEPING_ADDEQUIPMENT,
  API_TIMEKEEPING_EQUIPMENT,
  API_TIMEKEEPING_EQUIPMENT_2,
  API_HRM_SHIFT,
} from '../../../../config/urlConfig';
import { changeSnackbar } from '../../../Dashboard/actions';
import {
  addConfigTimekeepingFailer,
  addConfigTimekeepingSuccess,
  addEditEmployeesFailer,
  addEditEmployeesSuccess,
  addHolidayFailer,
  addHolidaySuccess,
  addSymbolFailer,
  addSymbolSuccess,
  addTimekeepTypeFailer,
  addTimekeepTypeSuccess,
  deleteConfigTimekeepingFailer,
  deleteConfigTimekeepingSuccess,
  deleteEditEmployeesFailer,
  deleteEditEmployeesSuccess,
  deleteHolidaySuccess,
  deleteSymbolFailer,
  deleteSymbolSuccess,
  deleteTimekeepTypeFailer,
  deleteTimekeepTypeSuccess,
  getAllConfigTimekeeping,
  getAllConfigTimekeepingFailer,
  getAllConfigTimekeepingSuccess,
  getAllHoliday,
  getAllHolidayFailer,
  getAllHolidaySuccess,
  getAllSymbol,
  getAllSymbolFailer,
  getAllSymbolSuccess,
  getAllTimekeepType,
  getAllTimekeepTypeFailer,
  getAllTimekeepTypeSuccess,
  getEditEmployees,
  getEditEmployeesFailer,
  getEditEmployeesSuccess,
  updateConfigTimekeepingFailer,
  updateConfigTimekeepingSuccess,
  updateEditEmployeesFailer,
  updateEditEmployeesSuccess,
  updateHolidayFailer,
  updateHolidaySuccess,
  updateSymbolFailer,
  updateSymbolSuccess,
  updateTimekeepTypeFailer,
  updateTimekeepTypeSuccess,
  getAllShiftSuccess,
  getAllShiftFailure,
  addShiftSuccess,
  addShiftFailure,
  updateShiftSuccess,
  updateShiftFailure,
  deleteShiftSuccess,
  deleteShiftFailure,
  getAllShift,
} from './actions';
import {
  ADD_CONFIG_TIMEKEEPING,
  ADD_EDIT_EMPLOYEES,
  ADD_HOLIDAY,
  ADD_SYMBOL,
  ADD_TIMEKEEP_TYPE,
  DELETE_CONFIG_TIMEKEEPING,
  DELETE_EDIT_EMPLOYEES,
  DELETE_HOLIDAY,
  DELETE_SYMBOL,
  DELETE_TIMEKEEP_TYPE,
  GET_ALL_CONFIG_TIMEKEEPING,
  GET_ALL_HOLIDAY,
  GET_ALL_SYMBOL,
  GET_ALL_TIMEKEEP_TYPE,
  GET_EDIT_EMPLOYEES,
  UPDATE_CONFIG_TIMEKEEPING,
  UPDATE_EDIT_EMPLOYEES,
  UPDATE_HOLIDAY,
  UPDATE_SYMBOL,
  UPDATE_TIMEKEEP_TYPE,
  GET_ALL_SHIFT,
  ADD_SHIFT,
  UPDATE_SHIFT,
  DELETE_SHIFT,
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

export function* getAllConfigTimekeepingSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const configTimeKeeping = yield call(request, `${API_TIMEKEEPING_EQUIPMENT}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (configTimeKeeping && configTimeKeeping.status === 1) {
      yield put(getAllConfigTimekeepingSuccess(configTimeKeeping.data));
    }
  } catch (err) {
    yield put(getAllConfigTimekeepingFailer(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'erro' }));
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

export function* getEditEmployeesSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const editEmployees = yield call(request, `${API_TIMEKEEPING_ADDEQUIPMENT}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (editEmployees && editEmployees.status === 1) {
      yield put(getEditEmployeesSuccess(editEmployees.data));
    }
  } catch (err) {
    yield put(getEditEmployeesFailer(err));
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
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
      yield put(getAllTimekeepType(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
    yield put(addTimekeepTypeFailer(error));
  }
}

export function* addConfigTimekeepingSaga(action) {
  const { data } = action;
  const token = localStorage.getItem('token');

  try {
    const res = yield call(request, `${API_TIMEKEEPING_EQUIPMENT}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thành công' }));
      yield put(addConfigTimekeepingSuccess(data));
      yield put(getAllConfigTimekeeping());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
      yield put(getAllConfigTimekeeping(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
    yield put(addConfigTimekeepingFailer(error));
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

    if (res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thành công' }));
      // yield put(addSymbolSuccess(res));
      yield put(getAllSymbol());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
      yield put(addSymbolFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
    yield put(addSymbolFailer(error));
  }
}

export function* addEditEmployeesSaga(action) {
  const { data } = action;
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_TIMEKEEPING_ADDEQUIPMENT}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm mới thành công' }));
      yield put(addEditEmployeesSuccess(data));
      yield put(getEditEmployees());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
      yield put(addEditEmployeesFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm mới thất bại' }));
    yield put(addEditEmployeesFailer(error));
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

export function* updateConfigTimekeepingSaga(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  const saveData = {
    port: data.port,
    ip: data.ip,
    password: data.password,
    code: data.code,
    name: data.name,
    organizationUnit: data.organizationUnit,
  };
  try {
    const res = yield call(request, `${API_TIMEKEEPING_EQUIPMENT}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saveData),
    });
    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật thành công' }));
      yield put(updateConfigTimekeepingSuccess(data));
      yield put(getAllConfigTimekeeping());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
      yield put(updateConfigTimekeepingFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
    yield put(updateConfigTimekeepingFailer(error));
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

export function* updateEditEmployeesSaga(action) {
  const { data } = action;
  const token = localStorage.getItem('token');
  console.log(action);
  try {
    const res = yield call(request, `${API_TIMEKEEPING_ADDEQUIPMENT}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật thành công' }));
      yield put(updateEditEmployeesSuccess(data));
      yield put(getEditEmployees());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
      yield put(updateEditEmployeesFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật thất bại' }));
    yield put(updateEditEmployeesFailer(error));
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

export function* deleteConfigTimekeepingSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_TIMEKEEPING_EQUIPMENT}/${action._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Xóa thành công' }));
      yield put(deleteConfigTimekeepingSuccess(action._id));
      yield put(getAllConfigTimekeeping());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
      yield put(deleteConfigTimekeepingFailer(data));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
    yield put(deleteConfigTimekeepingFailer(error));
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

export function* deleteEditEmployeesSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_TIMEKEEPING_ADDEQUIPMENT}/${action._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Xóa thành công' }));
      yield put(deleteEditEmployeesSuccess(action._id));
      yield put(getEditEmployees());
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
      yield put(deleteEditEmployeesFailer(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa thất bại' }));
    yield put(deleteEditEmployeesFailer(error));
  }
}

//shifts
export function* getAllShiftSaga() {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_SHIFT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    if (res && res.status === 1) {
      yield put(getAllShiftSuccess(res.data));
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: res.message || 'Lấy dữ liệu thất bại' }));
      yield put(getAllShiftFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
    yield put(getAllShiftFailure(error));
  }
}

export function* addShiftSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const res = yield call(request, `${API_HRM_SHIFT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(addShiftSuccess(res.data));
      yield put(getAllShift());
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Thêm dữ liệu thành công' }));
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: res.message || 'Thêm dữ liệu thất bại' }));
      yield put(addShiftFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Thêm dữ liệu thất bại' }));
    yield put(addShiftFailure(error));
  }
}
export function* updateShiftSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const res = yield call(request, `${API_HRM_SHIFT}/${data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (res && res.status === 1) {
      yield put(updateShiftSuccess(res));
      yield put(getAllShift());
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật dữ liệu thành công' }));
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: res.message || 'Cập nhật dữ liệu thất bại' }));
      yield put(updateShiftFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật dữ liệu thất bại' }));
    yield put(updateShiftFailure(error));
  }
}
export function* deleteShiftSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_SHIFT}/${action._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });

    if (res && res.status === 1) {
      yield put(deleteShiftSuccess(res.data));
      yield put(getAllShift());
      yield put(changeSnackbar({ variant: 'success', status: true, message: 'Xóa dữ liệu thành công' }));
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: res.message || 'Xóa dữ liệu thất bại' }));
      yield put(deleteShiftFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Xóa dữ liệu thất bại' }));
    yield put(deleteShiftFailure(error));
  }
}

// Individual exports for testing
export default function* configHrmTimekeepPageSaga() {
  yield takeLatest(GET_ALL_HOLIDAY, getAllHolidaySaga);
  yield takeLatest(GET_ALL_TIMEKEEP_TYPE, getAllTimekeepTypeSaga);
  yield takeLatest(GET_ALL_CONFIG_TIMEKEEPING, getAllConfigTimekeepingSaga);
  yield takeLatest(GET_ALL_SYMBOL, getAllSymbolSaga);
  yield takeLatest(GET_EDIT_EMPLOYEES, getEditEmployeesSaga);

  yield takeLatest(ADD_HOLIDAY, addHolidaySaga);
  yield takeLatest(ADD_TIMEKEEP_TYPE, addTimekeepTypeSaga);
  yield takeLatest(ADD_CONFIG_TIMEKEEPING, addConfigTimekeepingSaga);
  yield takeLatest(ADD_SYMBOL, addSymbolSaga);
  yield takeLatest(ADD_EDIT_EMPLOYEES, addEditEmployeesSaga);

  yield takeLatest(UPDATE_HOLIDAY, updateHolidaySaga);
  yield takeLatest(UPDATE_TIMEKEEP_TYPE, updateTimekeepTypeSaga);
  yield takeLatest(UPDATE_CONFIG_TIMEKEEPING, updateConfigTimekeepingSaga);
  yield takeLatest(UPDATE_SYMBOL, updateSymbolSaga);
  yield takeLatest(UPDATE_EDIT_EMPLOYEES, updateEditEmployeesSaga);

  yield takeLatest(DELETE_HOLIDAY, deleteHolidaySaga);
  yield takeLatest(DELETE_TIMEKEEP_TYPE, deleteTimekeepTypeSaga);
  yield takeLatest(DELETE_CONFIG_TIMEKEEPING, deleteConfigTimekeepingSaga);
  yield takeLatest(DELETE_SYMBOL, deleteSymbolSaga);
  yield takeLatest(DELETE_EDIT_EMPLOYEES, deleteEditEmployeesSaga);

  // shifts
  yield takeLatest(GET_ALL_SHIFT, getAllShiftSaga);
  yield takeLatest(ADD_SHIFT, addShiftSaga);
  yield takeLatest(UPDATE_SHIFT, updateShiftSaga);
  yield takeLatest(DELETE_SHIFT, deleteShiftSaga);
}
