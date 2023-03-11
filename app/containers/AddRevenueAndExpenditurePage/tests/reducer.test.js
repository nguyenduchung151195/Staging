import { fromJS } from 'immutable';
import addRevenueAndExpenditurePageReducer from '../reducer';

describe('addRevenueAndExpenditurePageReducer', () => {
  it('returns the initial state', () => {
    expect(addRevenueAndExpenditurePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
