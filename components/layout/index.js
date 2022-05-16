import React from 'react';
import PropTypes from 'prop-types';
import { useStyletron } from 'baseui';

function Layout({ children }) {
  const [css] = useStyletron();

  return (
    <>
      Layout
      <main className={css({ maxWidth: '1440px', margin: '0 auto' })}>
        {children}
      </main>
    </>
  );
}

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
