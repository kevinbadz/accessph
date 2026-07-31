import Link from "next/link";
import type { ReactNode } from "react";

interface BigButtonProps {
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  sublabel?: string;
  tone?: "default" | "danger";
}

const TONE_CLASSES: Record<NonNullable<BigButtonProps["tone"]>, string> = {
  default:
    "bg-white text-slate-900 border-slate-300 hover:bg-slate-50 focus-visible:outline-blue-700 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800",
  danger:
    "bg-red-600 text-white border-red-700 hover:bg-red-700 focus-visible:outline-red-900",
};

export default function BigButton({
  href,
  onClick,
  icon,
  label,
  sublabel,
  tone = "default",
}: BigButtonProps) {
  const classes = `flex min-h-28 w-full items-center gap-5 rounded-2xl border-2 px-6 py-5 text-left shadow-sm transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 active:scale-[0.99] ${TONE_CLASSES[tone]}`;

  const content = (
    <>
      <span className="text-4xl leading-none" aria-hidden="true">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-2xl font-bold">{label}</span>
        {sublabel && (
          <span className="text-base opacity-80">{sublabel}</span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
