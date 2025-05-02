import { FileText } from "lucide-react";
import { LoginForm } from "@/app/Login/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <FileText className="size-4" />
            </div>
            FACTIVA
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
        <Image
          src="/placeholder.svg"
          alt="Image"
          layout="fill"
          objectFit="cover"
          className="dark:brightness-[0.2] dark:grayscale"
        />
    </div>
  );
}
