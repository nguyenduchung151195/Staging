import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the SocialInsurancePage state domain
 */

const selectSocialInsurancePageDomain = state => state.get('recruitmentManagementPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SocialInsurancePage
 */

const makeSelectSocialInsurancePage = () => createSelector(selectSocialInsurancePageDomain, substate => substate.toJS());

export default makeSelectSocialInsurancePage;
export { selectSocialInsurancePageDomain };
