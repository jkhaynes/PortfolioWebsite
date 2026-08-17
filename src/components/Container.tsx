import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-[min(1080px,calc(100%-2rem))] ${className}`}>
      {children}
    </div>
  );
}
