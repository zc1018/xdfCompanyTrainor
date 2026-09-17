import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function goToContact() {
  document.querySelector('#contact')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  history.replaceState(null, '', '#contact');
  document.querySelector<HTMLElement>('#contact-title')?.focus({ preventScroll: true });
}
