import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the DismissedPage state domain
 */

const selectDismissedPageDomain = state => state.get('dismissedPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by DismissedPage
 */

const makeSelectDismissedPage = () => createSelector(selectDismissedPageDomain, substate => substate.toJS());

export default makeSelectDismissedPage;
export { selectDismissedPageDomain };
