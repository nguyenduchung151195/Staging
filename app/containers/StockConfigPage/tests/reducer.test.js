import { fromJS } from 'immutable';
import stockConfigPageReducer from '../reducer';

describe('stockConfigPageReducer', () => {
  it('returns the initial state', () => {
    expect(stockConfigPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
