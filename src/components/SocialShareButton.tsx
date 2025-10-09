import React from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

const SocialShareButton = ({ url, title }) => {
  return (
    <div>
      <FacebookShareButton url={url} quote={title} />
      <TwitterShareButton url={url} title={title} />
    </div>
  );
};

export default SocialShareButton;
