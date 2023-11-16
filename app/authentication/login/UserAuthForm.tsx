"use client"

import * as React from "react"

import { Icons } from "@/components/shared/Icons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { loginUser } from "@/lib/api/userAPI"
import { cn } from "@/lib/utils"
import useUserState from "@/stores/user-store"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3,{
    message: "Password must be at least 3 characters long",
  }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const { setCurrentUser } = useUserState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // 1. Define your form.
  const form = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formLoginSchema>) {
    setIsLoading(true)

    // 3. Send the data somewhere
    loginUser(values.email, values.password)
    .then((response) => {
      let {
        data, error
      } = response;
      if(error != null) throw new Error(error)
      
      const { loginResponse } = data

      setCurrentUser(data.user);
      localStorage.setItem("accessToken", loginResponse.accessToken);

      // amdin
      if(loginResponse.user.roleId === 4 ){
        window.location.href = "/dashboard";
      }
      // staff
      else if(loginResponse.user.roleId === 1){
        window.location.href = "/dashboard";
      }
      // zookeeper
      else if(loginResponse.user.roleId === 2){
        window.location.href = "/dashboard";
      }else{
        router.push(callbackUrl);
      }
    })
    .catch((error) => {
      toast({
        title: "Login Error",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-light">{JSON.stringify(error.message, null, 2)}</code>
          </pre>
        )
      })
      setIsLoading(false);
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  return (
    <div className={cn("grid gap-6 space-y-4", className)} {...props}>
      <Form {...form}>
        <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="w-full">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login with Email
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </div>
  )
}