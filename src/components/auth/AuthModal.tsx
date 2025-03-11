import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

type AuthView = "signIn" | "signUp" | "forgotPassword";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultView?: AuthView;
  onAuthSuccess?: () => void;
}

export default function AuthModal({
  open,
  onOpenChange,
  defaultView = "signIn",
  onAuthSuccess,
}: AuthModalProps) {
  const [currentView, setCurrentView] = useState<AuthView>(defaultView);

  const handleSuccess = () => {
    onOpenChange(false);
    if (onAuthSuccess) onAuthSuccess();
  };

  const renderView = () => {
    switch (currentView) {
      case "signIn":
        return (
          <SignInForm
            onSuccess={handleSuccess}
            onSignUpClick={() => setCurrentView("signUp")}
            onForgotPasswordClick={() => setCurrentView("forgotPassword")}
          />
        );
      case "signUp":
        return (
          <SignUpForm
            onSuccess={handleSuccess}
            onSignInClick={() => setCurrentView("signIn")}
          />
        );
      case "forgotPassword":
        return (
          <ForgotPasswordForm onBackToSignIn={() => setCurrentView("signIn")} />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">{renderView()}</DialogContent>
    </Dialog>
  );
}
