import { fromJS } from 'immutable';
import {
          GET_DELIVERY, GET_DELIVERY_FAILED, GET_DELIVERY_SUCCESS
} from './constants';

export const initialState = fromJS({
          delivery: [],
          tab: 0,
          successUpdate: false,
          reload: false,
});
function deliveryFormReducer(state = initialState, action) {
          switch (action.type) {
                    case GET_DELIVERY:
                              return state
                                        .set('loading', true)
                                        .set('success', false)
                                        .set('error', false);
                    case GET_DELIVERY_SUCCESS:
                              return state
                                        .set('taskList', action.data)
                                        .set('loading', false)
                                        .set('success', true)
                                        .set('error', false);
                    case GET_DELIVERY_FAILED:
                              return state
                                        .set('loading', false)
                                        .set('success', false)
                                        .set('error', true);
                    default:
                              return state;
          }
}
export default deliveryFormReducer;
