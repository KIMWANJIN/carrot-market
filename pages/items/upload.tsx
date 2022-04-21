import { Product } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";
import useMutation from "../../libs/client/useMutation";

interface ProductForm {
  name: string
  price: number
  description: string
  photo: FileList
}

interface ProductMutation {
  ok: boolean
  product: Product // this data type from prisma schema just like entity of Room android
}

const Upload: NextPage = () => {
  const router = useRouter()
  const { register, handleSubmit, watch } = useForm<ProductForm>()
  const onValid = async ({ name, price, description, photo }: ProductForm) => {
    if (loading) return
    if (photo && photo.length > 0) {
      // Ask URL to CloudFlare to upload avartar image
      const { uploadURL } = await(await fetch(`/api/files`)).json()
      // Upload Photo file to CloudFlare by creating a form taking photo file and its name to URL received and get id to call from cloudflare 
      const form = new FormData()
      form.append("file", photo[0], name)
      const { result: { id } } = await(await fetch(uploadURL, { method: "POST", body: form })).json()
      // Update Profile by calling editUserProfile method
      uploadProduct({ name, price, description, photo: id })
    } else {
      uploadProduct({ name, price, description })
    }

  }
  const [uploadProduct, { loading, data }] = useMutation<ProductMutation>("/api/products/")
  useEffect(() => { if (data?.ok) { router.push(`/items/${data.product.id}`) } }, [data, router])
  const photoFiles = watch("photo") // Observe input of form
  const [phothPreView, setPhotoPreView] = useState("")
  useEffect(() => {
    if (photoFiles && photoFiles.length > 0) {
      const photoFile = photoFiles[0]
      setPhotoPreView(URL.createObjectURL(photoFile))
    }
  }, [photoFiles])
  return (
    <Layout canGoBack title="중고거래 글쓰기">
      <form onSubmit={handleSubmit(onValid)} className="px-4 py-4">
        <div>
          {phothPreView ? (<img src={phothPreView} className="w-full h-46 text-gray-500" />) :
            (<label className="w-full flex items-center justify-center border-2 border-dashed  border-gray-300 h-48 rounded-lg cursor-pointer text-gray-500 hover:text-orange-500">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input {...register("photo")} accept="image/*" type="file" className="hidden" />
            </label>)}
        </div>
        <div className="my-4">
          <Input label="Title" name="title" register={register("name", { required: true })} type="text" />
          <Input label="Price" name="price" kind="price" register={register("price", { required: true })} type="number" />
          <TextArea label="Description" name="desc" register={register("description", { required: true })} />
        </div>
        <Button text={loading ? "Loading..." : "Upload product"} />
      </form>
    </Layout>
  );
};

export default Upload;