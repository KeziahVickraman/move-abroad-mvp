import { z } from "zod";

export const InterestTag = z.enum([
  "food",
  "outdoors",
  "arts",
  "sports",
  "professional",
  "language",
  "other",
]);

export type InterestTagType = z.infer<typeof InterestTag>;

export const Group = z
  .object({
    id: z.string().uuid(),
    title: z.string().min(1).max(120),
    interest_tag: InterestTag,
    description: z.string().max(500),
    external_link: z.string().url(),
    next_event_at: z.string().datetime().nullable(),
  })
  .strict();

export type GroupType = z.infer<typeof Group>;

export const Rsvp = z
  .object({
    user_id: z.string().uuid(),
    group_id: z.string().uuid(),
    status: z.enum(["going", "interested", "cancelled"]),
    created_at: z.string().datetime().optional(),
  })
  .strict();

export type RsvpType = z.infer<typeof Rsvp>;

export const ContentFrontmatter = z
  .object({
    title: z.string().min(1).max(120),
    interest_tags: z.array(InterestTag).min(1),
    summary: z.string().max(300),
    published: z.boolean().default(true),
  })
  .strict();

export type ContentFrontmatterType = z.infer<typeof ContentFrontmatter>;

// ===================================================================
// v1.1 Real-Time API Zod Schemas
// ===================================================================

export const WeatherNow = z
  .object({
    area: z.string(),
    forecast: z.string(),
    temperature_c: z.number().optional(),
    psi: z.number().optional(),
    uv_index: z.number().optional(),
    updated_at: z.string().datetime(),
  })
  .strict();

export type WeatherNowType = z.infer<typeof WeatherNow>;

export const BusArrival = z
  .object({
    bus_stop_code: z.string(),
    service_no: z.string(),
    eta_min: z.number(),
    load: z.enum(["seats_available", "standing_available", "limited_standing"]),
    wheelchair_accessible: z.boolean(),
  })
  .strict();

export type BusArrivalType = z.infer<typeof BusArrival>;

export const ExternalEvent = z
  .object({
    source: z.enum(["eventbrite", "meetup", "ticketmaster"]),
    external_id: z.string(),
    title: z.string(),
    interest_tag: InterestTag.optional(), // best-effort mapping, may be null
    start_at: z.string().datetime(),
    venue: z.string().optional(),
    external_link: z.string().url(),
  })
  .strict();

export type ExternalEventType = z.infer<typeof ExternalEvent>;

export const FxRate = z
  .object({
    base: z.literal("SGD"),
    rates: z.record(z.string(), z.number()),
    updated_at: z.string().datetime(),
  })
  .strict();

export type FxRateType = z.infer<typeof FxRate>;
