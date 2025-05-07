import React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary"
}

export const Badge: React.FC<BadgeProps> = ({ children, className = "", variant = "default", ...props }) => {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  const variants = {
    default: "bg-gray-200 text-gray-800",
    secondary: "bg-gray-100 text-gray-600 border border-gray-300",
  }
  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}

export default Badge; 