import { gql } from '@apollo/client';

// on 부분은 backend의 entity 부분과 동일해야 한다.
export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantParts on Restaurant {
    id
    name
    coverImg
    category {
      name
    }
    address
    isPromoted
  }
`;

// on 부분은 backend의 entity 부분과 동일해야 한다.
export const CATEGORY_FRAGMENT = gql`
  fragment CategoryParts on Category {
    id
    name
    coverImg
    slug
    restaurantCount
  }
`;

export const DISH_FRAGMENT = gql`
  fragment DishParts on Dish {
    id
    name
    price
    photo
    description
    options {
      name
      choices {
        name
        extra
      }
      extra
    }
  }
`;

// Chart를 위한 fragment
export const ORDERS_FRAGMENT = gql`
  fragment OrderParts on Order {
    id
    createdAt
    total
  }
`;
