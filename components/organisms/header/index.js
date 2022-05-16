import React from 'react';
import { useStyletron } from 'baseui';

function Header() {
  const [css, theme] = useStyletron();

  return (
    <header className={css({
      maxHeight: '70px',
      backgroundColor: theme.colors.mono100,
      position: 'sticky',
      top: 0,
      marginLeft: '250px',
      display: 'flex',
      paddingTop: '25px',
      paddingRight: '25px',
      paddingBottom: '25px',
      paddingLeft: '25px',
    })}
    >
      l
    </header>
  );
}

export default Header;
