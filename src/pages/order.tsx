import { useParams } from 'react-router-dom';
import React from 'react';

type IParams = {
  id: string;
};

export const Order = () => {
  const params = useParams<IParams>();
  return <h1>{params.id}</h1>;
};
