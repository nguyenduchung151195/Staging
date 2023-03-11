import { put, select, takeLatest, call } from 'redux-saga/effects';
import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import { API_TASK_PROJECT, API_USERS } from '../../config/urlConfig';
import { getTaskRelatePageSuccess, postTaskSuccess } from './actions';
import { serialize } from '../../utils/common';
import { makeSelectProfile } from '../Dashboard/selectors';
import { GET_TASK_RELATE, POST_TASK } from './constants';
const token = `Bearer ${localStorage.getItem('token')}`;
export function* getTaskRelatePageSaga() {
  try {
    const taskFilter = serialize({
      filter: {
        taskType: 3,
        $or: [{ isProject: 'false' }],
      },
    });

    const tasks = yield call(request, `${API_TASK_PROJECT}?${taskFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const users = yield call(request, API_USERS, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const profile = yield select(makeSelectProfile());

    yield put(getTaskRelatePageSuccess(profile, tasks, users));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* postTaskSaga(action) {
  // console.log('ACTION', action.data);

  try {
    // cong viec
    const taskFilter = serialize({
      filter: {
        isProject: 'false',
        startDate: { $gte: action.data.startDate },
        endDate: { $lte: action.data.endDate },
        $or: [
          { createdBy: action.id },
          { inCharge: { $in: [action.id] } },
          { viewable: { $in: [action.id] } },
          { join: { $in: [action.id] } },
          { support: { $in: [action.id] } },
        ],
      },
    });

    // phu trach
    const inChargeFilter = serialize({
      filter: {
        isProject: 'false',
        inCharge: action.id,
        startDate: { $gte: action.data.startDate },
        endDate: { $lte: action.data.endDate },
      },
    });
    // theo doi
    const viewableFilter = serialize({
      filter: {
        isProject: 'false',
        viewable: action.id,
        startDate: { $gte: action.data.startDate },
        endDate: { $lte: action.data.endDate },
      },
    });
    // dong dung
    const stopFilter = serialize({
      filter: {
        isProject: 'false',
        taskStatus: 5,
        startDate: { $gte: action.data.startDate },
        endDate: { $lte: action.data.endDate },
        $or: [
          { createdBy: action.id },
          { inCharge: { $in: [action.id] } },
          { viewable: { $in: [action.id] } },
          { join: { $in: [action.id] } },
          { support: { $in: [action.id] } },
        ],
      },
    });

    // khong thuc hien
    const cancelFilter = serialize({
      filter: {
        isProject: 'false',
        taskStatus: 6,
        startDate: { $gte: action.data.startDate },
        endDate: { $lte: action.data.endDate },
        $or: [
          { createdBy: action.id },
          { inCharge: { $in: [action.id] } },
          { viewable: { $in: [action.id] } },
          { join: { $in: [action.id] } },
          { support: { $in: [action.id] } },
        ],
      },
    });

    // dang thuc hien
    const doingFilter = serialize({
      filter: {
        isProject: 'false',
        taskStatus: 2,
        startDate: { $gte: action.data.startDate },
        endDate: { $lte: action.data.endDate },
        $or: [
          { createdBy: action.id },
          { inCharge: { $in: [action.id] } },
          { viewable: { $in: [action.id] } },
          { join: { $in: [action.id] } },
          { support: { $in: [action.id] } },
        ],
      },
    });

    // cham tien do
    const progressFilter = serialize({
      filter: {
        isProject: 'false',
        taskStatus: { $not: { $eq: 2 } },
        startDate: { $gte: action.data.startDate },
        endDate: { $lte: action.data.endDate },
        $or: [
          { createdBy: action.id },
          { inCharge: { $in: [action.id] } },
          { viewable: { $in: [action.id] } },
          { join: { $in: [action.id] } },
          { support: { $in: [action.id] } },
        ],
      },
    });

    // da hoan thanh
    const completeFilter = serialize({
      filter: {
        isProject: 'false',
        taskStatus: 3,
        startDate: { $gte: action.data.startDate },
        endDate: { $lte: action.data.endDate },
        $or: [
          { createdBy: action.id },
          { inCharge: { $in: [action.id] } },
          { viewable: { $in: [action.id] } },
          { join: { $in: [action.id] } },
          { support: { $in: [action.id] } },
        ],
      },
    });

    // da hoan thanh nhung cham tien do
    const completeSlowFilter = serialize({
      filter: {
        isProject: 'false',
        taskStatus: 3,
        // startDate: { $gte: action.data.startDate },
        finishDate: { $gte: action.data.endDate },
        $or: [
          { createdBy: action.id },
          { inCharge: { $in: [action.id] } },
          { viewable: { $in: [action.id] } },
          { join: { $in: [action.id] } },
          { support: { $in: [action.id] } },
        ],
      },
    });

    const taskSelect = yield call(request, `${API_TASK_PROJECT}?${taskFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const inChargeSelect = yield call(request, `${API_TASK_PROJECT}?${inChargeFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const viewableSelect = yield call(request, `${API_TASK_PROJECT}?${viewableFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const stopSelect = yield call(request, `${API_TASK_PROJECT}?${stopFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const cancelSelect = yield call(request, `${API_TASK_PROJECT}?${cancelFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const doingSelect = yield call(request, `${API_TASK_PROJECT}?${doingFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const progressSelect = yield call(request, `${API_TASK_PROJECT}?${progressFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const completeSelect = yield call(request, `${API_TASK_PROJECT}?${completeFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const completeSlowSelect = yield call(request, `${API_TASK_PROJECT}?${completeSlowFilter}`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    // const profile = yield select(makeSelectProfile());

    yield put(
      postTaskSuccess(
        taskSelect,
        inChargeSelect,
        viewableSelect,
        stopSelect,
        cancelSelect,
        doingSelect,
        progressSelect,
        completeSelect,
        completeSlowSelect,
      ),
    );
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Bạn cần chọn thời gian và nhân viên', variant: 'warning' }));
  }
}

// Individual exports for testing
export default function* taskRelatePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_TASK_RELATE, getTaskRelatePageSaga);
  yield takeLatest(POST_TASK, postTaskSaga);
}
