import api from '../api';
import loader from '../utils/loader';

export const setDiscussions = ({
  organizationId,
  discussions,
}) => async () => {
  loader.start();
  try {
    if (discussions.length) {
      await api.setDiscussions(organizationId, { discussions });
    } else {
      await api.deleteAllDiscussions(organizationId);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
  loader.done();
};
