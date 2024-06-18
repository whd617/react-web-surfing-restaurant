import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import {
  CreateRestaurantMutation,
  CreateRestaurantMutationVariables,
} from '../../gql/graphql';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { Helmet } from 'react-helmet-async';
import { FormError } from '../../components/form-error';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

const CREATE_RESTAURANT = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      // 레스토랑 생성 후 동작
      setUploading(false);
      // fake
    }
  };

  const [createRestaurantMutation, { loading, data }] = useMutation<
    CreateRestaurantMutation,
    CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT, {
    onCompleted,
    // query를 다시 fetch
    refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
  });

  const {
    register,
    formState: { errors, isValid },
    getValues,
    handleSubmit,
  } = useForm<IFormProps>({
    mode: 'onChange',
  });
  // form 작성후 submit을 누르면 파일을 업로드하고, url도 받아야하므로 그에 대한 기다리기 위한 처리
  const [uploading, setUploading] = useState(false);

  const onSubmit = async () => {
    try {
      // 업로드가 시작되면 setUploading(true)가 됨
      setUploading(true);
      // fetch를 통한 file upload
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append('file', actualFile);
      const { url: coverImg } = await (
        await fetch('http://localhost:4000/uploads', {
          method: 'POST',
          body: formBody,
        })
      ).json();

      // createRestaurant Mutation 적용
      createRestaurantMutation({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImg,
          },
        },
      });
    } catch (e) {}
  };

  return (
    <div>
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h1>Add Restaurant</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input"
          {...register('name', { required: 'Name is required.' })}
          name="name"
          placeholder="Name"
          type="text"
        />
        <input
          className="input"
          {...register('address', { required: 'Address is required.' })}
          name="address"
          placeholder="Address"
          type="text"
        />
        <input
          className="input"
          {...register('categoryName', {
            required: 'Category Name is required.',
          })}
          name="categoryName"
          placeholder="Category Name"
          type="text"
        />
        <div>
          {/* accept="image/*": file을 받아올 때 형식을 image로 함 */}
          <input
            type="file"
            accept="image/*"
            {...register('file', { required: true })}
          />
        </div>
        {/* 업로드가 끝나면 setUploading(false)가 됨 */}
        <Button
          loading={uploading}
          canClick={isValid}
          actionText="Create Restaurant"
        />
      </form>
      {/* 만약 create restaurant 실패시 해당 error 처리 */}
      {data?.createRestaurant?.error && (
        <FormError errorMessage={data.createRestaurant.error} />
      )}
    </div>
  );
};
