import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import {
  API_DATA_SALARY,
  API_SALARY_FORMULA,
  API_ATTRIBUTE_FORMULA,
  API_ATTRIBUTE_LISTATTRIBUTE,
  API_HRM_PROJECT_BONUS,
} from '../../../../config/urlConfig';
import { serialize } from '../../../../helper';
import { changeSnackbar } from '../../../Dashboard/actions';
import {
  getAllDataSalarySuccess,
  getAllDataSalaryFailer,
  getAllDataSalary,
  updateDataSalarySuccess,
  updateDataSalaryFailer,
  getAllSalaryFormulaSuccess,
  getAllSalaryFormulaFailure,
  getAllSalaryFormula,
  getAttributeFormulaSuccess,
  getAttributeFormulaFailure,
  addSalaryFormulaSuccess,
  updateSalaryFormulaSuccess,
  deleteSalaryFormulaSuccess,
  addAttributeFormulaSuccess,
  addAttributeFormulaFailure,
  getListAttributeFormulaSuccess,
  getListAttributeFormulaFailure,
  addSalaryFormulaFailure,
  updateSalaryFormulaFailure,
  getProjectBonusFailure,
  getProjectBonusSuccess,
  addProjectBonusSuccess,
  addProjectBonusFailure,
  updateProjectBonusSuccess,
  updateProjectBonusFailure,
  deleteProjectBonusSuccess,
  deleteProjectBonusFailure,
  addSingleAttributeFormulaFailure,
  addSingleAttributeFormulaSuccess,
  updateSingleAttributeFormulaSuccess,
  updateSingleAttributeFormulaFailure,
} from './actions';
import {
  ADD_SALARY_FORMULA,
  DELETE_SALARY_FORMULA,
  GET_ALL_DATA_SALARY,
  GET_ALL_SALARY_FORMULA,
  UPDATE_DATA_SALARY,
  UPDATE_SALARY_FORMULA,
  GET_ATTRIBUTE_FORMULA,
  ADD_ATTRIBUTE_FORMULA,
  UPDATE_ATTRIBUTE_FORMULA,
  DELETE_ATTRIBUTE_FORMULA,
  GET_LIST_ATTRIBUTE,
  GET_PROJECT_BONUS,
  ADD_PROJECT_BONUS,
  UPDATE_PROJECT_BONUS,
  DELETE_PROJECT_BONUS,
  ADD_SINGLE_ATTRIBUTE_FORMULA,
  UPDATE_SINGLE_ATTRIBUTE_FORMULA,
} from './constants';

export function* getAllDataSalarySaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, API_DATA_SALARY, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(getAllDataSalarySuccess(res.data));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
      yield put(getAllDataSalaryFailer(res));
    }
  } catch (err) {
    yield put(getAllDataSalaryFailer(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}
export function* updateContract2Allowance(action) {
  const token = localStorage.getItem('token');
  const { data = [] } = action;
  const { dataSalary } = data;
  const updateItems = [];
  dataSalary.forEach(cnf => {
    const { data: cnfData = [] } = cnf;
    cnfData.forEach(dataItem => {
      updateItems.push({
        _id: dataItem._id,
        value: parseInt(dataItem.value) || 0,
      });
    });
  });

  try {
    const res = yield call(request, API_DATA_SALARY, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updateItems }),
    });
    if (res && res.status === 1) {
      yield put(updateDataSalarySuccess(res.data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật dữ liệu thành công', variant: 'success' }));
      yield put(getAllDataSalary());
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật dữ liệu thất bại', variant: 'error' }));
      yield put(updateDataSalaryFailer(res.message));
    }
  } catch (err) {
    yield put(updateDataSalaryFailer(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

export function* getAllSalaryFormulaSaga() {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_SALARY_FORMULA}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(getAllSalaryFormulaSuccess(res.data));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
      yield put(getAllSalaryFormulaFailure(res));
    }
  } catch (err) {
    yield put(getAllSalaryFormulaFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* addSalaryFormulaSaga(action) {
  const token = localStorage.getItem('token');

  try {
    const res = yield call(request, API_SALARY_FORMULA, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (res && res.status === 1) {
      // yield put(addSalaryFormulaSuccess(res.data));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(getAllSalaryFormula());
      yield put(addSalaryFormulaSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
      yield put(addSalaryFormulaFailure(res));
    }
  } catch (err) {
    yield put(addSalaryFormulaFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

export function* updateSalaryFormulaSaga(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  // console.log('data', data)
  try {
    const res = yield call(request, `${API_SALARY_FORMULA}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // console.log('res', res)
    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(getAllSalaryFormula());
      yield put(updateSalaryFormulaSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: res.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateSalaryFormulaFailure(res));
    }
  } catch (err) {
    yield put(updateSalaryFormulaFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}
export function* deleteSalaryFormulaSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_SALARY_FORMULA}/${action._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thành công', variant: 'success' }));
      yield put(getAllSalaryFormula());
      yield put(deleteSalaryFormulaSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
      yield put(deleteSalaryFormulaFailure(res));
    }
  } catch (err) {
    yield put(deleteSalaryFormulaFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Xóa dữ liệu thất bại', variant: 'error' }));
  }
}

// lay thuoc tinh
export function* getListAttributeFormulaSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const filter = serialize({
      formulaId: action._id,
    });
    const res = yield call(request, `${API_ATTRIBUTE_LISTATTRIBUTE}/?${filter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      const { attributeFormula, data } = res;
      const newData = attributeFormula.concat(data);
      yield put(getListAttributeFormulaSuccess(newData));
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: res.message || 'Lấy dữ liệu thất bại' }));
      yield put(getListAttributeFormulaFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ variant: 'error', status: true, message: error || 'Lấy dữ liệu thất bại' }));
    yield put(getListAttributeFormulaFailure(error));
  }
}

// lay 1 ban ghi
export function* getAttributeFormulaSaga(action) {
  const token = localStorage.getItem('token');
  const filter = serialize({
    filter: {
      formulaId: action._id,
    },
  });

  try {
    const res = yield call(request, `${API_ATTRIBUTE_FORMULA}/?${filter}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(getAttributeFormulaSuccess(res.data));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
      yield put(getAttributeFormulaFailure(res));
    }
  } catch (err) {
    yield put(getAttributeFormulaFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* addAttributeFormulaSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    let newData = data.map(item => ({
      sourceAttribute: item.sourceAttribute.map(it => ({
        name: it.name,
        code: it.code,
        _id: it.idOld,
        formula: it.formula ? it.formula : '',
        groupName: it.groupName || '',
      })),
      name: item.name,
      code: item.code ? item.code : '',
      formulaId: action._id,
      formula: item.formula,
      // targetAttribute: item.targetAttribute,
      _id: item.id,
    }));

    const body = {
      data: newData,
      formulaId: action._id,
    };

    const res = yield call(request, API_ATTRIBUTE_FORMULA, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res && res.status === 1) {
      yield put(addAttributeFormulaSuccess(res.data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(addAttributeFormulaSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
      yield put(addAttributeFormulaFailure(res));
    }
  } catch (err) {
    yield put(addAttributeFormulaFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* updateAttributeFormulaSaga(action) {
  try {
    const res = yield call(request, `${API_ATTRIBUTE_FORMULA}/${action._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(getAttributeFormulaSuccess(res.data));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
      yield put(getAttributeFormulaFailure(res));
    }
  } catch (err) {
    yield put(getAttributeFormulaFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* deleteAttributeFormulaSaga(action) {
  try {
    const res = yield call(request, `${API_ATTRIBUTE_FORMULA}/${action._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res && res.status === 1) {
      yield put(getAttributeFormulaSuccess(res.data));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
      yield put(getAttributeFormulaFailure(res));
    }
  } catch (err) {
    yield put(getAttributeFormulaFailure(err));
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

// thuong du an
export function* getProjectBonusSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, API_HRM_PROJECT_BONUS, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    if (res && res.status === 1) {
      yield put(getProjectBonusSuccess(res.data));
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: res.message || 'Lấy dữ liệu thất bại' }));
      yield put(getProjectBonusFailure(res));
    }
  } catch (error) {
    yield put(getProjectBonusFailure(error));
  }
}

export function* addProjectBonusSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, API_HRM_PROJECT_BONUS, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(action.data),
    });

    if (res && res.status === 1) {
      yield put(addProjectBonusSuccess(res.data));
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: res.message || 'Thêm dữ liệu thất bại' }));
      yield put(addProjectBonusFailure(res));
    }
  } catch (error) {
    yield put(addProjectBonusFailure(error));
  }
}

export function* updateProjectBonusSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_PROJECT_BONUS}/${action._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(action.data),
    });

    if (res && res.status === 1) {
      yield put(updateProjectBonusSuccess(res.data));
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: res.message || 'Cập nhật dữ liệu thất bại' }));
      yield put(updateProjectBonusFailure(res));
    }
  } catch (error) {
    yield put(updateProjectBonusFailure(error));
  }
}

export function* deleteProjectBonusSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HRM_PROJECT_BONUS}/${action._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });

    if (res && res.status === 1) {
      yield put(deleteProjectBonusSuccess(res.data));
    } else {
      yield put(changeSnackbar({ variant: 'error', status: true, message: res.message || 'Xóa dữ liệu thất bại' }));
      yield put(deleteProjectBonusFailure(res));
    }
  } catch (error) {
    yield put(deleteProjectBonusFailure(error));
  }
}

// them cong thuc tinh don le
export function* addSingleAttributeFormulaSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const { formulaId } = data;

    const newData = {
      sourceAttribute: data.sourceAttribute.map(it => ({
        name: it.name,
        code: it.code,
        _id: it.idOld,
        formula: it.formula ? it.formula : '',
        groupName: it.groupName || '',
      })),
      name: data.name,
      code: data.code ? data.code : '',
      formulaId,
      formula: data.formula,
      _id: data.id,
    };

    const res = yield call(request, `${API_ATTRIBUTE_FORMULA}/item`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(newData),
    });
    if (res && res.status === 1) {
      yield put(addSingleAttributeFormulaSuccess(res));
      yield put(getAttributeFormula(formulaId));
      yield put(getListAttributeFormula(formulaId));
    } else {
      yield put(addSingleAttributeFormulaFailure(res));
    }
  } catch (error) {
    yield put(addSingleAttributeFormulaFailure(error));
  }
}

export function* updateSingleAttributeFormulaSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const { formulaId } = data;

    const newData = {
      sourceAttribute: data.sourceAttribute.map(it => ({
        name: it.name,
        code: it.code,
        _id: it.idOld,
        formula: it.formula ? it.formula : '',
        groupName: it.groupName || '',
      })),
      name: data.name,
      code: data.code ? data.code : '',
      formulaId,
      formula: data.formula,
      _id: data.id,
    };

    const res = yield call(request, `${API_ATTRIBUTE_FORMULA}/item/${newData._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(newData),
    });
    if (res && res.status === 1) {
      yield put(updateSingleAttributeFormulaSuccess(res));
      yield put(getAttributeFormula(formulaId));
      yield put(getListAttributeFormula(formulaId));
    } else {
      yield put(updateSingleAttributeFormulaFailure(res));
    }
  } catch (error) {
    yield put(updateSingleAttributeFormulaFailure(error));
  }
}

export default function* configSalaryPage() {
  yield takeLatest(GET_ALL_DATA_SALARY, getAllDataSalarySaga);
  yield takeLatest(UPDATE_DATA_SALARY, updateContract2Allowance);

  // salary formula
  yield takeLatest(GET_ALL_SALARY_FORMULA, getAllSalaryFormulaSaga);
  yield takeLatest(ADD_SALARY_FORMULA, addSalaryFormulaSaga);
  yield takeLatest(UPDATE_SALARY_FORMULA, updateSalaryFormulaSaga);
  yield takeLatest(DELETE_SALARY_FORMULA, deleteSalaryFormulaSaga);

  // lay 1 ban ghi
  yield takeLatest(GET_ATTRIBUTE_FORMULA, getAttributeFormulaSaga);
  yield takeLatest(ADD_ATTRIBUTE_FORMULA, addAttributeFormulaSaga);
  yield takeLatest(UPDATE_ATTRIBUTE_FORMULA, updateAttributeFormulaSaga);
  yield takeLatest(DELETE_ATTRIBUTE_FORMULA, deleteAttributeFormulaSaga);

  // lay danh sach thuoc tinh
  yield takeLatest(GET_LIST_ATTRIBUTE, getListAttributeFormulaSaga);

  // thuong du an
  yield takeLatest(GET_PROJECT_BONUS, getProjectBonusSaga);
  yield takeLatest(ADD_PROJECT_BONUS, getProjectBonusSaga);
  yield takeLatest(UPDATE_PROJECT_BONUS, getProjectBonusSaga);
  yield takeLatest(DELETE_PROJECT_BONUS, getProjectBonusSaga);

  //
  yield takeLatest(ADD_SINGLE_ATTRIBUTE_FORMULA, addSingleAttributeFormulaSaga);
  yield takeLatest(UPDATE_SINGLE_ATTRIBUTE_FORMULA, updateSingleAttributeFormulaSaga);
}
