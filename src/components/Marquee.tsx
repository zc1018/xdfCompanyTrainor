import type { CSSProperties } from 'react';
import { brands } from '../content';
import { cn } from '../lib';

export default function Marquee({ paused }: { paused: boolean }) {
  return <section className="mt-10" aria-label="新东方品牌、语言培训项目与部分过往企培合作机构">
    <svg width="0" height="0" aria-hidden="true" className="absolute"><defs><filter id="brand-ink" colorInterpolationFilters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -0.2126 -0.7152 -0.0722 0 1" result="ink" /><feComposite in="ink" in2="SourceGraphic" operator="in" /></filter></defs></svg>
    <div className="marquee-mask" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
      <div className="marquee-track" data-paused={paused}>
        {[0, 1].map(copy => <div key={copy} className="marquee-set" aria-hidden={copy === 1 ? true : undefined}>
          {brands.map(brand => <figure key={brand.alt} title={`${brand.alt} · ${brand.relationship}`} className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden">
            <div className="absolute inset-0 scale-150 opacity-0 transition-[transform,opacity] duration-500 group-hover:scale-100 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, ${brand.gradient.from}, ${brand.gradient.to})` } as CSSProperties} />
            <img src={brand.src} alt={copy === 1 ? '' : brand.alt} loading="eager" width="112" height="44" className={cn('relative z-10 h-11 w-28 object-contain transition-[filter] duration-300 group-hover:brightness-0 group-hover:invert', brand.imageClass)} />
            {copy === 0 ? <figcaption className="sr-only">{brand.relationship}</figcaption> : null}
          </figure>)}
        </div>)}
      </div>
    </div>
    <p className="mt-5 text-center text-[11px] leading-6 tracking-wide text-slate-400">新东方品牌、语言培训项目及部分过往企培合作机构 · 不分先后</p>
  </section>;
}
