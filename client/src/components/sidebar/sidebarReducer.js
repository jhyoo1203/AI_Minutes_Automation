import { TOGGLE_SIDEBAR } from './sidebarAction';

const initialState = {
  isCollapsed: true,
};

const sidebarReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        isCollapsed: !state.isCollapsed,
      };
    default:
      return state;
  }
};

export default sidebarReducer;