import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectAccountManage = state => state.get('accountRequest', initialState);

const makeSelectAddBankAccount = () => createSelector(selectAccountManage, substate => substate.toJS());

export default makeSelectAddBankAccount;
export { selectAccountManage };