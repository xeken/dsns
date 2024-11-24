// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract SocialPost {
    struct Post {
        uint256 pId;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }
    
    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(address => bool)) public userLikes;
    uint256 public postCount;

    event PostCreated(uint256 id, address author, string content);
    event PostLiked(uint256 id, address user, uint256 newLikeCount);

    function createPost(string memory _content) public {
        postCount++;
        posts[postCount] = Post(
            postCount,
            msg.sender,
            _content,
            block.timestamp,
            0
        );
        
        emit PostCreated(postCount, msg.sender, _content);
    }

    function toggleLike(uint256 _postId) public {
        require(_postId <= postCount, "Post does not exist");
        
        if (userLikes[_postId][msg.sender]) {
            posts[_postId].likes--;
            userLikes[_postId][msg.sender] = false;
        } else {
            posts[_postId].likes++;
            userLikes[_postId][msg.sender] = true;
        }
        
        emit PostLiked(_postId, msg.sender, posts[_postId].likes);
    }
}