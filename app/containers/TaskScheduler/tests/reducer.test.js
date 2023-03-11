import { fromJS } from 'immutable';
import taskSchedulerReducer from '../reducer';

describe('taskSchedulerReducer', () => {
  it('returns the initial state', () => {
    expect(taskSchedulerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
