import React, { useEffect, useState } from 'react'
import PostUpload from '../components/PostUpload'
import PostCard from '../components/PostCard'
import axios from 'axios'


const Home = () => {


  const [AllPost, setAllPost] = useState([]);

  let getAllPosts = async()=>{
    let res = await axios.get('http://localhost:6677/post/allPost');
    let data = res.data;
    console.log(data)
    setAllPost(data.posts)
  }

  useEffect(()=>{
    getAllPosts()
  },[])
  return (
    <div>
     <div className='h-max'>
       <PostUpload  getAllPosts={getAllPosts}/>
     </div>

      <div className="flex w-[400px] m-auto flex-col gap-2 ">
        {
          AllPost.map((ele,i)=>{ 
            return <PostCard key={ele._id} ele ={ele}  getAllPosts={getAllPosts}/>
          })
        }
      </div>
    </div>
  )
}

export default Home