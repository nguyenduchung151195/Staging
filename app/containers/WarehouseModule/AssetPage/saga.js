import { takeEvery, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import {
  getTagsSuccess,
  getTagsFailed,
  getAssetTypeSuccess,
  getAssetTypeFailed,
  getPropertiesSetSuccess,
  getPropertiesSetFailed,
  getSuppliersSuccess,
  getSuppliersFailed,
  getCalculateUnitSuccess,
  getCalculateUnitFailed,
  getCategorySuccess,
  getCategoryFailed,
  getDepartmentSuccess,
  getDepartmentFailed,
  getAgencyLevelSuccess,
  getAgencyLevelFailed,
  getOriginSuccess,
  getOriginFailed,
  getAssetSuccess,
  getAssetFailed,
  editAssetSuccess,
  editAssetFailed,
} from './actions';
import { GET_TAGS, GET_ASSET, EDIT_ASSET, GET_ASSET_TYPE } from './constants';
import {
  API_TAG_STOCK,
  SUPPLIER,
  GET_PROP_SET,
  API_UNIT_STOCK,
  API_ASSET_TYPE_STOCK,
  API_CATEGORY_STOCK_TREE,
  CRM_SOURCE,
  API_ORIGIN,
  API_ORIGANIZATION,
  API_ADD_NEW_PRODUCT,
  UPLOAD_IMG_SINGLE,
  API_ASSET,
} from 'config/urlConfig';
import { changeSnackbar } from '../../Dashboard/actions';

export function* getTags() {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, API_TAG_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getTagsSuccess(data));
    } else {
      yield put(getTagsFailed({}));
    }
  } catch (err) {
    yield put(getTagsFailed(err));
  }
}

export function* getSupplier() {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, SUPPLIER, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getSuppliersSuccess(data.data));
    } else {
      yield put(getSuppliersFailed({}));
    }
  } catch (err) {
    yield put(getSuppliersFailed(err));
  }
}

export function* getPropertiesSet() {
  try {
    const data = yield call(request, GET_PROP_SET, {
      method: 'GET',
      headers: {},
    });
    if (data.status === 'success') {
      yield put(getPropertiesSetSuccess(data.data));
    } else {
      yield put(getPropertiesSetFailed({}));
    }
  } catch (err) {
    yield put(getPropertiesSetFailed(err));
  }
}

export function* getCalculateUnit() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_UNIT_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getCalculateUnitSuccess(data));
    } else {
      yield put(getCalculateUnitFailed({}));
    }
  } catch (err) {
    yield put(getCalculateUnitFailed(err));
  }
}

export function* getAsetType() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_ASSET_TYPE_STOCK, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAssetTypeSuccess(data));
    } else {
      yield put(getAssetTypeFailed({}));
    }
  } catch (err) {
    yield put(getAssetTypeFailed(err));
  }
}

export function* getCategory() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_CATEGORY_STOCK_TREE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.success === true) {
      yield put(getCategorySuccess(data.data));
    } else {
      yield put(getCategoryFailed({}));
    }
  } catch (err) {
    yield put(getCategoryFailed(err));
  }
}

export function* getDepartment() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getDepartmentSuccess(data));
    } else {
      yield put(getDepartmentFailed({}));
    }
  } catch (err) {
    yield put(getDepartmentFailed(err));
  }
}

export function* getAgencyLevel() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${CRM_SOURCE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      // eslint-disable-next-line array-callback-return
      const agency = data.find(item => {
        if (item.code === 'pckh') return true;
      });
      yield put(getAgencyLevelSuccess(agency));
    } else {
      yield put(getAgencyLevelFailed({}));
    }
  } catch (err) {
    yield put(getAgencyLevelFailed(err));
  }
}

export function* getOrigin() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_ORIGIN, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getOriginSuccess(data));
    } else {
      yield put(getOriginFailed({}));
    }
  } catch (err) {
    yield put(getOriginFailed(err));
  }
}

export function* getAsset(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ASSET}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAssetSuccess(data));
    } else {
      yield put(getAssetFailed({}));
    }
  } catch (err) {
    yield put(getAssetFailed(err));
  }
}

export function* editAsset(action) {
  const token = localStorage.getItem('token');
  let image;
  if (action.body.avatar === null) {
    if (action.body.image.indexOf('g.lifetek.vn:203') > -1) {
      image = action.body.image;
    }
  }
  else {
    const formData = new FormData();
    formData.append('file', action.body.avatar);

    const upload = yield call(request, UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {},
      body: formData,
    });
    image = upload.url;
  }
  const bodySend = {
    ...action.body,
    image,
  };
  delete bodySend.avatar
  try {
    const method = bodySend._id ? 'PUT' : 'POST';
    const url = bodySend._id ? `${API_ASSET}/${bodySend._id}` : API_ASSET;
    const data = yield call(request, url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodySend),
    });
    if (data) {
      yield put(editAssetSuccess(data));
      yield put(changeSnackbar({ status: true, message: bodySend._id ? 'Cập nhật thành công' : 'Thêm mới thành công', variant: 'success' }));
    } else {
      yield put(editAssetFailed({}));
      yield put(changeSnackbar({ status: true, message: 'Api gặp vấn đề!', variant: 'error' }));
    }
  } catch (err) {
    yield put(editAssetFailed(err));
    yield put(changeSnackbar({ status: true, message: err.message, variant: 'error' }));
  }
}

// Individual exports for testing
export default function* assetPageSaga() {
  // See example in containers/HomePage/saga.js
  // yield takeEvery(GET_TAGS, getTags);
  yield takeEvery(GET_TAGS, getSupplier);
  yield takeEvery(GET_TAGS, getPropertiesSet);
  yield takeEvery(GET_TAGS, getCalculateUnit);
  yield takeEvery(GET_TAGS, getCategory);
  yield takeEvery(GET_TAGS, getAgencyLevel);
  yield takeEvery(GET_TAGS, getDepartment);
  yield takeEvery(GET_TAGS, getOrigin);
  yield takeEvery(GET_TAGS, getAsetType);
  yield takeEvery(EDIT_ASSET, editAsset);
  yield takeEvery(GET_ASSET, getAsset);
}
