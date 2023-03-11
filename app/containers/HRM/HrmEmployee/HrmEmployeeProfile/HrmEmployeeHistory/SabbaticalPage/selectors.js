import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the SabbaticalPage state domain
 */

const selectSabbaticalPageDomain = state => state.get('sabbaticalPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by SabbaticalPage
 */

const makeSelectSabbaticalPage = () => createSelector(selectSabbaticalPageDomain, substate => substate.toJS());

export default makeSelectSabbaticalPage;
export { selectSabbaticalPageDomain };
