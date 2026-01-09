import React from 'react';
import { Loader2 } from './Icons';

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    isLoading?: boolean;
  }
>(({ className = '', variant = 'primary', isLoading, children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500",
    outline: "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-500",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
});

export const Card: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

export const Badge = ({ status }: { status: string }) => {
  const styles = {
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accept: "bg-emerald-50 text-emerald-700 border-emerald-200",
    flag: "bg-amber-50 text-amber-700 border-amber-200",
    reject: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-slate-100 text-slate-600 border-slate-200",
  } as Record<string, string>;

  const labels = {
    processing: "Processing",
    completed: "Completed",
    accept: "Accepted",
    flag: "Flagged",
    reject: "Rejected",
    pending: "Pending",
  } as Record<string, string>;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  );
};

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3 border ${className}`}
      {...props}
    />
  )
);

export const Label: React.FC<{ children?: React.ReactNode; className?: string; htmlFor?: string }> = ({ children, className = '', htmlFor }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-slate-700 mb-1 ${className}`}>
    {children}
  </label>
);