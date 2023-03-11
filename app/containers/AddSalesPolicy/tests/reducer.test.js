import { fromJS } from 'immutable';
import addSalesPolicyReducer from '../reducer';

describe('addSalesPolicyReducer', () => {
  it('returns the initial state', () => {
    expect(addSalesPolicyReducer(undefined, {})).toEqual(fromJS({}));
  });
});
