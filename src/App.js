import './App.css';
// import socketIO from 'socket.io-client'
import  {BrowserRouter ,Routes,  Route, Navigate } from 'react-router-dom'
import Register from './Component/Register/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Component/Login/Login';
import ChatPage from './Component/ChatPage/ChatPage';

// const ENDPOINT = 'http://localhost:4000/'
// const socket = socketIO(ENDPOINT , {transports : ['websocket']})

function App() {

  // socket.on('connect' , (data)=> {
  //   console.log('client connect')
  // })

  // socket.emit('msg' , 'Ya hii')

  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            {
              localStorage.getItem('isLogin') !== null ? 
              <>
                 <Route path='/chat' element={<ChatPage />}  />
                 <Route path='/register' element={<Navigate to="/" />} />
                 <Route path='/' element={ <Navigate to="/chat" />} />
                 <Route path='/*' element={ <Navigate to="/" />} />
              </> : 
              <>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/chat' element={<Navigate to="/" />} />
                <Route path='/*' element={<Navigate to="/" />} />
              </>

            }
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
