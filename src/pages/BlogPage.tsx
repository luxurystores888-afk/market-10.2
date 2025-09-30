import React from 'react';
import { BlogSection } from '../components/BlogSection';
import { Helmet } from 'react-helmet';

const BlogPage: React.FC = () => (
  <div>
    <Helmet>
      <title>Blog - Cyber Mart 2077</title>
      <meta name="description" content="Latest cyberpunk e-commerce news and tips" />
    </Helmet>
    <BlogSection />
  </div>
);

export default BlogPage;
