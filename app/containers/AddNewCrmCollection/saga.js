import { takeLatest, call, put, all } from 'redux-saga/effects';

import lodash from 'lodash';
import { DYNAMIC_COLLECTION, API_VIEWCONFIG } from '../../config/urlConfig';
import request from '../../utils/request';
import {
  getAllCollection,
  getAllCRMCollectionSuccess,
  getAllCRMCollectionFalse,
  postAddNewCollectionSuccess,
  postAddNewCollectionFalse,
  putUpdateCollectionSuccess,
  putUpdateCollectionFalse,
  deleteCollectionFalse,
  deleteCollectionSuccess,
} from './actions';
import { GET_ALL_COLLECTION, ADD_NEW_COLLECTION, EDIT_COLLECTION, DELETE_COLLECTION } from './constants';

export function* fetchAllCRMCollection() {
  try {
    const data = yield call(request, DYNAMIC_COLLECTION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    yield put(getAllCRMCollectionSuccess(data));
    const viewConfig = yield call(request, API_VIEWCONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const formatedViewConfig = [];
    viewConfig.forEach(element => {
      const { columns } = element.listDisplay.type.fields.type;
      const statusFieldIndex = columns.findIndex(d => d.name === 'status');
      const othersFieldIndex = columns.findIndex(d => d.name === 'others');
      const newColumns = lodash.differenceBy(columns, [columns[statusFieldIndex], columns[othersFieldIndex], 'name']);

      element.listDisplay.type.fields.type.columns = newColumns;
      formatedViewConfig.push(element);
    });

    localStorage.setItem('viewConfig', JSON.stringify(formatedViewConfig));
  } catch (err) {
    yield put(getAllCRMCollectionFalse(err));
  }
}
export function* fetchAddCRMCollection(action) {
  try {
    const data = yield call(request, DYNAMIC_COLLECTION, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(action.body),
    });
    if (data) {
      yield put(postAddNewCollectionSuccess(data, 'Thêm module thành công'));
      yield put(getAllCollection());
    }
  } catch (err) {
    yield put(postAddNewCollectionFalse(err, 'Thêm module thất bại'));
  }
}
export function* fetchUpdateCRMCollection(action) {
  if (action.body.name !== action.oldData.name && action.body.collectionSchema !== action.oldData.collectionSchema) {
    try {
      const [updateName, updateSchema] = yield all([
        call(request, `${DYNAMIC_COLLECTION}/${action.body.code}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ name: action.body.name, plugins: action.body.plugins }),
        }),
        call(request, `${DYNAMIC_COLLECTION}/${action.body.code}/schema`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(action.body.collectionSchema),
        }),
      ]);
      if (updateName && updateSchema) {
        yield sleep(10);
        yield put(putUpdateCollectionSuccess('Cập nhật module thành công'));
        yield put(getAllCollection());
      }
    } catch (err) {
      yield put(putUpdateCollectionFalse(err, 'Cập nhật module thất bại'));
    }
  }
  if (action.body.name !== action.oldData.name && action.body.collectionSchema === action.oldData.collectionSchema) {
    try {
      const [updateName] = yield all([
        call(request, `${DYNAMIC_COLLECTION}/${action.body.code}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ name: action.body.name, plugins: action.body.plugins }),
        }),
      ]);
      if (updateName) {
        yield put(putUpdateCollectionSuccess('Cập nhật module thành công'));
        yield put(getAllCollection());
      }
    } catch (err) {
      yield put(putUpdateCollectionFalse(err, 'Cập nhật module thất bại'));
    }
  }
  if (action.body.name === action.oldData.name && action.body.collectionSchema !== action.oldData.collectionSchema) {
    try {
      const [updateSchema] = yield all([
        call(request, `${DYNAMIC_COLLECTION}/${action.body.code}/schema`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(action.body.collectionSchema),
        }),
      ]);

      if (updateSchema) {
        yield sleep(10);
        yield put(getAllCollection());
        yield put(putUpdateCollectionSuccess('Cập nhật module thành công'));
      }
    } catch (err) {
      yield put(putUpdateCollectionFalse(err, 'Cập nhật module thất bại'));
    }
  }
  if (action.body.name === action.oldData.name && action.body.collectionSchema === action.oldData.collectionSchema) {
    // yield sleep(10);
    yield put(getAllCollection());
    yield put(putUpdateCollectionSuccess('Cập nhật module thành công'));
  }
}
export function* deleteCRMCollection(action) {
  try {
    const data = yield call(request, `${DYNAMIC_COLLECTION}/${action.body}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      // body: JSON.stringify(action.body),
    });
    if (data) {
      yield put(deleteCollectionSuccess(data, 'Xóa module thành công'));
      yield put(getAllCollection());
    }
  } catch (err) {
    yield put(deleteCollectionFalse(err, ' Xóa module thất bại'));
  }
}
function sleep(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

// Individual exports for testing
export default function* addNewCrmCollectionSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_COLLECTION, fetchAllCRMCollection);
  yield takeLatest(ADD_NEW_COLLECTION, fetchAddCRMCollection);
  yield takeLatest(EDIT_COLLECTION, fetchUpdateCRMCollection);
  yield takeLatest(DELETE_COLLECTION, deleteCRMCollection);
}
