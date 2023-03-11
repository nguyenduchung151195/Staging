import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the recruitmentPage state domain
 */

const selectRecruitmentPageDomain = state => state.get('recruitmentPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by RecruitmentPage
 */

const makeSelectRecruitmentPage = () => createSelector(selectRecruitmentPageDomain, substate => substate.toJS());

export default makeSelectRecruitmentPage;
export { selectRecruitmentPageDomain };
