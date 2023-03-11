import { fromJS } from 'immutable';
import kpiEvaluateReducer from '../reducer';

describe('kpiEvaluateReducer', () => {
  it('returns the initial state', () => {
    expect(kpiEvaluateReducer(undefined, {})).toEqual(fromJS({}));
  });
});
