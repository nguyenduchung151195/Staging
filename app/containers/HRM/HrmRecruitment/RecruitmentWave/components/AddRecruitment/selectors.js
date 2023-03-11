import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addRecruitment state domain
 */

const selectAddRecruitmentDomain = state => state.get('addRecruitment', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddRecruitment
 */

const makeSelectAddRecruitment = () => createSelector(selectAddRecruitmentDomain, substate => substate.toJS());

export default makeSelectAddRecruitment;
export { selectAddRecruitmentDomain };
