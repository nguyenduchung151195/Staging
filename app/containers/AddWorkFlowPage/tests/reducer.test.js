import { fromJS } from 'immutable';
import addWorkFlowPageReducer from '../reducer';

describe('addWorkFlowPageReducer', () => {
  it('returns the initial state', () => {
    expect(addWorkFlowPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
