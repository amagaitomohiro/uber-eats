import axios from 'axios';
import { lineFoods, lineFoodsReplace } from '../urls/index';

//lineFoodsは仮注文のAPIのURL文字列。
//そのURLに対してPOSTリクエストを送るのでaxios.post()を使う
//引数にリクエストのURL文字列、第二引数にパラメーターを渡す
export const postLineFoods = (params) => {
  return axios.post(lineFoods,
    {
      food_id: params.foodId,
      count: params.count,
    }
  )
  .then(res => {
      console.log(res)
     return res.data
  })
  //not_acceptableが返ってきた場合↓の中に入る
  //レスポンスeをそのままthrowしています。eとはあくまで変数名ですが中身はAPIからのエラーレスポンスで、オブジェクトです。
  //そしてその中からe.response.statusとすることで、そのエラーのHTTPステータスコード(200や404などのこと)を取得することができます。
  //これをみて、not_acceptableを示す406だった場合は「別の仮注文として新規作成しますか？」というモーダルを表示させたいと思います。
  .catch((e) => { throw e; })
};

export const replaceLineFoods = (params) => {
  return axios.put(lineFoodsReplace,
    {
      food_id: params.foodId,
      count: params.count,
    }
  )
  .then(res => {
     return res.data
  })
  .catch((e) => { throw e; })
};

export const fetchLineFoods = () => {
  return axios.get(lineFoods)
  .then(res => {
      return res.data
  })
  .catch((e) => { throw e; })
};

//POST: リソースの作成
//PUT: リソースの作成、あるいは更新
//PATCH:リソースの部分的な更新