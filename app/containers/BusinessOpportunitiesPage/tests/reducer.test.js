import { fromJS } from 'immutable';
import businessOpportunitiesReducer from '../reducer';

describe('businessOpportunitiesReducer', () => {
  it('returns the initial state', () => {
    expect(businessOpportunitiesReducer(undefined, {})).toEqual(fromJS({}));
  });
});
