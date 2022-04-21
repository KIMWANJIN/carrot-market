import { Stream, User } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { formatWithOptions } from "util";
import Layout from "../../components/layout";
import Message from "../../components/message";
import useMutation from "../../libs/client/useMutation";
import useUser from "../../libs/client/useUser";

interface StreamWithUser extends Stream {
  user: User
}

interface MessageWithSender {
  id: number
  message: string
  user: { avater?: string, id: number }
}

interface StreamWithMessages extends Stream {
  message: MessageWithSender[]
}

interface StreamRes {
  ok: boolean
  stream: StreamWithMessages
}

interface MessageFrom {
  message: string
}

const StreamDetail: NextPage = () => {
  const { user } = useUser()
  const router = useRouter()
  const { register, handleSubmit, reset } = useForm<MessageFrom>()
  const { data, mutate } = useSWR<StreamRes>(router.query.id ? `/api/stream/${router.query.id}` : null, { refreshInterval: 1000000 })
  const [sendMessage, { loading, data: messageData }] = useMutation(`/api/stream/${router.query.id}/message`)
  const onValid = (form: MessageFrom) => {
    if (loading) return
    mutate(prev => prev && ({ ...prev, stream: { ...prev.stream, message: [...prev.stream.message, { id: Date.now(), message: form.message, user: { ...user } }] } } as any), false)
    sendMessage(form)
    reset()
  }

  // // when messageData changed refetch the api data
  // useEffect(() => {
  //   if (messageData && messageData.ok) {
  //     mutate() // refetch api data
  //   }
  // }, [messageData, mutate])
  return (
    <Layout canGoBack>
      <div className="py-2 px-4  space-y-4">
        {data?.stream?.liveId ? <iframe
          className="w-full aspect-video rounded-md shadow-sm"
          src={`https://iframe.videodelivery.net/${data?.stream?.liveId}`}
          height="720"
          width="1280"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen={true}
          id="stream-player"
        ></iframe> : null}
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">{data?.stream?.name}</h1>
          <span className="text-2xl block mt-3 text-gray-900">{data?.stream?.price}</span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
          <div className="bg-orange-400 p-5 rounded-md overflow-scroll flex flex-col space-y-3">
            <span>Stream Keys (secret)</span>
            <span className="text-white">
              <span className="font-medium text-gray-800">URL:</span>{" "}
              {data?.stream.liveUrl}
            </span>
            <span className="text-white">
              <span className="font-medium text-gray-800">Key:</span>{" "}
              {data?.stream.liveKey}
            </span>
          </div>

        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.stream?.message?.map(item => <Message key={item.id} message={item.message} reversed={item.user.id === user?.id} />)}
          </div>
          <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
            <form onSubmit={handleSubmit(onValid)} className="flex relative max-w-md items-center  w-full mx-auto">
              <input
                {...register("message", { required: true })}
                type="text"
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button
                  className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StreamDetail;