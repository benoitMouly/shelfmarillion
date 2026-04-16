import { useState } from "react";

type ConfirmButtonProps = {
  label: string;
  onConfirm: () => void;
  ariaLabel?: string;
  disabled?: boolean;
};


export const ConfirmButton = ({
  label,
  onConfirm,
  ariaLabel,
  disabled = false,
}: ConfirmButtonProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsConfirming(false);
  };

  if (isConfirming) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleConfirm}
          className="rounded-input bg-danger-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-danger-700"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          className="rounded-input border border-border-default px-4 py-2 text-sm transition hover:bg-surface-muted"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsConfirming(true)}
      disabled={disabled}
      aria-label={ariaLabel}
      className="rounded-input border border-danger-200 px-4 py-2 text-sm text-danger-700 transition hover:bg-danger-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
};
