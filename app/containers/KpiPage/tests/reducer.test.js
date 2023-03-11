import { fromJS } from 'immutable';
import kpiPageReducer from '../reducer';

describe('kpiPageReducer', () => {
  it('returns the initial state', () => {
    expect(kpiPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
