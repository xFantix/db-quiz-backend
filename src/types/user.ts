export interface RegisterUser {
  name: string;
  surname: string;
  email: string;
  index_umk: number;
  isAdmin?: boolean;
  idGroup: number;
}
