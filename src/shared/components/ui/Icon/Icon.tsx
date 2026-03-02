import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  filled?: boolean;
  style?: React.CSSProperties;
  title?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = '', size, filled: _filled = false, style, title }) => {
  const computedStyle: React.CSSProperties = {
    ...(size ? { fontSize: `${size}px` } : {}),
    ...style,
  };
  const hasStyle = Object.keys(computedStyle).length > 0;

  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      translate="no"
      style={hasStyle ? computedStyle : undefined}
      title={title}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};

export default Icon;
