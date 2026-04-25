export default function AccountPage() {
  return (
    <section>
      <h1 className="mb-3 text-4xl font-bold">Account</h1>
      <p className="mb-8 max-w-2xl text-slate-300">
        Manage your Corpo account, saved reports, upload preferences, and future
        document analysis settings.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-bold">Profile</h2>

          <div className="space-y-4">
            <Info label="Name" value="Demo User" />
            <Info label="Email" value="demo@corpo.ai" />
            <Info label="Plan" value="Free" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-2xl font-bold">Settings</h2>

          <div className="space-y-4">
            <Setting label="Save uploaded documents" />
            <Setting label="Email completed reports" />
            <Setting label="Use stricter risk detection" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function Setting({ label }) {
  return (
    <label className="flex items-center justify-between rounded-xl bg-slate-950 p-4">
      <span>{label}</span>
      <input type="checkbox" className="h-5 w-5" />
    </label>
  );
}