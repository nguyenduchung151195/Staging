import { call, put, takeLatest, select } from 'redux-saga/effects';
import lodash from 'lodash';
import request, { requestApprove } from '../../utils/request';
import { API_DYNAMIC_FORM, API_AUTOMATION, API_APPROVE_GROUPS, API_MAPPING_CONVERT } from '../../config/urlConfig';
const API_AUTOMATION1 = '172.16.50.3:10808/api/automation';
import {
  getAllDynamicFormFailAction,
  getAllDynamicFormSuccessAction,
  addAutomationFailAction,
  addAutomationSuccessAction,
  getAllAutomationFailAction,
  getAllAutomationSuccessAction,
  deleteAutomationSuccessAction,
  deleteAutomationFailAction,
  getAllApproveGroupFailAction,
  getAllApproveGroupSuccessAction,
} from './actions';
const API_TEST = 'http://172.16.10.25:10808/api/automation/test';
import { makeSelectBody } from './selectors';
import { makeSelectProfile } from '../../containers/Dashboard/selectors';
import { GET_ALL_DYNAMIC_FORMS, ADD_AUTOMATION, GET_ALL_AUTOMATION, UPDATE_AUTOMATION, DELETE_AUTOMATION, GET_ALL_APPROVE_GROUP } from './constants';
import { clientId } from '../../variable';
// Individual exports for testing
export function* getAllAutomation(action) {
  try {
    const data = yield call(request, `${API_AUTOMATION}/collection/${action.collectionCode}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const newData = data.filter(i => i.clientId === clientId);
    if (data) {
      yield put(getAllAutomationSuccessAction(newData));
    }
  } catch (err) {
    yield put(getAllAutomationFailAction(err));
  }
}
export function* getAllDynamicForms() {
  try {
    const data = yield call(request, `${API_DYNAMIC_FORM}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (data) {
      yield put(getAllDynamicFormSuccessAction(data));
    }
  } catch (err) {
    yield put(getAllDynamicFormFailAction(err, 'Lấy danh sách biểu mẫu động thất bại. Đăng xuất và đăng nhập lại để làm mới phiên làm việc!'));
  }
}
export function* getAllApproveGroup() {
  try {
    const data = yield call(requestApprove, `${API_APPROVE_GROUPS}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const mappingConvert = yield call(request, `${API_MAPPING_CONVERT}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (data && mappingConvert) {
      yield put(getAllApproveGroupSuccessAction(data, mappingConvert.data));
    }
  } catch (err) {
    yield put(getAllApproveGroupFailAction(err, 'Lấy danh sách biểu mẫu động thất bại. Đăng xuất và đăng nhập lại để làm mới phiên làm việc!'));
  }
}
export function* addAutomation(action) {
  const token = localStorage.getItem('token');
  // const profile = yield select(makeSelectProfile());
  // action.automation.username = profile.username;
  // action.automation.clientId = clientId;

  try {
    const addBo = yield call(request, `${API_TEST}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.automation),
    });
    if (addBo) {
      const oldBos = yield select(makeSelectBody('automations'));
      oldBos.push(addBo);
      yield put(addAutomationSuccessAction(addBo, 'Thêm automation thành công'));
    }
  } catch (err) {
    console.log(err, 'errrrrrrrrrrrrrrrrrrrr');
    yield put(addAutomationFailAction(err, 'Thêm automation thất bại'));
  }
}
export function* updateAutomation(action) {
  const token = localStorage.getItem('token');
  try {
    const updateAutomation = yield call(request, `${API_TEST}/${action.automationCode}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.automation),
    });
    if (updateAutomation) {
      const oldBos = yield select(makeSelectBody('automations'));
      oldBos[oldBos.findIndex(d => d._id === updateAutomation._id)] = updateAutomation;
      yield put(addAutomationSuccessAction(oldBos, 'Cập nhật thành công'));
    }
  } catch (err) {
    // yield put(addAutomationFailAction(err, 'Thêm đơn vị thất bại'));
  }
}
export function* deleteAutomation(action) {
  const token = localStorage.getItem('token');
  try {
    const deletedAutomation = yield call(request, `${API_AUTOMATION}/${action.automationCode}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (deletedAutomation) {
      const oldBos = yield select(makeSelectBody('automations'));
      const newBos = lodash.differenceBy(oldBos, [deletedAutomation], '_id');
      yield put(deleteAutomationSuccessAction(newBos, 'Xóa automation thành công'));
    }
  } catch (err) {
    yield put(deleteAutomationFailAction(err, 'Xóa automation thất bại'));
  }
}
export default function* pluginAutomationSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(ADD_AUTOMATION, addAutomation);
  yield takeLatest(GET_ALL_DYNAMIC_FORMS, getAllDynamicForms);
  yield takeLatest(GET_ALL_APPROVE_GROUP, getAllApproveGroup);
  yield takeLatest(GET_ALL_AUTOMATION, getAllAutomation);
  yield takeLatest(UPDATE_AUTOMATION, updateAutomation);
  yield takeLatest(DELETE_AUTOMATION, deleteAutomation);
}
