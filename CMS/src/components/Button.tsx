import type React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}) => {
  const baseStyles =
    "px-4 py-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-[#0088FF] text-white hover:bg-[#0077E6]",
    secondary: "bg-gray-200 text-[#0088FF] hover:bg-gray-300 ",
    outline:
      "border border-[#0088FF] text-[#0088FF] hover:bg-[#0088FF]/10",
    ghost: "text-[#0088FF] hover:bg-[#0088FF]/10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};
