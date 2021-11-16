import React, { Fragment, useReducer, useEffect } from 'react';

import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { OrderDetailItem } from '../components/OrderDetailItem';
import { OrderButton } from '../components/Buttons/OrderButton';
import CircularProgress from '@material-ui/core/CircularProgress';

// apis
import { fetchLineFoods } from '../apis/line_foods';
import { postOrder } from '../apis/orders';

// reducers
import {
  initialState,
  lineFoodsActionTypes,
  lineFoodsReducer,
} from '../reducers/lineFoods';

import MainLogo from '../images/logo.png';

import { REQUEST_STATE } from '../constants';

import {
  HeaderWrapper,
  MainLogoImage
} from '../components/StyledHeader.jsx';

const OrderListWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const OrderItemWrapper = styled.div`
  margin-bottom: 50px;
`;

export const Orders = () => {
  const [state, dispatch] = useReducer(lineFoodsReducer, initialState);

  useEffect(() => {
    dispatch({ type: lineFoodsActionTypes.FETCHING });
    fetchLineFoods()
      .then((data) =>
        dispatch({
          type: lineFoodsActionTypes.FETCH_SUCCESS,
          payload: {
            lineFoodsSummary: data
          }
        })
      );
  }, []);

  const postLineFoods = () => {
    //POSTINGが登録中、POST_SUCCESSが登録完了
    dispatch({ type: lineFoodsActionTypes.POSTING });
    postOrder({
      //state.lineFoodsSummaryには取得した仮注文データが入っている
      line_food_ids: state.lineFoodsSummary.line_food_ids,
    }).then(() => {
      dispatch({ type: lineFoodsActionTypes.POST_SUCCESS });
      //登録完了したら画面をリロードする
      window.location.reload();
    });
  };

  const orderButtonLabel = () => {
    //注文ボタンはリクエストの状態(state.postState)によって変える
    switch (state.postState) {
      case REQUEST_STATE.LOADING:
        return '注文中...';
      case REQUEST_STATE.OK:
        return '注文中が完了しました!';
      default:
        return '注文を確定する';
    }
  };

  const isExistsLineFoodsSummary = () => (
    state.fetchState === REQUEST_STATE.OK && state.lineFoodsSummary
  )

  return (
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
      </HeaderWrapper>
      <OrderListWrapper>
          <div>
            <OrderItemWrapper>
              {
                // APIローディング中はくるくる回るローディングコンポーネントを表示
                state.fetchState === REQUEST_STATE.LOADING ?
                  <CircularProgress />
                :
                //state.lineFoodsSummaryには前パートで取得した仮注文データが入っている
                  state.lineFoodsSummary &&
                    <OrderDetailItem
                      restaurantFee={state.lineFoodsSummary.restaurant.fee}
                      restaurantName={state.lineFoodsSummary.restaurant.name}
                      restaurantId={state.lineFoodsSummary.restaurant.id}
                      timeRequired={state.lineFoodsSummary.restaurant.time_required}
                      foodCount={state.lineFoodsSummary.count}
                      price={state.lineFoodsSummary.amount}
                  />
              }
            </OrderItemWrapper>
          <div>
              { 
              // state.fetchState === REQUEST_STATE.OK && state.lineFoodsSummary &&
              isExistsLineFoodsSummary() &&
              <OrderButton
              onClick={() => postLineFoods()}
              //APIを呼んでいる/成功した場合にはボタンをdisableにする
              disabled={state.postState === REQUEST_STATE.LOADING || state.postState === REQUEST_STATE.OK}
              >
                  {orderButtonLabel()}
                </OrderButton>
            }
            {
              //API登録が成功して仮注文のデータが無くなったら、ｐを表示する
              state.fetchState === REQUEST_STATE.OK && !(state.lineFoodsSummary) &&
              <p>
                注文予定の商品はありません
              </p>
            }
          </div>    
        </div>
      </OrderListWrapper>
    </Fragment>
  )
}