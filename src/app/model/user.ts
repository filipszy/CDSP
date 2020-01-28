export interface User {
  Id: number;
  DisplayName: string;
  Name: string;
  Surname: string;
  Department: string;
  Email: string;
  Manager: boolean;
  Roles: string[];
}
