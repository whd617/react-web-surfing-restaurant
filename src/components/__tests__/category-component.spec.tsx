import React from 'react';
import { CategoryComponent } from '../category-component';
import { render, screen } from '../../test-utils';

describe('<CategoryComponent />', () => {
  it('should render OK with Props', async () => {
    render(
      <CategoryComponent
        id="1"
        coverImg="xxx"
        name="categoryName"
        slug="categorySlug"
      />,
    );
    screen.getByText('categoryName');
  });
});
