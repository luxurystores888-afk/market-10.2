import React from 'react';
import { UserGallery } from '../components/UserGallery';
import { Helmet } from 'react-helmet';

const GalleryPage: React.FC = () => (
  <div>
    <Helmet>
      <title>Gallery - Cyber Mart 2077</title>
      <meta name="description" content="User-generated gallery of cyberpunk products" />
    </Helmet>
    <UserGallery />
  </div>
);

export default GalleryPage;
