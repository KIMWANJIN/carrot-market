import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";
import useMutation from "../../libs/client/useMutation";
import useUser from "../../libs/client/useUser";

interface ProfileForm {
  name?: string
  email?: string
  phone?: string
  avatar?: FileList
  formErrors?: string
}

interface EditProfileRes {
  ok: boolean
  dupError?: string
}

const EditProfile: NextPage = () => {
  const { register, setValue, handleSubmit, setError, formState: { errors }, clearErrors, watch } = useForm<ProfileForm>()
  const { user } = useUser()
  const [editUserProfile, { data, loading }] = useMutation<EditProfileRes>(`/api/users/connuser`)
  const onValid = async ({ name, email, phone, avatar }: ProfileForm) => {
    if (loading) return
    if (name === "" && email === "" && phone === "") {
      return setError("formErrors", { message: "e-mail 또는 휴대전화번호 중 하나를 입력해 주세요." })
    }
    if (avatar && avatar.length > 0 && user?.id) {
      // Ask URL to CloudFlare to upload avartar image
      const { uploadURL } = await (await fetch(`/api/files`)).json()
      // Upload Avartar file to CloudFlare URL
      const form = new FormData()
      form.append("file", avatar[0], String(user?.id))
      const { result: { id } } = await (await fetch(uploadURL, { method: "POST", body: form })).json()
      // Update Profile by calling editUserProfile method
      editUserProfile({ name, email, phone, avatar: id })
    } else {
      editUserProfile({ name, email, phone })
    }
  }
  useEffect(() => {
    if (user?.name) setValue("name", user.name)
    if (user?.email) setValue("email", user.email)
    if (user?.phone) setValue("phone", user.phone)
    if (user?.avatar) setAvatarPreview(`https://imagedelivery.net/Lwkg5IUHN6-qKP-99Ln9Uw/${user?.avatar}/avatar`)
  }, [user, setValue])
  useEffect(() => {
    if (data && !data.ok && data.dupError) {
      console.log(data?.dupError)
      setError("formErrors", { message: data.dupError })
    }
  }, [data, setError])
  const [avatarPreview, setAvatarPreview] = useState("")
  const avatar = watch("avatar")
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const avatarFile = avatar[0]
      const avatarUrl = URL.createObjectURL(avatarFile) // get location of avatar in memory
      setAvatarPreview(avatarUrl)
    }
  }, [avatar])
  console.log(watch("avatar"))
  return (
    <Layout canGoBack title="내정보 수정">
      <form onSubmit={handleSubmit(onValid)} className="py-4 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? <img src={avatarPreview} className="w-14 h-14 rounded-full bg-slate-500" /> : <div className="w-14 h-14 rounded-full bg-slate-500" />}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input {...register("avatar")} id="picture" type="file" className="hidden" accept="image/*" />
          </label>
        </div>
        <Input register={register("name")} label="User name" name="name" type="text" />
        <Input register={register("email")} label="Email adress" name="email" type="email" />
        <Input register={register("phone")} label="Phone number" name="phone" type="number" kind="phone" />
        {errors.formErrors ? <span className="block text-red-600 font-[600] text-center">{errors.formErrors?.message}</span> : null}
        <Button onClick={() => clearErrors()} text={loading ? "Loading..." : "Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfile;