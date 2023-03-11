import { fromJS } from 'immutable';
import criteriaPlanReducer from '../reducer';

describe('criteriaPlanReducer', () => {
  it('returns the initial state', () => {
    expect(criteriaPlanReducer(undefined, {})).toEqual(fromJS({}));
  });
});
