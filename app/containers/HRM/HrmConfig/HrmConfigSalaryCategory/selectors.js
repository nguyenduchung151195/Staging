import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the SocialInsurancePage state domain
 */
const selectConfigHrmSalaryCategoryDomain = state => state.get('configHrmSalaryCategory', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SocialInsurancePage
 */

const makeSelectConfigHrmSalaryCategoryPage = () => createSelector(selectConfigHrmSalaryCategoryDomain, substate => substate.toJS());

export default makeSelectConfigHrmSalaryCategoryPage;
export { selectConfigHrmSalaryCategoryDomain };
