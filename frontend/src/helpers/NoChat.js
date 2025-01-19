import React from "react";

import { IoMdChatbubbles } from "react-icons/io";

const NoChat= () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-primary h-full cursor-pointer">
      <div className="max-w-md  flex flex-col items-center space-y-6">
        <div className="mx-auto">
        <IoMdChatbubbles color="#1ba098" size={80} />
        </div>
        <h2 className="text-3xl text-fourth font-bold">Welcome!</h2>
        <p className="text-fourth font-semibold">
          Select a conversation to start chatting.
        </p>
      </div>
    </div>
  );
};

export default NoChat;