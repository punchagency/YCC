import React from 'react';

const CustomButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  style = {},
  ...props
}) => {
  const baseStyle = {
    backgroundColor: '#034D92',
    color: '#fff',
    border: '2px solid #034D92',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: 16,
    padding: '10px 0',
    width: '100%',
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    transition: 'all 0.2s',
    ...style,
  };

  const [hover, setHover] = React.useState(false);

  const hoverStyle = hover
    ? {
        backgroundColor: '#fff',
        color: '#000',
        border: '2px solid #034D92',
      }
    : {};

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{ ...baseStyle, ...hoverStyle }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton; 