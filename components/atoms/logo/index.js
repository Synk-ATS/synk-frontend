import React from 'react';
import Link from 'next/link';
import { useStyletron } from 'baseui';

function Logo() {
  const [css, theme] = useStyletron();

  return (
    <Link href="/" passHref>
      <div className={css({
        display: 'flex',
        paddingLeft: '20px',
        position: 'relative',
        zIndex: 3,
        maxHeight: '70px',
        alignItems: 'center',
        borderBottomWidth: '3px',
        borderBottomStyle: 'solid',
        borderBottomColor: theme.colors.accent,
        color: theme.colors.mono100,
      })}
      >
        <h1>Raftel</h1>
      </div>
    </Link>
  );
}

export default Logo;
