import { fromJS } from 'immutable';
import addStockManagerReducer from '../reducer';

describe('addStockManagerReducer', () => {
  it('returns the initial state', () => {
    expect(addStockManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
