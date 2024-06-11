import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from '../../gql/graphql';
import { Restaurant } from '../../components/restaurant';

/* 다중으로 query 지정하는 방법 */
const RESTAURANTS_QUERY = gql`
  query restaurantsPage($input: RestaurantsInput!) {
    allCategories {
      error
      ok
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }

    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurants = () => {
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  // pagination시 다음 page로 넘겨주는 function
  const onNextPageClick = () => {
    setPage((current) => current + 1);
  };

  // pagination시 이전 page로 넘겨주는 function
  const onPrevPageClick = () => {
    setPage((current) => current - 1);
  };

  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center ">
        <input
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search restaurants..."
        />
      </form>
      {!loading && (
        /* 레스토랑과 카테고리의 container */
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          {/* 카테고리만의 container */}
          <div className="flex justify-around max-w-sm  mx-auto ">
            {data?.allCategories.categories?.map((category) => (
              <div className="flex flex-col group items-center cursor-pointer">
                <div
                  className="w-14 h-14 bg-cover rounded-full group-hover:bg-gray-100"
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                ></div>
                <span className="mt-1 text-sm text-center font-medium">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid  mt-6 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                id={restaurant.id + ''}
                coverImg={restaurant.coverImg}
                categoryName={restaurant.category?.name}
                name={restaurant.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center item-center mx-auto max-w-md mt-10">
            {page > 1 ? (
              <button
                onClick={onPrevPageClick}
                className="focus:outline-none font-medium text-2xl"
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}

            <span>
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                onClick={onNextPageClick}
                className="focus:outline-none font-medium text-2xl"
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
