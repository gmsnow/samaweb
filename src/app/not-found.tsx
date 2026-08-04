export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="mt-4 text-4xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        This page could not be found. Please use the navigation above.
      </p>
    </main>
  );
}
