import { call, put, takeLatest, select, takeEvery, all } from 'redux-saga/effects';
import lodash from 'lodash';
import {
  API_VIEWCONFIG,
  SYS_CONF,
  API_STATUS_CRMCONFIG,
  API_SOURCE_CRMCONFIG,
  API_PROFILE,
  API_ORIGANIZATION,
  API_LOG,
  API_TASK_PROJECT,
  API_USERS,
  API_CODE_CONFIG,
  API_ROLE,
  API_ROLE_APP,
  API_APPROVE,
  API_CHANGE_WORKING_ORIGANIZATION,
  API_STATUS_HRMCONFIG,
  API_SOURCE_HRMCONFIG,
  API_HRM_HOLIDAY,
  API_HRM_TIMEKEEP_TYPE,
  API_HRM_SYMBOL,
  API_VIEW_CONFIG_FORMULA,
  API_TEMPLATE,
  API_COMMON_MODULE
} from '../../config/urlConfig';
import { GET_ALL_VIEWCONFIGS, GET_SYS_CONF, ADD_LOG, GET_CODE_CONFIG, GET_ROLE, GET_ROLE_TASK, GET_PROFILE, CHANGE_WORKING_ORGANIZATION, GET_ALL_HRM_TIMEKEEPING } from './constants';
import request, { requestApprove } from '../../utils/request';
import { clientId } from '../../variable';
import {
  fetchAllViewConfigsFailAction,
  getSysConfSuccess,
  getSysConfFailed,
  getProfileFailed,
  getStockSuccess,
  getStockFailed,
  mergeData,
  getCodeConfigSuccess,
  getCodeConfigError,
  getRole,
  getRoleTask,
  getApproveSuccessAction,
  getAllDepartmentFailed,
  getAllDepartmentSuccess,
  getAllHrmTimekeepingSuccess,
  getAllHrmTimekeepingFailer,
} from './actions';
import { makeSelectProfile } from './selectors';
import { serialize } from '../../helper';
export function* fetchGetAllViewConfigs() {
  try {
    const requestHeaders = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const query = {
      filter: {
        selection: { $in: [0, 1] },
        clientId
      }
    }
    let { data, crmStatus, taskStatus, crmSource, employees, hrmStatus, hrmSource, allViewconfigFormula, allTemplates } = yield all({
      data: call(request, API_VIEWCONFIG, requestHeaders),
      crmStatus: call(request, API_STATUS_CRMCONFIG, requestHeaders),
      taskStatus: call(request, `${API_TASK_PROJECT}/config`, requestHeaders),
      crmSource: call(request, API_SOURCE_CRMCONFIG, requestHeaders),
      employees: call(request, API_USERS, requestHeaders),
      hrmStatus: call(request, API_STATUS_HRMCONFIG, requestHeaders),
      hrmSource: call(request, API_SOURCE_HRMCONFIG, requestHeaders),
      allViewconfigFormula: call(request, API_VIEW_CONFIG_FORMULA, requestHeaders),
      allTemplates: call(request, `${API_TEMPLATE}?${serialize(query)}`, requestHeaders)
    });
    const formatedViewConfig = [];
    data.forEach(element => {
      let newColumns = [];
      const columns = element.listDisplay ? element.listDisplay.type.fields.type.columns : [];
      if (columns.length > 0) {
        const statusFieldIndex = columns.findIndex(d => String(d.name) === 'status');
        const othersFieldIndex = columns.findIndex(d => String(d.name) === 'others');
        newColumns = lodash.differenceBy(columns, [columns[statusFieldIndex], columns[othersFieldIndex], 'name']);
      }
      element.listDisplay.type.fields.type.columns = newColumns;
      formatedViewConfig.push(element);
    });
    localStorage.setItem('viewConfig', JSON.stringify(formatedViewConfig));
    // console.log(crmStatus, 'crmStatus')

    if (crmStatus && Array.isArray(crmStatus) && crmStatus.length) {
      let temp = []
      crmStatus.map((el) => {
        let itemCrmStatus = el
        let data = el.data
        if (data && Array.isArray(data) && data.length) {
          data = lodash.sortBy(data, ['code']);
        }
        itemCrmStatus.data = data
        temp.push(itemCrmStatus)
      })
      crmStatus = temp
    }

    localStorage.setItem('crmStatus', JSON.stringify(crmStatus));
    localStorage.setItem('crmSource', JSON.stringify(crmSource));
    localStorage.setItem('taskStatus', JSON.stringify(taskStatus));
    localStorage.setItem('hrmStatus', JSON.stringify(hrmStatus));
    localStorage.setItem('hrmSource', JSON.stringify(hrmSource));
    localStorage.setItem('smartForms', JSON.stringify(allTemplates.filter(t => t.selection == 1).map(r => {
      const { imageSrc, ...newR } = r;
      return newR;
    })));
    localStorage.setItem('allViewconfigFormula', JSON.stringify(allViewconfigFormula.data));
    yield put(mergeData({ employees: employees.data, allTemplates: allTemplates.filter(t => t.selection != 1), loadingSatus: false }));
    const approveList = yield call(requestApprove, `${API_APPROVE}`, {
      method: 'GET',
    });
    if (approveList && employees) {
      const userHasId = employees.data.filter(item => {
        if (Object.keys(item).includes('userId')) {
          return item;
        }
        return null;
      });

      if (!!userHasId) {
        const newData = approveList.data.map(item => {
          item.groupInfo = item.groupInfo.map(employee => ({ ...employee, ...userHasId.find(d => d.userId === employee.person) }));
          return item;
        });
        yield put(getApproveSuccessAction(newData));
      }
    }
    const allModules = yield call(request, `${API_COMMON_MODULE}`, {
      method: 'GET',
    });
    localStorage.setItem('allModules', JSON.stringify(allModules));
  } catch (err) {
    yield put(fetchAllViewConfigsFailAction(err));
  }
}

export function* getSystemConf() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, SYS_CONF, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      localStorage.setItem('systemConfig', JSON.stringify(data.moduleConfig));
      localStorage.setItem('dateFomat', data.dateFomat || 'DD/MM/YYYY');
      yield put(getSysConfSuccess(data));
    } else {
      yield put(getSysConfFailed());
    }
  } catch (error) {
    yield put(getSysConfFailed(error));
  }
}

export function* getProfile() {
  const token = localStorage.getItem('token');

  try {
    let data = yield call(request, API_PROFILE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!data) data = { avatar: '', name: 'Admin', _id: null };
    if (data.firstLogin) {
      localStorage.clear();
      window.location.reload();
    }
    yield put(mergeData({ profile: data, currentUser: data }));
    yield put(getRole(data.userId));
    yield put(getRoleTask(data._id));
  } catch (error) {
    yield put(getProfileFailed(error));
  }
}

export function* getRoleSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const role = yield call(request, `${API_ROLE}/${action.userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    yield put(mergeData({ role }));
  } catch (error) {
    // console.log(error);
  }
}

const listChil = (chil, level, list) => {
  if (chil.length > 0) {
    chil.forEach(item => {
      const newItem = {
        padding: `${level}`,
        id: item._id,
        name: item.name,
        code: item.code,
        type: item.type,
        parent: item.parent,
        level: item.level,
        hiden: false,
        priority: item.priority,
        oUFunction: item.oUFunction,
        duty: item.duty,
        note: item.note,
        accoutingBranchCode: item.accountingDepartmentCode || '',
        accountingDepartmentCode: item.accoutingBranchCode || '',
      };
      list.push(newItem);
      if (item.child) {
        listChil(item.child, level + 20, list);
      }
    });
  }
};

export function* getAllStock() {
  try {
    // const departmentId = action.departmentId;

    const data = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      const list = [];
      data.forEach(unit => {
        const newItem = {
          id: unit._id,
          name: unit.name,
          code: unit.code,
          parent: unit.parent,
          level: unit.level,
          type: unit.type,
          hiden: false,
          priority: unit.priority,
          oUFunction: unit.oUFunction,
          duty: unit.duty,
          note: unit.note,
          accoutingBranchCode: unit.accountingDepartmentCode || '',
          accountingDepartmentCode: unit.accoutingBranchCode || '',
        };
        list.push(newItem);
        if (unit.child) {
          listChil(unit.child, 20, list);
        }

      });
      yield put(getAllDepartmentSuccess(data));
      yield put(getStockSuccess(list));
    } else {
      yield put(getStockFailed({}));
    }
  } catch (err) {
    yield put(getStockFailed(err));
    yield put(getAllDepartmentFailed(err));
  }
}
export function* addLog(action) {
  try {
    const currentEmployee = yield select(makeSelectProfile());
    const employee = {
      employeeId: currentEmployee._id,
      name: currentEmployee.name,
    };

    const newLog = {
      content: action.object.content,
      employee,
      model: action.object.model,
      type: action.object.type,
      objectId: action.object.objectId,
    };
    // console.log(newLog);
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
}
export function* getCodeConfig() {
  try {
    const data = yield call(request, API_CODE_CONFIG, {
      method: 'GET',
    });
    if (data) {
      yield put(getCodeConfigSuccess(data));
    } else {
      yield put(getCodeConfigError());
    }
  } catch (error) {
    yield put(getCodeConfigError(error));
  }
}

export function* getRoleTaskSaga(action) {
  try {
    const roleTask = yield call(request, `${API_ROLE_APP}/Task/${action.userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const roleCustomer = yield call(request, `${API_ROLE_APP}/Customer/${action.userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const roleBusinessOpportunities = yield call(request, `${API_ROLE_APP}/BusinessOpportunities/${action.userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    yield put(mergeData({ roleTask, roleCustomer, roleBusinessOpportunities }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

export function* changeWorkingOriganization(action) {
  try {
    const body = {
      organizationUnitId: action.id
    }
    const data = yield call(request, `${API_CHANGE_WORKING_ORIGANIZATION}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      }
    })
    window.location.reload();
    if (data) {
      console.log('check>>>data', data)
    } else {
      console.log('err>>>data', data)
    }
  } catch (err) {
    console.log("err>> changeWorking", err)
  }
}

export function* getAllHrmTimekeepingSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const requestHeaders = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { holidays, timekeepType, symbols } = yield all({
      holidays: call(request, API_HRM_HOLIDAY, requestHeaders),
      timekeepType: call(request, API_HRM_TIMEKEEP_TYPE, requestHeaders),
      symbols: call(request, API_HRM_SYMBOL, requestHeaders),
    });

    const data = { holidays: holidays.data, timekeepType: timekeepType.data, symbols: symbols.data };
    if (holidays && timekeepType && symbols) {
      yield put(getAllHrmTimekeepingSuccess(data));
    }
  } catch (err) {
    yield put(getAllHrmTimekeepingFailer(err));
    // yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export default function* dashboardPageSaga() {
  yield takeLatest(ADD_LOG, addLog);
  yield takeLatest(GET_PROFILE, getProfile);
  yield takeLatest(GET_SYS_CONF, getSystemConf);
  yield takeLatest(GET_SYS_CONF, getAllStock);
  yield takeLatest(GET_ALL_VIEWCONFIGS, fetchGetAllViewConfigs);
  yield takeLatest(GET_CODE_CONFIG, getCodeConfig);
  yield takeLatest(GET_ROLE, getRoleSaga);
  yield takeLatest(GET_ROLE_TASK, getRoleTaskSaga);
  yield takeLatest(CHANGE_WORKING_ORGANIZATION, changeWorkingOriganization);
  yield takeLatest(GET_ALL_HRM_TIMEKEEPING, getAllHrmTimekeepingSaga);

}
