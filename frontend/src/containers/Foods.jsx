import React, { Fragment, useReducer, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, Link } from 'react-router-dom';

//components
import { LocalMallIcon } from '../components/Icons';
import { FoodWrapper } from '../components/FoodWrapper';
import { NewOrderConfirmDialog } from '../components/NewOrderConfirmDialog';
import Skelton from '@material-ui/lab/Skeleton';

//reducers
import {
  initialState as foodsInitialState,
  foodsActionTypes,
  foodsReducer,
} from '../reducers/foods';

//apis
import { fetchFoods } from '../apis/foods';
import { postLineFoods, replaceLineFoods } from '../apis/line_foods';

//images
import MainLogo from '../images/logo.png';
import { FoodOrderDialog } from '../components/FoodOrderDialog';
import FoodImage from '../images/food-image.png';

//constants
import { HTTP_STATUS_CODE } from '../constants';
import { COLORS } from '../style_constants';
import { REQUEST_STATE } from '../constants';

import {
  HeaderWrapper,
  MainLogoImage
} from '../components/StyledHeader.jsx';

const BagIconWrapper = styled.div`
  padding-top: 24px;
`;

const ColoredBagIcon = styled(LocalMallIcon)`
  color: ${COLORS.MAIN};
`;

const FoodsList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;

const ItemWrapper = styled.div`
  margin: 16px;
`;

export const Foods = ({
  match
}) => {
  //初期値
  const initialState = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
    isOpenNewOrderDialog: false,
    existingRestaurantName: '',
    newRestaurantName: '',
  };
  const [state, setState] = useState(initialState);
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);
  const history = useHistory();

   useEffect(() => {
    dispatch({ type: foodsActionTypes.FETCHING });
    fetchFoods(match.params.restaurantsId)
      .then((data) => {
        dispatch({
          type: foodsActionTypes.FETCH_SUCCESS,
          payload: {
            foods: data.foods
          }
        });
      })
  }, []);

  //n点を注文に追加のボタンを押されたときの処理
  const submitOrder = () => {
    //submitOrderでpostLineFoodsを書き換え
    postLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
      //成功した場合は注文ページへと遷移させる
    }).then(() => history.push('/orders'))
      .catch((e) => {
        //だめなら406であればNewOrderConfirmDialogコンポーネントを表示させる
        //FoodOrderDialogを閉じてNewFoodOrderDialogを開き、必要な情報をeオブジェクトから取得してstateにセット
        //apis/line_foods.jsのeを使用 406かどうか？
        if (e.response.status === HTTP_STATUS_CODE.NOT_ACCEPTABLE) {
          setState({
            ...state,
            isOpenOrderDialog: false,
            isOpenNewOrderDialog: true,
            existingRestaurantName: e.response.data.existing_restaurant,
            newRestaurantName: e.response.data.new_restaurant,
          })
        } else {
          throw e;
        }
      })
  };

  // 一度注文を選んだ後から注文を変える処理
  const replaceOrder = () => {
    //replaceOrderでreplaceLineFoodsを書き換え
    replaceLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => history.push('/orders'))
    //特定の関数の実行結果に応じてページ遷移をさせるときはusehistoryを使う
  }

  return (
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
        <BagIconWrapper>
          <Link to="/orders">
            <ColoredBagIcon fontSize="large" />
          </Link>
        </BagIconWrapper>
      </HeaderWrapper>
      <FoodsList>
        {
        //12個のSkeltonがレンダリングされる
          foodsState.fetchState === REQUEST_STATE.LOADING ?
            <Fragment>
              {
                [...Array(12).keys()].map(i =>
                  <ItemWrapper key={i}>
                    <Skelton key={i} variant="rect" width={450} height={180} />
                  </ItemWrapper>
                  )
              }
            </Fragment>
          :
          //料理一覧の表示
            foodsState.foodsList.map(food =>
              <ItemWrapper key={food.id}>
                <FoodWrapper
                //FoodWrapper=食べ物の詳細、(名前、詳細、値段、画面)
                  food={food}
                  onClickFoodWrapper={
                    (food) => setState({
                      ...state,
                      selectedFood: food,
                      isOpenOrderDialog: true,
                    })
                  }
                  imageUrl={FoodImage}
                  />
              </ItemWrapper>
              )
            }
      </FoodsList>
      {
      //モーダル、 クリック後の(個数選択など)注文に関するページの操作
        state.isOpenOrderDialog &&
          <FoodOrderDialog 
            isOpen={state.isOpenOrderDialog}
            food={state.selectedFood}
            countNumber={state.selectedFoodCount}
            onClickCountUp={() => setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount + 1,
            })}
            onClickCountDown={() => setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount - 1,
            })}
            //先ほど作った関数を渡します
            onClickOrder={() => submitOrder()}
            //モーダルを閉じる時はすべてのstateを初期化する
            onClose={() => setState({
              ...state,
              isOpenOrderDialog: false,
              selectedFood: null,
              selectedFoodCount: 1,
            })}
          />
      }
      {
      //一度仮注文した後にまた注文するときの処理
      //state.isOpenNewOrderDialogがtrueの時にNewOrderConfirmDialogが実行
        state.isOpenNewOrderDialog && 
        <NewOrderConfirmDialog 
          isOpen={state.isOpenNewOrderDialog}
          onClose={() => setState({ ...state, isOpenNewOrderDialog: false })}
          existingRestaurantName={state.existingRestaurantName}
          newRestaurantName={state.newRestaurantName}
          onClickSubmit={() => replaceOrder()}
        />
      }
      </Fragment>
  )
}