import { GraphQLSchema } from 'ucom-libs-graphql-schemas';
import humps from 'lodash-humps';
import * as axios from 'axios';
import snakes from '../utils/snakes';
import { getBackendConfig } from '../utils/config';
import { getToken } from '../utils/token';
import { COMMENTS_PER_PAGE } from '../utils/comments';
import { FEED_PER_PAGE, OVERVIEW_SIDE_PER_PAGE } from '../utils/feed';
import { NODES_PER_PAGE } from '../utils/governance';
import { LIST_ORDER_BY, LIST_PER_PAGE } from '../utils/list';

const { Dictionary } = require('ucom-libs-wallet');

const request = async (data, extraOptions = {}) => {
  let options = {
    headers: {},
    withCredentials: true,
    baseURL: getBackendConfig().httpEndpoint,
  };

  const token = getToken();

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  options = {
    ...options,
    ...extraOptions,
    headers: {
      ...options.headers,
      ...extraOptions.headers,
    },
  };

  try {
    const resp = await axios.post('/graphql', data, options);
    if (resp.data.errors) {
      throw resp;
    }
    return humps(resp.data);
  } catch (e) {
    throw e;
  }
};

export default {
  async getUserPageData({
    userIdentity,
    trustedByOrderBy = LIST_ORDER_BY,
    trustedByPerPage = LIST_PER_PAGE,
    trustedByPage = 1,
    followsOrganizationsOrderBy = LIST_ORDER_BY,
    followsOrganizationsPerPage = LIST_PER_PAGE,
    followsOrganizationsPage = 1,
  }) {
    const query = GraphQLSchema.getQueryMadeFromParts([
      GraphQLSchema.getOneUserQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
        },
      }),
      GraphQLSchema.getOneUserTrustedByQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
        },
        order_by: trustedByOrderBy,
        per_page: trustedByPerPage,
        page: trustedByPage,
      }),
      GraphQLSchema.getOneUserFollowsOrganizationsQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
        },
        order_by: followsOrganizationsOrderBy,
        per_page: followsOrganizationsPerPage,
        page: followsOrganizationsPage,
      }),
    ]);

    try {
      const data = await request({ query });
      return data.data;
    } catch (e) {
      throw e;
    }
  },

  async getUserFollowsOrganizations({
    userIdentity,
    orderBy = LIST_ORDER_BY,
    perPage = LIST_PER_PAGE,
    page = 1,
  }) {
    const query = GraphQLSchema.getQueryMadeFromParts([
      GraphQLSchema.getOneUserFollowsOrganizationsQueryPart({
        page,
        filters: {
          user_identity: `${userIdentity}`,
        },
        order_by: orderBy,
        per_page: perPage,
      }),
    ]);

    try {
      const data = await request({ query });
      return data.data.oneUserFollowsOrganizations;
    } catch (e) {
      throw e;
    }
  },

  async getUserTrustedBy({
    userIdentity,
    orderBy = LIST_ORDER_BY,
    perPage = LIST_PER_PAGE,
    page = 1,
  }) {
    const query = GraphQLSchema.getQueryMadeFromParts([
      GraphQLSchema.getOneUserTrustedByQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
        },
        order_by: orderBy,
        per_page: perPage,
        page,
      }),
    ]);

    try {
      const data = await request({ query });

      // TODO: Hot fix for backend bug
      data.data.oneUserTrustedBy.data.forEach((item) => {
        delete item.iFollow;
        delete item.followedBy;
      });

      return data.data.oneUserTrustedBy;
    } catch (e) {
      throw e;
    }
  },

  async fetchUser({
    userIdentity,
  }) {
    const query = GraphQLSchema.getQueryMadeFromParts([
      GraphQLSchema.getOneUserQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
        },
      }),
    ]);

    try {
      const data = await request({ query });
      // TODO: Remove after backend fix 200 code when error;
      if (data.errors) {
        throw data.errors;
      }
      return data.data.oneUser;
    } catch (e) {
      throw e;
    }
  },

  async getUserWallFeed({
    userIdentity,
    page = 1,
    perPage = FEED_PER_PAGE,
    commentsPage = 1,
    commentsPerPage = COMMENTS_PER_PAGE,
  }) {
    const query = GraphQLSchema.getQueryMadeFromParts([
      GraphQLSchema.getUserWallFeedQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
        },
        page,
        per_page: perPage,
        comments: {
          page: commentsPage,
          per_page: commentsPerPage,
        },
      }),
    ]);

    try {
      const data = await request({ query });
      return data.data.userWallFeed;
    } catch (e) {
      throw e;
    }
  },

  async getUserNewsFeed({
    page = 1,
    perPage = FEED_PER_PAGE,
    commentsPage = 1,
    commentsPerPage = COMMENTS_PER_PAGE,
  }) {
    const query = GraphQLSchema.getUserNewsFeed(
      page,
      perPage,
      commentsPage,
      commentsPerPage,
    );

    try {
      const data = await request({ query });
      return data.data.userNewsFeed;
    } catch (e) {
      throw e;
    }
  },

  async getOrganizationWallFeed({
    organizationId,
    page = 1,
    perPage = FEED_PER_PAGE,
    commentsPage = 1,
    commentsPerPage = COMMENTS_PER_PAGE,
  }) {
    const query = GraphQLSchema.getOrganizationWallFeedQuery(
      organizationId,
      page,
      perPage,
      commentsPage,
      commentsPerPage,
    );

    try {
      const data = await request({ query });
      return data.data.orgWallFeed;
    } catch (e) {
      throw e;
    }
  },

  async getPostComments({
    commentableId,
    page = 1,
    perPage = COMMENTS_PER_PAGE,
  }) {
    const query = GraphQLSchema.getPostCommentsQuery(
      commentableId,
      page,
      perPage,
    );

    try {
      const data = await request({ query });
      return data.data.feedComments;
    } catch (e) {
      throw e;
    }
  },

  async getCommentsOnComment({
    commentableId,
    parentId,
    parentDepth,
    page = 1,
    perPage = COMMENTS_PER_PAGE,
  }) {
    const query = GraphQLSchema.getCommentsOnCommentQuery(
      commentableId,
      parentId,
      parentDepth,
      page,
      perPage,
    );

    try {
      const data = await request({ query });
      return data.data.commentsOnComment;
    } catch (e) {
      throw e;
    }
  },

  async getOnePost({
    postId,
    page = 1,
    perPage = COMMENTS_PER_PAGE,
  }) {
    const token = getToken();
    const query = (token ? GraphQLSchema.getOnePostQueryAsMyself : GraphQLSchema.getOnePostQueryAsGuest)(
      postId,
      page,
      perPage,
    );

    try {
      const data = await request({ query });
      return data.data.onePost;
    } catch (e) {
      throw e;
    }
  },

  async getTagWallFeed({
    tagIdentity,
    page = 1,
    perPage = FEED_PER_PAGE,
    commentsPage = 1,
    commentsPerPage = COMMENTS_PER_PAGE,
  }) {
    const token = getToken();
    const query = await GraphQLSchema.getTagWallFeedQuery(
      tagIdentity,
      page,
      perPage,
      commentsPage,
      commentsPerPage,
      Boolean(token),
    );

    try {
      const data = await request({ query });
      return data.data.tagWallFeed;
    } catch (e) {
      throw e;
    }
  },


  async getOverview({
    page = 1,
    perPage = FEED_PER_PAGE,
    commentsPage,
    commentsPerPage,
    filter,
    tab,
    postTypeId,
  }) {
    const token = getToken();
    const query = tab === 'Posts' ?
      await GraphQLSchema[`getMany${filter}PostsQuery`](
        postTypeId,
        page,
        perPage,
        commentsPage,
        commentsPerPage,
        Boolean(token),
      ) : await GraphQLSchema[`getMany${filter}${tab}Query`](
        page,
        perPage,
      );

    try {
      const data = await request({ query });
      return data.data;
    } catch (e) {
      throw e;
    }
  },

  async getOverviewSide({
    page = 1,
    perPage = OVERVIEW_SIDE_PER_PAGE,
    filter,
    tab,
    side,
    postTypeId,
  }) {
    const query = tab === 'Posts' ?
      await GraphQLSchema[`getMany${side}For${filter}${tab}Query`](
        postTypeId,
        page,
        perPage,
      ) :
      await GraphQLSchema[`getMany${side}For${filter}${tab}Query`](
        page,
        perPage,
      );
    try {
      const data = await request({ query });
      return data.data;
    } catch (e) {
      throw e;
    }
  },

  async getNodesSelected(
    userId,
    orderBy = 'bp_status',
    page = 1,
    perPage = NODES_PER_PAGE,
  ) {
    const commonParams = { orderBy, page, perPage };
    const BLOCK_PRODUCERS = Dictionary.BlockchainNodes.typeBlockProducer();
    const CALCULATOR_NODES = Dictionary.BlockchainNodes.typeCalculator();

    const isVotedBlockProducers = GraphQLSchema.getManyBlockchainNodesQueryPart(snakes({
      ...commonParams,
      filters: {
        myselfVotesOnly: true,
        userId,
        blockchainNodesType: BLOCK_PRODUCERS,
      },
    }));

    const isVotedCalculatorsNodes = GraphQLSchema.getManyBlockchainNodesQueryPart(snakes({
      ...commonParams,
      filters: {
        myselfVotesOnly: true,
        userId,
        blockchainNodesType: CALCULATOR_NODES,
      },
    }));

    const partsWithAliases = {
      isVotedBlockProducers, isVotedCalculatorsNodes,
    };

    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases(partsWithAliases);

    try {
      const data = await request({ query });
      return {
        selectedNodes: {
          [BLOCK_PRODUCERS]: data.data.isVotedBlockProducers,
          [CALCULATOR_NODES]: data.data.isVotedCalculatorsNodes,
        },
      };
    } catch (e) {
      throw e;
    }
  },
  async getAllNodes(
    orderBy = 'bp_status',
    page = 1,
    perPage = NODES_PER_PAGE,
  ) {
    const commonParams = { orderBy, page, perPage };
    const BLOCK_PRODUCERS = Dictionary.BlockchainNodes.typeBlockProducer();
    const CALCULATOR_NODES = Dictionary.BlockchainNodes.typeCalculator();

    const blockProducers = GraphQLSchema.getManyBlockchainNodesQueryPart(snakes({
      ...commonParams,
      filters: {
        myselfVotesOnly: false,
        blockchainNodesType: BLOCK_PRODUCERS,
      },
    }));

    const calculatorsNodes = GraphQLSchema.getManyBlockchainNodesQueryPart(snakes({
      ...commonParams,
      filters: {
        myselfVotesOnly: false,
        blockchainNodesType: CALCULATOR_NODES,
      },
    }));


    const partsWithAliases = {
      blockProducers, calculatorsNodes,
    };

    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases(partsWithAliases);

    try {
      const data = await request({ query });
      return {
        nodes: {
          [BLOCK_PRODUCERS]: data.data.blockProducers,
          [CALCULATOR_NODES]: data.data.calculatorsNodes,
        },
      };
    } catch (e) {
      throw e;
    }
  },
  async getOnePostOffer({
    postId,
    commentsQuery = {
      page: 1,
      per_page: COMMENTS_PER_PAGE,
    },
    usersTeamQuery,
  }, options = {}) {
    const query = GraphQLSchema.getOnePostOffer(
      postId,
      commentsQuery,
      usersTeamQuery,
    );

    try {
      const data = await request({ query }, options);
      return data.data;
    } catch (e) {
      throw e;
    }
  },

  async getOnePostOfferWithUserAirdrop({
    airdropFilter,
    postId,
    commentsQuery = {
      page: 1,
      per_page: COMMENTS_PER_PAGE,
    },
    usersTeamQuery,
  }, options = {}) {
    const query = GraphQLSchema.getOnePostOfferWithUserAirdrop(
      airdropFilter,
      postId,
      commentsQuery,
      usersTeamQuery,
    );

    try {
      const data = await request({ query }, options);
      return data.data;
    } catch (e) {
      throw e;
    }
  },

  async getManyUsers({
    airdropFilter,
    orderBy,
    page,
    perPage,
    isMyself,
  }) {
    const query = GraphQLSchema.getManyUsers(
      airdropFilter,
      orderBy,
      page,
      perPage,
      isMyself,
    );

    try {
      const data = await request({ query });
      return data.data.manyUsers;
    } catch (e) {
      throw e;
    }
  },
};
