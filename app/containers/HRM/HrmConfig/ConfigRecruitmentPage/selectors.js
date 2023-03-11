import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectConfigRecruitmentDomain = state => state.get('dataRecruitment', initialState);

const makeSelectConfigRecruitment = () => createSelector(selectConfigRecruitmentDomain, substate => substate.toJS());
export default makeSelectConfigRecruitment;
export { selectConfigRecruitmentDomain };
