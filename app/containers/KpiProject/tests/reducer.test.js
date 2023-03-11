import { fromJS } from 'immutable';
import kpiProjectReducer from '../reducer';

describe('kpiProjectReducer', () => {
  it('returns the initial state', () => {
    expect(kpiProjectReducer(undefined, {})).toEqual(fromJS({}));
  });
});
