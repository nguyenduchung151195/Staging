// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../../../../utils/request';
import { API_HUMAN_RESOURCE, API_PERSONNEL, API_RECRUITMENT } from '../../../../../../config/urlConfig';
import {
  createRecruitmentManagementSuccess,
  createRecruitmentManagementFailure,
  updateRecruitmentManagementSuccess,
  updateRecruitmentManagementFailure,
  deleteRecruitmentManagementSuccess,
  deleteRecruitmentManagementFailure,
  getCountHrmByRoleSuccess,
  getCountHrmByRoleFailure,
  getHumanResourceSuccess,
  getHumanResourceFailure,
} from './actions';
import {
  CREATE_RECRUITMENTMANAGEMENT,
  UPDATE_RECRUITMENTMANAGEMENT,
  DELETE_RECRUITMENTMANAGEMENT,
  GET_HUMAN_RESOURCE,
  GET_COUNT_HRM_BY_ROLE,
} from './constants';
import { changeSnackbar } from '../../../../../Dashboard/actions';
import { serialize } from '../../../../../../helper';

export function* createRecruitmentManagement(action) {
  try {
    const { data } = action;
    const newData = { ...data, proponent: data.proponent && data.proponent._id };
    const response = yield call(request, API_RECRUITMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createRecruitmentManagementSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createRecruitmentManagementFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createRecruitmentManagementFailure(err));
  }
}

export function* updateRecruitmentManagement(action) {
  try {
    const { hrmEmployeeId: RecruitmentManagementId, data } = action;
    const response = yield call(request, `${API_RECRUITMENT}/${RecruitmentManagementId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateRecruitmentManagementSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateRecruitmentManagementFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateRecruitmentManagementFailure(err));
  }
}

export function* deleteRecruitmentManagement(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_RECRUITMENT}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteRecruitmentManagementSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteRecruitmentManagementFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteRecruitmentManagementFailure(err));
  }
}

export function* getCountHrmByRoleSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { roleCode, organizationUnit } = action;
    const filter = serialize({
      roleCode,
      organizationUnit,
    });
    const response = yield call(request, `${API_PERSONNEL}/count-hrm-by-role?${filter}`, {
      method: 'GET',
      headers: {
        Authorazation: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response && response.status) {
      console.log(response.data,'response.data')
      yield put(getCountHrmByRoleSuccess(response.data));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Lấy dữ đếm nhân sự thất bại', variant: 'error' }));
      yield put(getCountHrmByRoleFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Lấy dữ đếm nhân sự thất bại', variant: 'error' }));
    yield put(getCountHrmByRoleFailure(err));
  }
}

export function* getHumanResourceSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HUMAN_RESOURCE}`, {
      method: 'GET',
      headers: {
        Authorazation: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (res && res.status) {
      const { humanResourceSource, data } = res;
      yield put(getHumanResourceSuccess(humanResourceSource, data));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Lấy dữ thất bại định biên', variant: 'error' }));
      yield put(getHumanResourceFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Lấy dữ thất bại định biên', variant: 'error' }));
    yield put(getHumanResourceFailure(err));
  }
}

export default function* recruitmentManagementPageSaga() {
  yield takeLatest(CREATE_RECRUITMENTMANAGEMENT, createRecruitmentManagement);
  yield takeLatest(UPDATE_RECRUITMENTMANAGEMENT, updateRecruitmentManagement);
  yield takeLatest(DELETE_RECRUITMENTMANAGEMENT, deleteRecruitmentManagement);
  yield takeLatest(GET_COUNT_HRM_BY_ROLE, getCountHrmByRoleSaga);
  yield takeLatest(GET_HUMAN_RESOURCE, getHumanResourceSaga);
}
