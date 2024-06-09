import React from 'react';
import { useMe } from '../../hooks/useMe';
import { Button } from '../../components/button';

export const EditProfile = () => {
  /* userData의 cache 에 접근할 수 있는 wrapHook(만약 cache에 없으면 API에 직접 접근)  */
  const { data: userData } = useMe();
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
        <input
          className="input"
          type="email"
          name="email"
          placeholder="email"
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="password"
        />
        <Button loading={false} canClick={true} actionText="Save Profile" />
      </form>
    </div>
  );
};
