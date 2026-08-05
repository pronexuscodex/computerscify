import React from 'react';

type LayoutElement = 'div' | 'section' | 'article' | 'header';

interface LayoutBaseProps extends React.HTMLAttributes<HTMLElement> {
  as?: LayoutElement;
  children?: React.ReactNode;
}

export interface PageContainerProps extends LayoutBaseProps {
  width?: 'reading' | 'content' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  as: Component = 'div',
  width = 'content',
  className = '',
  children,
  ...props
}) => {
  const widthClass = {
    reading: 'max-w-[var(--ds-reading-width)]',
    content: 'max-w-[var(--ds-content-width)]',
    full: 'max-w-none',
  }[width];

  return (
    <Component className={`ds-page ${widthClass} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export interface StackProps extends LayoutBaseProps {
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Stack: React.FC<StackProps> = ({
  as: Component = 'div',
  gap = 'md',
  className = '',
  children,
  ...props
}) => {
  const gapClass = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6', xl: 'gap-8' }[gap];
  return (
    <Component className={`flex min-w-0 flex-col ${gapClass} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export interface ClusterProps extends LayoutBaseProps {
  justify?: 'start' | 'between' | 'end';
}

export const Cluster: React.FC<ClusterProps> = ({
  as: Component = 'div',
  justify = 'start',
  className = '',
  children,
  ...props
}) => {
  const justifyClass = { start: 'justify-start', between: 'justify-between', end: 'justify-end' }[
    justify
  ];
  return (
    <Component
      className={`flex min-w-0 flex-wrap items-center gap-3 ${justifyClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const ContentGrid: React.FC<LayoutBaseProps> = ({
  as: Component = 'div',
  className = '',
  children,
  ...props
}) => (
  <Component
    className={`grid min-w-0 grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 ${className}`}
    {...props}
  >
    {children}
  </Component>
);

export interface SectionHeaderProps extends Omit<LayoutBaseProps, 'children' | 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  as: Component = 'header',
  title,
  description,
  action,
  className = '',
  ...props
}) => (
  <Component
    className={`flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className}`}
    {...props}
  >
    <div className="min-w-0">
      <h2 className="ds-section-heading ds-text-safe text-xl sm:text-2xl">{title}</h2>
      {description && <p className="ds-muted ds-text-safe mt-1 text-sm leading-relaxed">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </Component>
);
