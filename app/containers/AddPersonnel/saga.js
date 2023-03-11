// import { take, call, put, select } from 'redux-saga/effects';
import { takeLatest, call, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import {
  getDepartmentSuccess,
  postPersonnelSuccess,
  putPersonnelSuccess,
  getPersonnelCurentSuccess,
  getDataSuccess,
  mergeData,
  postEquipmentSuccess,
  getAllEquipmentOfEmployeeSuccess,
} from './actions';
import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import {
  UPLOAD_IMG_SINGLE,
  API_ORIGANIZATION,
  API_PERSONNEL,
  API_SOURCE_HRMCONFIG,
  API_TIMEKEEPING_EQUIPMENT,
  API_TIMEKEEPING_ADDEQUIPMENT,
} from '../../config/urlConfig';
import { GET_DEPARTMENT, GET_DATA, POST_PERSONNEL, PUT_PERSONNEL, GET_PERSONNEL_CURRENT, GET_ALL_EQUIPMENT_OF_EMPLOYEE } from './constants';
import { CUSTOMER_TYPE_CODE } from '../../utils/constants';
// Individual exports for testing

export function* getDepartmentSaga() {
  try {
    const departments = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getDepartmentSuccess(departments));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* getDataSaga() {
  try {
    let laborStatus;
    let marriage;
    let title;
    let contractType;
    let educateSystem;
    let specialize;
    let degree;
    let informatics;
    let language1;
    let language2;
    let nation;
    let religion;
    let shift;
    let graduateSchool;
    let bloodGroup;
    const data = yield call(request, API_SOURCE_HRMCONFIG, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (data) {
      laborStatus = data.find(item => item.code === 'S02').data;
      marriage = data.find(item => item.code === 'S01').data;
      contractType = data.find(item => item.code === 'S03').data;
      title = data.find(item => item.code === 'S04').data;
      educateSystem = data.find(item => item.code === 'S05').data;
      specialize = data.find(item => item.code === 'S06').data;
      degree = data.find(item => item.code === 'S07').data;
      informatics = data.find(item => item.code === CUSTOMER_TYPE_CODE).data;
      language1 = data.find(item => item.code === 'S09').data;
      language2 = data.find(item => item.code === 'S10').data;
      nation = data.find(item => item.code === 'S11').data;
      religion = data.find(item => item.code === 'S12').data;
      shift = data.find(item => item.code === 'S13').data;
      graduateSchool = data.find(item => item.code === 'S14').data;
      bloodGroup = data.find(item => item.code === 'S15').data;
    }
    yield put(
      mergeData({
        laborStatuss: laborStatus,
        marriages: marriage,
        titles: title,
        contractTypes: contractType,
        educateSystems: educateSystem,
        specializes: specialize,
        degrees: degree,
        informaticss: informatics,
        language1s: language1,
        language2s: language2,
        nations: nation,
        religions: religion,
        shifts: shift,
        graduateSchools: graduateSchool,
        bloodGroups: bloodGroup,
      }),
    );
    const dataEquipment = yield call(request, API_TIMEKEEPING_EQUIPMENT, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (dataEquipment && dataEquipment.status === 1) {
      yield put(
        mergeData({
          equipmentList: dataEquipment.data,
        }),
      );
    }
    yield put(getDataSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu danh mục thất bại', variant: 'error' }));
  }
}

export function* postPersonnel(action) {
  try {
    if (action.data.avatarURL) {
      const formData = new FormData();
      formData.append('file', action.data.avatar);
      const avatarURL = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      action.data.avatar = avatarURL.url;
    }
    let urlFile;
    if (action.data.file) {
      const formData = new FormData();
      formData.append('file', action.data.file);
      urlFile = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
    }
    const dataConvert = {
      name: action.data.name,
      code: action.data.code,
      gender: action.data.gender,
      email: action.data.email,
      birthday: action.data.birthday,
      phoneNumber: action.data.phoneNumber,
      address: action.data.address,
      note: action.data.note,
      identityCardNumber: action.data.identityCardNumber,
      beginWork: action.data.beginWork,
      locationProvide: action.data.locationProvide,
      marriage: action.data.marriage,
      automatic: action.data.automatic,
      dateProvide: action.data.dateProvide,
      dateOfficial: action.data.dateOfficial,
      laborStatus: action.data.laborStatus,
      decisionNumber: action.data.decisionNumber,
      decisionDay: action.data.decisionDay,
      organizationUnit: action.data.organizationUnit,
      position: action.data.position,
      title: action.data.title,
      contractNumber: action.data.contractNumber,
      contractType: action.data.contractType,
      contractStartDate: action.data.contractStartDate,
      contractEndDate: action.data.contractEndDate,
      bankAccount: action.data.bankAccount,
      bank: action.data.bank,
      taxCode: action.data.taxCode,
      educateSystem: action.data.educateSystem,
      specialize: action.data.specialize,
      degree: action.data.degree,
      informatics: action.data.informatics,
      language1: action.data.language1,
      language2: action.data.language2,
      nation: action.data.nation,
      religion: action.data.religion,
      file: urlFile ? urlFile.url : '',
      avatar: action.data.avatar,
      avatarURL: action.data.avatarURL,
      rank: action.data.rank,
      role: action.data.role,
      restStatus: action.data.restStatus,
      inactivityDate: action.data.inactivityDate,
      insuranceNumber: action.data.insuranceNumber,
      insuranceCode: action.data.insuranceCode,
      graduateSchool: action.data.graduateSchool,
      graduateYear: action.data.graduateYear,
      bloodGroup: action.data.bloodGroup,
      healthStatus: action.data.healthStatus,
      relationship: action.data.relationship,
      passport: action.data.passport,
      passportDate: action.data.passportDate,
      facebook: action.data.facebook,
      skype: action.data.skype,
      yahoo: action.data.yahoo,
      twitter: action.data.twitter,
      kanbanStatus: action.data.kanbanStatus,
      portal: action.data.portal,
    };
    const data = yield call(request, API_PERSONNEL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataConvert),
    });
    console.log(data);
    if (data && data.status === 1) {
      yield put(postPersonnelSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Thêm nhân sự thành công', variant: 'success' }));

      const value = {
        hrmEmployeeId: data && data.data._id,
        workingInformation: action.data.workingInformation,
      };
      const dataEquipment = yield call(request, API_TIMEKEEPING_ADDEQUIPMENT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
      });
      if (dataEquipment && dataEquipment.status === 1) {
        yield put(postEquipmentSuccess(dataEquipment));
      } else {
        yield
        // yield put(changeSnackbar({ status: true, message: dataEquipment.message, variant: 'error' }));
      }

      // yield put(push('/hrm/hrmPersonnelRecordsManagement'));
      yield put(push('/hrm/personnel'));

    } else {
      yield put(changeSnackbar({ status: true, message: data.message, variant: 'error' }));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Thêm nhân sự thất bại', variant: 'error' }));
  }
}

function* putPersonnel(action) {
  try {
    if (action.data.avatarURL) {
      const formData = new FormData();
      formData.append('file', action.data.avatar);
      const avatarURL = yield call(request, UPLOAD_IMG_SINGLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      action.data.avatar = avatarURL.url;
    }
    const data = yield call(request, `${API_PERSONNEL}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });
    console.log(data, 'data')

    if (data && data.status === 1) {
      yield put(putPersonnelSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));

      // console.log('1', value)
      const value = {
        body: action.data.workingInformation.map(item => ({ ...item, hrmEmployeeId: data && data.data._id })),
      };
      console.log(value, 'value');
      const dataEquipment = yield call(request, API_TIMEKEEPING_ADDEQUIPMENT, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
      });
      console.log(dataEquipment, 'dataEquipment')
      if (dataEquipment && dataEquipment.status === 1) {
        yield put(postEquipmentSuccess(dataEquipment.data));
      } else {
        let message = dataEquipment.message
        if (message && typeof message === 'string') {

        }
        else message = 'Cập nhật thất bại hợp đồng BHXH!'
        yield put(changeSnackbar({ status: true, message: message || 'Cập nhật thất bại!', variant: 'error' }));
      }

      // yield put(push('/hrm/hrmPersonnelRecordsManagement'));
      yield put(push('/hrm/personnel'));

    } else {
      yield put(changeSnackbar({ status: true, message: data.message, variant: 'error' }));
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật thất bại', variant: 'error' }));
  }
}

export function* deleteEquipmentSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_TIMEKEEPING_ADDEQUIPMENT}/${action._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
    if (res && res.status === 1) {
      // yield put()
    } else {
    }
  } catch { }
}

function* getPersonnelCurent(action) {
  try {
    const data = yield call(request, `${API_PERSONNEL}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(action.data),
    });
    yield put(getPersonnelCurentSuccess(data));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu nhân sự thất bại', variant: 'error' }));
  }
}

export function* getAllEquipmentOfEmployeeSaga(action) {
  try {
    const data = yield call(request, `${API_TIMEKEEPING_ADDEQUIPMENT}?filter[hrmEmployeeId]=${action._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      // body: JSON.stringify(action.data),
    });
    yield put(getAllEquipmentOfEmployeeSuccess(data.data));
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu nhân sự thất bại', variant: 'error' }));
  }
}

export default function* addPersonnelSaga() {
  yield takeLatest(GET_DEPARTMENT, getDepartmentSaga);
  yield takeLatest(GET_DATA, getDataSaga);
  yield takeLatest(GET_PERSONNEL_CURRENT, getPersonnelCurent);
  yield takeLatest(POST_PERSONNEL, postPersonnel);
  yield takeLatest(PUT_PERSONNEL, putPersonnel);
  yield takeLatest(GET_ALL_EQUIPMENT_OF_EMPLOYEE, getAllEquipmentOfEmployeeSaga);
  // See example in containers/HomePage/saga.js
}
