"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

import { useConsent } from "./useConsent";

type ButtonProps = ComponentProps<typeof Button>;

type ManageConsentButtonProps = {
  label?: string;
} & Pick<ButtonProps, "className" | "variant" | "size">;

export function ManageConsentButton({
  label = "Kelola Cookie",
  className,
  variant = "ghost",
  size = "sm",
}: ManageConsentButtonProps) {
  const { openPreferences } = useConsent();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={openPreferences}
      className={className}
    >
      {label}
    </Button>
  );
}

export default ManageConsentButton;
