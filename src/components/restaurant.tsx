import React from 'react';
import { Link } from 'react-router-dom';

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImg,
  name,
  categoryName,
}) => {
  return (
    <Link to={`restaurant/${id}`}>
      <div className="flex flex-col">
        {/* <div
          style={{ backgroundImage: `url(${coverImg})` }}
          className="bg-cover bg-center mb-3 py-28"
        ></div> */}
        <img
          className="mb-3 object-cover h-64"
          src={coverImg}
          alt={categoryName}
        />
        <h3 className="text-xl font-bold">{name}</h3>
        <span className="border-t mt-2 py-2 text-xs opacity-50 border-gray-400">
          {categoryName}
        </span>
      </div>
    </Link>
  );
};
