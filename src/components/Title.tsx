import { raimond } from '@/app/fonts'

interface TitleProps {
  level: 'h1' | 'h2';
  children: React.ReactNode;
  className?: string;
}

export function Title({ level, children, className = '' }: TitleProps) {
  const Tag = level;
  return (
    <Tag className={`${raimond.className} ${className}`}>
      {children}
    </Tag>
  );
} 