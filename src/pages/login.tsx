import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import { gql, useMutation } from '@apollo/client';
import { LoginMutation, LoginMutationVariables } from '../gql/graphql';
import nuberLogo from '../images/logo.svg';
import { Button } from '../components/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';

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
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ILoginForm>({
    mode: 'onChange',
  });

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      // localStorage에 token 설정
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      // authToken: reactiv variable(apollo.ts)에 token을 업데이트
      authTokenVar(token);
      // isLoggedInVar: reactiv variable(apollo.ts)도 업데이트
      isLoggedInVar(true);
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
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | NuberEats</title>
      </Helmet>
      {/*  login 화면 CSS설정(핸드폰) */}
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-5" />
        <h4 className="font-medium w-full text-left text-3xl mb-10 ">
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <input
            {...register('email', {
              required: 'Email is required',
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            required
            name="email"
            type="email"
            placeholder="Eamil"
            className="input"
          />

          {errors.email?.message && (
            /* Function을 통한 error 처리하는 방법  */
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === 'pattern' && (
            /* Function을 통한 error 처리하는 방법  */
            <FormError errorMessage={'Please enter a valid email'} />
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
          <Button canClick={isValid} loading={loading} actionText={'Log in'} />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to nuber?{' '}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Crate an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
