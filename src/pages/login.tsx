import React from 'react';
import { useForm } from 'react-hook-form';

interface ILoginForm {
  email?: string;
  password?: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginForm>();

  const onSubmit = () => {
    console.log(getValues());
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
            <span className="font-medium text-red-500">
              {errors.email?.message}
            </span>
          )}

          <input
            {...register('password', {
              required: 'Password is required',
              minLength: 10,
            })}
            required
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />

          {errors.password?.message && (
            <span className="font-medium text-red-500">
              {errors.password?.message}
            </span>
          )}

          {errors.password?.type === 'minLength' && (
            <span className="font-medium text-red-500">
              Password must be more than 10 chars.
            </span>
          )}

          <button className="btn mt-3">Log In</button>
        </form>
      </div>
    </div>
  );
};
