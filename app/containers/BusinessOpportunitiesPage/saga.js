import { call, put, takeLatest, select } from 'redux-saga/effects';
// import lodash from 'lodash';
import request from '../../utils/request';
import { API_BOS, API_UPDATE_VIEWCONFIG, API_LOG } from '../../config/urlConfig';
import {
  fetchAllBosFailAction,
  fetchAllBosSuccessAction,
  addBoSuccessAction,
  addBoFailAction,
  // updateBoFailAction,
  updateBoSuccessAction,
  deleteBosSuccessAction,
  deleteBosFailAction,
  fetchAllBosAction,
  updateBoFailAction,
  // fetchAllBosAction,
} from './actions';

import { makeSelectBody, makeSelectDashboardPage } from './selectors';
// import { makeSelectBodyKanban } from '../KanbanPlugin/selectors';
import { GET_ALL_BOS, ADD_BO, DELETE_BOS, UPDATE_BO, EDIT_VIEWCONFIG_ACTION } from './constants';
import { getLogString } from '../../utils/common';
import { changeSnackbar } from '../Dashboard/actions';
import { serialize } from '../../helper';

// Individual exports for testing

export function* fetchGetAllBos(action) {
  let url = '';
  if (action.query) {
    url = `${API_BOS}?${serialize(action.query)}`;
  } else {
    url = `${API_BOS}`;
  }

  try {
    // console.log('aaaa', action);

    const data = yield call(request, url, {
      method: 'GET',
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem('token')}`,
      // },
    });
    if (data) {
      // console.log(data);
      yield put(fetchAllBosSuccessAction(data));
    }
  } catch (err) {
    yield put(fetchAllBosFailAction(err));
  }
}
export function* fetchAddBo(action) {
  const token = localStorage.getItem('token');

  try {
    // console.log('action', action);
    const addBo = yield call(request, `${API_BOS}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.doc),
    });
    if (addBo) {
      const oldBos = yield select(makeSelectBody('bos'));
      oldBos.push(addBo.data);
      yield put(addBoSuccessAction(oldBos, 'Thêm thành công'));
      // yield put(
      //   fetchAllBosAction({
      //     skip: 0,
      //     limit: 5,
      //   }),
      // );
      yield put(changeSnackbar({ status: true, message: 'Thêm cơ hội kinh doanh thành công', variant: 'success' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Thêm cơ hội kinh doanh thất bại', variant: 'error' }));
    yield put(addBoFailAction(err, 'Thêm cơ hội kinh doanh thất bại'));
  }
}
export function* fetchDeleteBos(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedBos = yield call(request, `${API_BOS}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.deleteIds }),
    });

    if (deletedBos) {
      // const oldBos = yield select(makeSelectBody('bos'));
      // console.log(oldBos);
      // console.log(deletedBos.data);
      // const newBos = lodash.differenceBy(oldBos, deletedBos.data, '_id');
      yield put(deleteBosSuccessAction({}, 'Xóa thành công'));
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(fetchAllBosAction({ skip: 0, limit: 10 }));
    }
  } catch (err) {
    yield put(deleteBosFailAction(err, 'Xóa thất bại'));
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}
export function* fetchUpdateBos(action) {
  const token = localStorage.getItem('token');
  try {
    const oldData = yield call(request, `${API_BOS}/${action.doc._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (oldData) {
      const updateBos = yield call(request, `${API_BOS}/${action.doc._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.doc),
      });
      if (updateBos.success === true) {
        // const oldBos = yield select(makeSelectBodyKanban('allItems'));
        // const boIndex = oldBos.findIndex(d => String(d._id) === String(updateBos.data._id));

        const currentEmployee = yield select(makeSelectDashboardPage('profile'));
        const employee = {
          employeeId: currentEmployee._id,
          name: currentEmployee.name,
        };
        const newLog = {
          content: getLogString(oldData, updateBos.data, 'ST01'),
          employee,
          model: 'BusinessOpportunities',
          type: 'update',
          objectId: action.doc._id,
        };
        // oldBos[boIndex] = updateBos.data;
        yield put(updateBoSuccessAction({}, 'Cập nhật thành công'));
        yield put(changeSnackbar({ status: true, message: 'Cập nhập thành công', variant: 'success' }));

        try {
          // const data =
          yield call(request, `${API_LOG}`, {
            method: 'POST',
            body: JSON.stringify(newLog),
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-type': 'application/json',
            },
          });
        } catch (err) {
          // yield put(postLogFailedAct(err));
        }
      } else {
        yield put(changeSnackbar({ status: true, message: updateBos.message, variant: 'error' }));
        yield put(updateBoFailAction());
      }
    }
  } catch (err) {
    // console.log(err);
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhập thất bại', variant: 'error' }));
    yield put(updateBoFailAction());
  }
}
export function* fetchEditViewConfig(action) {
  const token = localStorage.getItem('token');

  try {
    const newViewConfig = action.newViewConfig;
    delete newViewConfig.createdAt;
    delete newViewConfig.updatedAt;
    yield call(request, `${API_UPDATE_VIEWCONFIG}/${newViewConfig._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.newViewConfig),
    });
  } catch (err) {
    // yield put(addUserFalseAction(err));
  }
}

export default function* businessOpportunitiesSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(EDIT_VIEWCONFIG_ACTION, fetchEditViewConfig);
  yield takeLatest(GET_ALL_BOS, fetchGetAllBos);
  yield takeLatest(ADD_BO, fetchAddBo);
  yield takeLatest(DELETE_BOS, fetchDeleteBos);
  yield takeLatest(UPDATE_BO, fetchUpdateBos);
}
