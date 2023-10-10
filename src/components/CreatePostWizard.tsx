import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { Spinner } from "./ui";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

type FormValues = {
  post: string;
};

const CreatePostWizard = () => {
  const [input, setInput] = useState("");
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { user } = useUser();

  const ctx = api.useContext();

  if (!user) return null;

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      void ctx.posts.getAll.invalidate();
      reset();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;

      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
        return;
      }

      toast.error(`Failed to post - ${e.message}`);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutate({ content: data.post });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        type="text"
        {...register("post", { required: true })}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (input !== "" && e.key === "Enter") {
            e.preventDefault();
            onSubmit({ post: e.currentTarget.value });
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && <button type="submit">Post</button>}
      {isPosting && (
        <div className="flex items-center justify-center">
          <Spinner size={20} />
        </div>
      )}
    </form>
  );
};

export default CreatePostWizard;
