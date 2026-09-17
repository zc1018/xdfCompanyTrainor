import { useEffect, type CSSProperties, type ReactNode } from 'react';

export function useReveals(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.revealed = 'true';
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [enabled]);
}

export default function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return <div data-reveal data-revealed="false" style={{ '--reveal-delay': `${delay}ms` } as CSSProperties} className={className}>{children}</div>;
}
