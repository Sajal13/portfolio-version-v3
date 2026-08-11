import React from 'react';
import { Metadata } from 'next';
import BlogsContainer from 'components/pages/blogs';

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'Blogs page'
};

const BlogPage = async () => {
  return <BlogsContainer />;
};

export default BlogPage;
