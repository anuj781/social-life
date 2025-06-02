import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { PiImagesLight } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { toast } from 'react-toastify';
import { fetchUserByToken } from '../redux/userSlice';

const FriendProfile = () => {

  const [friend, setfriend] = useState('');
  console.log(friend)
  const [friendPost, setfriendPost] = useState([]);

  let userSlice = useSelector((state)=>state.users);
  // console.log(userSlice)
  let location = useLocation();
  // console.log(location)
  let friendId = location.state
  console.log(friendId)

  let dispatch = useDispatch()


  let getFriendData = async()=>{
    let res = await axios.get(`http://localhost:6677/user/friend/${friendId}`,{
      headers:{
        'Authorization':userSlice.token
      }
    })

    let data = res.data;
    console.log(data)
    setfriend(data.friend);
    setfriendPost(data.friendPosts)
  }

  useEffect(()=>{
    getFriendData()
  },[friendId])

    const handleFollow = async()=>{
    let res = await axios.put(`http://localhost:6677/user/followUnfollow/${friendId}`,{},{
      headers:{
        'Authorization':userSlice.token
      }
    })

    let data = res.data;
    if(res.status==200){
      toast.success(data.msg)
      dispatch(fetchUserByToken(userSlice?.token))
        getFriendData()
    }
  }

  return (
    <div className='container m-auto'>
        <div className="cover relative w-full h-[50vh]">
            <img className='w-full h-full' src={friend?.coverPic} alt="" />

            <div className="profile bg-white border w-[200px] h-[200px] rounded-full absolute bottom-[-20%] left-[5%]">
                <img className='w-full h-full rounded-full' src={friend?.profilePic} alt="" />
                <h3 className='text-center text-2xl font-semibold'>{friend?.name}</h3>
            </div>
        </div>

          {/* <div className="flex w-[400px] m-auto mt-[100px] flex-col gap-2"> */}
          <div className='flex justify-center items-center gap-10 mt-5'>
          <div className="box flex flex-col justify-center items-center text-xl">
            <h3 className='font-semibold'>Followers</h3>
            <p>{friend?.followers?.length}</p>
          </div>
           <div className="box flex flex-col justify-center items-center text-xl">
            <h3 className='font-semibold'>Followings</h3>
            <p>{friend?.followings?.length}</p>
          </div>
          
        </div>

         <div className="box flex gap-3 justify-center items-center mt-10 text-xl">

          {
            friend?.followers?.includes(userSlice?.user?._id) ?  <button onClick={handleFollow} className='px-5 py-2 rounded-md bg-[#022702] text-white hover:bg-[#008000]'>UnFollow</button>
            :
            <button onClick={handleFollow} className='px-5 cursor-pointer py-2 rounded-md bg-[#480210] text-white hover:bg-[crimson] '>Follow</button>
          }

              
             
              <Link to={'/chat'}  className='px-5 cursor-pointer py-2 rounded-md bg-[#000028] text-white hover:bg-[blue]'>Chat</Link>
           
          </div>

         {friendPost.length >0 ? <div className="flex w-[400px] m-auto mt-[60px] flex-col gap-2">
                {
                  friendPost.map((ele,i)=>{
                    return <PostCard   getAllPosts={  getFriendData}  key={ele._id} ele ={ele}/>
                  })
                }
              </div>
               :

            <h1 className='text-center md:text-5xl sm:text-3xl text-xl mt-[60px]'>No Post to show</h1>
            }
    </div>
  )
}

export default FriendProfile