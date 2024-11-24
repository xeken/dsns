import React, { useCallback, useState, useEffect} from 'react';
import { getWeb3Provider, getContract } from './utils/Web3';
import PostCreator from './components/PostCreator';
import PostFeed from './components/PostFeed';

const samplePosts = [
  {
    id: 1,
    user: {
      name: "조병현",
      profile_img: "default_profile.png"
    },
    content: "언론·출판은 타인의 명예나 권리 또는 공중도덕이나 사회윤리를 침해하여서는 아니된다. 언론·출판이 타인의 명예나 권리를 침해한 때에는 피해자는 이에 대한 피해의 배상을 청구할 수 있다.",
    timestamp: "2024-11-14T10:30:00",
    likes: 12
  },
  {
    id: 2,
    user: {
      name: "조용수",
      profile_img: "default_profile.png"
    },
    content: "법률은 특별한 규정이 없는 한 공포한 날로부터 20일을 경과함으로써 효력을 발생한다. 국회의원이 회기전에 체포 또는 구금된 때에는 현행범인이 아닌 한 국회의 요구가 있으면 회기중 석방된다.",
    timestamp: "2024-11-14T09:15:00",
    likes: 8
  },
  {
    id: 3,
    user: {
      name: "오문성",
      profile_img: "default_profile.png"
    },
    content: "중앙선거관리위원회는 법령의 범위안에서 선거관리·국민투표관리 또는 정당사무에 관한 규칙을 제정할 수 있으며, 법률에 저촉되지 아니하는 범위안에서 내부규율에 관한 규칙을 제정할 수 있다.",
    timestamp: "2024-11-14T08:45:00",
    likes: 15
  }
];

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [posts, setPosts] = useState(samplePosts);

  useEffect(() => {
    initWeb3(); 
  }, []);

  const initWeb3 = async () => {
    try {
        const provider = await getWeb3Provider();
        const contract = await getContract(provider);
        setProvider(provider);
        setContract(contract);
    } catch (error) {
        console.error("Web3 초기화 실패:", error);
    }
};

  // const handleAddPost = (content) => {
  //   const newPost = {
  //     id: samplePosts.length + 1,
  //     user: {
  //       name: "조병현",
  //       profile_img: "default_profile.png"
  //     },
  //     content,
  //     timestamp: new Date().toISOString(),
  //     likes: 0
  //   };

  //   setPosts([newPost, ...posts]);
  //   console.log(content); 
  // };

  // const handleUpdateLike = useCallback((postId) => {
  //   setPosts(posts => posts.map(post => {
  //     if (post.id === postId) {
  //       return {
  //         ...post,
  //         likes: post.isLiked ? post.likes - 1 : post.likes + 1,
  //         isLiked: !post.isLiked
  //       };
  //     }
  //     return post;
  //   }));
  // }, []); 

  const handleAddPost = async (content) => {
    try {
      if (!contract) {
        console.error("Contract not initialized");
        return;
      }
 
      const tx = await contract.createPost(content);
      await tx.wait();
      
      const newPost = {
        id: posts.length + 1,
        user: {
          name: "현재 사용자",
          avatar: "/resources/image/default_profile.png"
        },
        content,
        timestamp: new Date().toISOString(),
        likes: 0
      };
 
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  };
  const handleUpdateLike = async (postId) => {
    try {
      if (!contract) {
        console.error("Contract not initialized");
        return;
      }
 
      const tx = await contract.toggleLike(postId);
      await tx.wait();
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes + (post.isLiked ? -1 : 1),
            isLiked: !post.isLiked
          };
        }
        return post;
      }));
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };


  return (
    <div>
      <PostCreator onAddPost={handleAddPost}/>
      <div className="bg-gray-50 min-h-screen">
        <PostFeed posts={posts} onUpdateLike={handleUpdateLike} />
      </div>
    </div>
  );
}
export default App;