import React from 'react';
import { Link } from 'react-router-dom';

interface ICategoryProps {
  id: string;
  slug: string;
  coverImg: string;
  name: string;
}

export const CategoryComponent: React.FC<ICategoryProps> = ({
  slug,
  coverImg,
  name,
}) => {
  /* Warning: Each child in a list should have a unique "key" prop -> key 값 추가 */
  return (
    <Link to={`/category/${slug}`}>
      <div className="flex flex-col group items-center cursor-pointer">
        <div
          className=" w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
          style={{ backgroundImage: `url(${coverImg})` }}
        ></div>
        <span className="mt-1 text-sm text-center font-medium">{name}</span>
      </div>
    </Link>
  );
};
