import { Post, User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";
import FloatingButton from "../../components/floating-button";
import Layout from "../../components/layout";
import useCoords from "../../libs/client/useCoords";
import client from "../../libs/server/prismaClient"

interface PostWithUser extends Post {
  user: User
  _count: { wondering: number, answer: number }
}

interface PostRes {
  posts: PostWithUser[]
}

const Community: NextPage<PostRes> = ({posts}) => {
  // const { lat, lng } = useCoords()
  // const { data } = useSWR<PostRes>(lat && lng ? `/api/posts?lat=${lat}&lng=${lng}` : null)

  return (
    <Layout title="동네생활" hasTabBar>
      <div className="space-y-8 px-4">{
        posts?.map((item) => (
          <Link key={item.id} href={`/community/${item.id}`}>
            <a className="flex flex-col items-start cursor-pointer">
              <span className="flex items-center px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">동네질문</span>
              <div className="mt-2 text-gray-700">
                <span className="text-orange-500 font-medium">Q. </span>{item.question}
              </div>
              <div className="mt-5 flex items-center justify-between w-full text-gray-500 font-medium text-xs">
                <span>{item.user?.name}</span>
                <span>{item.careatedAt}</span>
              </div>
              <div className="flex space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px] w-full">
                <span className="flex space-x-2 items-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>궁금해요 {item._count?.wondering}</span>
                </span>
                <span className="flex space-x-2 items-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                  <span>답변 {item._count?.answer}</span>
                </span>
              </div>
            </a>
          </Link>
        ))}

        <FloatingButton
          href="./community/write">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

// In build time creating HTML pages which has static data
export async function getStaticProps() {
  const posts = await client.post.findMany({
    include: {
      _count: {
        select: { wondering: true, answer: true }
      },
      user: { select: { id: true, name: true, avatar: true } }
    }
  })
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)) 
    }
  }
}

export default Community;