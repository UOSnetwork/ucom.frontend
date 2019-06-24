import { useSelector } from 'react-redux';
import React from 'react';
import { getPageData } from '../../actions/mainPage';
import { TAB_ID_COMMUNITIES } from '../../components/Feed/Tabs';
import Guest from './Guest';
import UserPage from './User';
import { selectOwner } from '../../store/selectors';

const HomePage = () => {
  const owner = useSelector(selectOwner, ((prev, next) =>
    prev && next && prev.id === next.id
  ));

  return owner.id ? <UserPage /> : <Guest />;
};

export const getHomePageData = store => Promise.all([
  store.dispatch(getPageData(TAB_ID_COMMUNITIES)),
]);

export default HomePage;
