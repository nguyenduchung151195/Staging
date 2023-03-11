/* eslint-disable no-unused-vars */
import { call, put, takeLatest, select } from 'redux-saga/effects';
import lodash from 'lodash';
import request from '../../utils/request';
import { API_TRADINGS, API_UPDATE_VIEWCONFIG, API_LOG } from '../../config/urlConfig';
import {
  fetchAllTradingsFailAction,
  fetchAllTradingsSuccessAction,
  addTradingSuccessAction,
  addTradingFailAction,
  updateTradingFailAction,
  updateTradingSuccessAction,
  deleteTradingsSuccessAction,
  deleteTradingsFailAction,
  fetchAllTradingsAction,
} from './actions';
import { makeSelectBody, makeSelectDashboardPage } from './selectors';
// import { makeSelectBodyKanban } from '../KanbanPlugin/selectors';
import { GET_ALL_TRADINGS, ADD_TRADING, DELETE_TRADINGS, UPDATE_TRADING, EDIT_VIEWCONFIG_ACTION } from './constants';
import { serialize } from '../../helper';
import { changeSnackbar } from '../Dashboard/actions';
import { getLogString } from '../../utils/common';
// Individual exports for testing
export function* fetchGetAllTradings(action) {
  try {
    const data = yield call(request, `${API_TRADINGS}?${serialize({ ...action.query })}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(fetchAllTradingsSuccessAction(data));
    }
  } catch (err) {
    yield put(fetchAllTradingsFailAction(err));
  }
}
export function* fetchAddTrading(action) {
  const token = localStorage.getItem('token');
  try {
    // console.log('action', action);
    const addTrading = yield call(request, `${API_TRADINGS}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.doc),
    });
    if (addTrading) {
      // console.log(addTrading);
      // const oldTradings = yield select(makeSelectBody('bos'));

      // oldTradings.push(addTrading.data);

      yield put(addTradingSuccessAction({}, 'Thêm thành công'));
      yield put(changeSnackbar({ status: true, message: 'Thêm trao đổi thảo thuận thành công', variant: 'success' }));
    }
  } catch (err) {
    // console.log(err);
    yield put(changeSnackbar({ status: true, message: 'Thêm trao đổi thảo thuận thất bại', variant: 'error' }));
    yield put(addTradingFailAction(err, 'Thêm trao đổi thảo thuận thất bại'));
  }
}
export function* fetchDeleteTradings(action) {
  const token = localStorage.getItem('token');

  try {
    const deletedTradings = yield call(request, `${API_TRADINGS}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.deleteIds }),
    });

    if (deletedTradings) {
      const oldTradings = yield select(makeSelectBody('bos'));
      // console.log(oldTradings);
      // console.log(deletedTradings.data);
      const newTradings = lodash.differenceBy(oldTradings, deletedTradings.data, '_id');
      yield put(deleteTradingsSuccessAction(newTradings, 'Xóa thành công'));
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(fetchAllTradingsAction({ skip: 0, limit: 10 }));
    }
  } catch (err) {
    yield put(deleteTradingsFailAction(err, 'Xóa thất bại'));
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}
export function* fetchUpdateTradings(action) {
  const token = localStorage.getItem('token');
  console.log(action);
  // if (action.doc.kanbanStatus === '616f9e64262b8b3655aa3d8a' || action.doc.kanbanStatus === '616f9e64262b8b3655aa3d91') {
  //   action.doc.kanbanStatus = '616f9e64262b8b3655aa3d99';
  // }
  try {
    const oldData = yield call(request, `${API_TRADINGS}/${action.doc._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (oldData) {
      const updateTradings = yield call(request, `${API_TRADINGS}/${action.doc._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.doc),
      });
      if (!updateTradings || updateTradings.status === 0) {
        yield put(updateTradingFailAction());
        yield put(changeSnackbar({ status: true, message: updateTradings.message, variant: 'error' }));
      } else {
        const currentEmployee = yield select(makeSelectDashboardPage('profile'));

        const employee = {
          employeeId: currentEmployee._id,
          name: currentEmployee.name,
        };
        const newLog = {
          content: getLogString(oldData, updateTradings.data, 'ST03'),
          employee,
          model: 'ExchangingAgreement',
          type: 'update',
          objectId: action.doc._id,
        };
        try {
          const data = yield call(request, `${API_LOG}`, {
            method: 'POST',
            body: JSON.stringify(newLog),
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-type': 'application/json',
            },
          });

          // const { objectId } = data;
          // yield put(postLogSuccessAct(data));
          // yield put(getLogAct({ objectId }));
        } catch (err) {
          // console.log(err);
          // yield put(postLogFailedAct(err));
        }
        yield put(updateTradingSuccessAction({}, 'Cập nhật thành công'));
        yield put(changeSnackbar({ status: true, message: 'Cập nhập thành công', variant: 'success' }));
      }
    }
  } catch (err) {
    // console.log(err);
    yield put(updateTradingFailAction(err, 'Cập nhật thất bại'));
    yield put(changeSnackbar({ status: true, message: 'Cập nhập thất bại', variant: 'error' }));
  }
}
export function* fetchEditViewConfig(action) {
  const token = localStorage.getItem('token');

  try {
    const newViewConfig = action.newViewConfig;
    delete newViewConfig.createdAt;
    delete newViewConfig.updatedAt;
    // console.log(newViewConfig);

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
  yield takeLatest(GET_ALL_TRADINGS, fetchGetAllTradings);
  yield takeLatest(ADD_TRADING, fetchAddTrading);
  yield takeLatest(DELETE_TRADINGS, fetchDeleteTradings);
  yield takeLatest(UPDATE_TRADING, fetchUpdateTradings);
}
