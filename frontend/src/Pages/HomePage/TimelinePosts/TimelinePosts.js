import { useEffect, useRef, useCallback } from "react";
import Post from "../../../Components/PostComponent/Post";
import s from "./TimelinePostsStyle.module.css";
import { usePostsContext } from "../../../Hooks/usePostsContext";
import { useAuthContext } from "../../../Hooks/useAuthContext";

function TimelinePosts({ commentsPopupHandler }) {
  const { posts, postDispatch } = usePostsContext();
  const { user } = useAuthContext();
  
  // Δημιουργούμε ένα ref για κάθε post
  const postRefs = useRef([]);

  // Fetch posts from database
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        postDispatch({ type: "SET_POSTS", payload: json });
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [postDispatch, user]);

  const handleIntersection = useCallback((entries) => {
    entries.forEach( async (entry) => {
      if (entry.isIntersecting && !user.interactionSource) {
        try {
            const response = await fetch(`/api/users/viewInteraction/${entry.target.dataset.postid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (response.ok) {
                
            } else {
                console.error('Error updating interactions');
            }
        } catch (error) {
            console.error('Error updating interactions:', error);
        }
      }
    });
  }, [user]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // 50% του Post να είναι ορατό
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    postRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      // Καθαρισμός των observers όταν το component αποσυνδέεται
      observer.disconnect();
    };
  }, [posts, handleIntersection]);

  return (
    <div className={s.posts}>
      {posts &&
        posts.map((post, index) => (
          <div
            key={post._id}
            ref={(el) => (postRefs.current[index] = el)}
            data-postid={post._id}
          >
            <Post postData={post} commentsPopupHandler={commentsPopupHandler} />
          </div>
        ))}
    </div>
  );
}

export default TimelinePosts;
