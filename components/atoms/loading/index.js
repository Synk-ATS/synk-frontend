import React from 'react';
import PropTypes from 'prop-types';
import { Block } from 'baseui/block';
import { useStyletron } from 'baseui';
import { BounceLoader } from 'react-spinners';

function Loading({ loading }) {
  const [css, theme] = useStyletron();

  if (!loading) {
    return (<Block />);
  }

  return (
    <Block className={css({
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
      backgroundColor: 'rgba(34,34,34,0.96)',
      position: 'fixed',
      overflow: 'hidden',
      display: 'flex',
      zIndex: '999',
      justifyContent: 'center',
      alignItems: 'center',
    })}
    >
      <BounceLoader color={theme.colors.accent} loading={loading} size={80} />
    </Block>

  );
}

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default Loading;
