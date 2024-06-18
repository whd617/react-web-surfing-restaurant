import React, { useEffect } from 'react';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import { MyRestaurantsQuery } from '../../gql/graphql';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);
  const client = useApolloClient();
  useEffect(() => {
    // cache의 현재 state를 읽기
    const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
    client.writeQuery({
      query:MY_RESTAURANTS_QUERY,
      data:{
        ...queryResult,
        restaurants:
      }
    })
  }, []);
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok &&
        data?.myRestaurants.restaurants?.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link className="link" to="/add-restaurant">
              Create one &rarr;
            </Link>
          </>
        ) : (
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.myRestaurants?.restaurants?.map((restaurant) => (
              <div>
                <Restaurant
                  key={restaurant.id}
                  id={restaurant.id + ''}
                  coverImg={restaurant.coverImg}
                  name={restaurant.name}
                  categoryName={restaurant.category?.name}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
