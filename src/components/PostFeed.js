import { Heart } from 'lucide-react';
import styles from './PostFeed.module.css';

const PostFeed = (props) => {
  console.log(props);
  return (
    <div className={styles.container}>
      <div className={styles.feedList}>
        { props.posts && props.posts.map(post => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postHeader}>
              <div className={styles.profile}>
                <img 
                  src={post.user.profile_img} 
                  alt={post.user.name} 
                  className={styles.profileImg} />
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{post.user.name}</div>
                <div className={styles.timestamp}>
                  {new Date(post.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
            <p className={styles.postContent}>{post.content}</p>
            <button onClick={() => props.onUpdateLike(post.id)}
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