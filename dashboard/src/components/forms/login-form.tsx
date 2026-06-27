"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2, AlertCircle } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm({ devBypass = false }: { devBypass?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [formError, setFormError] = useState<string | null>(null);
  const [devLoading, setDevLoading] = useState(false);

  const goToDashboard = () => {
    router.push(callbackUrl);
    router.refresh();
  };

  const onDevLogin = async () => {
    setDevLoading(true);
    setFormError(null);
    const result = await signIn("credentials", {
      email: "dev@mruk.co.tz",
      password: "dev-bypass-password",
      redirect: false,
    });
    if (!result || result.error) {
      setFormError("Dev login failed. Check DEV_AUTH_BYPASS in .env.local.");
      setDevLoading(false);
      return;
    }
    goToDashboard();
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginInput) => {
    setFormError(null);
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (!result || result.error) {
      setFormError("Invalid email or password. Please try again.");
      return;
    }
    goToDashboard();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@mruk.co.tz"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || devLoading}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {devBypass && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-3">
            <span className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-xs">dev mode</span>
            <span className="bg-border h-px flex-1" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onDevLogin}
            disabled={isSubmitting || devLoading}
          >
            {devLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Entering…
              </>
            ) : (
              "Continue as Dev Admin"
            )}
          </Button>
        </div>
      )}
    </form>
  );
}
