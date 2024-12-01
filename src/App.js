import React, { useState, useEffect} from 'react';
import swal from 'sweetalert';
import { getWeb3Provider, getContract, getUserInfo } from './utils/Web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostCreator from './components/PostCreator';
import PostFeed from './components/PostFeed';
const ethers = require("ethers") 

// const samplePosts = [
//   {
//     pId: 2,
//     author: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
//     content: "제3조(국외행위에 대한 적용) 이 법은 국외에서 이루어진 행위로서 그 효과가 국내에 미치는 경우에도 적용한다.",
//     timestamp: 1733025477,
//     likes: 8
//   },
//   {
//     pId: 1,
//     author: "0xfBf0243e88145db92242A20F3CAa8e4a49A08161",
//     content: "제1조(목적) 이 법은 가상자산 이용자 자산의 보호와 불공정거래행위 규제 등에 관한 사항을 정함으로써 가상자산 이용자의 권익을 보호하고 가상자산시장의 투명하고 건전한 거래질서를 확립하는 것을 목적으로 한다.",
//     timestamp: 1733015477,
//     likes: 12
//   }
// ];

function App() {
  const [contract, setContract] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    init(); 
  }, []);

  const init = async () => {
    try {
      const provider = await getWeb3Provider();
      const contract = await getContract(provider);
      const user = await getUserInfo(provider);

      setContract(contract);
      setUserInfo(user);

      const count = ethers.toNumber(await contract.postCount());
      const loadedPosts = [];
      for(let i = count; i > 0; i--){ 
        const post = await contract.posts(i);
        const pId = ethers.toNumber(post.pId);
        if(pId === 0x0000000000000000000000000000000000000000)
          continue;

        const isLiked = await contract.userLikes(i, user.address);

        loadedPosts.push({
          pId: pId,
          author: ethers.getAddress(post.author),
          content: post.content,
          timestamp: ethers.toNumber(post.timestamp),
          likes: ethers.toNumber(post.likes),
          isLiked: isLiked,
          isMyPost: post.author.toLowerCase() === user.address.toLowerCase()
        });
      }
      setPosts(loadedPosts);
     
      // for(let i = count; i > 2; i--){ ///@TODO 샘플데이터 삭제 후 0으로
      //   const post = await contract.posts(i);
      //   const newPost = {
      //     pId: ethers.toNumber(post.pId),
      //     author: ethers.getAddress(post.author),
      //     content: post.content,
      //     timestamp: ethers.toNumber(post.timestamp),
      //     likes: post.likes,
      //   };
      //   setPosts([newPost, ...posts]);
      // }
    } catch (error) {
      swal({
        title: "ERROR",
        text: "메타마스크 지갑정보를 확인해주세요!",
        icon: "error",
        button: "확인",
      });
      console.error(error);
    }
  };

  const handleAddPost = async (content) => {
    try {
      if (!contract) {
        console.error("Contract not initialized");
        return;
      }
      
      const toastId = toast.loading("트랜잭션 처리 중...");

      const tx = await contract.createPost(content);
      const receipt = await tx.wait();

      console.log(receipt);
      
      if (receipt.status !== 1) 
        throw new Error("tx error");
      
      const count = ethers.toNumber(await contract.postCount());

      const newPost = {
        pId: ethers.toNumber(count) + 1,
        //pId: posts.length === 0 ? 0 : posts.at(-1).pId + 1,
        author: userInfo.address,
        content,
        timestamp: Math.floor(new Date().getTime() / 1000),
        likes: 0,
        isMyPost: true
      };
 
      setPosts([newPost, ...posts]);
      
      toast.update(toastId, {
        render: "게시글이 작성되었습니다",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

    } catch (error) {
      swal({
        title: "게시글 작성 실패",
        text: "메타마스크를 확인해주세요!",
        icon: "warning",
        button: "확인",
      });
      console.log(error);
    }
  };

  const handleUpdateLike = async (postId) => {
    try {
      if (!contract) {
        console.error("Contract not initialized");
        return;
      }

      const toastId = toast.loading("트랜잭션 처리 중...");
      
      console.log(postId);
      const tx = await contract.toggleLike(postId);

      const receipt = await tx.wait();
      console.log(receipt);

      if (receipt.status !== 1) 
        throw new Error("tx error");

      init();

      toast.update(toastId, {
        render: "좋아요 처리가 완료되었습니다.",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      swal({
        title: "좋아요 실패",
        text: "메타마스크를 확인해주세요!",
        icon: "error",
        button: "확인",
      });
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      if (!contract) {
        console.error("Contract not initialized");
        return;
      }
      const toastId = toast.loading("트랜잭션 처리 중...");
      
      const tx = await contract.deletePost(postId);

      const receipt = await tx.wait();
      console.log(receipt);

      if (receipt.status !== 1) 
        throw new Error("tx error");

      init();

      toast.update(toastId, {
        render: "게시글 삭제가 완료되었습니다.",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

    } catch (error) {
      swal({
        title: "삭제 실패",
        text: "메타마스크를 확인해주세요!",
        icon: "error",
        button: "확인",
      });
    }
  }
  return (
    <div>
      <PostCreator userInfo={userInfo} onAddPost={handleAddPost}/>
      <div className="bg-gray-50 min-h-screen">
        <PostFeed posts={posts} onUpdateLike={handleUpdateLike} onDeletePost={handleDeletePost}/>
      </div>
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
      />
    </div>
  );
}
export default App;