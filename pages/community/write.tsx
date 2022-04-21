import { Post } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";
import useCoords from "../../libs/client/useCoords";
import useMutation from "../../libs/client/useMutation";

interface WriteForm {
  question: string
}

interface WriteRes {
  ok: boolean
  post: Post
}

const Write: NextPage = () => {
  const router = useRouter()
  const { register, handleSubmit } = useForm<WriteForm>()
  const [post, { loading, data }] = useMutation<WriteRes>("/api/posts")
  const { lat, lng } = useCoords()
  const onValid = (data: WriteForm) => {
    if (loading) return
    post({ ...data, lat, lng })
  }
  useEffect(() => { if (data && data.ok) { router.push(`/community/${data.post.id}`) } }, [data, router])
  return (
    <Layout canGoBack title="동네생활 질문하기">
      <form onSubmit={handleSubmit(onValid)} className="px-4">
        <TextArea register={register("question", { required: true })} placeholder="Ask a question!" />
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;