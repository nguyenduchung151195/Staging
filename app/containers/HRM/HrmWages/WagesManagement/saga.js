// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_TIMEKEEPING_TABLE, API_TIMEKEEPING_EQUIPMENT, API_TIMEKEEPING_ADDEQUIPMENT, API_IMPORT_TIMEKEEPING, API_HRM_SALARY_CATEGORY, API_TAKE_LEAVE, API_OVER_TIME } from 'config/urlConfig';
import {
  createWagesSuccess,
  createWagesFailure,
  updateWagesSuccess,
  updateWagesFailure,
  deleteWagesSuccess,
  deleteWagesFailure,
  getAllTimekeepingEquipmentFailure,
  getAllTimekeepingEquipmentSuccess,
  getTimekeepingToEquipmentSuccess,
  getTimekeepingToEquipmentFailure,
  importTimeKeepingFailure,
  importTimeKeepingSuccess,
  addTakeLeaveManagerFailure,
  addTakeLeaveManagerSuccess,
  updateTakeLeaveManagerSuccess,
  updateTakeLeaveManagerFailure,
  deleteTakeLeaveManagerSuccess,
  deleteTakeLeaveManagerFailure,
  getAllVacationModeSuccess,
  getAllVacationModeFailure,
  // addOverTimeManagerSuccess,
  // addOverTimeManagerFailure,
  // updateOverTimeManagerSuccess,
  // updateOverTimeManagerFailure,
  // deleteOverTimeManagerSuccess,
  // deleteOverTimeManagerFailure,
  addPlanOverTimeSuccess,
  addPlanOverTimeFailure,
} from './actions';
import {
  CREATE_WAGES,
  UPDATE_WAGES,
  DELETE_WAGES,
  GET_ALL_TIMEKEEPING_EQUIPMENT,
  GET_TIMEKEEPING_TO_EQUIPMENT,
  IMPORT_TIMEKEEPING,
  ADD_TAKE_LEAVE_MANAGER,
  UPDATE_TAKE_LEAVE_MANAGER,
  DELETE_TAKE_LEAVE_MANAGER,
  GET_ALL_VACATION_MODE,
  ADD_OVER_TIME_MANAGER,
  UPDATE_OVER_TIME_MANAGER,
  DELETE_OVER_TIME_MANAGER,
  ADD_PLAN_OT,
} from './constants';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { serialize, convertDatetime2Date } from 'utils/common';

export function* createWages(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_TIMEKEEPING_TABLE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response && response.status === 1) {
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
    const response = yield call(request, `${API_TIMEKEEPING_TABLE}/${wagesId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response && response.status === 1) {
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
    const response = yield call(request, `${API_TIMEKEEPING_TABLE}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response && response.status === 1) {
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

export function* getAllTimekeepingEquipmentSaga() {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_TIMEKEEPING_EQUIPMENT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(getAllTimekeepingEquipmentSuccess(res.data));
    } else {
      yield put(getAllTimekeepingEquipmentFailure(res));
    }
  } catch (error) {
    yield put(getAllTimekeepingEquipmentFailure(error));
  }
}

export function* getTimekeepingToEquipmentSaga(action) {
  const token = localStorage.getItem('token');
  const filter = serialize({
    filter: {
      equipmentId: action._id,
    },
  });
  try {
    const res = yield call(request, `${API_TIMEKEEPING_ADDEQUIPMENT}?${filter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    if (res && res.status === 1) {
      yield put(getTimekeepingToEquipmentSuccess(res.data));
    } else {
      yield put(getTimekeepingToEquipmentFailure(res));
    }
  } catch (error) {
    yield put(getTimekeepingToEquipmentFailure(error));
  }
}

// import data saga
export function* importTimekeepingSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    // console.log('1', data)
    const res = yield call(request, `${API_IMPORT_TIMEKEEPING}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res && res.status === 1) {
      yield put(importTimeKeepingSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Import dữ liệu thành công', status: true }));
    } else {
      yield put(importTimeKeepingFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: 'Import dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(importTimeKeepingFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Import dữ liệu thất bại', status: true }));
  }
}

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
    const newData = { ...data, date: convertDatetime2Date(data.date) }
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

// che do nghi
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

// export function* addOverTimeManagerSaga(action) {
//   const token = localStorage.getItem('token');
//   try {
//     const { data } = action;
//     const res = yield call(request, `${API_OVER_TIME}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//     if (res && res.status === 1) {
//       yield put(addOverTimeManagerSuccess(res.data));
//       yield put(changeSnackbar({ variant: 'success', message: 'Thêm mới dữ liệu thành công', status: true }));
//     } else {
//       yield put(addOverTimeManagerFailure(res));
//       yield put(changeSnackbar({ variant: 'error', message: res.message || 'Thêm mới dữ liệu thất bại', status: true }));
//     }
//   } catch (error) {
//     yield put(addOverTimeManagerFailure(error));
//     yield put(changeSnackbar({ variant: 'error', message: 'Thêm mới dữ liệu thất bại', status: true }));
//   }
// }

// export function* updateOverTimeManagerSaga(action) {
//   const token = localStorage.getItem('token');
//   try {
//     const { data } = action;
//     const res = yield call(request, `${API_OVER_TIME}/${data._id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//     if (res && res.status === 1) {
//       yield put(updateOverTimeManagerSuccess(res.data));
//       yield put(changeSnackbar({ variant: 'success', message: 'Cập nhật dữ liệu thành công', status: true }));
//     } else {
//       yield put(updateOverTimeManagerFailure(res));
//       yield put(changeSnackbar({ variant: 'error', message: res.message || 'Cập nhật dữ liệu thất bại', status: true }));
//     }
//   } catch (error) {
//     yield put(updateOverTimeManagerFailure(error));
//     yield put(changeSnackbar({ variant: 'error', message: 'Cập nhật dữ liệu thất bại', status: true }));
//   }
// }
// export function* deleteOverTimeManagerSaga(action) {
//   const token = localStorage.getItem('token');
//   try {
//     const { ids } = action;
//     const res = yield call(request, `${API_OVER_TIME}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       method: 'DELETE',
//       body: JSON.stringify(action.data),
//     });
//     if (res && res.status === 1) {
//       yield put(deleteOverTimeManagerSuccess(res.data));
//       yield put(changeSnackbar({ variant: 'success', message: 'Xóa dữ liệu thành công', status: true }));
//     } else {
//       yield put(deleteOverTimeManagerFailure(res));
//       yield put(changeSnackbar({ variant: 'error', message: res.message || 'Xóa dữ liệu thất bại', status: true }));
//     }
//   } catch (error) {
//     yield put(deleteOverTimeManagerFailure(error));
//     yield put(changeSnackbar({ variant: 'error', message: 'Xóa dữ liệu thất bại', status: true }));
//   }
// }

export function* addPlanOverTimeSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_OVER_TIME}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/josn'
      },
      body: JSON.stringify(action.data)
    })

    if (res && res.status === 1) {
      yield put(addPlanOverTimeSuccess(res));
    } else {
      yield put(addPlanOverTimeFailure(res));
    }

  } catch (error) {
    yield put(addPlanOverTimeFailure(error))
  }
}

export default function* wageManagementSaga() {
  yield takeLatest(CREATE_WAGES, createWages);
  yield takeLatest(UPDATE_WAGES, updateWages);
  yield takeLatest(DELETE_WAGES, deleteWages);

  yield takeLatest(GET_ALL_TIMEKEEPING_EQUIPMENT, getAllTimekeepingEquipmentSaga);
  yield takeLatest(GET_TIMEKEEPING_TO_EQUIPMENT, getTimekeepingToEquipmentSaga);

  // // import data
  yield takeLatest(IMPORT_TIMEKEEPING, importTimekeepingSaga);

  // // ngay nghi phep
  // yield takeLatest(ADD_TAKE_LEAVE_MANAGER, addTakeLeaveManagerSaga);
  // yield takeLatest(UPDATE_TAKE_LEAVE_MANAGER, updateTakeLeaveManagerSaga);
  // yield takeLatest(DELETE_TAKE_LEAVE_MANAGER, deleteTakeLeaveManagerSaga);

  // // che do nghi
  yield takeLatest(GET_ALL_VACATION_MODE, getAllVacationModeSaga);

  // // OT
  // yield takeLatest(ADD_OVER_TIME_MANAGER, addOverTimeManagerSaga);
  // yield takeLatest(UPDATE_OVER_TIME_MANAGER, updateOverTimeManagerSaga);
  // yield takeLatest(DELETE_OVER_TIME_MANAGER, deleteOverTimeManagerSaga);

  // // ke hoach OT
  // yield takeLatest(ADD_PLAN_OT, addPlanOverTimeSaga);
}
