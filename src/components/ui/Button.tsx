import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost';
};

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  const base = 'btn ';
  const variantClass =
    variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'hover:bg-gray-100';
  return <button className={`${base} ${variantClass} ${className}`} {...props} />;
}




