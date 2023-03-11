import { fromJS } from 'immutable';
import stockManagerReducer from '../reducer';

describe('stockManagerReducer', () => {
  it('returns the initial state', () => {
    expect(stockManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
