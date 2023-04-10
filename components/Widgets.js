import { SearchIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import News from "./News";
import { AnimatePresence, motion } from "framer-motion";

export default function Widgets({ newsResult, randomUsers }) {
  const [articleNum, setArticleNum] = useState(3);
  const [randomUser, setRandomUser] = useState(3);
  return (
    <div className="xl:w-[600px] hidden lg:inline ml-8 spac-y-5">
      <div className="w-[90%] xl:w-[75%] sticky top-0 bg-white py-1.5 z-50">
        <div className="flex items-center p-3 rounded-full relative">
          <SearchIcon className="h-5 cursor-pointer z-50 text-gray-500" />
          <input
            className="absolute inset-0 rounded-full pl-11 border-gray-500 text-gray-700 focus:shadow-lg focus:bg-white bg-gray-100"
            type="text"
            placeholder="Search Twitter"
          />
        </div>
      </div>
      <div className="text-gray-700 space-y-3">
        <h4 className="font-bold text-xl px-4">Whats Happening</h4>
        <AnimatePresence>
          {newsResult.slice(0, articleNum).map((article) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <News key={article.title} article={article} />
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => setArticleNum(articleNum + 3)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
        >
          Show more
        </button>
      </div>
      <div className="sticky top-16 text-gray-700 space-y-3 bg-gray-100 pt-2 rounded-xl w-[90%] xl:w-[75%]">
        <h4 className="font-bold text-xl px-4 ">Who to follow</h4>
        <AnimatePresence>
          {randomUsers.slice(0, randomUser).map((user) => (
            <motion.div
              key={user.login.username}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div
                key={user.login.username}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200  transition duration-500 ease-out"
              >
                <img
                  className="rounded-full"
                  width="40"
                  src={user.picture.thumbnail}
                />
                <div className="truncate ml-4 leading-5">
                  <h4 className="font-bold hover:underline text-[14px] truncate">
                    {user.login.username}
                  </h4>
                  <h5 className="text-[13px] text-gray-500 truncate">
                    {user.name.first + "" + user.name.last}
                  </h5>
                </div>
                <button className="ml-auto bg-black text-white rounded-full text-sm px-3.5 py-1.5 font-bold">
                  Follow
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          onClick={() => setRandomUser(randomUser + 3)}
          className="text-blue-300 pl-4 pb-3 hover:text-blue-400 "
        >
          Show more
        </button>
      </div>
    </div>
  );
}
