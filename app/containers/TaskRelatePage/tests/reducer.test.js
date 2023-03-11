import { fromJS } from 'immutable';
import taskRelatePageReducer from '../reducer';

describe('taskRelatePageReducer', () => {
  it('returns the initial state', () => {
    expect(taskRelatePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
