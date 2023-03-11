import { takeLatest, call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from '../../utils/request';
import { API_DISPATCH, API_LOG } from '../../config/urlConfig';
import { CREATE_DOCUMENT, UPDATE_DOCUMENT, GET_CURRENT } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import makeSelectDashboardPage from '../Dashboard/selectors';
import * as actions from './actions';
// import { serialize } from '../../helper';
import { getLogString } from '../../utils/common';
import { logNames } from '../../variable';

export function* fetchCreateDocument(action) {
  console.log('vao saga', action);
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_DISPATCH}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      yield put(changeSnackbar({ status: true, message: 'Tạo công văn thành công', variant: 'success' }));
      yield put(actions.createDocumentSuccessAction());
      if (action.data.callback) action.data.callback();
      else if (action.data.type === '2') {
        yield put(push('/Documentary/inComingDocument'));
      } else {
        yield put(push('/Documentary/outGoingDocument'));
      }
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Tạo công văn thất bại', variant: 'error' }));
    yield put(actions.createDocumentFaileAction());
  }
}

export function* updateDocumentSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const oldData = yield call(request, `${API_DISPATCH}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = yield call(request, `${API_DISPATCH}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    if (data) {
      yield put(changeSnackbar({ status: true, message: 'Sửa công văn thành công', variant: 'success' }));
      yield put(actions.updateDocumentSuccess(data));
      const dashboardPage = yield select(makeSelectDashboardPage());
      const currentEmployee = dashboardPage.profile;

      const employee = {
        employeeId: currentEmployee._id,
        name: currentEmployee.name,
      };
      const kanban = 'khuong';
      const newLog = {
        content: getLogString(oldData, data, action.data.type === '2' ? 'ST14' : 'ST17', kanban),
        employee,
        model: 'Documentary',
        type: logNames.UPDATE,
        objectId: action.id,
      };
      try {
        const createdLog = yield call(request, `${API_LOG}`, {
          method: 'POST',
          body: JSON.stringify(newLog),
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json',
          },
        });

        if (createdLog) {
          const { objectId } = createdLog;
          yield put(actions.getLogAct({ objectId }));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }

      if (action.data.callback) action.data.callback();
      else if (action.data.type === '2') {
        yield put(push('/Documentary/inComingDocument'));
      } else {
        yield put(push('/Documentary/outGoingDocument'));
      }
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Sửa công văn thất bại', variant: 'error' }));
    yield put(actions.updateDocumentFailed());
  }
}

export function* getCurrentSaga(action) {
  try {
    const data = yield call(request, `${API_DISPATCH}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    const newtreeData = [
      {
        name: data.replyDispatch ? `Nguồn: ${data.replyDispatch.name}` : null,
        attributes: {},
        children: [
          {
            name: data.name,
            _collapsed: true,
            children: [
              {
                name: data.officialDispatch ? `CV phúc đáp: ${data.officialDispatch.name}` : null,
                attributes: {},
                _collapsed: true,
                children: [],
              },
              {
                name: data.task ? `Dự án: ${data.task.name}` : null,
                _collapsed: true,
                children: [],
              },
            ],
          },
        ],
      },
    ];
    // console.log('newtreeData', newtreeData);
    yield put(actions.mergeData({ treeData: newtreeData, ducumentData: data }));
    data.customer = Array.isArray(data.customer) ? data.customer.map(i => ({ _id: i.customerId, name: i.name })) : [];
    yield put(actions.getCurrentSuccess(data));
    const dashboardPage = yield select(makeSelectDashboardPage());
    const currentEmployee = dashboardPage.profile;

    const employee = {
      employeeId: currentEmployee._id,
      name: currentEmployee.name,
    };
    const newLog = {
      content: 'Xem chi tiết',
      employee,
      model: 'Documentary',
      type: logNames.VIEW,
      objectId: action.id,
    };
    try {
      yield call(request, `${API_LOG}`, {
        method: 'POST',
        body: JSON.stringify(newLog),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-type': 'application/json',
        },
      });

      // if (createdLog) {
      //   const { objectId } = createdLog;
      //   yield put(actions.getLogAct({ objectId }));
      // }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  } catch (error) {
    // console.log('error', error);
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu công văn thất bại', variant: 'error' }));
  }
}
// Individual exports for testing
export default function* addDispatchManagerPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(CREATE_DOCUMENT, fetchCreateDocument);
  yield takeLatest(UPDATE_DOCUMENT, updateDocumentSaga);
  yield takeLatest(GET_CURRENT, getCurrentSaga);
}
