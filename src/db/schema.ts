import { 
    pgTable,
    pgEnum,
    text,
    timestamp,
    uuid,
    integer,
    boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { INSTRUMENTS } from '@/constants/instruments';
import { create } from 'domain';

export const instrumentEnum = pgEnum('instrument', INSTRUMENTS);

//tables /////////
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    clerkId: text('clerk_id').notNull().unique(),
    username: text('username').notNull().unique(),
    name: text('name').notNull(),
    bio: text('bio'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userInstruments = pgTable('user_instruments', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    instrument: instrumentEnum('instrument').notNull(),
    isFavorite: boolean('is_favorite').default(false).notNull(),
});

export const sessions = pgTable('sessions', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    instrument: instrumentEnum('instrument').notNull(),
    title: text('title').notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    notes: text('notes'),
    mediaUrl: text('media_url'),
    mediaType: text('media_type'),
    CreatedAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessionLikes = pgTable('session_likes', {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    sessionId: uuid('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessionComments = pgTable('session_comments', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    sessionId: uuid('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const follows = pgTable('follows', {
    followerId: uuid('follower_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    followingId: uuid('following_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const streaks = pgTable('streaks', {
    userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
    currentStreak: integer('current_streak').default(0).notNull(),
    longestStreak: integer('longest_streak').default(0).notNull(),
    lastPractice: timestamp('last_practice'),
});

//relations /////////
export const usersRelations = relations(users, ({ many, one }) => ({
    instruments: many(userInstruments),
    sessions: many(sessions),
    likes: many(sessionLikes),
    comments: many(sessionComments),
    followers: many(follows, { relationName: 'following' }),
    following: many(follows, { relationName: 'follower' }),
    streak: one(streaks),
}));

export const userInstrumentsRelations = relations(userInstruments, ({ one }) => ({
    user: one(users, { fields: [userInstruments.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
    likes: many(sessionLikes),
    comments: many(sessionComments),
}));

export const sessionLikesRelations = relations(sessionLikes, ({ one }) => ({
    user: one(users, { fields: [sessionLikes.userId], references: [users.id] }),
    session: one(sessions, { fields: [sessionLikes.sessionId], references: [sessions.id] })
}));

export const sessionCommentsRelations = relations(sessionComments, ({ one }) => ({
    user: one(users, { fields: [sessionComments.userId], references: [users.id] }),
    session: one(sessions, { fields: [sessionComments.sessionId], references: [sessions.id] })
}));

export const followsRelations = relations(follows, ({ one }) => ({
    follower: one(users, { fields: [follows.followerId], references: [users.id], relationName: 'follower' }),
    follows: one(users, { fields: [follows.followingId], references: [users.id], relationName: 'following' }),
}));

export const streaksRelations = relations(streaks, ({ one }) => ({
    user: one(users, { fields: [streaks.userId], references: [users.id] }),
}));