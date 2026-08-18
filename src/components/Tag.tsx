type TagProps = {
  children: string;
};

export default function Tag({ children }: TagProps) {
  return (
    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
      {children}
    </span>
  );
}
