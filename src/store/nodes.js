const getInitialState = () => ({
  data: {},
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case 'NODES_RESET': {
      return getInitialState();
    }

    case 'NODES_ADD': {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.reduce((obj, item) => ({
            ...obj,
            [item.id]: {
              ...state.data[item.id],
              ...item,
            },
          }), {}),
        },
      };
    }

    default: {
      return state;
    }
  }
};

export const getNodesByIds = (nodes, ids) => ids.map(id => nodes.data[id]);
