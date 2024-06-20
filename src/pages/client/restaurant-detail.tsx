import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { RestaurantQuery, RestaurantQueryVariables } from '../../gql/graphql';
import { Dish } from '../../components/dish';

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
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
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
      <div className="container grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
        {/* Dish component에 React.FC에 대한 type을 지정해 줘서 해당 praps를 전달할 수 있다. */}
        {data?.restaurant.restaurant?.menu.map((dish) => (
          <Dish
            name={dish.name}
            description={dish.description}
            price={dish.price}
            isCustomer={true}
            options={dish.options}
          />
        ))}
      </div>
    </div>
  );
};
