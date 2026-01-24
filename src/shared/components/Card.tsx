import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {title ? (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-semibold text-slate-800 text-lg">{title}</h3>
        </div>
      ) : null}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

