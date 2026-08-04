"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const IS_DEMO =
  !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function useDemoAuth() {
  const demoSessionKey = "sama-demo-session";
  const demoUsersKey = "sama-demo-users";

  const readUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(demoUsersKey) ?? "[]") as {
        email: string;
        password: string;
        name: string;
      }[];
    } catch {
      return [];
    }
  };

  const demoLogin = (email: string, password: string) => {
    const user = readUsers().find(
      (u) => u.email === email && u.password === password
    );
    if (!user) return false;
    localStorage.setItem(demoSessionKey, JSON.stringify({ email: user.email, name: user.name }));
    return true;
  };

  const demoRegister = (name: string, email: string, password: string) => {
    const users = readUsers();
    if (users.some((u) => u.email === email)) return false;
    users.push({ email, password, name });
    localStorage.setItem(demoUsersKey, JSON.stringify(users));
    localStorage.setItem(demoSessionKey, JSON.stringify({ email, name }));
    return true;
  };

  return { demoLogin, demoRegister };
}

type Mode = "login" | "register" | "forgot";

export function AuthForm({ initialMode = "login" }: { initialMode?: Mode }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const { demoLogin, demoRegister } = useDemoAuth();

  const [mode, setMode] = React.useState<Mode>(initialMode);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const redirect = (path: string) => {
    router.push(path);
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (IS_DEMO) {
      await new Promise((r) => setTimeout(r, 500));
      if (mode === "login") {
        if (!demoLogin(email, password)) {
          toast.error(t("invalidCredentials"));
          setLoading(false);
          return;
        }
      } else if (mode === "register") {
        if (!demoRegister(name, email, password)) {
          toast.error("This email is already registered.");
          setLoading(false);
          return;
        }
      } else {
        toast.success(t("emailSent"));
        setLoading(false);
        return;
      }
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      redirect("/portal");
      setLoading(false);
      return;
    }

    try {
      if (mode === "login") {
        const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        redirect("/portal");
      } else if (mode === "register") {
        const { error } = await supabaseBrowser.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabaseBrowser.auth.resetPasswordForEmail(email);
        if (error) throw error;
        toast.success(t("emailSent"));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === "login" ? t("loginTitle") : mode === "register" ? t("registerTitle") : t("forgotTitle");
  const subtitle =
    mode === "login"
      ? t("loginSubtitle")
      : mode === "register"
        ? t("registerSubtitle")
        : t("forgotSubtitle");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong w-full max-w-md rounded-3xl p-8 shadow-lift"
    >
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent text-white shadow-lift">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <div className="relative">
              <User className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="ps-10"
                required
                minLength={2}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <div className="relative">
            <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="ps-10"
              required
            />
          </div>
        </div>

        {mode !== "forgot" && (
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="ps-10 pe-10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {mode === "login" && (
          <div className="text-end">
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-sm text-primary hover:underline"
            >
              {t("forgot")}
            </button>
          </div>
        )}

        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "login" ? t("login") : mode === "register" ? t("register") : t("reset")}
        </Button>
      </form>

      {mode === "forgot" && (
        <p className="mt-4 text-center text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className="text-primary hover:underline"
          >
            {t("backToLogin")}
          </button>
        </p>
      )}

      {mode !== "forgot" && (
        <div className="mt-6 border-t pt-5 text-center text-sm">
          {mode === "login" ? (
            <p>
              {t("noAccount")}{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-semibold text-primary hover:underline"
              >
                {t("createOne")}
              </button>
            </p>
          ) : (
            <p>
              {t("hasAccount")}{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-semibold text-primary hover:underline"
              >
                {t("signIn")}
              </button>
            </p>
          )}
        </div>
      )}

      {IS_DEMO && (
        <p className="mt-4 rounded-xl bg-muted/60 p-3 text-center text-xs text-muted-foreground">
          {t("demoNotice")}
        </p>
      )}
    </motion.div>
  );
}
