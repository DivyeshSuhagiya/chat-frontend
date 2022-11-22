import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./ChatPage.css";
import { BiDotsVerticalRounded, BiSend , BiLeftArrowCircle } from "react-icons/bi";
import ScrollToBottom from 'react-scroll-to-bottom'
import socketIO from 'socket.io-client'

const ENDPOINT = 'https://chat-backend-node-app.herokuapp.com/'
const socket = socketIO(ENDPOINT , {transports : ['websocket']})
function ChatPage() {
  const [userObj, setuserObj] = useState({});
  const [allUser, setallUser] = useState([]);
  const blankObj = { message : "" , senderId : '' , receiverId : ''}
  const [value, setvalue] = useState({...blankObj});
  const [data, setdata] = useState([]);
  const [chatUser, setchatUser] = useState();
  const [showChat, setshowChat] = useState(false)
  const divRef = useRef(null);
  const chatWithSelectedUser =  data.filter(x => ((x.senderId == userObj?._id) && (x.receiverId == chatUser?._id)) || ((x.senderId == chatUser?._id) && (x.receiverId == userObj?._id)))
  function getUser() {
    axios.get("https://chat-backend-node-app.herokuapp.com/api/user/getUser").then((res) => {
      setallUser(res.data.data)
      let obj = res.data.data.find(
        (x) => x.email == localStorage.getItem("userEmail")
      );
      setuserObj({ ...obj });
    });
  }
  useEffect(() => {
    getUser();
  }, []);

  socket.on('Message' , (data)=> {
    setdata(data)
    scrollToBottomWithSmoothScroll()
  })

    useEffect(() => {
      socket.on('Message' , (data)=> {
        setdata(data)
          })
        }, [])
        
    function logout(){
      localStorage.clear('isLogin')
      localStorage.clear('userEmail')
      window.location.reload()
  }
  
  
  
  
  function changeInput(e){
    setvalue({...value , [e.target.name] : e.target.value,  senderId : userObj._id , receiverId : chatUser._id})
    scrollToBottomWithSmoothScroll()
  }

  function keyUpFun(e){
    if(e.code == 'Enter'){ 
      if(value.message != "" && value.senderId != "" && value.receiverId){
        socket.emit('Message' ,value)
        setvalue({...blankObj})
        scrollToBottomWithSmoothScroll()
      }
    }
  }
  function sendMessage(){
    if(value.message != "" && value.senderId != "" && value.receiverId){
      socket.emit('Message' ,value)
      setvalue({...blankObj})
      scrollToBottomWithSmoothScroll()
    }
  }
  
  
  const scrollToBottomWithSmoothScroll = () => {
    const scroll =
      divRef.current?.scrollHeight -
      divRef.current?.clientHeight;
      divRef.current?.scrollTo({top:scroll,behavior: 'smooth'});
  }
  setTimeout(() => {
    scrollToBottomWithSmoothScroll()
  }, 1);
 
 function clearChat(data) {
  console.log(data)
  axios.post("https://chat-backend-node-app.herokuapp.com/api/message/delete" , data).then((res) => {
    setdata(res.data.data)
  });
 }
  return (
    <>
      <div className="ChatPage">
        <div className="row m-0">
          <div className={` sidebarMain mt-5 p-0 col-12 col-lg-3 d-lg-block d-none`}>
            <div className="sidebar">
            <div className="userHeader px-2 ">
              <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex ">
                <div className="userImage"></div>
                <div className="ps-3 text-white d-flex flex-column">
                  <h6 className="m-0">{userObj.userName?.split('')[0].toUpperCase() + userObj.userName?.split('').slice(1).join('')}</h6>
                  <p className="m-0">status</p>
                </div>
              </div>
              <div>
                <BiDotsVerticalRounded size={25} color="white" className="option-icon cursor-pointer" />
                <div className="options py-2">
                  <h5 className="p-0 m-0 py-2 px-3 cursor-pointer" onClick={() => logout()}>Logout</h5>
                </div>
              </div>
              </div>
              <div className="py-3 px-2 pb-1">
                <input type="text" placeholder="Search.."/>
              </div>
            </div>
            <div>
              {
                allUser.filter(x => x.email != userObj.email).map((x, i)=> {
                  let lastCommunication =  data.filter(y => ((y.senderId == userObj?._id) && (y.receiverId == x?._id)) || ((y.senderId == x?._id) && (y.receiverId == userObj?._id))).slice(-1)[0]

                  return <div className={`sidebarUser px-2 d-flex justify-content-between align-items-center cursor-pointer ${x._id == chatUser?._id ? 'activeClass' : ''}`} key={i} onClick={() =>  setchatUser({...x})}>
                            <div className="d-flex">
                              <div className="userImage"></div>
                              <div className="ms-2">
                                <h6 className="m-0 mt-1">{x.userName?.split('')[0].toUpperCase() + x.userName?.split('').slice(1).join('')}</h6>
                                <p className="lastMsg m-0 " style={{fontSize:'14px'}}>{ lastCommunication?.message.length > 25 ?lastCommunication?.message.substring(0,25) + '...' : lastCommunication?.message}</p>
                              </div>
                            </div>
                            <div>
                              <p className="m-0" style={{fontSize:'14px'}}>{lastCommunication?.createTime}</p>
                            </div>
                        </div>
                })
              }
            </div>
            </div>
          </div>


          <div className={` sidebarMain p-0 mt-5 col-12 d-lg-none d-block ${showChat ? 'd-none' : ''}`}>
            <div className="sidebar">
            <div className="userHeader px-2 ">
              <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex ">
                <div className="userImage"></div>
                <div className="ps-3 text-white d-flex flex-column">
                  <h6 className="m-0">{userObj.userName?.split('')[0].toUpperCase() + userObj.userName?.split('').slice(1).join('')}</h6>
                  <p className="m-0">status</p>
                </div>
              </div>
              <div>
                <BiDotsVerticalRounded size={25} color="white" className="option-icon cursor-pointer" />
                <div className="options py-2">
                  <h5 className="p-0 m-0 py-2 px-3 cursor-pointer" onClick={() => logout()}>Logout</h5>
                </div>
              </div>
              </div>
              <div className="py-3 px-2 pb-1">
                <input type="text" placeholder="Search.."/>
              </div>
            </div>
            <div>
              {
                allUser.filter(x => x.email != userObj.email).map((x, i)=> {
                  let lastCommunication =  data.filter(y => ((y.senderId == userObj?._id) && (y.receiverId == x?._id)) || ((y.senderId == x?._id) && (y.receiverId == userObj?._id))).slice(-1)[0]

                  return <div className={`sidebarUser px-2 d-flex justify-content-between align-items-center cursor-pointer ${x._id == chatUser?._id ? 'activeClass' : ''}`} key={i} onClick={() =>  {setchatUser({...x}); setshowChat(true)}}>
                            <div className="d-flex">
                              <div className="userImage"></div>
                              <div className="ms-2">
                                <h6 className="m-0 mt-1">{x.userName?.split('')[0].toUpperCase() + x.userName?.split('').slice(1).join('')}</h6>
                                <p className="lastMsg m-0 " style={{fontSize:'14px'}}>{ lastCommunication?.message.length > 25 ?lastCommunication?.message.substring(0,25) + '...' : lastCommunication?.message}</p>
                              </div>
                            </div>
                            <div>
                              <p className="m-0" style={{fontSize:'14px'}}>{lastCommunication?.createTime}</p>
                            </div>
                        </div>
                })
              }
            </div>
            </div>
          </div>


          {
            chatUser ? 
            <>
              <div className={`col-12 col-lg-9 chatSection`}>
                    <div className="chatHeader px-2 d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                      <BiLeftArrowCircle size={30} className={`me-4 mt-2 cursor-pointer  ${showChat ? 'd-block' : 'd-none'}`} onClick={() =>  setshowChat(false)} />
                        <div className="userImage"></div>
                        <div className="ps-3 d-flex flex-column">
                          <h6 className="m-0">{chatUser ? (chatUser.userName?.split('')[0].toUpperCase() + chatUser.userName?.split('').slice(1).join('')) : ''}</h6>
                          <p className="m-0">status</p>
                        </div>
                      </div>
                      <div className="position-relative">
                        <BiDotsVerticalRounded size={25} className={`dot-3-icon cursor-pointer `}  />
                        <div className="dot-3 py-2">
                          <h5 className="p-0 m-0 py-2 px-3 cursor-pointer" onClick={() => clearChat({senderId : userObj._id , receiverId : chatUser._id})}>Clear chat</h5>
                        </div>
                      </div>
                    </div>
                    <div className="chatDataDiv" ref={divRef}> 
                          {
                            chatWithSelectedUser.map(x => {
                              return x.senderId == userObj?._id ? 
                                  <>
                                  <div className="sentMessage">
                                    <div className="d-flex justify-content-between align-items-center py-2">
                                      <h6 className="mx-2 my-0">You </h6>
                                      <span> {x.createTime}</span>
                                    </div>
                                    <p>{x.message}</p>
                                  </div> 
                                  </> : 
                                  <>
                                  <div className="ReceivedMessage">
                                    <div className="d-flex justify-content-between align-items-center py-2">
                                      <h6 className="mx-2 my-0">{chatUser?.userName} </h6>
                                      <span> {x.createTime}</span>
                                    </div>
                                    <p>{x.message}</p>
                                  </div>
                                  </>
                                
                            })
                          }
                    </div>
                    <div className="chatInputBox">
                        {/* <textarea name="message" value={value.message} className="px-3" placeholder="Type something..." onChange={changeInput}></textarea> */}
                        <input name="message" value={value.message} className="px-3" placeholder="Type something..." onKeyUp={keyUpFun} onChange={changeInput} ></input>
                        <button onClick={() => sendMessage() }><BiSend color="white" size={25} /></button>
                    </div>
              </div>
            </>
            : 
            <>
              <div className="col-9 chatSection p-0 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <h3 className="mb-5 text-white">Start Chat with friends...</h3>
                    <img src="/bg.png" alt="" width='430' height='300' />
                    <p className="mt-4 text-white">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, placeat?</p>
                  </div>
              </div>
              </>
          }
          
        </div>
      </div>
    </>
  );
}

export default ChatPage;
