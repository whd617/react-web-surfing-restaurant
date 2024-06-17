import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { gql, useQuery } from '@apollo/client';
import { CateogoryQuery, CateogoryQueryVariables } from '../../gql/graphql';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { CategoryComponent } from '../../components/category-component';
import { Restaurant } from '../../components/restaurant';

interface IFormProps {
  searchTerm: string;
}

type Params = {
  slug: string;
};

export const CATEGORY_QUERY = gql`
  query cateogory($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

export const Category = () => {
  const [page, setPage] = useState(1);
  const params = useParams<Params>();
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const { data, loading } = useQuery<CateogoryQuery, CateogoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page,
          slug: params.slug + '',
        },
      },
    },
  );
  const onPrevPageClick = () => setPage((current) => current - 1);
  const onNextPageClick = () => setPage((current) => current + 1);

  const navigate = useNavigate();

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    navigate({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Category | Nuber Eats</title>
      </Helmet>
      <form
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
        onSubmit={handleSubmit(onSearchSubmit)}
      >
        <input
          {...register('searchTerm', { required: true, min: 3 })}
          className="search-input"
          type="Search"
          required
          placeholder="Search restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="flex justify-around max-w-sm mx-auto">
            <CategoryComponent
              coverImg={data?.category.category?.coverImg + ''}
              id={data?.category.category?.id + ''}
              name={data?.category.category?.name + ''}
              slug={data?.category.category?.slug + ''}
              key={data?.category.category?.id}
            />
          </div>
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.category.restaurants?.map((restaurant) => (
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
              <button
                className="focus:outline-none font-medium text-2xl"
                onClick={onPrevPageClick}
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span>
              Page {page} of {data?.category.totalPages}
            </span>
            {page !== data?.category.totalPages ? (
              <button
                className="focus:outline-none font-medium text-2xl"
                onClick={onNextPageClick}
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
