import React, { Fragment, useReducer, useEffect } from 'react';
import styled from 'styled-components';

import { Link } from 'react-router-dom';

import Skeleton from '@material-ui/lab/Skeleton';

import { fetchRestaurants } from '../apis/restaurants';

import {
  initialState,
  restaurantsActionTypes,
  restaurantsReducer,
} from '../reducers/restaurants';

import { REQUEST_STATE } from '../constants'

import MainLogo from '../images/logo.png';
import MainCoverImage from '../images/main-cover-image.png';

import RestaurantImage from '../images/restaurant-image.png';

import {
  HeaderWrapper,
  MainLogoImage
} from '../components/StyledHeader.jsx'

const MainCoverImageWrapper = styled.div`
  text-align: center;
`;

const MainCover = styled.img`
  height: 600px;
`;

const RestaurantsContentsList = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 150px;
`;

const RestaurantsContentWrapper = styled.div`
  width: 450px;
  height: 300px;
  padding: 48px;
`;

const RestaurantsImageNode = styled.img`
  width: 100%;
`;

const MainText = styled.p`
  color: black;
  font-size: 18px;
`;

const SubText = styled.p`
  color: black;
  font-size: 12px;
`;

export const Restaurants = () => {
  const [state, dispatch] = useReducer(restaurantsReducer, initialState);

   useEffect(() => {
  //typeをrestaurantsActionTypes.FETCHINGにした場合
  //stateの中のfetchStateはREQUEST_STATE.LOADINGに変更される
    dispatch({ type: restaurantsActionTypes.FETCHING });
    fetchRestaurants()
    .then((data) =>
  //type: restaurantsActionTypes.FETCH_SUCCESSとpayload: {...}を渡すと、
  //fetchStateがREQUEST_STATE.OKと変更されるのと、
  //payloadに渡したデータがrestaurantsListに入れられます
  //payloadは通信に含まれるデータのことをペイロードデータということから慣習的に付けられている
      dispatch({
        type: restaurantsActionTypes.FETCH_SUCCESS,
        payload: {
          restaurants: data.restaurants
        }
      })
    )
  }, [])
// console.log(fetchState);
  return (
    <Fragment>
      <HeaderWrapper>
        <MainLogoImage src={MainLogo} alt="main logo" />
      </HeaderWrapper>
      <MainCoverImageWrapper>
        <MainCover src={MainCoverImage} alt="main cover"/>
      </MainCoverImageWrapper>
      <RestaurantsContentsList>
        {
          //ロード中ならスケルトンを表示する
          state.fetchState === REQUEST_STATE.LOADING ?
            <Fragment>
              <Skeleton variant="rect" width={450} height={300} />
              <Skeleton variant="rect" width={450} height={300} />
              <Skeleton variant="rect" width={450} height={300} />
            </Fragment>
          :
          //ロードが完了したらrestaurants/item.id/foodsが表示される
            state.restaurantsList.map((item, index) =>
              <Link to={`/restaurants/${item.id}/foods`} key={index} style={{ textDecoration: 'none' }}>
                <RestaurantsContentWrapper>
                  <RestaurantsImageNode src={RestaurantImage} />
                  <MainText>{item.name}</MainText>
                  <SubText>{`配送料：${item.fee}円 ${item.time_required}分`}</SubText>
                </RestaurantsContentWrapper>
              </Link>
            )
          }
      </RestaurantsContentsList>
    </Fragment>
  )
}
