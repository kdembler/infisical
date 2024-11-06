import { type FC } from "react";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { createNotification } from "@app/components/notifications";

type Props = {
  password: string;
};

export const PasswordCell: FC<Props> = ({ password }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      createNotification({ text: "Password copied to clipboard", type: "success" });
    } catch (err) {
      createNotification({ text: "Failed to copy password", type: "error" });
    }
  };

  const obfuscatedPassword = "•".repeat(password.length);

  return (
    <button
      type="button"
      aria-label="copy password"
      className="flex items-center gap-2 rounded-md bg-primary-500 bg-opacity-0 py-1 px-2 hover:bg-opacity-10"
      onClick={handleCopy}
    >
      <span className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap text-left font-mono">
        <span className="group-hover:hidden">{obfuscatedPassword}</span>
        <span className="hidden group-hover:inline">{password}</span>
      </span>

      <FontAwesomeIcon
        icon={faCopy}
        className="text-sm opacity-0 transition-opacity group-hover:opacity-100"
      />
    </button>
  );
};
