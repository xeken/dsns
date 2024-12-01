import { Heart } from 'lucide-react';
import { createJazzicon } from '../utils/Web3';
import styles from './PostFeed.module.css';

const PostFeed = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.feedList}>
        { props.posts && props.posts.map(post => ( 
          <div key={post.pId} className={styles.postCard}>
            <div className={styles.postHeader}>
              <div className={styles.avatar}>
                <div title={post.author} ref={(element) => {
                    if (element && post.author) {
                      while (element.firstChild) 
                        element.removeChild(element.firstChild);
                      element.appendChild(createJazzicon(post.author));
                    }
                  }}/>
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{post.author.slice(0, 8)}</div>
                <div className={styles.timestamp}>
                  {new Date(post.timestamp * 1000).toLocaleString()}
                </div>
              </div>
              {post.isMyPost && (
                <button onClick={() => props.onDeletePost(post.pId)}
                  className={styles.deleteButton} > 삭제 </button>)}
            </div>
            <p className={styles.postContent}>{post.content}</p>
            <button onClick={() => props.onUpdateLike(post.pId)}
                className={`${styles.likeButton} ${post.isLiked ? styles.liked : ''}`}>
              <Heart size={16} className={post.isLiked ? styles.likedIcon : ''} />
              <span>{post.likes}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostFeed;