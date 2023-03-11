import { fromJS } from 'immutable';
import criteriaPageReducer from '../reducer';

describe('criteriaPageReducer', () => {
  it('returns the initial state', () => {
    expect(criteriaPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
