import { GraphQLSchema } from 'ucom-libs-graphql-schemas';
import humps from 'lodash-humps';
import * as axios from 'axios';
import snakes from '../utils/snakes';
import { getBackendConfig } from '../utils/config';
import { getToken } from '../utils/token';
import { COMMENTS_PER_PAGE } from '../utils/comments';
import { FEED_PER_PAGE, OVERVIEW_SIDE_PER_PAGE } from '../utils/feed';
import {
  LIST_ORDER_BY_RATE,
  LIST_PER_PAGE,
  BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS,
  BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES,
  POST_TYPE_MEDIA_ID,
  ENTITY_NAMES_USERS,
  ENTITY_NAMES_ORG,
  INTERACTION_TYPE_ID_VOTING_UPVOTE,
  INTERACTION_TYPE_ID_VOTING_DOWNVOTE,
} from '../utils/constants';

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
  } catch (err) {
    throw err;
  }
};

const api = {
  async getMainPageData(params) {
    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      feed: GraphQLSchema.getPostsFeedQueryPart(params.feed.params, params.feed.include),
      posts: GraphQLSchema.getPostsFeedQueryPart(params.posts),
      users: GraphQLSchema.getManyUsersQueryPart(params.users),
    });

    try {
      const data = await request({ query });
      return data.data;
    } catch (e) {
      throw e;
    }
  },

  async getUserMainPageData({
    userIdentity,
  }) {
    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      posts: GraphQLSchema.getPostsFeedQueryPart({
        filters: {
          post_type_ids: [POST_TYPE_MEDIA_ID],
          entity_names_from: [ENTITY_NAMES_USERS, ENTITY_NAMES_ORG],
          entity_names_for: [ENTITY_NAMES_USERS, ENTITY_NAMES_ORG],
        },
        order_by: LIST_ORDER_BY_RATE,
        page: 1,
        per_page: 10,
      }),
      orgs: GraphQLSchema.getOneUserFollowsOrganizationsQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
        },
        order_by: LIST_ORDER_BY_RATE,
        per_page: 10,
        page: 1,
      }),
      users: GraphQLSchema.getOneUserActivityQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
          activity: 'I_follow',
        },
        order_by: LIST_ORDER_BY_RATE,
        per_page: 10,
        page: 1,
      }),
    });

    try {
      const data = await request({ query });
      return data.data;
    } catch (e) {
      throw e;
    }
  },

  async getUserPageData({
    userIdentity,
    trustedByOrderBy = LIST_ORDER_BY_RATE,
    trustedByPerPage = LIST_PER_PAGE,
    trustedByPage = 1,
    followsOrganizationsOrderBy = LIST_ORDER_BY_RATE,
    followsOrganizationsPerPage = LIST_PER_PAGE,
    followsOrganizationsPage = 1,
    iFollowOrderBy = LIST_ORDER_BY_RATE,
    iFollowPerPage = LIST_PER_PAGE,
    iFollowPage = 1,
    followedByOrderBy = LIST_ORDER_BY_RATE,
    followedByPerPage = LIST_PER_PAGE,
    followedByPage = 1,
  } = {}) {
    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      user: GraphQLSchema.getOneUserQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
        },
      }),
      orgs: GraphQLSchema.getOneUserFollowsOrganizationsQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
        },
        order_by: followsOrganizationsOrderBy,
        per_page: followsOrganizationsPerPage,
        page: followsOrganizationsPage,
      }),
      trustedBy: GraphQLSchema.getOneUserTrustedByQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
        },
        order_by: trustedByOrderBy,
        per_page: trustedByPerPage,
        page: trustedByPage,
      }),
      iFollow: GraphQLSchema.getOneUserActivityQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
          activity: 'I_follow',
        },
        order_by: iFollowOrderBy,
        per_page: iFollowPerPage,
        page: iFollowPage,
      }),
      followedBy: GraphQLSchema.getOneUserActivityQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
          activity: 'followed_by',
        },
        order_by: followedByOrderBy,
        per_page: followedByPerPage,
        page: followedByPage,
      }),
    });

    try {
      const data = await request({ query });
      return data.data;
    } catch (e) {
      throw e;
    }
  },

  async getUserIFollow({
    userIdentity,
    orderBy = LIST_ORDER_BY_RATE,
    perPage = LIST_PER_PAGE,
    page = 1,
  } = {}) {
    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      iFollow: GraphQLSchema.getOneUserActivityQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
          activity: 'I_follow',
        },
        order_by: orderBy,
        per_page: perPage,
        page,
      }),
    });

    try {
      const data = await request({ query });
      return data.data.iFollow;
    } catch (e) {
      throw e;
    }
  },

  async getUserFollowedBy({
    userIdentity,
    orderBy = LIST_ORDER_BY_RATE,
    perPage = LIST_PER_PAGE,
    page = 1,
  } = {}) {
    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      followedBy: GraphQLSchema.getOneUserActivityQueryPart({
        filters: {
          user_identity: `${userIdentity}`,
          activity: 'followed_by',
        },
        order_by: orderBy,
        per_page: perPage,
        page,
      }),
    });

    try {
      const data = await request({ query });
      return data.data.followedBy;
    } catch (e) {
      throw e;
    }
  },

  async getUserFollowsOrganizations({
    userIdentity,
    orderBy = LIST_ORDER_BY_RATE,
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
    orderBy = LIST_ORDER_BY_RATE,
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

  async getPostsFeed(params) {
    const query = GraphQLSchema.getQueryMadeFromParts([
      GraphQLSchema.getPostsFeedQueryPart(params.params, params.include),
    ]);

    try {
      const data = await request({ query });
      return data.data.postsFeed;
    } catch (e) {
      throw e;
    }
  },

  getManyUsersQueryPart({
    overviewType = 'trending',
    orderBy = '-scaled_social_rate_delta',
    page = 1,
    perPage = 10,
  } = {}) {
    const params = {
      filters: {
        overview_type: overviewType,
      },
      order_by: orderBy,
      page,
      per_page: perPage,
    };

    return GraphQLSchema.getManyUsersQueryPart(params);
  },

  async getManyUsers(params) {
    const query = GraphQLSchema.getQueryMadeFromParts([
      api.getManyUsersQueryPart(params),
    ]);

    try {
      const data = await request({ query });
      return data.data.manyUsers;
    } catch (e) {
      throw e;
    }
  },

  async getUsers(params) {
    try {
      const data = await request({
        query: GraphQLSchema.getQueryMadeFromParts([
          GraphQLSchema.getManyUsersQueryPart(snakes(params)),
        ]),
      });

      return data.data.manyUsers;
    } catch (e) {
      throw e;
    }
  },

  async getTrendingOrganizations({
    page = 1,
    perPage = 10,
  } = {}) {
    const query = GraphQLSchema.getManyTrendingOrganizationsQuery(
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

  async getHotOrganizations({
    page = 1,
    perPage = 10,
  } = {}) {
    const query = GraphQLSchema.getManyHotOrganizationsQuery(
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

  async getTrendingTags({
    page = 1,
    perPage = 10,
  } = {}) {
    const query = GraphQLSchema.getManyTrendingTagsQuery(
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

  async getPosts({
    page = 1,
    perPage = FEED_PER_PAGE,
    commentsPage = 1,
    commentsPerPage = COMMENTS_PER_PAGE,
    postTypeId = POST_TYPE_MEDIA_ID,
  }) {
    const token = getToken();
    // TODO: Replace to new api method for fetch all posts, like feed
    const query = await GraphQLSchema.getManyTrendingPostsQuery(
      postTypeId,
      page,
      perPage,
      commentsPage,
      commentsPerPage,
      Boolean(token),
    );

    try {
      const data = await request({ query });
      return data.data;
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

  async getNodes(params) {
    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      nodes: GraphQLSchema.getManyBlockchainNodesQueryPart(params),
    });

    try {
      const data = await request({ query });
      return data.data.nodes;
    } catch (e) {
      throw e;
    }
  },

  async getSelectedNodes(userId) {
    const params = {
      page: 1,
      per_page: 100,
      order_by: 'bp_status',
    };

    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      blockProducers: GraphQLSchema.getManyBlockchainNodesQueryPart({
        ...params,
        filters: {
          myself_votes_only: true,
          blockchain_nodes_type: BLOCKCHAIN_NODES_TYPE_BLOCK_PRODUCERS,
          user_id: userId,
        },
      }),
      calculatorsNodes: GraphQLSchema.getManyBlockchainNodesQueryPart({
        ...params,
        filters: {
          myself_votes_only: true,
          blockchain_nodes_type: BLOCKCHAIN_NODES_TYPE_CALCULATOR_NODES,
          user_id: userId,
        },
      }),
    });

    try {
      const { data } = await request({ query });
      return data;
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

  async getManyUsersAirdrop({
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

  async getOrganizationActivity(params) {
    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      users: GraphQLSchema.getOneOrganizationActivityQueryPart(params),
    });

    try {
      const data = await request({ query });
      return data.data.users;
    } catch (e) {
      throw e;
    }
  },

  async searchEntities(
    searchQuery,
    params = {},
    commonParams = {
      page: 1,
      perPage: 7,
    },
  ) {
    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      users: GraphQLSchema.getManyUsersQueryPart({
        filters: {
          users_identity_pattern: searchQuery,
        },
        order_by: '-scaled_importance',
        ...snakes(params.users || commonParams),
      }),
      orgs: GraphQLSchema.getManyOrganizationQueryPart({
        filters: {
          organizations_identity_pattern: searchQuery,
        },
        order_by: '-current_rate',
        ...snakes(params.orgs || commonParams),
      }),
      tags: GraphQLSchema.getManyTagsQueryPart({
        filters: {
          tags_identity_pattern: searchQuery,
        },
        order_by: '-current_rate',
        ...snakes(params.tags || commonParams),
      }),
    });

    try {
      const data = await request({ query });
      return data.data;
    } catch (e) {
      throw e;
    }
  },

  async getUserReferrals(
    userId,
    page = 1,
    perPage = 10,
    orderBy = '-account_name',
  ) {
    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      users: GraphQLSchema.getOneUserReferralsQueryPart({
        filters: {
          user_id: userId,
        },
        order_by: orderBy,
        page,
        per_page: perPage,
      }),
    });

    try {
      const data = await request({ query });
      return data.data;
    } catch (e) {
      throw e;
    }
  },

  async getVotesForEntityPreview(entityId, entityName) {
    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      upvotes: GraphQLSchema.getOneContentVotingUsersQueryPart({
        filters: {
          interaction_type: INTERACTION_TYPE_ID_VOTING_UPVOTE,
          entity_id: entityId,
          entity_name: entityName,
        },
        order_by: LIST_ORDER_BY_RATE,
        page: 1,
        per_page: 3,
      }),
      downvotes: GraphQLSchema.getOneContentVotingUsersQueryPart({
        filters: {
          interaction_type: INTERACTION_TYPE_ID_VOTING_DOWNVOTE,
          entity_id: entityId,
          entity_name: entityName,
        },
        order_by: LIST_ORDER_BY_RATE,
        page: 1,
        per_page: 3,
      }),
    });

    try {
      const data = await request({ query });
      return data.data;
    } catch (err) {
      throw err;
    }
  },

  async getVotesForEntity(entityId, entityName, interactionType, page = 1, perPage = 20) {
    const query = GraphQLSchema.getQueryMadeFromPartsWithAliases({
      votes: GraphQLSchema.getOneContentVotingUsersQueryPart({
        filters: {
          ...(interactionType ? { interaction_type: interactionType } : {}),
          entity_id: entityId,
          entity_name: entityName,
        },
        order_by: LIST_ORDER_BY_RATE,
        page,
        per_page: perPage,
      }),
    });

    try {
      const data = await request({ query });
      return data.data.votes;
    } catch (err) {
      throw err;
    }
  },
};

export default api;
