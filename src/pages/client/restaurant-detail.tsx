import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
  CreateOrderItemInput,
  CreateOrderMutation,
  CreateOrderMutationVariables,
  RestaurantQuery,
  RestaurantQueryVariables,
} from '../../gql/graphql';
import { Dish } from '../../components/dish';
import { DishOption } from '../../components/dish-option';

type TRestaurantParams = {
  id: string;
};

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      error
      ok
      orderId
    }
  }
`;

export const RestaurantDetail = () => {
  const params = useParams() as TRestaurantParams;
  const { data, loading, error } = useQuery<
    RestaurantQuery,
    RestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +params.id,
      },
    },
  });

  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

  const triggerStartOrder = () => {
    setOrderStarted(true);
  };

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };

  const isSelected = (dishId: number) => {
    // find()는 find한 object를 return
    // order의 dishId 중에 우리가 추가하려는 dishId와 동일한게 있는 지 찾고
    // 만일 찾았다면 아무것도 반환하지 않는다.
    return Boolean(getItem(dishId));
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) => {
      return current.filter((dish) => dish.dishId !== dishId);
    });
  };

  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };

  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }

    const oldItem = getItem(dishId);
    if (oldItem) {
      // 중복돈 option 클릭을 제외하기 위한 로직
      const hasOption = Boolean(
        oldItem.options?.find((aOption) => aOption.name === optionName),
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        // state를 mutation하지 않기 위해서 한번더setOrderItems호출하는데 이때는 options가 추가로 들어감
        // 항상 새 state를 만들고 return해야 한다.
        setOrderItems((current) => [
          // !: typescript에게 날 믿으로가 말하는 것(많이 쓰지는 말것)
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...current,
        ]);
      }
    }
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      // state를 mutation하지 않기 위해서 한번더setOrderItems호출하는데 이때는 options가 추가로 들어감
      // 항상 새 state를 만들고 return해야 한다.
      setOrderItems((current) => [
        // !: typescript에게 날 믿으로가 말하는 것(많이 쓰지는 말것)
        {
          dishId,
          //filter는 조건을 만족하는 element들을 모아 array로 return
          options: oldItem.options?.filter(
            (option) => option.name !== optionName,
          ),
        },
        ...current,
      ]);
      return;
    }
  };

  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string,
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };

  // option이 선택됐는지 알려주는 로직
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };

  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };

  const navigate = useNavigate();

  const onCompleted = (data: CreateOrderMutation) => {
    const {
      createOrder: { ok, error, orderId },
    } = data;
    if (data.createOrder.ok) {
      navigate(`/order/${orderId}`);
    }
  };

  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });

  const triggerConfirmOrder = () => {
    if (placingOrder) {
      return;
    }
    if (orderItems.length === 0) {
      alert("Can't place emty order");
      return;
    }
    const ok = window.confirm('You are about to place an order');
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
  };

  return (
    <div>
      <img
        src={data?.restaurant.restaurant?.coverImg}
        alt={data?.restaurant.restaurant?.name}
        className=" w-full object-cover h-96 mx-auto flex flex-col items-center bg-gray-700 bg-center"
      />
      <div className="bg-white w-3/12 py-8 pl-48">
        <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
        <h5 className="text-sm font-light mb-2">
          {data?.restaurant.restaurant?.category?.name}
        </h5>
        <h6 className="text-sm font-light ">
          {data?.restaurant.restaurant?.address}
        </h6>
      </div>
      <div className="container pb-32 flex flex-col items-end mt-20">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-10">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center ">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
              Confirm Order
            </button>
            <button
              onClick={triggerCancelOrder}
              className="btn px-10 bg-black hover:bg-black"
            >
              Cancel Order
            </button>
          </div>
        )}

        <div className="w-full  grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {/* Dish component에 React.FC에 대한 type을 지정해 줘서 해당 praps를 전달할 수 있다. */}
          {data?.restaurant.restaurant?.menu.map((dish, index) => (
            <Dish
              id={dish.id}
              isSelected={isSelected(dish.id)}
              orderStarted={orderStarted}
              key={index}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer={true}
              options={dish.options}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
              addOptionToItem={addOptionToItem}
            >
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  dishId={dish.id}
                  addOptionToItem={addOptionToItem}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  extra={option.extra}
                  name={option.name}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
