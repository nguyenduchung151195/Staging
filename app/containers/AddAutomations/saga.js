import { call, put, takeLatest } from 'redux-saga/effects';

import { push } from 'react-router-redux';
import request from 'utils/request';
import { API_TEMPLATE, API_NEWS_FEED } from 'config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { getTemplateSuccess, putTemplateFailed, postTemplateFailed, getAllTemplateSuccess, getAllTemplateFailure } from './actions';
import { GET_ALL_TEMPLATE } from './constants';
import { clientId } from '../../variable';

export function* getAllTemplateSaga() {
  try {
    const res = yield call(request, `${API_TEMPLATE}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
    });
    if (res) {
      yield put(getAllTemplateSuccess(res));
    } else {
      yield put(getAllTemplateFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* getTemplateSaga(action) {
  try {
    let data = {};
    if (action.id !== 'add') {
      data = yield call(request, `${API_NEWS_FEED}/${action.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      yield put(getTemplateSuccess(data, action.id));
    }
    action.getTem();
  } catch (error) {
    console.log('error', error);
    yield put(changeSnackbar({ variant: 'error', status: true, message: 'Lấy dữ liệu thất bại' }));
  }
}

function* postTemplateSaga(action) {
  try {
    const data = yield call(request, API_NEWS_FEED, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ message: `Thêm mới thành công ${data.data.title}`, status: true, variant: 'success' }));
    // yield put(push(`/crm/suppliers/${supplierInfo.data._id}`));
    yield put(push('/setting/template'));
  } catch (error) {
    yield put(changeSnackbar({ message: 'Thêm mới thất bại', status: true, variant: 'error' }));
    yield put(postTemplateFailed());
  }
}

function* putTemplateSaga(action) {
  try {
    const data = yield call(request, `${API_NEWS_FEED}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ message: `Cập nhật thành công ${data.data.title}`, status: true, variant: 'success' }));
    yield put(push('/setting/template'));
  } catch (error) {
    yield put(putTemplateFailed());
  }
}

export default function* addTemplatePageSaga() {
  yield takeLatest('GET_TEMPLATE', getTemplateSaga);
  yield takeLatest('POST_TEMPLATE', postTemplateSaga);
  yield takeLatest('PUT_TEMPLATE', putTemplateSaga);
  yield takeLatest(GET_ALL_TEMPLATE, getAllTemplateSaga);
}
