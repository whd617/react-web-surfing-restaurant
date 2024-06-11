import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import { gql, useMutation } from '@apollo/client';
import nuberLogo from '../images/logo.svg';
import { Button } from '../components/button';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
  UserRole,
} from '../gql/graphql';

/* mutation 적용하기 */
const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

/* Backend에서 지정한 role의 enum type을 불러오고 다음 createAcount의 interface type을 지정 */
interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ICreateAccountForm>({
    mode: 'onBlur',
    /* Role의 기본값 설정하기 */
    defaultValues: {
      role: UserRole.Client,
    },
  });

  // page redirect 시키기
  const navigate = useNavigate();

  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (ok) {
      /* 로그인 페이지로 이동했다는 것을 알려주기 */
      alert('Account Created! Log in now!');
      navigate('/', { replace: true });
    }
  };

  // codegen을 활용한 type 검증
  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    },
  );

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <HelmetProvider>
        <Helmet>
          <title>Create Account | NuberEats</title>
        </Helmet>
      </HelmetProvider>
      {/*  login 화면 CSS설정(핸드폰) */}
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-5" />
        <h4 className="font-medium w-full text-left text-3xl mb-10 ">
          Let's get started
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
          {/* UserRole 선택하기 */}
          <select
            {...register('role', { required: true })}
            name="role"
            className="input"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={isValid}
            loading={loading}
            actionText={'Create Account'}
          />
          {/* 계정 생성시 error처리 */}
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account?{' '}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};
