import HomePage, { getHomePageData } from './pages/Home';
import UserPage, { getUserPageData } from './pages/User/index';
import EditPostPage from './pages/EditPost';
import PostPage, { PostEosPage, getPostPageData, getPostEosPageData } from './pages/Post';
import OverviewPage, { getPageData } from './pages/Overview';
import Offer, { getPostOfferData } from './pages/Offer';
import Offer2, { getPostOfferData_2 } from './pages/Offer2';
import UsersPage from './pages/Users';
import AboutPage from './pages/About';
import OrganizationsPage from './pages/Organizations';
import OrganizationsCreatePage from './pages/OrganizationsCreate';
import OrganizationPage from './pages/Organization';
import NotFoundPage from './pages/NotFoundPage';
import RegistrationPage from './components/Registration/Registration';
import GovernancePage from './components/Governance/Governance';
import Tag from './pages/Tag';
import Faq from './pages/Faq';
import Statistics from './pages/Statistics';
import { getAirdropOfferId_1, getAirdropOfferId_2 } from './utils/airdrop';

const airdropOfferId_1 = getAirdropOfferId_1();
const airdropOfferId_2 = getAirdropOfferId_2();

export default [{
  exact: true,
  path: '/',
  component: HomePage,
  getData: getHomePageData,
}, {
  exact: true,
  path: '/overview/:route/filter/:filter',
  component: OverviewPage,
  getData: getPageData,
}, {
  exact: true,
  path: '/overview/:route/filter/:filter/page/:page',
  component: OverviewPage,
  getData: getPageData,
}, {
  exact: false,
  path: '/user/:userId',
  component: UserPage,
  getData: getUserPageData,
}, {
  exact: true,
  path: '/user/:userId/:postId',
  component: UserPage,
  getData: getUserPageData,
}, {
  exact: true,
  path: '/user/:userId/profile',
  component: UserPage,
  getData: getUserPageData,
}, {
  exact: true,
  path: '/posts/new',
  component: EditPostPage,
}, {
  exact: true,
  path: '/posts/:id/edit',
  component: EditPostPage,
}, {
  exact: true,
  path: `/posts/${airdropOfferId_1}`,
  component: Offer,
  getData: getPostOfferData,
}, {
  exact: true,
  path: `/posts/${airdropOfferId_2}`,
  component: Offer2,
  getData: getPostOfferData_2,
}, {
  exact: true,
  path: '/github',
  component: Offer2,
  getData: getPostOfferData_2,
}, {
  exact: true,
  path: '/eos',
  component: PostEosPage,
  getData: getPostEosPageData,
}, {
  exact: true,
  path: '/posts/:postId',
  component: PostPage,
  getData: getPostPageData,
}, {
  exact: true,
  path: '/registration',
  component: RegistrationPage,
}, {
  exact: true,
  path: '/users',
  component: UsersPage,
}, {
  exact: true,
  path: '/about',
  component: AboutPage,
}, {
  exact: true,
  path: '/about/:page',
  component: AboutPage,
}, {
  exact: true,
  path: '/communities',
  component: OrganizationsPage,
}, {
  exact: true,
  path: '/communities/new',
  component: OrganizationsCreatePage,
}, {
  exact: false,
  path: '/communities/:id',
  component: OrganizationPage,
}, {
  exact: true,
  path: '/communities/:id/:postId',
  component: OrganizationPage,
}, {
  exact: true,
  path: '/communities/:id/profile',
  component: OrganizationPage,
}, {
  exact: true,
  path: '/communities/:organizationId/discussions/new',
  component: EditPostPage,
}, {
  exact: true,
  path: '/governance',
  component: GovernancePage,
}, {
  exact: true,
  path: '/tags/:title',
  component: Tag,
}, {
  exact: true,
  path: '/faq',
  component: Faq,
},
{
  exact: true,
  path: '/stats',
  component: Statistics,
},
{
  exact: true,
  path: '*',
  component: NotFoundPage,
}];
