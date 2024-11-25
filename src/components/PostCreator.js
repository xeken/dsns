import React, { useState, useRef } from 'react';
import styles from './PostCreator.module.css';

const PostCreator = (props) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (content.trim()) {
      props.onAddPost(content);
      setContent('');
      setIsExpanded(false);
    }
  };
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    if (!content.trim()) 
      setIsExpanded(false);
  };

  const handleWrapperClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      textareaRef.current?.focus();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit}>
          <div className={styles.flexRow}>
            <div className={styles.avatar}>
              <img 
                src="default_profile.png" 
                alt="User" 
                className={styles.avatarImg} />
            </div>
            
            <div className={styles.inputWrapper}>
              <div
                className={`${styles.textareaWrapper} 
                  ${ isExpanded ? styles.textareaExpanded : styles.textareaCollapsed}`}
                  onClick={handleWrapperClick} >
                <textarea
                  ref={textareaRef}
                  className={styles.textarea}
                  placeholder="어떤 생각을 공유하시겠어요?"
                  value={content}
                  onChange={handleContentChange}
                  onBlur={handleBlur}
                />
              </div>
              
              {isExpanded && (
                <div className={styles.footer}>
                  <input
                    type="submit"
                    value="게시하기"
                    className={`${styles.postButton} 
                      ${ content.trim() ? styles.postButtonEnabled : styles.postButtonDisabled }`}
                    disabled={!content.trim()} />
                </div>)
              }
            </div>
          </div>
          </form>
      </div>
    </div>
  );
};

export default PostCreator;