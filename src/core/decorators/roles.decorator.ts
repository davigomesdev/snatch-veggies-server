import { AccessLevelEnum } from '@core/enums/access-level.enum';
import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AccessLevelEnum[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
