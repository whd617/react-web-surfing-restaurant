import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { gql, useQuery } from '@apollo/client';
import { CateogoryQuery, CateogoryQueryVariables } from '../../gql/graphql';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';

interface IFormProps {
  searchTerm: string;
}

type Params = {
  slug: string;
};

const CATEGORY_QUERY = gql`
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
  console.log(data?.category.category);
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  const navigate = useNavigate();

  const onSubmit = () => {
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
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register('searchTerm', { required: true, min: 3 })}
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          type="Search"
          placeholder="Search restaurants..."
        />
      </form>
    </div>
  );
};
