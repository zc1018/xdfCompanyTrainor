import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const isStaticVersion = document.documentElement.dataset.experience === 'static';

export type SectionId = 'home' | 'capability' | 'solutions' | 'ai-reading' | 'delivery' | 'faq' | 'contact';

export function goToSection(id: string, updateHistory = true, instant = false) {
  const section = document.getElementById(id);
  if (!section) return;
  if (updateHistory && location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
  section.scrollIntoView({ block: 'start', behavior: instant || isStaticVersion || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  const heading = section.querySelector<HTMLElement>('h1, h2');
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
}

export function goToContact() { goToSection('contact'); }
