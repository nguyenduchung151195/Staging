import { fromJS } from 'immutable';
import addKpiEvaluateReducer from '../reducer';

describe('addKpiEvaluateReducer', () => {
  it('returns the initial state', () => {
    expect(addKpiEvaluateReducer(undefined, {})).toEqual(fromJS({}));
  });
});
