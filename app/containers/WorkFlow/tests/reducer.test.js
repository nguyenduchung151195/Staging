import { fromJS } from 'immutable';
import workFlowReducer from '../reducer';

describe('workFlowReducer', () => {
  it('returns the initial state', () => {
    expect(workFlowReducer(undefined, {})).toEqual(fromJS({}));
  });
});
