import { fromJS } from 'immutable';
import addKpiConfigReducer from '../reducer';

describe('addKpiConfigReducer', () => {
  it('returns the initial state', () => {
    expect(addKpiConfigReducer(undefined, {})).toEqual(fromJS({}));
  });
});
