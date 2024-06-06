import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import { gql, useMutation } from '@apollo/client';
import { LoginMutation, LoginMutationVariables } from '../gql/graphql';

/* mutation 적용하기 */
const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginForm>();

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };

  // codegen을 활용한 type 검증
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    /* 프론트엔드에서 로그인 버튼을 1번만 클릭하게 설정(로딩중이 아닐때 만 해당 로직 진행) */
    if (!loading) {
      const { email, password } = getValues();
      /* mutation에 변수추가하기 */
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
        <h3 className=" text-3xl text-gray-800">Log in</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <input
            {...register('email', { required: 'Email is required' })}
            required
            name="email"
            type="email"
            placeholder="Eamil"
            className="input "
          />

          {errors.email?.message && (
            /* Function을 통한 error 처리하는 방법  */
            <FormError errorMessage={errors.email?.message} />
          )}

          <input
            {...register('password', {
              required: 'Password is required',
            })}
            required
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />

          {errors.password?.message && (
            /* Function을 통한 error 처리하는 방법  */
            <FormError errorMessage={errors.password?.message} />
          )}

          {errors.password?.type === 'minLength' && (
            /* Function을 통한 error 처리하는 방법  */
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <button className="btn mt-3">
            {loading ? 'Loading...' : 'Log In'}
          </button>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};
