import { GET_DELIVERY,GET_DELIVERY_FAILED,GET_DELIVERY_SUCCESS } from "./constants";
export function getDelivery(data) {
          return {
                    type: GET_DELIVERY,
                    data,
          };
}
export function getDeliverySuccess(data) {
          return {
                    type: GET_DELIVERY_SUCCESS,
                    data,
          };
}
export function getDeliveryFailed(err) {
          return {
                    type: GET_DELIVERY_FAILED,
                    err,
          };
}