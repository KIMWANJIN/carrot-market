import { Stream } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import FloatingButton from "../../components/floating-button";
import Layout from "../../components/layout";

interface StreamRes {
  ok: boolean
  streams: Stream[]
}

const Live: NextPage = () => {
  const { data } = useSWR<StreamRes>("/api/stream")
  return (
    <Layout title="라이브" hasTabBar>
      <div className="divide-y-[1px] space-y-4">
        {data?.streams?.map((item) => (
          <Link key={item.id} href={`/streams/${item.id}`}>
            <div className="pt-4  px-4" >
              <div className="w-full relative rounded-md overflow-hidden shadow-sm bg-slate-300 aspect-video">
                <Image layout="fill" src={`http://videodelivery.net/${item.liveId}/thumbnails/tuumbnail.jpg?height=120`} />
              </div>
              <h1 className="text-2xl mt-2 font-bold text-gray-900">{item.name}</h1>
            </div>
          </Link>
        ))}
        <FloatingButton href="./streams/create">
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};
export default Live;