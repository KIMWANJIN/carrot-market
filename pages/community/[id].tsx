import { Answer, Post, Product, User } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Button from "../../components/button";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";
import useMutation from "../../libs/client/useMutation";
import { jcn } from "../../libs/client/utils";

interface PostWithUser extends Post {
  user: User
  _count: { answer: number, wondering: number }
  answer: AnswerWithUser[]
}

interface AnswerWithUser extends Answer {
  user: User
}

interface PostDetailRes {
  ok: boolean
  post: PostWithUser
  isWondering: boolean
}

interface AnswerForm {
  user: User
  answer: string
}

interface AnswerMutation {
  ok: boolean
  answer: Answer // this data type from prisma schema just like entity of Room android
}

interface AnswerRes {
  ok: boolean
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter()
  const { data, mutate } = useSWR<PostDetailRes>(router.query.id ? `/api/posts/${router.query.id}` : null)
  const [setWordering, { loading: loadingWonder }] = useMutation(`/api/posts/${router.query.id}/wonder`)
  const { register, handleSubmit, reset } = useForm<AnswerForm>()
  const [postAnswer, { loading, data: ansData }] = useMutation<AnswerMutation>(`/api/posts/${router.query.id}/answer`)
  const onValid = (answer: AnswerForm) => {
    if (loading) return
    postAnswer(answer)
  }
  const onWonderingClick = () => {
    if (!data) return;
    // Just mutate some data in all data in cache by SWR. if want to api call and reupdate, last argument should be true
    mutate({
      ...data,
      post: {
        ...data.post,
        _count: {
          ...data.post._count,
          wondering: data.isWondering ? data?.post._count.wondering - 1 : data?.post._count.wondering + 1
        }
      },
      isWondering: !data.isWondering
    }, false)
    if (!loadingWonder) { setWordering({}); console.log(loadingWonder) };
  }
  useEffect(() => { if (ansData && ansData.ok) { reset(); mutate() } }, [ansData, reset])
  return (
    <Layout canGoBack>
      <div>
        <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          동네질문
        </span>
        <div className="flex mb-3 px-4 cursor-pointer pb-3  border-b items-center space-x-3">
          {data?.post?.user?.avatar ? <img src={`https://imagedelivery.net/Lwkg5IUHN6-qKP-99Ln9Uw/${data?.post?.user?.avatar}/avatar`} className="w-16 h-16 rounded-full" /> :
            <div className="w-16 h-16 bg-slate-500 rounded-full" />}
          <div>
            <p className="text-sm font-medium text-gray-700">{data?.post?.user?.name}</p>
            <p className="text-xs font-medium text-gray-500">
              View profile &rarr;
            </p>
          </div>
        </div>
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="text-orange-500 font-medium">Q.</span>
            {data?.post?.question}
          </div>
          <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px]  w-full">
            <button onClick={onWonderingClick} className={jcn("flex space-x-2 items-center text-sm", data?.isWondering ? "text-green-600" : "")}>
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
              <span>{`궁금해요 ${data?.post._count.wondering}`}</span>
            </button>
            <span className="flex space-x-2 items-center text-sm">
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
              <span>{`답변 ${data?.post._count.answer}`}</span>
            </span>
          </div>
        </div>
        <div className="px-4 my-5 space-y-5">
          {data?.post.answer.map((item) => (
            <div key={item.id} className="flex items-start space-x-3">
                        {item.user.avatar ? <img src={`https://imagedelivery.net/Lwkg5IUHN6-qKP-99Ln9Uw/${item.user.avatar}/avatar`} className="w-12 h-12 rounded-full" /> :
            <div className="w-12 h-12 bg-slate-500 rounded-full" />}
              <div>
                <span className="text-sm block font-medium text-gray-700">
                  {`${item.user.name} ${item.updatedAt}`}
                </span>
                <span className="text-xs text-gray-500 block ">{item.careatedAt}</span>
                <p className="text-gray-700 mt-2">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit(onValid)} className="px-4 space-y-4">
          <TextArea register={register("answer", { required: true })} requried placeholder="Answer this question!" />
          <Button text={loading ? "Loading..." : "Reply"} />
        </form>

      </div>
    </Layout>
  );
};

export default CommunityPostDetail;