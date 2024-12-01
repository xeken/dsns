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
    uint256 public postCount = 0;

    event PostCreated(uint256 id, address author, string content);
    event PostLiked(uint256 id, address user, uint256 newLikeCount);
    event PostDeleted(uint256 indexed id, address indexed author);

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

    function getPost(uint256 _postId) public view returns (
        uint256 pId,
        address author,
        string memory content,
        uint256 timestamp,
        uint256 likes
    ) {
        require(_postId <= postCount, "Post does not exist");
        Post storage post = posts[_postId];
        return (
            post.pId,
            post.author,
            post.content,
            post.timestamp,
            post.likes
        );
    }

    function deletePost(uint256 _postId) public {
        require(_postId <= postCount, "Post does not exist");
        require(posts[_postId].author == msg.sender, "Only author can delete post");
    
        delete posts[_postId];
    
        emit PostDeleted(_postId, msg.sender);
    }

}