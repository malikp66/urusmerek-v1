"use client";

import Link from "next/link";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { mergeConsent } from "./consent-utils";
import { useConsent } from "./useConsent";

type ToggleableCategory = "analytics" | "marketing" | "functional";

const PRIVACY_POLICY_URL = "/privacy-policy";

const descriptions: Record<ToggleableCategory, string> = {
  analytics:
    "Mengumpulkan data anonim untuk memahami performa situs (mis. Google Analytics).",
  marketing:
    "Memungkinkan iklan yang dipersonalisasi dan remarketing di platform pihak ketiga.",
  functional:
    "Mengaktifkan fitur tambahan seperti chat, personalisasi, atau pengujian A/B.",
};

export function CookiePreferencesDialog() {
  const {
    consent,
    draftConsent,
    isPreferencesOpen,
    setDraftConsent,
    closePreferences,
    saveConsent,
  } = useConsent();

  const descriptionId = useId();
  const functionalAvailable = typeof draftConsent.functional === "boolean";

  const handleToggle = (category: ToggleableCategory) => (checked: boolean) => {
    setDraftConsent((prev) =>
      mergeConsent(prev, {
        [category]: checked,
      })
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDraftConsent(consent);
      closePreferences();
    }
  };

  const handleCancel = () => {
    setDraftConsent(consent);
    closePreferences();
  };

  const handleSave = () => {
    saveConsent(draftConsent);
  };

  return (
    <Dialog open={isPreferencesOpen} onOpenChange={handleOpenChange}>
      <DialogContent aria-describedby={descriptionId}>
        <DialogHeader>
          <DialogTitle>Preferensi Privasi</DialogTitle>
          <DialogDescription id={descriptionId}>
            Kelola jenis cookie yang kami gunakan. Cookie esensial wajib aktif untuk
            menjalankan layanan kami.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <section className="rounded-lg border border-dashed border-muted p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label className="text-base font-semibold">Esensial</Label>
                <p className="text-sm text-muted-foreground">
                  Dibutuhkan untuk keamanan, autentikasi, dan fitur dasar situs.
                </p>
              </div>
              <Switch checked disabled aria-readonly />
            </div>
          </section>
          <Separator />
          <section className="space-y-3">
            <PreferenceToggle
              label="Analitik"
              description={descriptions.analytics}
              checked={draftConsent.analytics}
              onCheckedChange={handleToggle("analytics")}
            />
            <PreferenceToggle
              label="Pemasaran"
              description={descriptions.marketing}
              checked={draftConsent.marketing}
              onCheckedChange={handleToggle("marketing")}
            />
            {functionalAvailable && (
              <PreferenceToggle
                label="Fungsional"
                description={descriptions.functional}
                checked={Boolean(draftConsent.functional)}
                onCheckedChange={handleToggle("functional")}
              />
            )}
          </section>
        </div>
        <DialogFooter className="pt-4">
          <div className="flex-1 text-sm text-muted-foreground sm:text-left">
            <Link
              href={PRIVACY_POLICY_URL}
              className="font-medium text-primary underline underline-offset-4"
            >
              Kebijakan Privasi
            </Link>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button variant="ghost" type="button" onClick={handleCancel}>
              Batalkan
            </Button>
            <Button type="button" onClick={handleSave}>
              Simpan preferensi
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type PreferenceToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function PreferenceToggle({
  label,
  description,
  checked,
  onCheckedChange,
}: PreferenceToggleProps) {
  const switchId = useId();

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-transparent p-3 transition hover:border-border">
      <div>
        <Label htmlFor={switchId} className="text-base font-semibold">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={switchId} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default CookiePreferencesDialog;
