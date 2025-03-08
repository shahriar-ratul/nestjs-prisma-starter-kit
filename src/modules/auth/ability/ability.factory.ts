import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AbilityFactory {
  defineAbilitiesFor(permissions = [] as string[]) {
    const builder = new AbilityBuilder(createMongoAbility);

    const { can, build } = builder;
    if (permissions.length > 0) {
      for (const permission of permissions) {
        can(permission, '');
      }
    } else {
      can([], '');
    }

    return build();
  }
}
