import { call, put, takeLatest } from 'redux-saga/effects';
import { API_ORIGANIZATION, API_CATEGORY_STOCK, API_ADD_NEW_PRODUCT, API_TAG_STOCK } from '../../config/urlConfig';
import { GET_ALL_STOCK, GET_ALL_CATEGORY, GET_ALL_INVENTORY, GET_ALL_TAGS } from './constants';
import request from '../../utils/request';
import { getAllStockSuccess, getAllStockFailed, getAllCategorySuccess, getAllInventorySuccess, getAllTagsSuccess } from './actions';

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
      if (newItem.type === 'stock' || newItem.type === 'salePoint') {
        list.push(newItem);
      }
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
        if (newItem.type === 'stock' || newItem.type === 'salePoint') {
          list.push(newItem);
        }
        if (unit.child) {
          listChil(unit.child, 20, list);
        }
      });
      yield put(getAllStockSuccess(list));
    } else {
      yield put(getAllStockFailed({}));
    }
  } catch (err) {
    yield put(getAllStockFailed(err));
  }
}

export function* fetchGetAllCategory() {
  try {
    const data = yield call(request, `${API_CATEGORY_STOCK}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    // console.log(data);
    if (data) {
      yield put(getAllCategorySuccess(data));
    } else {
      // yield put(fetchAllUnitsSuccessAction({}));
    }
  } catch (err) {
    // yield put(fetchAllUnitsFailAction(err));
  }
}

export function* getAllInventory() {
  try {
    const data = yield call(request, `${API_ADD_NEW_PRODUCT}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    // console.log(data);
    if (data) {
      yield put(getAllInventorySuccess(data.data));
    } else {
      // yield put(fetchAllUnitsSuccessAction({}));
    }
  } catch (err) {
    // yield put(fetchAllUnitsFailAction(err));
  }
}
export function* getAllTags() {
  try {
    const data = yield call(request, `${API_TAG_STOCK}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    // console.log(data);
    if (data) {
      yield put(getAllTagsSuccess(data));
    } else {
      // yield put(fetchAllUnitsSuccessAction({}));
    }
  } catch (err) {
    // yield put(fetchAllUnitsFailAction(err));
  }
}
// Individual exports for testing
export default function* addStockManagerSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ALL_STOCK, getAllStock);
  yield takeLatest(GET_ALL_CATEGORY, fetchGetAllCategory);
  yield takeLatest(GET_ALL_INVENTORY, getAllInventory);
  yield takeLatest(GET_ALL_TAGS, getAllTags);
}
