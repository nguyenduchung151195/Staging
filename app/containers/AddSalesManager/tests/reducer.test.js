import { fromJS } from 'immutable';
import addSalesManagerReducer from '../reducer';

describe('addSalesManagerReducer', () => {
  it('returns the initial state', () => {
    expect(addSalesManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
