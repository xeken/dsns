import { Heart } from 'lucide-react';
import styles from './PostFeed.module.css';

const PostFeed = (posts) => {
  console.log(posts && posts.posts)
  return (
    <div className={styles.container}>
      <div className={styles.feedList}>
        {posts && posts.posts.map(post => (
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
            <button className={styles.likeButton}>
              <Heart size={16} />
              <span>{post.likes}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostFeed;