import { createContext, useReducer } from "react";

export const PostsContext = createContext();

export const postsReducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTS":
      // Δημιουργία του postDirectory
      const postsDirectory = action.payload.reduce((acc, post) => {
        acc[post._id] = post;
        return acc;
      }, {});
      return {
        ...state,
        posts: action.payload,
        postDirectory: postsDirectory,
      };
    
    case "EMPTY_POSTS":
      return {
        ...state,
        posts: null,
      };
  
    case "CREATE_POST":
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        postDirectory: {
          ...state.postDirectory,
          [action.payload._id]: action.payload,
        },
      };

    case "SET_ACTIVE_COMMENTS_LIST":
      return {
        ...state,
        activeCommentsList: action.payload,
      };

    case "SET_ACTIVE_POST_ID":
      return {
        ...state,
        activePostId: action.payload,
      };

    case "UPDATE_COMMENTS_LIST_ON_POST": {
      const postIndex = state.posts.findIndex((p) => p._id === state.activePostId);

      // Δημιουργία βαθιάς αντιγραφής του posts array μόνο για την ενημέρωση του comments list στο επιθυμητό post
      const updatedPosts = state.posts.map((post, index) =>
        index === postIndex ? { ...post, commentsList: state.activeCommentsList } : post
      );

      return {
        ...state,
        posts: updatedPosts,
        postDirectory: {
          ...state.postDirectory,
          [state.activePostId]: {
            ...state.postDirectory[state.activePostId],
            commentsList: state.activeCommentsList,
          },
        },
      };
    }

    case "UPDATE_POST_LIKE": {
      const pIndex = state.posts.findIndex((p) => p._id === action.payload.post_id);

      // Δημιουργία βαθιάς αντιγραφής του posts array μόνο για την ενημέρωση του likes list στο επιθυμητό post
      const updatedPosts = state.posts.map((post, index) =>
        index === pIndex ? { ...post, likesList: action.payload.likesList } : post
      );

      return {
        ...state,
        posts: updatedPosts,
        postDirectory: {
          ...state.postDirectory,
          [action.payload.post_id]: {
            ...state.postDirectory[action.payload.post_id],
            likesList: action.payload.likesList,
          },
        },
      };
    }

    default:
      return state;
  }
};

export const PostsContextProvider = ({ children }) => {
  const [state, postDispatch] = useReducer(postsReducer, {
    posts: null,
    activeCommentsList: null,
    activePostId: null,
    postDirectory: {},
  });

  return (
    <PostsContext.Provider value={{ ...state, postDispatch }}>
      {children}
    </PostsContext.Provider>
  );
};
