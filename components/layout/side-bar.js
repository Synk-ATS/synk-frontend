import React from 'react';
import { useStyletron } from 'baseui';
import Link from 'next/link';
import Image from 'next/image';
import {
  Checks, GearSix, Layout, Student, Users,
} from 'phosphor-react';
import { useRouter } from 'next/router';
import { toggleIsExpanded, TreeView } from 'baseui/tree-view';
import { StyledSideBarNav, TreeLabelOverrides } from './styled-components';

function customLabel(node) {
  const router = useRouter();
  const [css, theme] = useStyletron();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(node.id)}
      onKeyDown={() => router.push(node.id)}
      className={css({
        ...theme.typography.ParagraphMedium,
        color: theme.colors.mono200,
        height: '100%',
        width: '100%',
      })}
    >
      <div
        className={css({
          outline: 'none',
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
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
    id: '#dashboard',
    title: 'Dashboard',
    label: customLabel,
    isExpanded: false,
    icon: (<Layout />),
  },
  {
    id: '#attendance',
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

function SideBar() {
  const [css, theme] = useStyletron();
  const [data, setData] = React.useState(items);
  return (
    <StyledSideBarNav>
      <div>
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
          })}
          >
            <Image
              src="/logo-light.svg"
              alt="Synk Logo"
              height="80%"
              width="80%"
            />
          </div>
        </Link>
      </div>
      <div>
        <TreeView
          data={data}
          onToggle={(node) => {
            setData((prevData) => toggleIsExpanded(prevData, node));
          }}
          overrides={{ TreeLabel: { ...TreeLabelOverrides } }}
        />
      </div>
    </StyledSideBarNav>

  );
}

export default SideBar;
