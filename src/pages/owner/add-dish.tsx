import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
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

type Params = {
  restaurantId: string;
};

// form에는 문자열밖에 없으므로 price number를 string으로 변경
interface IForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string; // 위 필수적인 값들 제외하고 다른 값들을 얼마든지 추가하도록 설정(typescript에서 escape하는 방법)
}

export const AddDish = () => {
  const { restaurantId } = useParams<Params>();

  const navigate = useNavigate();

  const restaurantIdNum = Number(restaurantId);
  // mutation이 호출되면 refetch
  const [createDishMutation, { loading }] = useMutation<
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
    unregister,
  } = useForm<IForm>({
    mode: 'onChange',
    shouldUnregister: true,
  });
  console.log(getValues());
  const onSumit = () => {
    const { description, name, price, ...rest } = getValues();

    const optionsObject = optionsNumber.map((theId) => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
      choices: choices[theId]?.map((choiceId) => ({
        name: rest[`${theId}-optionName-${choiceId}-choiceName`],
        extra: +rest[`${theId}-optionExtra-${choiceId}-choiceExtra`],
      })),
    }));
    const good = createDishMutation({
      variables: {
        input: {
          description,
          name,
          price: +price,
          restaurantId: restaurantIdNum,
          options: optionsObject,
        },
      },
    });
    navigate(-1);
  };

  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const [choices, setChoices] = useState<{ [key: number]: number[] }>({});
  console.log(choices);
  const onAddOptionsClick = () => {
    /* Add Dish Option버튼을 클릭할 때마다 Array 형태이면서 그안에 현재 날짜로 생성 됨 */
    setOptionsNumber((current) => [Date.now(), ...current]);
  };
  /* Dish option의 option 개수 감소 */
  const onDeleteClick = (idToDelete: number) => {
    /* option input을 삭제 */
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    unregister(`${idToDelete}-optionName`);
    unregister(`${idToDelete}-optionExtra`);
  };

  const onChoiceAddOptionClick = (optionId: number) => {
    setChoices((current) => ({
      ...current,
      [optionId]: [Date.now(), ...(current[optionId] || [])],
    }));
  };

  const onChoiceDeleteClick = (optionId: number, choiceId: number) => {
    /* option input을 삭제 */
    setChoices((current) => ({
      ...current,
      [optionId]: current[optionId].filter((id) => id !== choiceId),
    }));
    unregister(`${optionId}-optionName-${choiceId}-choiceName`);
    unregister(`${optionId}-optionExtra-${choiceId}-choiceExtra`);
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
          <span
            onClick={onAddOptionsClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 "
          >
            Add Dish Option
          </span>
          {/* optionsNumber가 1이면, 이 코드는 슬롯이 1개인 비어있는 array가 생성 */}
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  {...register(`${id}-optionName`)}
                  className="py-2 px-4 focus:outline-none mr-3 focus:border-red-600 border-2"
                  type="text"
                  placeholder="Option Name"
                />
                <input
                  {...register(`${id}-optionExtra`)}
                  className="py-2 px-4 focus:outline-none focus:border-red-600 border-2"
                  type="number"
                  placeholder="Option Extra"
                />

                <span
                  className="text-sm cursor-pointer text-white bg-red-500 ml-2 py-3 px-1 rounded-sm"
                  onClick={() => onChoiceAddOptionClick(id)}
                >
                  Add Choice
                </span>
                <span
                  className="cursor-pointer text-sm text-white bg-red-500 ml-2 py-3 px-1 rounded-sm"
                  onClick={() => onDeleteClick(id)}
                >
                  Delete Option
                </span>

                {choices[id] &&
                  choices[id].map((choiceId) => (
                    <div key={choiceId} className="mt-5">
                      <input
                        {...register(`${id}-optionName-${choiceId}-choiceName`)}
                        className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                        type="text"
                        placeholder="Choice Name"
                      />
                      <input
                        {...register(
                          `${id}-optionExtra-${choiceId}-choiceExtra`,
                        )}
                        className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                        type="number"
                        placeholder="Choice Extra"
                      />
                      <span
                        className="cursor-pointer text-sm text-white bg-gray-500 ml-2 py-3 px-1 rounded-sm"
                        onClick={() => onChoiceDeleteClick(id, choiceId)}
                      >
                        Delete Choice
                      </span>
                    </div>
                  ))}
                {/* onClick={onDeleteClick(id)} 이렇게 사용하게 되면은 즉시 onDeleteClick 함수가 동작하므로 아래와 같이 작성 */}
              </div>
            ))}
        </div>
        <Button loading={loading} canClick={isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
