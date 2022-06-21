import React from 'react';
import { StatefulSelect as Search, TYPE } from 'baseui/select';
import {
  ALIGN, HeaderNavigation, StyledNavigationItem, StyledNavigationList,
} from 'baseui/header-navigation';
import { Avatar } from 'baseui/avatar';
import { ParagraphSmall } from 'baseui/typography';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../../redux/slices/auth.slice';

function Header() {
  const router = useRouter();

  const {
    profile: { attributes: { firstName, lastName, avatar } },
  } = useSelector(selectAuth);
  const options = {
    labelKey: 'id',
    valueKey: 'color',
    placeholder: 'Search students',
    maxDropdownHeight: '300px',
  };

  return (
    <HeaderNavigation
      overrides={{
        Root: {
          style: ({ $theme }) => ({
            maxHeight: '70px',
            backgroundColor: $theme.colors.mono100,
            position: 'sticky',
            top: 0,
            marginLeft: '250px',
            display: 'flex',
            paddingTop: '25px',
            paddingRight: '40px',
            paddingBottom: '25px',
            paddingLeft: '40px',
            boxShadow: '0 4px 16px hsla(0, 0%, 0%, 0.05)',
            borderBottomWidth: 0,
          }),
        },
      }}
    >
      <StyledNavigationList $align={ALIGN.left}>
        <StyledNavigationItem style={{ width: '350px', paddingLeft: 0 }}>
          <Search
            {...options}
            type={TYPE.search}
            // getOptionLabel={({ option }) => option.id || null}
            onChange={() => {}}
          />
        </StyledNavigationItem>
      </StyledNavigationList>
      <StyledNavigationList $align={ALIGN.center} />
      <StyledNavigationList $align={ALIGN.right}>
        <StyledNavigationItem
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => router.push('/auth/profile')}
        >
          <Avatar name={`${firstName} ${lastName}`} size="scale900" src={avatar?.data?.attributes?.url} />
          <ParagraphSmall marginTop={0} marginBottom={0} marginLeft="10px">
            {`Hi ${firstName}`}
          </ParagraphSmall>
        </StyledNavigationItem>
      </StyledNavigationList>
    </HeaderNavigation>
  );
}

export default Header;
