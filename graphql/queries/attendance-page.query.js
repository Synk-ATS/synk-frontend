import { gql } from '@apollo/client';

export const AttendanceFacultyQuery = gql`
    query Faculty($id: ID!) {
      faculty(id: $id) {
        data {
          id
          attributes {
            designation
            firstName
            lastName
            course {
              data {
                id
                attributes {
                  code
                  title
                  attendances {
                    data {
                      id
                      attributes {
                        date
                        open
                        timer
                        content
                      }
                    }
                  }
                  students {
                    data {
                      id
                      attributes {
                        uid
                        firstName
                        middleName
                        lastName
                        avatar {
                          data {
                            attributes {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            program {
              data {
                attributes {
                  name
                }
              }
            }
          }
        }
      }
    }       
`;

export const AttendanceStudentQuery = gql`
    query Student($id: ID!) {
      student(id: $id) {
        data {
          id
          attributes {
            uid
            attendanceRecord
            courses {
              data {
                id
                attributes {
                  title
                  code
                  attendances {
                    data {
                      id
                      attributes {
                        content
                        course {
                          data {
                            id
                            attributes {
                              students {
                                data {
                                  id
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }                  
`;
