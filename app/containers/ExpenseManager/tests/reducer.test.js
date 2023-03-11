import { fromJS } from 'immutable';
import expenseManagerReducer from '../reducer';

describe('expenseManagerReducer', () => {
  it('returns the initial state', () => {
    expect(expenseManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
