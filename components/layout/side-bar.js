import React from 'react';
import { Navigation } from 'baseui/side-navigation';

const items = [
  {
    title: 'Attendance',
    itemId: '#attendance',
    subNav: [
      {
        title: 'Daily Attendance',
        itemId: '#daily-attendance',
      },
      {
        title: 'Monthly Report',
        itemId: '#monthly-report',
      },
      {
        title: 'Summary Report',
        itemId: '#summary-report',
      },
    ],
  },
  {
    title: 'Students',
    itemId: '#students',
    subNav: [],
  },
  {
    title: 'Users',
    itemId: '#users',
    subNav: [],
  },
  {
    title: 'Settings',
    itemId: '#settings',
    subNav: [],
  },
];

function SideBar() {
  const [activeItemId, setActiveItemId] = React.useState('#primary');
  return (
    <Navigation
      items={items}
      activeItemId={activeItemId}
      onChange={({ item }) => setActiveItemId(item.itemId)}
      overrides={{
        Root: {
          style: ({
            height: '100%',
            width: '250px',
            backgroundColor: '#222222',
            position: 'fixed',
          }),
        },
        NavItem: {
          style: ({
          }),
        },
      }}
    />

  );
}

export default SideBar;
