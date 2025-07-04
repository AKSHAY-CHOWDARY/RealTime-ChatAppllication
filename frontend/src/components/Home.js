import React from 'react';
import SideBar from './SideBar';
import { useSelector } from 'react-redux';
import NoChat from '../helpers/NoChat';
import ChatContainer from './ChatContainer';

function Home() {
  const { selectedUser } = useSelector((state) => state.chatState);

  return (
    <div className="h-screen bg-secondary text-black pt-10 lg:p-14">
      <div className="container shadow-custom bg-white mx-auto flex h-full">
        {/* Sidebar */}
        <div className="w-1/4 border-r border-gray-300">
          <SideBar />
        </div>

        {/* Main Chat Section */}
        <div className="w-3/4">
          {selectedUser._id? <ChatContainer /> : <NoChat />}
        </div>
      </div>
    </div>
  );
}

export default Home;
