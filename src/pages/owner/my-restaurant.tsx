import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from '../../gql/graphql';
import { useParams } from 'react-router-dom';

// graphql query 추가
const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      error
      ok
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
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
  return <h1>My restaurant</h1>;
};
