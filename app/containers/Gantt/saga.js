import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_TASK_PROJECT, API_ORIGANIZATION } from '../../config/urlConfig';
import { mergeData, getDataSuccess } from './actions';
import { GET_GANTT, POST_PROGRESS, GET_DATA } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
const token = localStorage.getItem('token');

function* getGanttSaga(action) {
  try {
    const data = yield call(request, API_TASK_PROJECT, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newData = {
      data: data.items.map(item => {
        const d = new Date(item.startDate);
        return {
          ...item,
          parent: item.parentId,
          open: true,
          text: item.name,
          id: item._id,
          start_date: d.toISOString().substring(0, 10),
          duration: 6,
          progress: 9,
        };
      }),
      links: [],
    };

    yield put(mergeData({ tasks: newData }));
    action.ganttParse();
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* postProgressSaga(action) {
  try {
    const data = action.data;
    const endDate = new Date(data.start_date);
    endDate.setDate(endDate.getDate() + data.duration);
    data.endDate = endDate.toISOString().substring(0, 10);
    data.startDate = data.start_date.toISOString().substring(0, 10);

    yield call(request, `${API_TASK_PROJECT}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    action.loadGantt();
    yield put(changeSnackbar({ variant: 'success', status: true, message: 'Cập nhật thành công' }));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Cập nhật không thành công' }));
  }
}

function* getDataSaga() {
  try {
    const data = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getDataSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

// Individual exports for testing
export default function* ganttSaga() {
  yield takeLatest(GET_GANTT, getGanttSaga);
  yield takeLatest(POST_PROGRESS, postProgressSaga);
  yield takeLatest(GET_DATA, getDataSaga);
}
