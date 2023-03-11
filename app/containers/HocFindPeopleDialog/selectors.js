import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the hocFindPeopleDialog state domain
 */

const selectHocFindPeopleDialogDomain = state => state.get('hocFindPeopleDialog', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by HocFindPeopleDialog
 */

const makeSelectHocFindPeopleDialog = () => createSelector(selectHocFindPeopleDialogDomain, substate => substate.toJS());

export default makeSelectHocFindPeopleDialog;
export { selectHocFindPeopleDialogDomain };
