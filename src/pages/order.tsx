import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  EditOrderMutation,
  EditOrderMutationVariables,
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderStatus,
  OrderUpdatesSubscription,
  OrderUpdatesSubscriptionVariables,
  UserRole,
} from '../gql/graphql';
import { Helmet } from 'react-helmet-async';
import { FULL_ORDER_FRAGMENT } from '../fragments';
import { useMe } from '../hooks/useMe';

type IParams = {
  id: string;
};

const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      error
      ok
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

export const Order = () => {
  const params = useParams<IParams>();
  const { data: userData } = useMe();

  const [editOrderMutation] = useMutation<
    EditOrderMutation,
    EditOrderMutationVariables
  >(EDIT_ORDER);
  const paramsId = Number(params.id);

  const { data, subscribeToMore } = useQuery<
    GetOrderQuery,
    GetOrderQueryVariables
  >(GET_ORDER, {
    variables: {
      input: {
        id: paramsId,
      },
    },
  });

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: { id: paramsId },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: OrderUpdatesSubscription } },
        ) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data]);

  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: paramsId,
          status: newStatus,
        },
      },
    });
  };

  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{params.id} | Nuber Eats</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By: {''}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            Delivery To: {''}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:{''}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || 'Not yet'}
            </span>
          </div>
          {userData?.me.role === UserRole.Client && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                  className="btn"
                >
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                  className="btn"
                >
                  Order Cooked
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                    Status: {data?.getOrder.order?.status}
                  </span>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
