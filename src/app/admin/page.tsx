export default function AdminPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        If you can see this page while logged out, admin protection is not
        working.
      </p>
    </main>
  );
}