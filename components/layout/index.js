import React from 'react';
import PropTypes from 'prop-types';
import { useStyletron } from 'baseui';
import SideBar from './side-bar';

function Layout({ children }) {
  const [css] = useStyletron();

  return (
    <>
      <SideBar />
      <main className={css({ maxWidth: '1440px', margin: '0 auto 0 250px' })}>
        {children}
      </main>
    </>
  );
}

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
