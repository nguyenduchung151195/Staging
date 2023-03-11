import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addEmailCampaign state domain
 */

const selectAddEmailCampaignDomain = state => state.get('addEmailCampaign', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddEmailCampaign
 */

const makeSelectAddEmailCampaign = () => createSelector(selectAddEmailCampaignDomain, substate => substate.toJS());

export default makeSelectAddEmailCampaign;
export { selectAddEmailCampaignDomain };
