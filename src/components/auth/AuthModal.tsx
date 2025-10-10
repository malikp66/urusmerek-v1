"use client";

import * as React from "react";
import { X, Mail, Lock, User2, ShieldCheck, Chrome, Facebook } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useGlobalAlert } from "@/components/global-alert/GlobalAlertProvider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// --- Validasi
const emailSchema = z.string().email("Format email tidak valid");
const passwordRules =
  "Min 6 karakter, wajib huruf besar, huruf kecil, angka";
const passwordSchema = z
  .string()
  .min(6, passwordRules)
  .regex(/[a-z]/, "Wajib mengandung huruf kecil")
  .regex(/[A-Z]/, "Wajib mengandung huruf besar")
  .regex(/[0-9]/, "Wajib mengandung angka");

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password wajib diisi"),
});
type LoginValues = z.infer<typeof loginSchema>;

const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Nama terlalu pendek")
    .max(60, "Nama terlalu panjang")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ''\s.-]+$/, "Nama hanya boleh huruf & spasi"),
  email: emailSchema,
  password: passwordSchema,
});
type SignupValues = z.infer<typeof signupSchema>;

type AuthModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAuthenticated?: () => void;
  hasSession?: boolean;
};

type ApiResponse<T = unknown> = {
  ok: boolean;
  message?: string;
  data?: T;
};

async function sendAuthRequest<T>(
  url: string,
  payload: unknown,
  fallbackMessage: string
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  let body: ApiResponse<T> | null = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok || !body?.ok) {
    throw new Error(body?.message ?? fallbackMessage);
  }

  return body;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function AuthModal({
  open,
  onOpenChange,
  onAuthenticated,
  hasSession = false,
}: AuthModalProps) {
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const router = useRouter();
  const pathname = usePathname();
  const { showAlert } = useGlobalAlert();

  const mitraPanelPath = "/mitra/affiliates";

  // Login form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loggingIn },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  // Signup form
  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isSubmitting: signingUp },
    watch,
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const pwd = watch("password");

  React.useEffect(() => {
    if (!hasSession) {
      return;
    }

    setMode("login");
    if (open) {
      onOpenChange(false);
    }
  }, [hasSession, open, onOpenChange]);

  const handlePostAuthSuccess = React.useCallback(() => {
    setMode("login");
    onOpenChange(false);
    onAuthenticated?.();

    if (pathname !== mitraPanelPath) {
      router.push(mitraPanelPath);
    } else {
      router.refresh();
    }
  }, [mitraPanelPath, onAuthenticated, onOpenChange, pathname, router]);

  async function onLogin(values: LoginValues) {
    try {
      const result = await sendAuthRequest(
        "/api/mitra/login",
        values,
        "Terjadi kendala saat memproses permintaan login."
      );

      showAlert({
        tone: "success",
        title: "Login berhasil",
        description:
          result.message ?? "Selamat datang kembali di portal Mitra UrusMerek.",
      });
      handlePostAuthSuccess();
    } catch (error) {
      console.error(error);
      showAlert({
        tone: "error",
        title: "Gagal masuk",
        description: getErrorMessage(
          error,
          "Terjadi kendala saat memproses permintaan login."
        ),
      });
    }
  }

  async function onSignup(values: SignupValues) {
    try {
      const result = await sendAuthRequest(
        "/api/mitra/signup",
        values,
        "Terjadi kendala saat memproses pendaftaran akun."
      );

      showAlert({
        tone: "success",
        title: "Akun berhasil dibuat",
        description:
          result.message ?? "Anda dapat langsung masuk menggunakan kredensial baru.",
      });
      handlePostAuthSuccess();
    } catch (error) {
      console.error(error);
      showAlert({
        tone: "error",
        title: "Pendaftaran gagal",
        description: getErrorMessage(
          error,
          "Terjadi kendala saat memproses pendaftaran akun."
        ),
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
      <DialogContent
        className={cn(
          "fixed left-1/2 top-1/2 z-[61] w-[92vw] max-w-[440px] -translate-x-1/2 -translate-y-1/2",
          "rounded-[32px] border border-black/[0.08] bg-white/98 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl",
          "supports-[backdrop-filter]:bg-white/95",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        )}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl flex items-center justify-center bg-[linear-gradient(135deg,#ff4d4d_0%,#dc2626_45%,#a10000_100%)] shadow-[0_6px_14px_-6px_rgba(220,38,38,.45)]">
              <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 leading-tight">Mitra UrusMerek</p>
              <p className="text-xs text-gray-500">Portal Mitra Resmi</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="h-10 w-10 inline-flex items-center justify-center rounded-2xl hover:bg-gray-100 transition-colors duration-200"
            aria-label="Tutup"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* switcher segmented */}
        <div className="mb-8 flex items-center gap-1 rounded-2xl p-1.5 bg-gray-50 border border-gray-200/60">
          <button
            onClick={() => setMode("login")}
            className={cn(
              "flex-1 h-11 px-6 inline-flex items-center justify-center rounded-xl text-[15px] font-semibold transition",
              mode === "login"
                ? "text-white bg-[linear-gradient(135deg,#ff4d4d_0%,#dc2626_45%,#a10000_100%)] border border-white/20 shadow-[inset_0_-1px_0_rgba(0,0,0,.08),0_6px_14px_-6px_rgba(220,38,38,.45)]"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={cn(
              "flex-1 h-11 px-6 inline-flex items-center justify-center rounded-xl text-[15px] font-semibold transition",
              mode === "signup"
                ? "text-white bg-[linear-gradient(135deg,#ff4d4d_0%,#dc2626_45%,#a10000_100%)] border border-white/20 shadow-[inset_0_-1px_0_rgba(0,0,0,.08),0_6px_14px_-6px_rgba(220,38,38,.45)]"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Daftar
          </button>
        </div>

        {/* forms */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-5">
            <FormField
              label="Email"
              error={loginErrors.email?.message}
              icon={<Mail className="h-4 w-4" />}
            >
              <input
                type="email"
                autoComplete="email"
                placeholder="nama@gmail.com"
                className={inputClass(loginErrors.email)}
                {...loginRegister("email")}
              />
            </FormField>

            <FormField
              label="Password"
              error={loginErrors.password?.message}
              icon={<Lock className="h-4 w-4" />}
            >
              <input
                type="password"
                autoComplete="current-password"
                placeholder="********"
                className={inputClass(loginErrors.password)}
                {...loginRegister("password")}
              />
            </FormField>

            <button
              type="submit"
              disabled={loggingIn}
              className={cn(
                "w-full h-12 rounded-2xl text-[15px] font-semibold text-white",
                "bg-[linear-gradient(135deg,#ff4d4d_0%,#dc2626_45%,#a10000_100%)]",
                "border border-white/20 shadow-[inset_0_-1px_0_rgba(0,0,0,.08),0_6px_14px_-6px_rgba(220,38,38,.45)]",
                "hover:shadow-[inset_0_-1px_0_rgba(0,0,0,.12),0_10px_18px_-8px_rgba(220,38,38,.55)]",
                "active:translate-y-px transition",
                loggingIn && "opacity-80 cursor-wait"
              )}
            >
              {loggingIn ? "Masuk..." : "Masuk"}
            </button>

            <div className="relative py-4 text-center text-sm text-gray-600 font-medium">
              <span className="px-4 relative z-[1]">atau lanjutkan dengan</span>
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => alert("Google OAuth")} 
                className="group relative h-12 inline-flex items-center justify-center gap-2.5 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm overflow-hidden transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 active:translate-y-px"
              >
                <Chrome className="h-5 w-5 text-gray-600 transition-transform duration-300 group-hover:scale-110" />
                <span className="transition-all duration-300">Google</span>
              </button>
              <button 
                type="button" 
                onClick={() => alert("Facebook OAuth")} 
                className="group relative h-12 inline-flex items-center justify-center gap-2.5 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm overflow-hidden transition-all duration-300 hover:bg-gray-50 hover:border-gray-300 active:translate-y-px"
              >
                <Facebook className="h-5 w-5 text-gray-600 transition-transform duration-300 group-hover:scale-110" />
                <span className="transition-all duration-300">Facebook</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-5">
            <FormField label="Nama Anda" error={signupErrors.name?.message} icon={<User2 className="h-4 w-4" />}>
              <input
                type="text"
                placeholder="Nama Anda"
                className={inputClass(signupErrors.name)}
                {...signupRegister("name")}
              />
            </FormField>

            <FormField label="Email" error={signupErrors.email?.message} icon={<Mail className="h-4 w-4" />}>
              <input
                type="email"
                autoComplete="email"
                placeholder="nama@gmail.com"
                className={inputClass(signupErrors.email)}
                {...signupRegister("email")}
              />
            </FormField>

            <div className="space-y-2">
              <FormField label="Password" error={signupErrors.password?.message} icon={<Lock className="h-4 w-4" />}>
                <input
                  type="password"
                  autoComplete="new-password"
                placeholder="********"
                  className={inputClass(signupErrors.password)}
                  {...signupRegister("password")}
                />
              </FormField>
              <PasswordChecklist value={pwd ?? ""} />
            </div>

            <button
              type="submit"
              disabled={signingUp}
              className={cn(
                "w-full h-12 rounded-2xl text-[15px] font-semibold text-white",
                "bg-[linear-gradient(135deg,#ff4d4d_0%,#dc2626_45%,#a10000_100%)]",
                "border border-white/20 shadow-[inset_0_-1px_0_rgba(0,0,0,.08),0_6px_14px_-6px_rgba(220,38,38,.45)]",
                "hover:shadow-[inset_0_-1px_0_rgba(0,0,0,.12),0_10px_18px_-8px_rgba(220,38,38,.55)]",
                "active:translate-y-px transition",
                signingUp && "opacity-80 cursor-wait"
              )}
            >
              {signingUp ? "Mendaftarkan..." : "Daftar"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// --- UI helpers
function FormField({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div
        className={cn(
          "relative flex items-center rounded-2xl border bg-white px-4 transition-all duration-200",
          "focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-400",
          error ? "border-red-400 ring-2 ring-red-500/20" : "border-gray-200 hover:border-gray-300"
        )}
      >
        {icon && <span className="mr-3 text-gray-400">{icon}</span>}
        {children}
      </div>
      {error ? (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
          <span className="inline-block h-1 w-1 rounded-full bg-red-600"></span>
          {error}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
}

function inputClass(hasError?: unknown) {
  return cn(
    "h-12 w-full bg-transparent outline-none text-[15px] placeholder:text-gray-400",
    hasError ? "text-red-900" : "text-gray-900"
  );
}

function PasswordChecklist({ value }: { value: string }) {
  const rules = [
    { ok: value.length >= 6, label: ">= 6 karakter" },
    { ok: /[a-z]/.test(value), label: "huruf kecil" },
    { ok: /[A-Z]/.test(value), label: "huruf besar" },
    { ok: /[0-9]/.test(value), label: "angka" },
  ];
  return (
    <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
      {rules.map((r, i) => (
        <li key={i} className={cn("flex items-center gap-2 font-medium transition-colors duration-200", r.ok ? "text-emerald-600" : "text-gray-400")}>
          <span className={cn("inline-flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200", r.ok ? "bg-emerald-100" : "bg-gray-100")}>
            {r.ok ? (
              <svg className="h-2.5 w-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            )}
          </span>
          {r.label}
        </li>
      ))}
    </ul>
  );
}
