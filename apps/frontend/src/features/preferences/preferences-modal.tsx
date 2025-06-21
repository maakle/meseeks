"use client";

import { ThemeSwitch } from "@/components/layout/ThemeToggle/theme-switch";
import { ThemeSelector } from "@/components/theme-selector";
import { Modal } from "@/components/ui/modal";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreferencesModal({
  isOpen,
  onClose,
}: PreferencesModalProps) {
  return (
    <Modal
      title="Preferences"
      description="Customize your application settings and preferences"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Color Mode</div>
            <div className="flex gap-2">
              <ThemeSwitch />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Theme</div>
            <div className="flex gap-2">
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
