import { HomeIcon } from "lucide-react"
import { SignupForm } from "@/components/authentication/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gray-900 p-6 md:p-10">
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium text-white hover:text-blue-400 transition-colors">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500 text-white">
            <HomeIcon className="size-4" />
          </div>
          Apna Ghar :)
        </a>
        <SignupForm />
      </div>
    </div>
  )
} 