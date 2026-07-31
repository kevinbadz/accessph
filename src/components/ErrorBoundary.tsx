"use client";

import { Component } from "react";
import type { ReactNode } from "react";
import { useSettings } from "@/components/SettingsProvider";
import { t } from "@/lib/i18n";

function ErrorFallback() {
  const { settings } = useSettings();
  const lang = settings.language;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold">{t(lang, "somethingWentWrong")}</h1>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="min-h-14 rounded-xl bg-blue-700 px-6 text-lg font-bold text-white hover:bg-blue-800"
      >
        {t(lang, "reloadPage")}
      </button>
    </div>
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("AccessPH: uncaught error", error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
