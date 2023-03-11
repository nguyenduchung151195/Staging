import { fromJS } from 'immutable';
import kpiConfigReducer from '../reducer';

describe('kpiConfigReducer', () => {
  it('returns the initial state', () => {
    expect(kpiConfigReducer(undefined, {})).toEqual(fromJS({}));
  });
});
