import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/api/useAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useToggle } from "@/hooks/useToggle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginFormData } from "@/types/auth";
import { loginFormSchema } from "@/types/auth";
import { toast } from "sonner";

export default function LoginForm() {
  const { mutate: loginApi, isPending } = useLogin();
  const { login: authLogin } = useAuth();
  const id = useId();
  const [isVisible, toggleVisibility] = useToggle(false);
  const navigate = useNavigate();
  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    clearErrors();
    loginApi(
      { email: data.email, password: data.password },
      {
        onSuccess: (response) => {
          // Store token and user data in auth context
          authLogin(response.data);
          toast.success("Login successful");
          navigate("/workspaces");
        },
        onError: (error: Error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen max-w-lg mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Sign in to Collabix
        </h1>
        <p className="text-gray-600">
          One solution for all your business collaboration problems
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* Email Field */}
        <div className="*:not-first:mt-2">
          <Label htmlFor={`${id}-email`}>Email</Label>
          <Input
            id={`${id}-email`}
            placeholder="Enter your email"
            className="py-5"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="*:not-first:mt-2">
          <Label htmlFor={`${id}-password`}>Password</Label>
          <div className="relative">
            <Input
              id={`${id}-password`}
              className="pe-9 py-5"
              placeholder="Password"
              type={isVisible ? "text" : "password"}
              {...register("password")}
            />
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls={`${id}-password`}
            >
              {isVisible ? (
                <EyeOffIcon size={16} aria-hidden="true" />
              ) : (
                <EyeIcon size={16} aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me and Forgot password */}
        <div className="flex items-center justify-between">
          <div />
          <Link
            to="/auth/forgot-password"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Error Message */}
        {errors.root && (
          <div className="text-red-600 text-sm text-center">
            {errors.root.message}
          </div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isPending ? "Signing In..." : "Sign In"}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isPending}
          variant="outline"
          className="w-full h-12"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign In with Google
        </Button>
      </form>

      {/* Sign Up Link */}
      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-gray-900 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
