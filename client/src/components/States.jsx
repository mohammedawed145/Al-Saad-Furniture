import { LoaderCircle } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export function Spinner({ label }) {
  const { t } = useLang();
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-stone">
      <LoaderCircle className="h-7 w-7 animate-spin" />
      <p className="text-sm">{label || t.common.loading}</p>
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-16 text-center text-stone">
      {message}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  const { t } = useLang();
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <p className="text-stone">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-outline mt-6">
          {t.common.retry}
        </button>
      )}
    </div>
  );
}
