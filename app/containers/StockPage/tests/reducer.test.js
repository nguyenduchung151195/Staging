import { fromJS } from 'immutable';
import stockPageReducer from '../reducer';

describe('stockPageReducer', () => {
  it('returns the initial state', () => {
    expect(stockPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
