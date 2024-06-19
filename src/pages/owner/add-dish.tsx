import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CreateDishMutation,
  CreateDishMutationVariables,
} from '../../gql/graphql';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { MY_RESTAURANT_QUERY } from './my-restaurant';

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

// form에는 문자열밖에 없으므로 price number를 string으로 변경
interface IForm {
  name: string;
  price: string;
  description: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<Prams>();

  const navigate = useNavigate();

  const restaurantIdNum = Number(restaurantId);
  // mutation이 호출되면 refetch
  const [createDishMutation, { data, error, loading }] = useMutation<
    CreateDishMutation,
    CreateDishMutationVariables
  >(CREATE_DISH_MUTATION, {
    /* query refetch 시 해당 query가 input 이필요하면 variables를 넣어주자. */
    /* 변수들을 사용해서 query를 refetch 하는 방법 */
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: restaurantIdNum,
          },
        },
      },
    ],
  });

  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
  } = useForm<IForm>({
    mode: 'onChange',
  });

  const onSumit = () => {
    const { description, name, price } = getValues();
    const foodPrice = Number(price);
    createDishMutation({
      variables: {
        input: {
          description,
          name,
          price: foodPrice,
          restaurantId: restaurantIdNum,
        },
      },
    });
    // navigate로 Mutation처리 후 뒤로가기 기능 구현
    navigate(-1);
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSumit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          placeholder="Name"
          {...register('name', { required: 'Name is required.' })}
        />
        <input
          className="input"
          type="number"
          min={0}
          placeholder="Price"
          {...register('price', { required: 'Price is required.' })}
        />
        <input
          className="input"
          type="text"
          placeholder="Description"
          {...register('description', { required: 'Description is required.' })}
        />
        <div>
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 ">
            Add Dish Option
          </span>
        </div>
        <Button loading={loading} canClick={isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
