import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from "typeorm";
import { Activity } from "../entities/Activity";
import { User } from "../entities/User";
import { Role } from "../entities/Role";

const logActivity = async (action: string, entity: any, manager: any) => {
  const activityRepository = manager.getRepository(Activity);

  const activity = activityRepository.create({
    entityName: entity.constructor.name,
    entityId: entity.id,
    action: action,
  });

  await activityRepository.save(activity);
};

@EventSubscriber()
export class ActivitySubscriber
  implements EntitySubscriberInterface<User | Role>
{
  listenTo() {
    return [User, Role] as any;
  }

  async afterInsert(event: InsertEvent<User | Role>) {
    await logActivity("CREATE", event.entity, event.manager);
  }

  async afterUpdate(event: UpdateEvent<User | Role>) {
    if (event.updatedColumns.length > 0) {
      await logActivity("UPDATE", event.entity, event.manager);
    }
  }

  async afterRemove(event: RemoveEvent<User | Role>) {
    await logActivity("DELETE", event.entity, event.manager);
  }
}
