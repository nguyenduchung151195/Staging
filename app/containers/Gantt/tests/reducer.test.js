import { fromJS } from 'immutable';
import ganttReducer from '../reducer';

describe('ganttReducer', () => {
  it('returns the initial state', () => {
    expect(ganttReducer(undefined, {})).toEqual(fromJS({}));
  });
});
