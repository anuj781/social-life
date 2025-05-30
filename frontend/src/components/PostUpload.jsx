import React, { useRef, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';
import { MdEmojiEmotions } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useSelector } from 'react-redux';

const cloudName = import.meta.env.VITE_CLOUDNAME;
const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

const PostUpload = (props) => {
  console.log(props)
  const [showImoji, setshowImoji] = useState(false);
  const [SelectedFiles, setSelectedFiles] = useState('');
  const [Loading, setLoading] = useState(false);
  let userSlice = useSelector((state)=>state.users);
    console.log(userSlice)
  let inputRef = useRef()

     function handleEmojiClicked(e){
        console.log(e)
        console.log(e.emoji)
      
        inputRef.current.value =  inputRef.current.value + e.emoji
        // setinputValue()
    }

     const handleRemove = (obj , i)=>{
      let copyArr = [...SelectedFiles];
      copyArr.splice(i,1);
      setSelectedFiles(copyArr)
    }

    // console.log("cloudName = ",import.meta.env.VITE_CLOUDNAME)
    console.log("preset = ",uploadPreset)

  const handleSubmit = async()=>{
    setLoading(true)
    let arr = [...SelectedFiles];
    let ansArr = arr.map(async(ele,i)=>{
      let formData = new FormData();
           formData.append('file',ele);
              formData.append('upload_preset',uploadPreset)
          let res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`,formData)

            return res.data.secure_url
    })

     let solvedPromises = await Promise.all(ansArr)
        console.log(solvedPromises)

  
    let obj ={
          title: inputRef.current.value,
          files:solvedPromises
        }
        console.log(obj)
        try{
          let res = await axios.post('http://localhost:6677/post/cPost',obj,{
             headers:{
            'Authorization':userSlice.token
          }
          })
      let data = res.data

        if(res.status===201 || res.status==200){
            toast.success(data.msg)

            inputRef.current.value = '';
            setSelectedFiles('')
          setLoading(false)
          props.getAllPosts()
        }
      } catch (error) {
        console.log(error)
          setLoading(false)
      }
        
        
      }
  

  function handleChange(e){
    let files = [...e.target.files];
    console.log(files)
    setSelectedFiles(files)
  }
  return (
    <div className='flex justify-center '>
      {Loading===true && <div className='loaderContainer'><span class="loader"></span></div>}
      <div className='  h-max w-[40vw] p-3 rounded-md bg-blue-300 flex flex-col gap-4 m-40'>
     <div className='flex justify-around'>
        <img className='w-[100px] h-[100px] rounded-full border-2 border-white' src="./src/assets/7.jpg" alt="" />
       <textarea ref={inputRef} className=' w-[400px] rounded-md bg-white outline-none p-2' name="" id=""></textarea>
     </div>
      {/* <div className='h-[200px] w-[500px] m-4 flex justify-center rounded-md bg-white'> */}
       {SelectedFiles &&<div className='flex gap-2 flex-wrap my-6 bg-white h-[200px] w-[500px] m-4 rounded-md '>
                  {
                    SelectedFiles.map((ele,i)=>{
                      return ele.type.includes('image') ?<div className='relative'>
                         <img className='w-[100px] h-[100px]' src={URL.createObjectURL(ele)} alt="" />
                         <IoMdClose onClick={()=>handleRemove(ele,i)} size={20} className='cursor-pointer absolute right-1 bottom-full'/>
                      </div>
                      :
                     <div className='relative'>
                       <video controls className='w-[100px] h-[100px]' src={URL.createObjectURL(ele)}></video>
                        <IoMdClose onClick={()=>handleRemove(ele,i)} size={20} className='cursor-pointer absolute right-1 bottom-full'/>
                     </div>
                    })
                  }
              
            </div>}
      <div className='flex justify-around'>
        <input multiple onChange={handleChange} className='hidden' id='files' type="file" />
        <label className='bg-blue-700 px-4 py-1 rounded-md text-white border-2 border-white cursor-pointer' htmlFor="files">Image/video</label>
      <MdEmojiEmotions className='cursor-pointer'  onClick={()=>setshowImoji(!showImoji)} size={28} color='blue'/>
      <button onClick={handleSubmit} className='bg-blue-700 px-4 py-1 rounded-md text-white border-2 border-white cursor-pointer'>Post</button>
      </div>
      <EmojiPicker onEmojiClick={handleEmojiClicked}  open={showImoji} searchDisabled={true}/>
      </div>
    </div>
  )
}

export default PostUpload
