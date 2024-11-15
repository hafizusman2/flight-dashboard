"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/app/components/common/button";
import { Input } from "@/app/components/common/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/app/components/common/form";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { loginUser, resetError } from "@/app/lib/features/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    dispatch(resetError());
    const response = (await dispatch(loginUser(data))) as {
      payload: { success: boolean };
    };
    if (response.payload.success) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-600 p-4">
      <div className="w-full max-w-md bg-black rounded-lg shadow-md p-6 border">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-md ">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-md">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full mt-4 bg-green-500 text-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="lightGreen"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="lightGreen"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "SignIn"
              )}
            </Button>
          </form>
        </Form>
        <div className="w-full mt-2">
          {error && (
            <div className="p-4 bg-red-600 text-white rounded-md">{error}</div>
          )}
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-400">
            Do not have an account?{" "}
            <Link href="/register" legacyBehavior>
              <a className="text-green-500">Register Now</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
