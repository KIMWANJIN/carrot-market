import { Stream } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";
import useMutation from "../../libs/client/useMutation";
 
interface StreamForm {
  name: string
  price: number
  description: string
}

interface StreamRes {
  ok: boolean
  stream: Stream
}

const Create: NextPage = () => {
  const router = useRouter()
  const [createStream, { data, loading }] = useMutation<StreamRes>("/api/stream")
  const { register, handleSubmit } = useForm<StreamForm>()
  const onValid = (form: StreamForm) => {
    if (loading) return
    createStream(form)
  }
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`)
    }

  }, [data, router])
  return (
    <Layout canGoBack>
      <form onSubmit={handleSubmit(onValid)} className=" space-y-5 px-4">
        <Input register={register("name", {required: true})} label="Name" name="name" type="text" />
        <Input register={register("price", {required: true, valueAsNumber: true})} label="Price" name="price" kind="price" type="text" />
        <TextArea register={register("description", {required: true})} label="Description" name="desc" />
        <Button text={loading ? "Loading..." : "Go live"} />
      </form>
    </Layout>
  )
}

export default Create;