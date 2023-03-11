/* eslint-disable consistent-return */
import { call, takeLatest, put } from 'redux-saga/effects';
// import qs from 'qs';
import request, { requestApprove } from '../../utils/request';
import { API_UPDATE_VIEWCONFIG, API_TEMPLATE, API_APPROVE, API_DOCS, API_COMMON_APPROVE_FINISH } from '../../config/urlConfig';
import {
  editViewConfigFailAction,
  editViewConfigSuccessAction,
  getDynamicFormSuccessAction,
  createApproveSuccess,
  setApproveFinishSuccess,
} from './actions';
// eslint-disable-next-line no-unused-vars
import { EDIT_VIEWCONFIG_ACTION, GET_DYNAMIC_FORM_ACTION, EXPORT_FORM_ACTION, CREATE_APPROVE, SET_APPROVE_FINISH } from './constants';
// import { serialize } from '../../utils/common';
import { PrintElem } from '../../helper';
import { changeSnackbar } from '../Dashboard/actions';
import { clientId } from '../../variable';
// function PrintElemD(elem) {
//   // eslint-disable-next-line no-restricted-globals
//   const mywindow = window.open('', 'newWin', `width=${screen.availWidth},height=${screen.availHeight}`);

//   mywindow.document.write(elem);

//   mywindow.document.close(); // necessary for IE >= 10
//   mywindow.focus(); // necessary for IE >= 10*/

//   mywindow.print();
//   // mywindow.close();

//   return true;
// }
// Individual exports for testing
export function* fetchEditViewConfig(action) {
  const token = localStorage.getItem('token');

  try {
    const newViewConfig = action.newViewConfig;
    delete newViewConfig.createdAt;
    delete newViewConfig.updatedAt;
    const { listDisplay } = newViewConfig;
    const col = listDisplay.type.fields.type.columns;
    const others = listDisplay.type.fields.type.others;
    col.forEach((item, index) => {
      if (item.name.includes('others.')) {
        others.push(item);
        col.splice(index, 1);
      }
    });
    listDisplay.type.fields.type.columns = col;
    listDisplay.type.fields.type.others = others;
    newViewConfig.listDisplay = listDisplay;
    const currentViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
    const index = currentViewConfig.findIndex(item => item.code === newViewConfig.code);

    // eslint-disable-next-line no-unused-vars
    const editViewConfig = yield call(request, `${API_UPDATE_VIEWCONFIG}/${newViewConfig._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.newViewConfig),
    });
    // console.log(2);
    currentViewConfig[index] = editViewConfig;
    localStorage.setItem('viewConfig', JSON.stringify(currentViewConfig));
    yield put(editViewConfigSuccessAction());
  } catch (err) {
    yield put(editViewConfigFailAction('Cập nhật viewconfig thất bại'));
  }
}
export function* getDynamicForm(action) {
  // const token = localStorage.getItem('token');
  try {
    // const templateQuery = serialize({
    //   filter: {
    //     moduleCode: action.collectionCode,
    //   },
    // });
    const forms = yield call(request, `${API_TEMPLATE}?filter%5BclientId%5D=${clientId}&filter%5BmoduleCode%5D=${action.collectionCode}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    yield put(getDynamicFormSuccessAction(forms));
  } catch (err) {
    // console.log(err);
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}
function* getTemplate(action) {
  try {
    const listRelationRef = [];
    action.viewConfig.forEach(element => {
      if (element.type.includes('Relation')) {
        let ref = '';
        ref = element.type.replace('Relation|', '');
        ref = ref.replace(/'/g, '"');
        const objectRef = JSON.parse(ref);
        listRelationRef.push({ columnName: element.name, ref: objectRef.ref });
      }
      if (element.type.includes('ObjectId')) {
        let ref = '';
        ref = element.type.replace('ObjectId|', '');
        listRelationRef.push({ columnName: element.name, ref });
      }
      // if (element.type.includes('Hard Array')) {
      // let ref = '';
      // ref = element.type.replace('Hard Array|', '');
      // listRelationRef.push({ columnName: element.name, ref });
      // }
    });
    try {
      // console.log(listRelationRef);
      const refData = {};
      // const refData = yield all([
      // eslint-disable-next-line array-callback-return
      // listRelationRef.forEach(item => {
      // console.log(action.data);
      for (let i = 0; i < listRelationRef.length; i += 1) {
        if (action.data[listRelationRef[i].columnName]) {
          try {
            const dataRela = yield call(request, `${API_DOCS}/${listRelationRef[i].ref}/${action.data[listRelationRef[i].columnName]}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            if (dataRela) {
              refData[listRelationRef[i].columnName] = dataRela;
            } else {
              refData[listRelationRef[i].columnName] = undefined;
            }
          } catch (errRela) {
            yield put(changeSnackbar({ status: true, message: `Lấy dữ liệu ${listRelationRef[i].columnName} thất bại`, variant: 'error' }));
          }
        }
      }
      // }),
      // ]);
      listRelationRef.map(item => (action.data[item.columnName] = refData[item.columnName]));
      const templates = yield call(request, `${API_TEMPLATE}/${action.formId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // console.log(action.data);
      // const temp = {};
      PrintElem({ content: templates.content, data: action.data, code: action.collectionCode });
      //   .then(res => {
      //     console.log(res)
      //     temp = res
      //   });
      // PrintElemD(temp);
      yield put(changeSnackbar({ status: true, message: 'Xuất File thành công', variant: 'success' }));
      // yield put(push('/crm/SalesQuotation'));
    } catch (errRelation) {
      yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Xuất File thất bại', variant: 'error' }));
  }
}

export function* createApprove(action) {
  try {
    // const templateQuery = serialize({
    //   filter: {
    //     moduleCode: action.collectionCode,
    //   },
    // });
    const forms = yield call(requestApprove, `${API_APPROVE}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    yield put(createApproveSuccess(forms));
    yield put(changeSnackbar({ status: true, message: 'Thêm phê duyệt thành công', variant: 'success' }));
  } catch (err) {
    // console.log(err);
    yield put(changeSnackbar({ status: true, message: 'Thêm phê duyệt thất bại', variant: 'error' }));
  }
}
export function* setApproveFinish(action) {
  try {
    const data = yield call(requestApprove, `${API_COMMON_APPROVE_FINISH}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(action.body),
    });
    yield put(setApproveFinishSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Thay đổi trạng thái thành công', variant: 'success' }));
  } catch (err) {
    // console.log(err);
    yield put(changeSnackbar({ status: true, message: 'Thay đổi trạng thái thất bại', variant: 'error' }));
  }
}

export default function* hocTableSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(EXPORT_FORM_ACTION, getTemplate);
  yield takeLatest(EDIT_VIEWCONFIG_ACTION, fetchEditViewConfig);
  yield takeLatest(GET_DYNAMIC_FORM_ACTION, getDynamicForm);
  yield takeLatest(CREATE_APPROVE, createApprove);
  yield takeLatest(SET_APPROVE_FINISH, setApproveFinish);
}
