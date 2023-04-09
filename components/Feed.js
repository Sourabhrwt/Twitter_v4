import { SparklesIcon } from "@heroicons/react/solid";
import Input from "./Input";
import Post from "./Post";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase.js";
import { AnimatePresence, motion } from "framer-motion";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
  }, [db]);
  return (
    <div className="xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky top-0 z-50 border-b border-gray-200 bg-white">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        <div className="hoverEffect flex items-center justify-center px-0 h-9 w-9 ml-auto">
          <SparklesIcon className="h-5" />
        </div>
      </div>
      <Input />
      <AnimatePresence>
        {posts.map((post) => {
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <Post key={post.id} id={post.id} post={post} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
