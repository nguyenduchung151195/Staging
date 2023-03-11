import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import lodash from 'lodash';
// import dot from 'dot-object';
import request from '../../utils/request';
import { API_DOCS, API_PLUGINS, APP_URL } from '../../config/urlConfig';
import {
  fetchAllDocsAction,
  fetchAllDocsFailAction,
  fetchAllDocsSuccessAction,
  getPluginsDocsFailAction,
  getPluginsSuccessAction,
  addDocSuccessAction,
  addDocFailAction,
  updateDocsFailAction,
  updateDocsSuccessAction,
  deleteDocsSuccessAction,
  deleteDocsFailAction,
  fetchAllRelationDocsFailAction,
} from './actions';
import { makeSelectBody } from './selectors';
import { serialize } from '../../utils/common';
import { GET_ALL_DOCS, ADD_DOC, DELETE_DOCS, UPDATE_DOC, GET_ALL_PLUGINS } from './constants';
// Individual exports for testing

export function* fetchGetAllDocs(action) {
  try {
    const data = yield call(
      request,
      `${API_DOCS}/${action.param.collectionCode ? action.param.collectionCode : action.param}?${serialize(
        action.param.query || { skip: 0, limit: 5 },
      )}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );

    if (data) {
      const viewConfigLocalStorage = JSON.parse(localStorage.getItem('viewConfig'));
      const currentViewConfig = viewConfigLocalStorage.find(d => String(d.code) === String(action.param.collectionCode));
      const { columns } = currentViewConfig.listDisplay.type.fields.type;
      const listRelationRef = [];
      // let ref = '';
      columns.forEach(element => {
        if (element.type.includes('Relation')) {
          let ref = '';
          ref = element.type.replace('Relation|', '');
          ref = ref.replace(/'/g, '"');
          const objectRef = JSON.parse(ref);
          // const indexOfRef = listRelationRef.findIndex(d => d.ref === objectRef.ref);
          // if (indexOfRef === -1) {
          let listId = data.data.map(item => item[element.name]);
          listId = listId.filter(e => e !== undefined);
          listId = lodash.uniq(listId);
          listRelationRef.push({ firstColumnName: element.name, ref: objectRef.ref, arrSelect: [objectRef.select], listId });
          // } else {
          //   listRelationRef[indexOfRef].arrSelect.push(objectRef.select);
          // }
        }
      });
      try {
        const refData = yield all(
          listRelationRef.map(item => {
            const param = {
              model: item.ref,
              ids: item.listId,
            };
            const convertedParam = serialize(param);
            return call(request, `${APP_URL}/api/common?${convertedParam}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
          }),
        );
        const newRefData = [];
        refData.forEach(item => {
          item.data.forEach(ele => {
            newRefData.push(ele);
          });
        });
        const newData = {
          ...data,
          data: data.data.map(item => ({
            ...item,
            _refData: newRefData,
          })),
        };
        yield put(fetchAllDocsSuccessAction(newData));
      } catch (errRelation) {
        yield put(fetchAllRelationDocsFailAction('Lấy dữ liệu relation thất bại'));
      }
    }
  } catch (err) {
    yield put(fetchAllDocsFailAction(err));
  }
}
export function* getPlugins(action) {
  try {
    const data = yield call(request, `${API_PLUGINS}/${action.collectionCode}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(getPluginsSuccessAction(data));
    }
  } catch (err) {
    yield put(getPluginsDocsFailAction(err));
  }
}
export function* fetchAddDoc(action) {
  const token = localStorage.getItem('token');
  try {
    const addDoc = yield call(request, `${API_DOCS}/${action.param.collectionCode}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.doc),
    });
    if (addDoc) {
      const oldDocs = yield select(makeSelectBody('docs'));
      oldDocs.data.push(addDoc);
      yield put(addDocSuccessAction(oldDocs, 'Thêm thành công'));
      yield put(fetchAllDocsAction(action.param));
    }
  } catch (err) {
    yield put(addDocFailAction(err, 'Thêm thất bại'));
  }
}
export function* fetchDeleteDocs(action) {
  const token = localStorage.getItem('token');
  const stringIds = action.deleteIds.join(',');
  try {
    const deletedDocs = yield call(request, `${API_DOCS}/${action.collectionCode}/deletemany/${stringIds}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (deletedDocs) {
      const oldDocs = yield select(makeSelectBody('docs'));

      yield put(deleteDocsSuccessAction(oldDocs, 'Xóa thành công'));
      yield put(fetchAllDocsAction({ collectionCode: action.collectionCode, query: { skip: 0, limit: 5 } }));
    }
  } catch (err) {
    yield put(deleteDocsFailAction(err, 'Xóa thất bại'));
  }
}
export function* fetchUpdateDocs(action) {
  const token = localStorage.getItem('token');
  // console.log(action.body);
  try {
    const updateDocs = yield call(request, `${API_DOCS}/${action.param.collectionCode}/${action.doc._id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.doc),
    });
    if (updateDocs) {
      // let oldDocs = yield select(makeSelectBody('docs'));
      // oldDocs = oldDocs.data;

      // oldDocs[oldDocs.findIndex(d => d._id === updateDocs._id)] = updateDocs;
      yield put(fetchAllDocsAction(action.param));
      yield put(updateDocsSuccessAction({}, 'Cập nhật thành công'));
    }
  } catch (err) {
    yield put(updateDocsFailAction(err, 'Cập nhật thất bại'));
  }
}
export default function* cloneModuleComponentSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_DOCS, fetchGetAllDocs);
  yield takeLatest(GET_ALL_PLUGINS, getPlugins);
  yield takeLatest(ADD_DOC, fetchAddDoc);
  yield takeLatest(DELETE_DOCS, fetchDeleteDocs);
  yield takeLatest(UPDATE_DOC, fetchUpdateDocs);
}
