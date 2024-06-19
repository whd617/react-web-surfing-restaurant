import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from '../../gql/graphql';
import { Link, useParams } from 'react-router-dom';

// graphql query 추가
const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      error
      ok
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

type Params = {
  id: string;
};

export const MyRestaurant = () => {
  // "/"에서 restaurant상세페이지로 접근했을 때 url params로 restaurant id 값을 받아옴
  const { id } = useParams<Params>();
  const restaurantId = Number(id);
  // query의 data 가져오기
  const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: restaurantId,
        },
      },
    },
  );
  console.log(data);
  return (
    <div>
      <img
        className="  bg-gray-700 py-14 bg-center "
        src={data?.myRestaurant.restaurant?.coverImg}
        alt={data?.myRestaurant.restaurant?.name}
      />
      <div>
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || 'Loading...'}
        </h2>
        <Link to={``} className=" mr-8 text-white bg-gray-800 py-3 px-10">
          Add Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish!</h4>
          ) : null}
        </div>
      </div>
    </div>
  );
};
