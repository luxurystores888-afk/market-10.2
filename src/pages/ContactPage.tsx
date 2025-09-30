import React from 'react';
import { ContactForm } from '../components/ContactForm';
import { Helmet } from 'react-helmet';

const ContactPage: React.FC = () => (
  <div>
    <Helmet>
      <title>Contact - Cyber Mart 2077</title>
      <meta name="description" content="Get in touch with our support team" />
    </Helmet>
    <ContactForm />
  </div>
);

export default ContactPage;
