import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-mist px-4 py-24 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-white text-brand-700 shadow-sm">
        <SearchX className="h-9 w-9" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold text-ink">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink-soft">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-800"
      >
        Back to home
      </Link>
    </div>
  );
}
