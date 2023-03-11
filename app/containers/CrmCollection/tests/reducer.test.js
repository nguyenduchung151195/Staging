import { fromJS } from 'immutable';
import crmCollectionReducer from '../reducer';

describe('crmCollectionReducer', () => {
  it('returns the initial state', () => {
    expect(crmCollectionReducer(undefined, {})).toEqual(fromJS({}));
  });
});
