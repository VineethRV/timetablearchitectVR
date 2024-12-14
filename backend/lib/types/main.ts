export type User = {
  id: number;
  name: string | null;
  orgId: number | null;
  role: string | null;
  department: string | null;
};

export interface OrganisationSchema {
  name: string;
  designation: string;
  dept: string;
  sections: number;
  teachers: number;
  students: number;
  depts_list: string[];
};

export type Room = {
  name: string;
  orgId: number;
  department: string | null;
  lab: boolean | null;
  timetable: string | null;
};

export type Teacher = {
  name: string;
  initials: string | null;
  email: string | null;
  department: string | null;
  alternateDepartments: string | null;
  timetable: string | null;
  labtable: string | null;
  orgId: number;
};

export type Course = {
  name: string;
  code: string;
  department: string | null;
  orgId: number;
  semester: number | null;
};

export type Lab = {
  name: string;
  department: string | null;
  orgId: number;
  semester: number | null;
  batches: string | null;
  teachers: string | null;
  rooms: string | null;
  timetable: string | null;
};

export type Elective = {
  name: string;
  department: string | null;
  orgId: number;
  semester: number | null;
  teachers: string | null;
  courses: string | null;
  rooms: string | null;
  timetable: string | null;
};

export type OTP_TYPE = {
  otp: number;
  email: string;
};
