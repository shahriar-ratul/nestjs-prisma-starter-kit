import { SetMetadata } from '@nestjs/common';

export const CHECK_ABILITY = 'check_ability';

export const CheckAbility = (...abilities: string[]) => SetMetadata(CHECK_ABILITY, abilities);
