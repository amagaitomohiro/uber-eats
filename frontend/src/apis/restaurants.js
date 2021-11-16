//axiosというHTTPクライアントライブラリ
//フロントエンド(ブラウザ)からHTTPリクエストを送ることが非常にシンプルになる
//フロントエンドでHTTP通信を行う際に必要な処理をまとめて行ってくれるライブラリのこと
import axios from 'axios';
//URLの文字列をimportし、使っている
import { restaurantsIndex } from '../urls/index'

export const fetchRestaurants =() => {
//axios.getの引数には文字列が必要で、ここではHTTPリクエストをなげる先のURL文字列が必要になる。
//それこそが先ほど作成したurls/index.jsの中身である。
  return axios.get(restaurantsIndex)
  //成功したらthen
  .then(res => {
    return res.data
  })
  //失敗したらcatch
  .catch((e) => console.error(e))
}
//GETリクエストなのでget、POSTであればpost