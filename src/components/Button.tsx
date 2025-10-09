import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'icon';
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  ...props
}) => {
  const baseClasses =
    'font-semibold rounded-xl transition disabled:opacity-50';

  const variantClasses = {
    primary:
      'bg-[#0061ff] hover:bg-[#0051d1] text-white px-6 py-3',
    icon: 'bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 flex items-center justify-center rounded-full',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
