import { REQUEST_STATE } from '../constants';

export const initialState = {
  //GET APIの状態を表すfetchState、一般的にAPIからデータを取得する時にfetch...とするのでこのように命名している
  fetchState: REQUEST_STATE.INITIAL,
  //APIから取得したレストラン一覧が入ってくる、初期値は空配列として[]を入れる
  restaurantsList: [],
};

export const restaurantsActionTypes = {
  FETCHING: 'FETCHING',
  FETCH_SUCCESS: 'FETCH_SUCCESS'
}

export const restaurantsReducer = (state, action) => {
  switch (action.type) {
    case restaurantsActionTypes.FETCHING:
      //API取得中 => fetchStateはLOADINGにスイッチする
      return {
        ...state,
        fetchState: REQUEST_STATE.LOADING,
      };
    case restaurantsActionTypes.FETCH_SUCCESS:
      //API取得完了 => fetchStateをOKにスイッチし、
      //restaurantsListにデータを入れる
      return {
        fetchState: REQUEST_STATE.OK,
        restaurantsList: action.payload.restaurants,
      };
    default:
      throw new Error();
  }
}