import { fromJS } from 'immutable';
import deliveryConfigPageReducer from '../reducer';

describe('deliveryConfigPageReducer', () => {
  it('returns the initial state', () => {
    expect(deliveryConfigPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
