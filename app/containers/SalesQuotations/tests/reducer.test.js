import { fromJS } from 'immutable';
import salesQuotationsReducer from '../reducer';

describe('salesQuotationsReducer', () => {
  it('returns the initial state', () => {
    expect(salesQuotationsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
