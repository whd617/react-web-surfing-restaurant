import { gql, useApolloClient, useMutation } from '@apollo/client';
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
import { client } from '../../apollo';
import { useNavigate } from 'react-router-dom';

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
  const client = useApolloClient();
  // 이미지를 업로드했을 때 해당 url을 variables와 공유
  // restaurant의 fake 버전에서 업로드된 이미지를 사용하기 위함
  const [imageUrl, setImageUrl] = useState('');

  //기존 "/" page으로 redirect
  const navigate = useNavigate();

  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { file, name, categoryName, address } = getValues();
      // 레스토랑 생성 후 동작
      setUploading(false);
      // fake
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      // cache의 현재 state를 읽기
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          // myRestaurants를 반환, 기존의 myRestaurants와 새로운 restaurants array가 존재
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  // typename은 기존 data와 동일하게 유지
                  __typename: 'Category',
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                // typename은 기존 data와 동일하게 유지
                __typename: 'Restaurant',
              },

              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      navigate('/');
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
      setImageUrl(coverImg);
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
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h1 className="font-semibold text-2xl mb-3">Add Restaurant</h1>
      <form
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
        onSubmit={handleSubmit(onSubmit)}
      >
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
