// import { take, call, put, select } from 'redux-saga/effects';

// Individual exports for testing
import qs from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { ADD_USER, GET_DEPARTMENT, EDIT_USER, GET_USER, GET_MODULE } from './constants';
import {
  addUserFalseAction,
  addUserSuccessAction,
  getDepartmentSuccess,
  getDepartmentFailed,
  editUserSuccess,
  editUserFailed,
  getUserSuccess,
  getUserFailed,
  getmoduleSuccess,
  getModuleFailed,
} from './actions';
import { API_USERS, API_ORIGANIZATION, CREATE, UPLOAD_IMG_SINGLE, API_ROLE, API_COMMON_MODULE, API_ROLE_GROUP, APP_URL, API_CHECK_DUPLICATE_DATA} from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { clientId } from '../../variable';

export function* AddUser(action) {
  
  const formData = new FormData();
  formData.append('file', action.body.avatar);
  const registerUser = {
    username: action.body.username,
    password: action.body.password,
    name: action.body.name,
    email: action.body.email,
    code: action.body.code,
    status: action.body.status,
  };
  const token = localStorage.getItem('token');
  try {
    let avatar = '';
    if (action.body.avatar) {
      try {
        const formData = new FormData();
        formData.append('file', action.body.avatar);
        const upload = yield call(request, UPLOAD_IMG_SINGLE, {
          method: 'POST',
          headers: {},
          body: formData,
        });
        avatar = upload.url;
      } catch (error) {
        // avatar = '';
      }
    }
    
   
    const dataRegister = yield call(request, CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      body: qs.stringify(registerUser),
    });

    if (dataRegister) {
      const createUser = {
        organizationUnit: action.body.organizationUnit,
        code: action.body.code,
        name: action.body.name,
        email: action.body.email,
        beginWork: action.body.beginWork,
        gender: action.body.gender,
        identityCardNumber: action.body.IDcard,
        phoneNumber: action.body.mobileNumber,
        address: action.body.address,
        note: action.body.note,
        positions: action.body.positions,
        userExtendViewConfig: action.body.userExtendViewConfig,
        avatar,
        dob: action.body.dob,
        status: action.body.status,
        username: action.body.username,
        user: dataRegister.user,
        others: action.body.others,
        type: action.body.type,
        roleGroupSource: action.body.roleGroupSource,
        allowedDepartment: action.body.allowedDepartment,
        sip_uri: action.body.sip_uri,
        sip_password: action.body.sip_password,
        isChangePwdRequired : action.body.isChangePwdRequired,
        resourcePortalUser : action.body.resourcePortalUser,
        expiredDate :action.body.expiredDate
        // resetChild: action.body.resetChild,
      };
      // console.log(createUser.email, action.body, 'createUser')
      const dataCreate = yield call(request, API_USERS, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUser),
      });
    
      const bodyAddRole = {
        roles: action.body.allFunctionForAdd,
        userId: dataRegister.user,
      };
      yield call(request, API_ROLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyAddRole),
      });
      if (dataCreate) {
        yield put(addUserSuccessAction());
      } else {
        yield put(addUserFalseAction());
      } 
    } 
    else {
      yield put(addUserFalseAction());
    }
    // yield put(addUserSuccessAction(data));
  } catch (err) {
  const check = yield call(request, API_CHECK_DUPLICATE_DATA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      body: qs.stringify(registerUser),
  })
  if (check.status === 0){

     yield put(changeSnackbar({ status: true, message: 'Email đã tồn tại', variant: 'error' }));
  }
  else yield put(addUserFalseAction());
    // yield put(changeSnackbar({ status: true, message: 'Email đã tồn tại', variant: 'error' }));
  }
}

export function* editUser(action) {
  const token = localStorage.getItem('token');
  try {
    let avatar = action.body.avatarURL;
    if (action.body.avatar) {
      try {
        const formData = new FormData();
        formData.append('file', action.body.avatar);
        const upload = yield call(request, UPLOAD_IMG_SINGLE, {
          method: 'POST',
          headers: {},
          body: formData,
        });
        avatar = upload.url;
      } catch (error) {
        // avatar = action.body.avatarURL;
      }
    }

    const editUser = {
      organizationUnit: action.body.organizationUnit,
      code: action.body.code,
      admin: action.body.admin,
      name: action.body.name,
      email: action.body.email,
      beginWork: action.body.beginWork,
      gender: action.body.gender,
      identityCardNumber: action.body.IDcard,
      phoneNumber: action.body.mobileNumber,
      address: action.body.address,
      note: action.body.note,
      positions: action.body.positions,
      avatar,
      userExtendViewConfig: action.body.userExtendViewConfig,
      dob: action.body.dob,
      status: action.body.status,
      user: action.body.user,
      others: action.body.others,
      type: action.body.type,
      codeRoleGroupSelect: action.body.codeRoleGroupSelect,
      roleGroupSource: action.body.roleGroupSource,
      allowedDepartment: action.body.allowedDepartment,
      sip_uri: action.body.sip_uri,
      sip_password: action.body.sip_password,
      isChangePwdRequired : action.body.isChangePwdRequired,
      resourcePortalUser : action.body.resourcePortalUser,
      expiredDate :action.body.expiredDate
    };
    // console.log(editUser, action.body, 'editUser')
    const dataEdit = yield call(request, `${API_USERS}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editUser),
    });
    if (dataEdit) {
      if (action.body.userId) {
        const bodyAddRole = {
          roles: action.body.allFunctionForAdd,
          userId: action.body.userId,
          // resetChild: action.body.resetChild,
        };
        yield call(request, `${API_ROLE}/${action.body.userId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyAddRole),
        });
      }
      if (action.body.resetChild) {
        const resetRoleBody = {
          userId: action.body.id,
          roleGroupId: action.body.roleGroupSelectId,
        };
        yield call(request, `${APP_URL}/api/roleApp/resetChildRole`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resetRoleBody),
        });
      }
      yield put(editUserSuccess());
    } else {
      yield put(editUserFailed());
    }
    // yield put(addUserSuccessAction(data));
  } catch (err) {
    yield put(editUserFailed(err));
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
    yield put(getDepartmentSuccess(data));
  } catch (err) {
    yield put(getDepartmentFailed(err));
  }
}

export function* getUser(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_USERS}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data.status === 'success') {
      const userId = data.data.userId || null;
      let roleForCurrentUser = [];
      if (userId !== null) {
        roleForCurrentUser = yield call(request, `${API_ROLE}/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      yield put(
        getUserSuccess({
          user: data.data,
          role: roleForCurrentUser,
        }),
      );
    } else {
      yield put(getUserFailed());
    }
  } catch (err) {
    yield put(getUserFailed(err));
  }
}
export function* getModules() {
  try {
    const data = yield call(request, `${API_COMMON_MODULE}`, {
      method: 'GET',
    });
    const roleGroups = yield call(request, `${API_ROLE_GROUP}?clientId=${clientId}`, {
      method: 'GET',
    });
    yield put(
      getmoduleSuccess({
        data,
        roleGroups: roleGroups.data,
      }),
    );
  } catch (err) {
    yield put(getModuleFailed(err));
  }
}

// Individual exports for testing
export default function* addUserPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_USER, getUser);
  yield takeLatest(ADD_USER, AddUser);
  yield takeLatest(EDIT_USER, editUser);
  yield takeLatest(GET_DEPARTMENT, getDepartment);
  yield takeLatest(GET_MODULE, getModules);
}
