import React from 'react';
import { useStyletron } from 'baseui';
import {
  Books,
  Checks, GearSix, Layout, Student, Users,
} from 'phosphor-react';
import { useRouter } from 'next/router';
import { toggleIsExpanded, TreeView } from 'baseui/tree-view';
import { Block } from 'baseui/block';
import { useSelector } from 'react-redux';
import { StyledSideBarNav } from './styled-components';
import Logo from '../atoms/logo';
import { selectAuth, USER_TYPE } from '../../redux/slices/auth.slice';

function customLabel(node) {
  const router = useRouter();
  const [css, theme] = useStyletron();
  const [id, setId] = React.useState(node.id);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (router.pathname === id) {
      setIsActive(true);
    } else { setIsActive(false); }
  });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => { setId(node.id); router.push(node.id); }}
      onKeyDown={() => { setId(node.id); router.push(node.id); }}
      className={css({
        ...theme.typography.ParagraphMedium,
        color: theme.colors.mono200,
        height: '100%',
        width: '100%',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
      })}
    >
      <Block
        position="absolute"
        height="100%"
        top={0}
        bottom={0}
        left={0}
        width="3px"
        backgroundColor={isActive ? theme.colors.accent : 'transparent'}
      />
      <div
        className={css({
          outline: 'none',
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          position: 'relative',
        })}
      >
        <div>{node.icon && node.icon}</div>
        <p className={css({ marginLeft: '5px' })}>{node.title && node.title}</p>
      </div>

    </div>
  );
}

const items = [
  {
    id: '/',
    title: 'Dashboard',
    label: customLabel,
    icon: (<Layout />),
  },
  {
    id: '/attendance',
    title: 'Attendance',
    label: customLabel,
    icon: (<Checks />),
  },
  {
    id: '#students',
    title: 'Students',
    label: customLabel,
    icon: (<Student />),
  },
  {
    id: '#users',
    title: 'Users',
    label: customLabel,
    icon: (<Users />),
  },
  {
    id: '#settings',
    title: 'Settings',
    label: customLabel,
    icon: (<GearSix />),
  },
];

const studentItems = [
  {
    id: '/',
    title: 'Dashboard',
    label: customLabel,
    icon: (<Layout />),
  },
  {
    id: '/attendance',
    title: 'Attendance',
    label: customLabel,
    icon: (<Checks />),
  },
  {
    id: '#courses',
    title: 'Courses',
    label: customLabel,
    icon: (<Books />),
  },
  {
    id: '#settings',
    title: 'Settings',
    label: customLabel,
    icon: (<GearSix />),
  },
];

function SideBar() {
  const { userType } = useSelector(selectAuth);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    switch (userType) {
      case USER_TYPE.student:
        setData(studentItems);
        break;
      case USER_TYPE.teacher:
        setData(items);
        break;
      default:
        setData([]);
    }
  }, [userType]);

  return (
    <StyledSideBarNav>
      <Logo />
      <TreeView
        data={data}
        onToggle={(node) => {
          setData((prevData) => toggleIsExpanded(prevData, node));
        }}
        overrides={{
          TreeLabel: {
            style: ({ $theme, $isSelected }) => ({
              width: '100%',
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
          },
        }}
      />
    </StyledSideBarNav>
  );
}

export default SideBar;
