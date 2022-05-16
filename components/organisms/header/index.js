import React from 'react';
import { useStyletron } from 'baseui';

function Header() {
  const [css, theme] = useStyletron();

  return (
    <header className={css({
      height: '100px',
      backgroundColor: theme.colors.mono100,
    })}
    >
      l
    </header>
  );
}

export default Header;
