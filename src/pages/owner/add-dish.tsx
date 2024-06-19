import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from '../../gql/graphql';

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      error
      ok
    }
  }
`;

type Prams = {
  restaurantId: string;
};

export const AddDish = () => {
  const { restaurantId } = useParams<Prams>();
  const [createDishMutation, { data, error, loading }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH_MUTATION);
  console.log(restaurantId);
  return <h1>a</h1>;
};
