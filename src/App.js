import {BrowserRouter,Routes, Route} from "react-router-dom";
import ChatRoomList from "./chat/chatRoomList";
import Home from "./home";
import Header from "./header";
import ChattingRoom from "./chat/chattingRoom";

function App() {
  return (
    <BrowserRouter>
        <Header/>
        <Routes>
            <Route path={'/'} element={<Home/>}></Route>
            <Route path={'/chatRoomList'} element={<ChatRoomList/>}></Route>
            <Route path={'/chatRoomEnter'} element={<ChattingRoom/>}></Route>
        </Routes>
    </BrowserRouter>

  );
}

export default App;
