import { z } from "zod";

export const KpiSchema = z.object({
  title: z.string(),
  value: z.union([z.number(), z.string()]),
  suffix: z.string().optional(),
  trend: z.array(z.number()),
  positive: z.boolean().optional(),
  iconKey: z.enum(["team", "check", "clock", "file"]).optional(),
});
export type Kpi = z.infer<typeof KpiSchema>;

export const EventSchema = z.object({
  id: z.union([z.string(), z.number()]),
  time: z.string(),
  title: z.string(),
  tag: z.string(),
});
export type EventItem = z.infer<typeof EventSchema>;

export const ActivitySchema = z.object({
  id: z.string(),
  user: z.string(),
  action: z.string(),
  when: z.string(),
});
export type ActivityItem = z.infer<typeof ActivitySchema>;

export const TaskSchema = z.object({
  key: z.string(),
  task: z.string(),
  priority: z.enum(["Low", "Medium", "High"]),
  due: z.string(),
});
export type TaskItem = z.infer<typeof TaskSchema>;

export const PayslipSchema = z.object({
  key: z.string(),
  month: z.string(),
  status: z.string(),
  amount: z.string(),
});
export type PayslipItem = z.infer<typeof PayslipSchema>;
