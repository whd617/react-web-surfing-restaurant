import { gql, useQuery } from '@apollo/client';
import React from 'react';
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from '../../gql/graphql';
import { url } from 'inspector';

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
  const { data, loading } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
  });
  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center ">
        <input
          type="Search"
          className="input rounded-md border-0 w-3/12"
          placeholder="Search restaurants..."
        />
      </form>
      {!loading && (
        /* 레스토랑과 카테고리의 container */
        <div className="max-w-screen-2xl mx-auto mt-8">
          {/* 카테고리만의 container */}
          <div className="flex justify-around max-w-sm mx-auto ">
            {data?.allCategories.categories?.map((category) => (
              <div className="flex flex-col items-center cursor-pointer">
                <div
                  className="w-14 h-14 bg-cover rounded-full hover:bg-gray-100"
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                ></div>
                <span className="mt-1 text-sm text-center font-medium">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
