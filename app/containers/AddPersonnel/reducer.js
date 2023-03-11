/*
 *
 * AddPersonnel reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  MERGE_DATA,
  GET_DEFAULT,
  GET_DEPARTMENT_SUCCESS,
  GET_PERSONNEL_CURRENT_SUCCESS,
  GET_DATA_SUCCESS,
  POST_PERSONNEL_SUCCESS,
  PUT_PERSONNEL_SUCCESS,
  CHANGE_IMAGE,
  POST_EQUIPMENT_SUCCESS,
  GET_ALL_EQUIPMENT_OF_EMPLOYEE_SUCCESS,
  CHANGE_TAB,
} from './constants';

export const initialState = fromJS({
  laborStatuss: [],
  marriages: [],
  titles: [],
  contractTypes: [],
  educateSystems: [],
  specializes: [],
  degrees: [],
  informaticss: [],
  language1s: [],
  language2s: [],
  nations: [],
  religions: [],
  shifts: [],
  graduateSchools: [],
  bloodGroups: [],
  data: '',
  name: '',
  code: '',
  email: '',
  phoneNumber: '',
  startDate: '',
  address: '',
  birthday: '',
  locationProvide: '',
  gender: 0,
  note: '',
  identityCardNumber: '',
  dateProvide: '',
  marriage: {},
  automatic: true,
  dateOfficial: '',
  laborStatus: {},
  decisionNumber: '',
  decisionDay: '',
  organizationUnit: '',
  position: '',
  title: {},
  contractNumber: '',
  contractType: {},
  contractStartDate: '',
  contractEndDate: '',
  bankAccount: '',
  bank: '',
  taxCode: '',
  educateSystem: {},
  specialize: {},
  degree: {},
  informatics: {},
  language1: {},
  language2: {},
  nation: {},
  religion: {},
  file: '',
  url: '',
  avatar: '',
  avatarURL: '',
  rank: '',
  role: '',
  restStatus: true,
  inactivityDate: '',
  insuranceNumber: '',
  insuranceCode: '',
  workingInformation: [
    {
      codeEmployee: '',
      shift: '',
      equipmentId: '',
    },
  ],
  equipmentList: [],
  graduateSchool: {},
  graduateYear: '',
  bloodGroup: {},
  healthStatus: '',
  relationship: '',
  passport: '',
  passportDate: '',
  facebook: '',
  skype: '',
  yahoo: '',
  twitter: '',
  departments: [],
  errorName: true,
  errorIdentityCardNumber: true,
  errorOrganizationUnit: true,
  errorPosition: true,
  openDrawer: false,
  openDialog: false,
  openSocial: false,
  openProcess: false,
  openMaternity: false,
  openContract: false,
  openEducate: false,
  openBonus: false,
  openDiscipline: false,
  openSabbatical: false,
  openRelations: false,
  openDismissed: false,
  openPraise: false,
  openCollaborate: false,
  kanbanStatus: '',
  tab: 0,
});

function addPersonnelReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CHANGE_TAB:
      return state.set('tab', action.data);
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DEPARTMENT_SUCCESS:
      return state.set('departments', action.departments);
    case GET_DATA_SUCCESS:
      return state.set('data', action.data);
    case CHANGE_IMAGE:
      return state.set('avatar', action.data.avatar).set('avatarURL', action.data.avatarURL);
    case GET_DEFAULT:
      return state.merge(initialState);
    case GET_PERSONNEL_CURRENT_SUCCESS:
      return state.merge({
        ...action.data,
        errorName: false,
        errorIdentityCardNumber: false,
        errorOrganizationUnit: false,
        errorPosition: false,
      });
    case POST_PERSONNEL_SUCCESS:
      return state.set('data', action.data);
    case PUT_PERSONNEL_SUCCESS:
      return state.set('data', action.data);
    case POST_EQUIPMENT_SUCCESS:
      return state.set('workingInformation', action.data);
    case GET_ALL_EQUIPMENT_OF_EMPLOYEE_SUCCESS:
      return state.set('workingInformation', action.data);
    default:
      return state;
  }
}

export default addPersonnelReducer;
