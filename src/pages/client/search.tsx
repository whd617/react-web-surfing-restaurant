import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from '../../gql/graphql';
import { useForm } from 'react-hook-form';
import { Restaurant } from '../../components/restaurant';

interface IFormProps {
  searchTerm: string;
}

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
  const [page, setPage] = useState(1);
  const [queryReadyToStart, { loading, data }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT);

  const { register, handleSubmit, getValues } = useForm<IFormProps>();

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    navigate({ pathname: '/search', search: `?term=${searchTerm}` });
  };

  useEffect(() => {
    const [_, query] = location.search.split('?term=');
    if (!query) {
      return navigate('/', { replace: true });
    }
    /*  /search에 query가 있는 경우만 다음 function 실행 */
    queryReadyToStart({
      variables: {
        input: {
          page,
          query,
        },
      },
    });
  }, [location, page]);

  const onNextPage = () => {
    setPage((current) => current + 1);
  };

  const onPrevPage = () => {
    setPage((current) => current - 1);
  };

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <form className="search-bg" onSubmit={handleSubmit(onSearchSubmit)}>
        <input
          {...register('searchTerm', { required: true })}
          type="Search"
          className="search-input"
          required
          placeholder="Search restaurants..."
        />
      </form>
      <div className="flex flex-col ">
        {data?.searchRestaurant.totalResults === 0 && (
          <div className="w-full flex-grow flex justify-center mt-8 md:mt-32">
            <h1 className="text-xl font-bold">Does not exits...</h1>
          </div>
        )}
      </div>
      {!loading && data?.searchRestaurant.totalResults !== 0 && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.searchRestaurant.restaurants?.map((restaurant) => (
              <Restaurant
                coverImg={restaurant.coverImg}
                id={restaurant.id + ''}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
                key={restaurant.id}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
            {page > 1 ? (
              <button onClick={onPrevPage}>&larr;</button>
            ) : (
              <div></div>
            )}
            <span>
              Page {page} of {data?.searchRestaurant.totalPages}
            </span>
            {page !== data?.searchRestaurant.totalPages ? (
              <button onClick={onNextPage}>&rarr;</button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
