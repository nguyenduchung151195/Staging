import { fromJS } from 'immutable';
import kpiExchangeReducer from '../reducer';

describe('kpiExchangeReducer', () => {
  it('returns the initial state', () => {
    expect(kpiExchangeReducer(undefined, {})).toEqual(fromJS({}));
  });
});
