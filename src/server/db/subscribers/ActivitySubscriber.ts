// src/server/db/subscribers/ActivitySubscriber.ts
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

// Helper untuk mencatat aktivitas ke DB
const logActivity = async (action: string, entity: any, manager: any) => {
  // Di lingkungan serverless, kita harus mengambil repository dari manager event
  const activityRepository = manager.getRepository(Activity);

  const activity = activityRepository.create({
    entityName: entity.constructor.name,
    entityId: entity.id,
    action: action,
    // (Optional) Anda bisa menambahkan user ID jika tersedia di Request context
  });

  await activityRepository.save(activity);
};

@EventSubscriber()
export class ActivitySubscriber
  implements EntitySubscriberInterface<User | Role>
{
  // Listen hanya pada Entity yang relevan
  listenTo() {
    // Kita mengembalikan array, dan meyakinkan compiler bahwa ini valid
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
