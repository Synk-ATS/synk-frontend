import React from 'react';
import { HeadingXLarge } from 'baseui/typography';
import { Block } from 'baseui/block';

function StudentCourses() {
  return (
    <Block
      paddingLeft={['20px', '20px', '40px', '40px']}
      paddingRight={['20px', '20px', '40px', '40px']}
    >
      <HeadingXLarge>Student Courses</HeadingXLarge>
    </Block>
  );
}

export default StudentCourses;
