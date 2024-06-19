import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from '../../gql/graphql';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Dish } from '../../components/dish';
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory';

// graphql query 추가
export const MY_RESTAURANT_QUERY = gql`
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
      <Helmet>
        <title>
          {data?.myRestaurant.restaurant?.name || 'Loading...'} | Nuber Eats
        </title>
      </Helmet>
      <img
        className=" w-full object-cover h-96 mx-auto flex flex-col items-center bg-gray-700 bg-center"
        src={data?.myRestaurant.restaurant?.coverImg}
        alt={data?.myRestaurant.restaurant?.name}
      />
      <div>
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || 'Loading...'}
        </h2>
        <Link
          to={`/restaurant/${id}/add-dish`}
          className=" mr-8 text-white bg-gray-800 py-3 px-10"
        >
          Add Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish!</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {/* Dish component에 React.FC에 대한 type을 지정해 줘서 해당 praps를 전달할 수 있다. */}
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Dish
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          )}
        </div>
        {/* Vitory set(그래프 제작) */}
        <div className="mt-20 mb-10">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className="max-w-sm w-full mx-auto">
            <VictoryChart domainPadding={20}>
              <VictoryAxis
                label={'Amount of Money'}
                dependentAxis
                tickValues={[20, 30, 40, 50, 60]}
              />
              <VictoryAxis label={'Days of Life'} />
              <VictoryBar
                data={[
                  { x: 10, y: 20 },
                  { x: 20, y: 5 },
                  { x: 35, y: 55 },
                  { x: 45, y: 99 },
                ]}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
