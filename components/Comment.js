import {
  ChartBarIcon,
  ChatIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  DotsHorizontalIcon,
  HeartIcon as HeartIconFilled,
} from "@heroicons/react/solid";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { db } from "../firebase";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atom/modalAtom";
import { useRouter } from "next/router";

export default function Post({ commentId, comment, originalPostId }) {
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", originalPostId, "comments", commentId, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, commentId, originalPostId]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [likes]);

  async function likeComment() {
    if (session) {
      if (hasLiked) {
        await deleteDoc(
          doc(
            db,
            "posts",
            originalPostId,
            "comments",
            commentId,
            "likes",
            session?.user.uid
          )
        );
      } else {
        await setDoc(
          doc(
            db,
            "posts",
            originalPostId,
            "comments",
            commentId,
            id,
            "likes",
            session?.user.uid
          ),
          {
            username: session.user.username,
          }
        );
      }
    } else {
      signIn();
    }
  }

  async function deleteComment() {
    if (window.confirm("Are you sure you want to delete this comment?"))
      deleteDoc(doc(db, "posts", originalPostId, "comments", commentId));
  }

  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200 pl-20">
      {/* image */}
      <img
        src={comment?.userImg}
        alt="user"
        className="h-11 w-11 rounded-full mr-4 "
      />
      {/* right side */}
      <div className="flex-1">
        {/* header */}

        <div className="flex items-center justify-between">
          {/* post user info */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {comment?.name}
            </h4>
            <span className="text-sm sm:text-[15px]">
              @{comment?.username} -{" "}
            </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{comment?.timestam?.toDate()}</Moment>
            </span>
          </div>

          {/* dot icon */}
          <DotsHorizontalIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2" />
        </div>

        {/* post text */}

        <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
          {comment?.comment}
        </p>

        {/* icons */}

        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatIcon
              onClick={() => {
                if (!session) {
                  signIn();
                } else {
                  setOpen(!open);
                  setPostId(originalPostId);
                }
              }}
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100 "
            />
          </div>
          {session?.user.uid === comment?.id && (
            <TrashIcon
              onClick={deleteComment}
              className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100 "
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likeComment}
                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100 "
              />
            ) : (
              <HeartIcon
                onClick={likePost}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100 "
              />
            )}
            {likes.length > 0 && (
              <span
                className={`${hasLiked && "text-red-600"} text-sm select-none`}
              >
                {likes.length}
              </span>
            )}
          </div>
          <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100 " />
          <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100 " />
        </div>
      </div>
    </div>
  );
}
