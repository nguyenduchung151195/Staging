import { fromJS } from 'immutable';
import workFlowPageReducer from '../reducer';

describe('workFlowPageReducer', () => {
  it('returns the initial state', () => {
    expect(workFlowPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
