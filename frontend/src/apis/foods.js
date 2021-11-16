import axios from 'axios';
import { foodsIndex } from '../urls/index'

export const fetchFoods =(restaurantId) => {
  //foodsIndex(restaurantsId)はURL文字列を返す
  return axios.get(foodsIndex(restaurantId))
  .then(res => {
    return res.data
  })
  .catch((e) => console.error(e))
}
