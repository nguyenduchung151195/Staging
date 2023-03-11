import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';
import { API_TEMPLATE } from 'config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';

import { getTemplateSuccess, putTemplateSuccess, postTemplateSuccess } from './actions';
function* getTemplateSaga(action) {
  try {
    const dataTemplateType = yield call(request, `${API_TEMPLATE}/category`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    let data = { templateTypes: dataTemplateType };
    if (action.id !== 'add') {
      const dataTemplate = yield call(request, `${API_TEMPLATE}/${action.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const newDataTemplate = { ...dataTemplate, categoryDynamicForm: dataTemplate.categoryDynamicForm._id };
      data = { ...data, ...newDataTemplate };
    }
    yield put(getTemplateSuccess(data, action.id));
    action.getTem();
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* postTemplateSaga(action) {
  try {
    const data = yield call(request, API_TEMPLATE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    const callback = action.data.callback;
    yield put(postTemplateSuccess(data));
    yield put(changeSnackbar({ message: `Thêm mới thành công `, status: true, variant: 'success' }));
    if (callback) {
      callback();
    } else {
      yield put(push('/setting/email'));
    }
  } catch (error) {
    yield put(changeSnackbar({ message: 'Thêm mới thất bại', status: true, variant: 'error' }));
  }
}
function* putTemplateSaga(action) {
  try {
    const data = yield call(request, `${API_TEMPLATE}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    const callback = action.data.callback;
    yield put(putTemplateSuccess(data));
    yield put(changeSnackbar({ message: `Cập nhật thành công `, status: true, variant: 'success' }));
    if (callback) {
      callback();
    } else {
      yield put(push('/setting/email'));
    }
  } catch (error) {
    yield put(changeSnackbar({ message: 'Cập nhật thất bại', status: true, variant: 'error' }));
  }
}
// Individual exports for testing
export default function* addEmailSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest('GET_TEMPLATE', getTemplateSaga);
  yield takeLatest('POST_TEMPLATE', postTemplateSaga);
  yield takeLatest('PUT_TEMPLATE', putTemplateSaga);
}
