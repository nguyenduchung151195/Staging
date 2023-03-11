import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ProcessPage state domain
 */

const selectProcessPageDomain = state => state.get('processPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProcessPage
 */

const makeSelectProcessPage = () => createSelector(selectProcessPageDomain, substate => substate.toJS());

export default makeSelectProcessPage;
export { selectProcessPageDomain };
