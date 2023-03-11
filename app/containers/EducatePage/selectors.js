import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the educatePage state domain
 */

const selectEducatePageDomain = state => state.get('educatePage', initialState);

const makeSelectEducatePage = () => createSelector(selectEducatePageDomain, substate => substate.toJS());
export default makeSelectEducatePage;
export { selectEducatePageDomain };

