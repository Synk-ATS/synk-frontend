export class Student {
  constructor({
    firstName, middleName, lastName, gender, email,
  }) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.gender = gender;
    this.email = email;
  }

  toString() {
    return `${this.firstName}, ${this.middleName}, ${this.lastName}, ${this.gender}, ${this.email}`;
  }
}

export const studentConverter = {
  toFirestore: (student) => ({
    firstName: student.firstName,
    middleName: student.middleName,
    lastName: student.lastName,
    gender: student.gender,
    email: student.email,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Student({
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      gender: data.gender,
      email: data.email,
    });
  },
};
