import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { RestaurantQuery, RestaurantQueryVariables } from '../../gql/graphql';

type TRestaurantParams = {
  id: string;
};

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const RestaurantDetail = () => {
  const { id } = useParams() as TRestaurantParams;
  const { data, loading, error } = useQuery<
    RestaurantQuery,
    RestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,
      },
    },
  });

  return (
    <div>
      <img
        src={data?.restaurant.restaurant?.coverImg}
        alt={data?.restaurant.restaurant?.name}
        className=" w-full object-cover h-96 mx-auto flex flex-col items-center bg-gray-700 bg-center"
      />
      <div className="bg-white w-3/12 py-8 pl-48">
        <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
        <h5 className="text-sm font-light mb-2">
          {data?.restaurant.restaurant?.category?.name}
        </h5>
        <h6 className="text-sm font-light ">
          {data?.restaurant.restaurant?.address}
        </h6>
      </div>
    </div>
  );
};
