import React from 'react';
import { cn } from '@/lib/utils';
import { Shippori_Mincho } from 'next/font/google';

const shippori = Shippori_Mincho({ weight: ['400', '500', '600', '700'], subsets: ['latin'] });

interface GeoSchemaUIProps {
  title: string;
  description?: string;
  items: {
    question?: string;
    answer?: string;
    label?: string;
    value?: string;
  }[];
  type?: 'qa' | 'table' | 'list';
  className?: string;
}

export function GeoSchemaUI({
  title,
  description,
  items,
  type = 'qa',
  className
}: GeoSchemaUIProps) {
  return (
    <section className={cn("py-12 px-4 max-w-4xl mx-auto w-full", className)}>
      <h2 className={cn("text-2xl md:text-3xl text-primary text-center mb-6", shippori.className)}>
        {title}
      </h2>
      {description && (
        <p className="text-center text-sm md:text-base text-muted-foreground mb-8">
          {description}
        </p>
      )}

      {type === 'qa' && (
        <div className="space-y-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className={cn("text-lg md:text-xl text-primary mb-3 flex items-center gap-3", shippori.className)}>
                <span className="text-primary/70 text-base">Q.</span>
                {item.question}
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed flex items-start gap-3">
                <span className="text-primary/70 text-base mt-0.5">A.</span>
                <span className="flex-1">{item.answer}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {type === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-white/10 text-sm md:text-base">
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                  <th className="py-4 px-6 text-left bg-white/5 font-medium min-w-[120px] text-gray-200 w-1/3">
                    {item.label}
                  </th>
                  <td className="py-4 px-6 text-gray-300 text-left">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {type === 'list' && (
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i} className="flex gap-4 p-4 border border-white/10 bg-white/5 rounded-lg">
              <span className="text-primary font-bold">{i + 1}.</span>
              <div>
                {item.label && <span className="font-semibold block mb-1 text-gray-200">{item.label}</span>}
                {item.value && <span className="text-sm md:text-base text-gray-300">{item.value}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
