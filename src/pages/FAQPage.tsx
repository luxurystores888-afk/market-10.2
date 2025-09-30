import React from 'react';
import { FAQSection } from '../components/FAQSection';
import { Helmet } from 'react-helmet';

const FAQPage: React.FC = () => (
  <div>
    <Helmet>
      <title>FAQ - Cyber Mart 2077</title>
      <meta name="description" content="Frequently asked questions about our cyberpunk e-commerce platform" />
    </Helmet>
    <FAQSection />
  </div>
);

export default FAQPage;
