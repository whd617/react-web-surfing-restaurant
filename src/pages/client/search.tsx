import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from '../../gql/graphql';
import { HelmetProvider } from 'react-helmet-async';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [queryReadyToStart, { loading, data, called }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const [_, query] = location.search.split('?/term=');
    if (!query) {
      return navigate('/', { replace: true });
    }
    /*  /search에 query가 있는 경우만 다음 function 실행 */
    queryReadyToStart({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, []);

  console.log(loading, data, called);

  return (
    <h1>
      <HelmetProvider>
        <Helmet>
          <title>Search | Nuber Eats</title>
        </Helmet>
      </HelmetProvider>
      Search page
    </h1>
  );
};
