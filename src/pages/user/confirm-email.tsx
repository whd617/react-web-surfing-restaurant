import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import {
  VerifyEmailMutation,
  VerifyEmailMutationVariables,
} from '../../gql/graphql';
import { useMe } from '../../hooks/useMe';
import { useNavigate } from 'react-router-dom';

const VERIFFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const navigate = useNavigate();
  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      /* fragment를 write하는 부분 */
      client.writeFragment({
        /* id의 값을 string으로 바꾸는 방법 */
        id: `User:${userData.me.id}`,
        /* fragment를 통해 우리가 User entity type 중에서 어떤 값을 Update하고 싶은지를 선언 */
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        /* fragment로 선언한 값을 data로 send */
        data: {
          verified: true,
        },
      });
      /* verify후 home으로 이동 */
      navigate('/', { replace: true });
    }
  };
  const [verifyEmail] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFFY_EMAIL_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    const [_, code] = window.location.href.split('code=');
    console.log(code);
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
