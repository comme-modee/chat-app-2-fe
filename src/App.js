import "./App.css";
import socket from "./server";
import { useEffect, useState } from 'react'
import InputField from './components/InputField/InputField'
import MessageContainer from './components/MessageContainer/MessageContainer'

function App() {
  const [ user, setUser ] = useState(null)
  const [ message, setMessage ] = useState('')
  const [ messageList, setMessageList ] = useState([]) 
  console.log('messageList', messageList)
  useEffect(()=>{
    socket.on('message', (message) => {
      //서버가 유저 전체에게 보내준 메세지 저장
      setMessageList((prev) => prev.concat(message)) //concat: 뒤에 덧붙임
    })
    askUserName();
  },[])

  const askUserName = () => {
    const userName = prompt('당신의 이름을 입력하세요')

    //.emit(대화의 제목, 보낼 내용, 콜백함수(이 소통이 끝난 후에 처리가 잘 되었는지 응답을 받을 수 있는 함수))
    socket.emit('login', userName, (res) => {
      console.log('로그인 후에 백엔드에서 온 응답', res)
      if(res?.ok) {
        setUser(res.data)
      }
    })
  }

  const sendMessage = (e) => {
    e.preventDefault();

    //입력받은 input 백엔드로 message를 보낸다
    socket.emit('sendMessage', message, (res) => {
      console.log('sendMessage 보내고 받은 응답', res)
    })
  }

  return (
    <div>
      <div className="App">
        <MessageContainer
          messageList={messageList}
          user={user}
        />
        <InputField
          message={message}  
          setMessage={setMessage}  
          sendMessage={sendMessage}  
        />
      </div>
    </div>
  );
}

export default App;
