export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold">You&apos;re offline</h1>
      <p className="max-w-sm text-lg text-slate-600 dark:text-slate-400">
        AccessPH couldn&apos;t reach the network. Voice commands and pages you&apos;ve
        already visited still work offline. Reconnect to use the camera reader for
        the first time.
      </p>
    </main>
  );
}
