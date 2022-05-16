import { styled } from 'baseui';

export const StyledSideBarNav = styled('nav', ({ $theme }) => ({
  height: '100%',
  top: 0,
  width: '250px',
  backgroundColor: $theme.colors.primary,
  position: 'fixed',
  borderRightWidth: '3px',
  borderRightStyle: 'solid',
  borderRightColor: $theme.colors.accent,
}));

export const TreeLabelOverrides = {
  style: ({ $isSelected, $theme }) => ({
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    color: $theme.colors.mono600,
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: $theme.animation.timing600,
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: $isSelected ? $theme.colors.accent : 'transparent',
    backgroundColor: $isSelected ? $theme.colors.mono900 : 'transparent',
    ':hover': {
      color: $theme.colors.mono800,
      backgroundColor: $theme.colors.mono900,
    },
  }),
};
