import { takeLatest, call, put } from 'redux-saga/effects';
import { GET_TASKS } from './constants';
import request from '../../utils/request';
import { API_TASK_PROJECT } from '../../config/urlConfig';
import { mergeData } from './actions';
import { changeSnackbar } from '../Dashboard/actions';

// Individual exports for testing

const token = `Bearer ${localStorage.getItem('token')}`;

function* getTasksSaga() {
  try {
    const data = yield call(request, API_TASK_PROJECT, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    const newData = data.data.map(item => ({ ...item, title: item.name, startDate: new Date(item.startDate), endDate: new Date(item.endDate) }));

    yield put(mergeData({ data: newData }));
    // eslint-disable-next-line no-empty
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export default function* taskSchedulerSaga() {
  yield takeLatest(GET_TASKS, getTasksSaga);
}
