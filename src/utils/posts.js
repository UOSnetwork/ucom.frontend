export const UPVOTE_STATUS = 'upvote';
export const DOWNVOTE_STATUS = 'downvote';

export const POST_TYPES = [{
  id: 1,
  description: 'Story',
}, {
  id: 2,
  description: 'Challenge',
}, {
  id: 3,
  description: 'Poll',
}, {
  id: 4,
  description: 'News',
}, {
  id: 5,
  description: 'Trading Forecast',
}, {
  id: 6,
  description: 'Review',
}, {
  id: 7,
  description: 'Analytics',
}, {
  id: 8,
  description: 'Interview',
}];

export const getPostUrl = (postId) => {
  if (postId) {
    return `/posts/${postId}`;
  }

  return null;
};

export const getPostEditUrl = (postId) => {
  if (postId) {
    return `/posts/${postId}/edit`;
  }

  return null;
};

export const getRulesByPostTypeId = (postTypeId) => {
  switch (postTypeId) {
    case 2:
      return {
        title: 'required',
        leading_text: 'required',
        description: 'required',
        action_button_title: 'required',
        action_button_url: 'required|url',
        action_duration_in_days: 'required|numeric',
        main_image_filename: 'required',
      };
    default:
      return {
        title: 'required',
        leading_text: 'required',
        description: 'required',
        main_image_filename: 'required',
      };
  }
};
