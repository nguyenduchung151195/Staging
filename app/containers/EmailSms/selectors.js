import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the emailSms state domain
 */

const selectEmailSmsDomain = state => state.get('emailSms', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by EmailSms
 */

const makeSelectEmailSms = () => createSelector(selectEmailSmsDomain, substate => substate.toJS());

export default makeSelectEmailSms;
export { selectEmailSmsDomain };
