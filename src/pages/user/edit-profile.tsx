import React from 'react';
import { useMe } from '../../hooks/useMe';
import { Button } from '../../components/button';
import { useForm } from 'react-hook-form';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import {
  EditProfileMutation,
  EditProfileMutationVariables,
} from '../../gql/graphql';

/* Edit Profile Mutation 작성법 */
const EDIT_PROFILE = gql`
  mutation editProfile($input: EidtProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  /* userData의 cache 에 접근할 수 있는 wrapHook(만약 cache에 없으면 API에 직접 접근)  */
  const { data: userData, refetch } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: EditProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      // update the cache
      const {
        me: { email: prevEmail, id },
      } = userData;

      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        /* fragment를 write하는 부분 */
        client.writeFragment({
          /* id의 값을 string으로 바꾸는 방법 */
          id: `User:${id}`,
          /* fragment를 통해 우리가 User entity type 중에서 어떤 값을 Update하고 싶은지를 선언 */
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          /* fragment로 선언한 값을 data로 send */
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };
  const [editProfile, { loading }] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_PROFILE, { onCompleted });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<IFormProps>({
    // validation을 handling하는 방법
    mode: 'onChange',
    // input의 default value 값 넣기
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    console.log({
      email,
      // password가 빈 string일 수 있기 때문에 conditional을 사용
      ...(password !== '' && { password }),
    });
    editProfile({
      variables: {
        input: {
          email,
          // password가 빈 string일 수 있기 때문에 conditional을 사용
          // password가 빈 string과 같지 않으면 password가 포함된 object를 return하고 object를 풀어라
          ...(password !== '' && { password }),
        },
      },
    });
  };
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          {...register('email', {
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          className="input"
          type="email"
          name="email"
          placeholder="email"
        />
        <input
          {...register('password')}
          className="input"
          type="password"
          placeholder="password"
        />
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Save Profile"
        />
      </form>
    </div>
  );
};
