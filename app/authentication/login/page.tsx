import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/app/authentication/login/UserAuthForm"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative grid h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900">
            <div className="relative w-full h-full mx-auto">
              <Image
                src="/peguin.jpg"
                layout='fill'
                className="rounded-t-md"
                objectFit='cover'
                alt="News"
              />
            </div>
          </div>
          <Link href="/" className="relative z-20 flex items-center text-lg font-medium">
            <Image
              src="/logos/Zooma_White_Text.svg"
              alt="logo"
              width={150}
              height={150}
            />
          </Link>
          <div className="relative z-20 mt-auto text-light">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;People forget the good that zoos do. If it were not for zoos, we would have so many species that would be extinct today.&rdquo;
              </p>
              <footer className="text-sm">Betty White</footer>
            </blockquote>
          </div>
        </div>
        <Link href="/" className="absolute left-10 top-10 z-20 flex lg:hidden">
          <Image
            src="/logos/Zooma_Black_Text.svg"
            alt="logo"
            width={150}
            height={150}
          />
        </Link>
        <div className="lg:p-8 relative">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome to Zooma
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              Don&lsquo;t have an account? {" "}
              <Link
                href="/authentication/signup"
                className="underline underline-offset-4 text-primary hover:text-primary-hover font-bold"
              >
                Register here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}