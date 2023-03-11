import { takeLatest, call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
// Individual exports for testing
import {
  API_TASK_PROJECT,
  API_PROGRESS,
  API_TRANFER,
  // UPLOAD_APP_URL,
  UPLOAD_IMG_SINGLE,
  API_CONVERSATION,
  UPLOAD_APP_URL,
  API_TASK_CONFIG,
  API_TEMPLATE,
  API_APPROVE,
  API_USERS,
} from '../../config/urlConfig';
// import lodash from 'lodash';
import { initialState } from './reducer';
import request from '../../utils/request';
import makeSelectaddProject from './selectors';
import { mergeData, putProgressSuccess, postDrive, getDataSuccess, postFileSystem, getProjectCurrent, getEmployeeSuccess } from './actions';
import {
  POST_PROJECT,
  PUT_PROJECT,
  GET_PROJECT_CURRENT,
  PUT_PROGRESS,
  POST_TRANFER,
  POST_FILE,
  PUT_PROGRESS_SUCCESS,
  PUT_RATIO,
  POST_DRIVE,
  GET_DATA,
  POST_FILE_SYSTEM,
  POST_APPROVE,
  GET_EMPLOYEE,
} from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { serialize, sortTask, convertRatio } from '../../helper';
import { clientId } from '../../variable';

function* getProjectCurrentSaga(action) {
  try {
    if (action.id === 'add') {
      yield put(mergeData({ ...initialState.toJS(), taskStatus: 1, ...action.data }));
    } else {
      const checkConversation = yield call(request, `${API_CONVERSATION}/check?id=${action.id}&moduleName=Task`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const hideAddConversation = checkConversation.success;

      const data = yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      let newProject = [data];
      let newEmployeess;
      let projectName = '';
      if (data.projectId) {
        const filter = serialize({ filter: { projectId: data.projectId, status: 1 } });

        const projects = yield call(request, `${API_TASK_PROJECT}/projects?${filter}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const listRatio = convertRatio(projects.data, action.id);
        // console.log(projects);
        data.listRatio = listRatio;
        const listEmployee = yield call(request, `${API_TASK_PROJECT}/getJoins/${data.projectId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        newEmployeess = listEmployee;
        newProject = sortTask(projects.data, [], action.id, true).filter(i => i);
        const dt = yield call(request, `${API_TASK_PROJECT}/${data.projectId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        projectName = dt.name;
      }

      const projectData = {
        ...data,
        hasTemplate: data.template,
        projects: newProject,
        idSelect: action.id,
        selectProgress: data.progress,
        selectStatus: data.taskStatus,
        selectPiority: data.piority,
        employees: newEmployeess,
        errorName: false,
        objectAvatar: '',
        parentStatus: data.parentId ? data.parentId.taskStatus : null,
        listInCharge: [...data.inCharge],
        listJoin: [...data.join],
        hideAddConversation,
        projectName,
        errorDescription: false,
      };

      yield put(mergeData(projectData));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* getProjectUpdated(action) {
  try {
    const data = yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    let newProject = [data];

    if (data.projectId) {
      const filter = serialize({ filter: { projectId: data.projectId, status: 1 } });

      const projects = yield call(request, `${API_TASK_PROJECT}?${filter}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      newProject = sortTask(projects.data, [], action.id, true);
    }

    const projectData = {
      ...data,
      projects: newProject,
      // idSelect: action.id,
      selectProgress: data.progress,
      selectStatus: data.taskStatus,
      selectPiority: data.piority,
      parentStatus: data.parentId ? data.parentId.taskStatus : null,
      reloadProgress: Math.random(),
      reloadApproved: Math.random(),
      reloadHistory: Math.random(),
    };

    yield put(mergeData(projectData));
  } catch (error) {
    // console.log('1', error);
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

function* postProject(action) {
  try {
    if (action.data.objectAvatar) {
      const formData = new FormData();
      formData.append('file', action.data.avatar);
      const url = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      action.data.avatar = url.url;
    }

    const data = yield call(request, API_TASK_PROJECT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
    if (action.data.isProject === true)
      yield put(postDrive({ name: data.data.name, description: data.data.description, users: data.data.join, state: 3 }));

    yield put(
      postFileSystem({
        action: 'read',
        path: '/',
        showHiddenItems: false,
        data: [],
      }),
    );

    if (action.data.callback) {
      action.data.callback(data);
    } else {
      yield put(push('/Task'));
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới thất bại', variant: 'error' }));
  }
}

function* postDriveSaga(action) {
  try {
    yield call(request, `${UPLOAD_APP_URL}/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token_03')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
      // body: JSON.stringify({ name: data.data.name, description: data.data.description, id: data.data._id }),
    });
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới tủ hồ sơ dự án thất bại', variant: 'error' }));
  }
}

function* putProject(action) {
  try {
    if (action.data.objectAvatar) {
      const formData = new FormData();
      formData.append('file', action.data.avatar);
      const url = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      action.data.avatar = url.url;
    }
    const data = yield call(request, `${API_TASK_PROJECT}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    if (data) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));

      if (action.data.callback) action.data.callback();
      else {
        yield put(mergeData(data));
        yield put(push(`/Task`));
      }
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Bạn không có quyền sửa bản ghi này', variant: 'error' }));
  }
}

function* putProgress(action) {
  try {
    const data = yield call(request, `${API_PROGRESS}/${action.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    // if (data.status === 0) {
    //   yield put(changeSnackbar({ status: true, message: data.message, variant: 'error' }));
    // } else {}
    if(data) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật tiến độ thành công', variant: 'success' }));
      if (action.data.callback) action.data.callback();
      yield put(putProgressSuccess(action.id));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật tiến độ thất bại', variant: 'error' }));
  }
}
function* postTranfer(action) {
  try {
    yield call(request, `${API_TRANFER}/${action.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(
      mergeData({
        reloadTranfer: Math.random(),
        tranferJoin: [],
        currentJoin: [],
        currentInCharge: [],
        tranferInCharge: [],
      }),
    );

    yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
    yield put(getProjectCurrent(action.id, { id: action.id }));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Bạn không có quyền sửa bản ghi này', variant: 'error' }));
  }
}

function* postFileSaga(action) {
  try {
    const formData = new FormData();
    const type = action.data.type.includes('image') ? 'image' : 'doc';
    formData.append('file', action.data);
    const data = yield call(request, UPLOAD_IMG_SINGLE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    const addProject = yield select(makeSelectaddProject());
    const name = addProject.fileTitle;
    const taskId = addProject._id;
    const description = addProject.fileDescription;
    const fileData = {
      name,
      fileName: action.data.name,
      size: action.data.size,
      originFile: action.data.type,
      type,
      taskId,
      description,
      url: data.url,
    };
    const fileUpdload = yield call(request, `${API_TASK_PROJECT}/file/${taskId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileData),
    });
    const files = addProject.files.concat(fileUpdload);
    yield put(mergeData({ files, fileDescription: '', fileTitle: '' }));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Bạn không có quyền sửa bản ghi này', variant: 'error' }));
  }
}

function* putRatioSaga(action) {
  try {
    yield call(request, `${API_TASK_PROJECT}/ratio/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật tỉ lệ thất bại', variant: 'error' }));
  }
}

function* getDataSaga() {
  try {
    let configs;
    const data = yield call(request, API_TASK_CONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const templates = yield call(request, `${API_TEMPLATE}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (data) configs = data.find(item => item.code === 'TASKTYPE').data;

    const templatesItem = templates ? templates.filter(elm => elm.moduleCode === 'Task') : [];

    yield put(getDataSuccess(configs, templatesItem));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy cấu hình công việc thất bại', variant: 'error' }));
  }
}

function* postFileSystemSaga(action) {
  try {
    yield call(request, `${UPLOAD_APP_URL}/file-system/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới tủ hồ sơ dự án thất bại', variant: 'error' }));
  }
}

function* postApproveSaga(action) {
  try {
    yield call(request, API_APPROVE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    yield put(changeSnackbar({ status: true, message: 'Tạo phê duyệt thành công', variant: 'success' }));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Tạo phê duyệt thất bại', variant: 'error' }));
  }
}
export function* getEmployee() {
  try {
    const data = yield call(request, API_USERS, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (data) {
      yield put(getEmployeeSuccess(data.data));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy nhân viên thất bại', variant: 'error' }));
  }
}

export default function* addProjectsSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(POST_PROJECT, postProject);
  yield takeLatest(POST_FILE, postFileSaga);
  yield takeLatest(GET_PROJECT_CURRENT, getProjectCurrentSaga);
  yield takeLatest(PUT_PROGRESS_SUCCESS, getProjectUpdated);
  yield takeLatest(GET_EMPLOYEE, getEmployee);

  yield takeLatest(PUT_PROJECT, putProject);
  yield takeLatest(PUT_PROGRESS, putProgress);
  yield takeLatest(POST_TRANFER, postTranfer);
  yield takeLatest(PUT_RATIO, putRatioSaga);
  yield takeLatest(POST_DRIVE, postDriveSaga);
  yield takeLatest(GET_DATA, getDataSaga);
  yield takeLatest(POST_FILE_SYSTEM, postFileSystemSaga);
  yield takeLatest(POST_APPROVE, postApproveSaga);
}
