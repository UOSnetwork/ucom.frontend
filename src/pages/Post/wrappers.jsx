import React from 'react';
import Post from './index';

export const DefaultPost = ({ match }) => (
  <Post postId={match.params.postId} />
);
