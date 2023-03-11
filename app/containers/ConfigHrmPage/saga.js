// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import qs from 'qs';
import { changeSnackbar } from '../Dashboard/actions';
import { API_SOURCE_HRMCONFIG, API_STATUS_HRMCONFIG } from '../../config/urlConfig';
// import lodash from 'lodash';
import request from '../../utils/request';
import { makeSelectBody } from './selectors';
import {
  addStatusSuccessAction,
  fetchAllCategorySuccessAction,
  fetchAllStatusAction,
  deleteStatusSuccessAction,
  addCategorySuccessAction,
  deleteCategorySuccessAction,
  updateCategorySuccessAction,
  fetchAllStatusSuccessAction,
  updateStatusSuccessAction,
  updateStatusIndexSuccessAction,
  resetAllCategorySuccess,
  resetAllCategoryFailure,
  resetAllStatusSuccess,
  resetAllStatusFailure,
  editHRMStatusSuccessAction,
  deleteHRMStatusSuccessAction,
  fetchAllCategoryAction,
} from './actions';
import {
  GET_ALL_CATEGORY,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
  GET_ALL_STATUS,
  ADD_STATUS,
  ADD_HRM_STATUS,
  DELETE_STATUS,
  UPDATE_STATUS,
  UPDATE_STATUS_INDEX,
  RESET_ALL_CATEGORY,
  RESET_ALL_STATUS,
  EDIT_HRM_STATUS,
  DELETE_HRM_STATUS,
  EDIT_HRM_CATEGORY,
} from './constants';

export function* fetchAddHRMStatus(action) {
  const token = localStorage.getItem('token');

  try {
    const addStatus = yield call(request, `${API_STATUS_HRMCONFIG}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({ title: action.title }),
    });
    if (addStatus) {
      if (addStatus.status === 0) {
        if (addStatus.message === 'HrmStatus validation failed: title: Path `title` is required.') {
          yield put(changeSnackbar({ status: true, message: 'Không được để trống tên cấu hình', variant: 'error' }));
        } else {
          yield put(changeSnackbar({ status: true, message: addStatus.message, variant: 'error' }));
        }
      } else {
        const oldStatus = yield select(makeSelectBody('listSt'));
        // oldStatus[oldStatus.findIndex(d => d._id === action.id)].data = addStatus.data;
        yield put(addStatusSuccessAction(oldStatus));
        yield put(changeSnackbar({ status: true, message: 'Thêm trạng thái cấu hình thành công', variant: 'success' }));
        yield put(fetchAllStatusAction());
      }
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Thêm trạng cấu hình thất bại', variant: 'error' }));
  }
}

export function* fetchEditHRMStatus(action) {
  const token = localStorage.getItem('token');
  try {
    const editStatus = yield call(request, `${API_STATUS_HRMCONFIG}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({ title: action.title }),
    });
    if (editStatus) {
      const oldStatus = yield select(makeSelectBody('listSt'));
      // oldStatus[oldStatus.findIndex(d => d._id === action.id)].data = addStatus.data;
      yield put(editHRMStatusSuccessAction(oldStatus));
      yield put(changeSnackbar({ status: true, message: 'Sửa trạng thái cấu hình thành công', variant: 'success' }));
      yield put(fetchAllStatusAction());
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Sửa trạng thái cấu hình thất bại', variant: 'error' }));
  }
}

export function* fetchDeleteHRMStatus(action) {
  const token = localStorage.getItem('token');
  // const code = convertToSlug(action.body);
  try {
    const delteStatus = yield call(request, `${API_STATUS_HRMCONFIG}/${action.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // body: qs.stringify({ title: action.body }),
    });
    if (delteStatus) {
      const oldStatus = yield select(makeSelectBody('listSt'));
      // oldStatus[oldStatus.findIndex(d => d._id === action.id)].data = addStatus.data;
      yield put(deleteHRMStatusSuccessAction(oldStatus));
      yield put(changeSnackbar({ status: true, message: 'Xóa trạng thái cấu hình thành công', variant: 'success' }));
      yield put(fetchAllStatusAction());
    }
  } catch (err) {
    console.log('check>>>', err)
    yield put(changeSnackbar({ status: true, message: 'Xóa trạng thái cấu hình thành công', variant: 'error' }));
  }
}
export function* resetAllStatus(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_STATUS_HRMCONFIG}/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (data.status === 1) {
      // yield put(resetAllStatusSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Hoàn tác dữ liệu thành công', variant: 'success' }));
      yield put(fetchAllStatusAction());
    }
  } catch (err) {
    yield put(resetAllStatusFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Hoàn tác dữ liệu thất bại', variant: 'error' }));
  }
}

export function* fetchGetAllStatus() {
  try {
    const data = yield call(request, API_STATUS_HRMCONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    localStorage.setItem('crmStatus', JSON.stringify(data));
    if (data) {
      yield put(fetchAllStatusSuccessAction(data));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy trạng thái thất bại', variant: 'error' }));
  }
}
export function* fetchAddStatus(action) {
  const token = localStorage.getItem('token');
  try {
    const addStatus = yield call(request, `${API_STATUS_HRMCONFIG}/createitem/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(action.title),
    });
    if (addStatus) {
      const oldStatus = yield select(makeSelectBody('listSt'));
      oldStatus[oldStatus.findIndex(d => d._id === action.id)].data = addStatus.data;
      localStorage.setItem('crmStatus', JSON.stringify(oldStatus));
      yield put(addStatusSuccessAction(oldStatus));
      yield put(changeSnackbar({ status: true, message: 'Thêm trạng thái thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Thêm trạng thái thất bại', variant: 'error' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Thêm trạng thái thất bại', variant: 'error' }));
  }
}
export function* fetchDeleteStatus(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedStatus = yield call(request, `${API_STATUS_HRMCONFIG}/deleteitem/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: action.statusId }),
    });

    if (deletedStatus) {
      const oldStatus = yield select(makeSelectBody('listSt'));
      oldStatus[oldStatus.findIndex(d => d._id === action.id)] = deletedStatus;
      localStorage.setItem('crmStatus', JSON.stringify(oldStatus));
      yield put(deleteStatusSuccessAction(oldStatus));
      yield put(changeSnackbar({ status: true, message: 'Xóa trạng thái thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Xóa trạng thái thất bại', variant: 'error' }));
  }
}
export function* fetchUpdateStatus(action) {
  const token = localStorage.getItem('token');
  const newData = action.body;
  newData.id = newData._id;
  delete newData._id;
  try {
    const updateStatus = yield call(request, `${API_STATUS_HRMCONFIG}/updateitem/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(newData),
    });
    if (updateStatus) {
      const oldStatus = yield select(makeSelectBody('listSt'));

      oldStatus[oldStatus.findIndex(d => d._id === updateStatus._id)] = updateStatus;
      localStorage.setItem('crmStatus', JSON.stringify(oldStatus));
      yield put(updateStatusSuccessAction(oldStatus));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thất bại', variant: 'error' }));
  }
}
export function* fetchUpdateStatusIndex(action) {
  const token = localStorage.getItem('token');
  try {
    const updateStatus = yield call(request, `${API_STATUS_HRMCONFIG}/updateIndex/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: action.body }),
    });
    if (updateStatus) {
      const oldStatus = yield select(makeSelectBody('listSt'));

      oldStatus[oldStatus.findIndex(d => d._id === updateStatus._id)] = updateStatus;
      localStorage.setItem('crmStatus', JSON.stringify(oldStatus));
      yield put(updateStatusIndexSuccessAction(oldStatus));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật trạng thái thất bại', variant: 'error' }));
  }
}

// Category
export function* fetchGetAllCategory() {
  try {
    const data = yield call(request, API_SOURCE_HRMCONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (data) {
      yield put(fetchAllCategorySuccessAction(data));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy cấu hình danh mục thất bại', variant: 'error' }));
  }
}
export function* fetchaddCategory(action) {
  const token = localStorage.getItem('token');

  try {
    const addCategory = yield call(request, API_SOURCE_HRMCONFIG, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.title, code: action.code }),
    });
    if (addCategory) {
      const data = yield select(makeSelectBody('sources'));

      data.push(addCategory);
      localStorage.setItem('crmSource', JSON.stringify(data));
      yield put(addCategorySuccessAction(data));
      yield put(changeSnackbar({ status: true, message: 'Thêm cấu hình danh mục thành công', variant: 'success' }));
      yield put(fetchAllCategoryAction());
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Thêm cấu hình danh mục thất bại', variant: 'error' }));
  }
}
export function* fetchUpdateCategory(action) {
  const token = localStorage.getItem('token');
  try {
    const updateCategory = yield call(request, `${API_SOURCE_HRMCONFIG}/${action.param._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: action.param.title, data: action.title }),
    });
    if (updateCategory) {
      const data = yield select(makeSelectBody('sources'));

      data[data.findIndex(d => d._id === updateCategory._id)] = updateCategory;
      localStorage.setItem('crmSource', JSON.stringify(data));
      yield put(updateCategorySuccessAction(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhập danh mục thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhập danh mục thất bại', variant: 'error' }));
  }
}
export function* fetchDeleteCategory(action) {
  const token = localStorage.getItem('token');

  try {
    // console.log('action', action.body);
    const deleteSource = yield call(request, `${API_SOURCE_HRMCONFIG}/${action.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // body: qs.stringify({ title: action.body }),
    });

    if (deleteSource) {
      // const oldSources = yield select(makeSelectBody('sources'));

      // oldSources.push(deleteSource);
      // localStorage.setItem('crmSource', JSON.stringify(oldSources));
      // yield put(deleteCategorySuccessAction(oldSources));
      yield put(changeSnackbar({ status: true, message: 'Xóa kiểu danh mục thành công', variant: 'success' }));
      yield put(fetchAllCategoryAction());
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Xóa kiểu danh mục thất bại', variant: 'error' }));
  }
}

export function* fetchEditCategory(action) {
  const token = localStorage.getItem('token');

  try {
    // console.log('action', action.body);
    const editCategory = yield call(request, `${API_SOURCE_HRMCONFIG}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({ title: action.title }),
    });

    if (editCategory) {
      // const oldCategorys = yield select(makeSelectBody('sources'));
      // oldCategorys.push(editCategory);
      // // localStorage.setItem('crmCategory', JSON.stringify(oldCategorys));
      // yield put(updateCategorySuccessAction(oldCategorys));
      yield put(changeSnackbar({ status: true, message: 'Sửa kiểu danh mục thành công', variant: 'success' }));
      yield put(fetchAllCategoryAction());

    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Sửa kiểu danh mục thất bại', variant: 'error' }));
  }
}

export function* resetAllCategory(action) {
  const token = localStorage.getItem('token');

  try {
    const response = yield call(request, `${API_SOURCE_HRMCONFIG}/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 1) {
      // yield put(resetAllCategorySuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Hoàn tác dữ liệu thành công', variant: 'success' }));
      yield put(fetchAllCategoryAction());
    }
  } catch (err) {
    yield put(resetAllCategoryFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Hoàn tác dữ liệu thất bại', variant: 'error' }));
  }
}


// Individual exports for testing
export default function* configHrmPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_STATUS, fetchGetAllStatus);
  yield takeLatest(ADD_STATUS, fetchAddStatus);
  yield takeLatest(ADD_HRM_STATUS, fetchAddHRMStatus);
  yield takeLatest(DELETE_STATUS, fetchDeleteStatus);
  yield takeLatest(UPDATE_STATUS, fetchUpdateStatus);
  yield takeLatest(UPDATE_STATUS_INDEX, fetchUpdateStatusIndex);
  yield takeLatest(GET_ALL_CATEGORY, fetchGetAllCategory);
  yield takeLatest(ADD_CATEGORY, fetchaddCategory);
  yield takeLatest(DELETE_CATEGORY, fetchDeleteCategory);
  yield takeLatest(UPDATE_CATEGORY, fetchUpdateCategory);
  yield takeLatest(RESET_ALL_CATEGORY, resetAllCategory);
  yield takeLatest(RESET_ALL_STATUS, resetAllStatus);
  yield takeLatest(EDIT_HRM_STATUS, fetchEditHRMStatus);
  yield takeLatest(DELETE_HRM_STATUS, fetchDeleteHRMStatus);
  yield takeLatest(EDIT_HRM_CATEGORY, fetchEditCategory)
}
