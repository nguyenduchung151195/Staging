import { fromJS } from 'immutable';
import recruitmentPageReducer from '../reducer';

describe('recruitmentPageReducer', () => {
  it('returns the initial state', () => {
    expect(recruitmentPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
