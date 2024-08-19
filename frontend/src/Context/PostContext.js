import { createContext, useReducer } from "react";

export const PostsContext = createContext()

export const postsReducer = (state, action) => {
    switch (action.type){
        case 'SET_POSTS':
            return {
                ...state,
                posts: action.payload
            }
        case 'CREATE_POST':
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            }
        case 'SET_ACTIVE_COMMENTS_LIST':
            return{
                ...state,
                activeCommentsList: action.payload
            }
        case 'SET_ACTIVE_POST_ID':
            return {
                ...state,
                activePostId: action.payload
            }
        case 'UPDATE_COMMENTS_LIST_ON_POST':
            const postIndex = state.posts.findIndex( p=> p._id === state.activePostId)
            
            // Create a deep copy of the posts array only changing the comments list on the desired post
            const updatedPosts = state.posts.map( (post, index) => 
                index === postIndex ? {...post, commentsList: state.activeCommentsList} : post
            );

            return {
                ...state,
                posts: updatedPosts
            }

        case "UPDATE_POST_LIKE":
            const pIndex = state.posts.findIndex (p => p._id === action.payload.post_id);

            // Create a deep copy of the posts array only changing the likes list on the desired post
            const updPosts = state.posts.map( (post, index) => 
                index === pIndex ? {...post, likesList: action.payload.likesList} : post
            );

            return {
                ...state,
                posts: updPosts
            }

        default:
            return state
    }
}

export const PostsContextProvider = ( {children} ) => {
    const [state, postDispatch] = useReducer(postsReducer, {
        posts: null,
        activeCommentsList: null,
        activePostId: null
    })

    return(
        <PostsContext.Provider value={{...state, postDispatch}}>
            {children}
        </PostsContext.Provider>
    )
}