import { UserRole } from '../../common/enums/user-role.enum';

export interface JwtAuthUser {
  id: number;
  loginId: string;
  name: string;
  role: UserRole;
}
