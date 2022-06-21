import React from 'react';
import PropTypes from 'prop-types';
import { useStyletron } from 'baseui';
import { PLACEMENT, Toast, ToasterContainer } from 'baseui/toast';
import { Block } from 'baseui/block';
import { useSelector } from 'react-redux';
import SideBar from './side-bar';
import Header from '../organisms/header';
import { selectGlobal } from '../../redux/slices/global.slice';

function Layout({ children }) {
  const [css] = useStyletron();
  const { toastMessage } = useSelector(selectGlobal);

  return (
    <>
      <Block
        display={toastMessage === null ? 'none' : 'block'}
        right={0}
        bottom={0}
        padding="20px"
        position="absolute"
        className={css({ zIndex: 100 })}
      >
        <ToasterContainer placement={PLACEMENT.topRight} />
        <Toast>{toastMessage}</Toast>
      </Block>
      <Header />
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
