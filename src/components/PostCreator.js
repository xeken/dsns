import React, { useState, useRef, useEffect } from 'react';
import styles from './PostCreator.module.css';
import { createJazzicon } from '../utils/Web3';

const PostCreator = (props) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);
  const avatarRef = useRef(null); 

  useEffect(() => {
    if (props.userInfo && props.userInfo.address) {
      if (avatarRef.current) {
        while (avatarRef.current.firstChild) 
          avatarRef.current.removeChild(avatarRef.current.firstChild);
        avatarRef.current.appendChild(createJazzicon(props.userInfo.address));
      }
    }
  });

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
            <div className={styles.avatar} 
                ref={avatarRef} 
                // title={props.userInfo.balance + ' ETH'}
              />
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