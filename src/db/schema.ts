import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull().default('temp_username'),
  email: text('email').notNull().unique(),
  password: text('password').notNull().default('temp_password'),
  role: text('role').notNull().default('petugas'),
  emailVerified: boolean('emailVerified'),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => users.id)
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => users.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const rooms = pgTable('rooms', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  adminId: text('admin_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull(),
});

export const racks = pgTable('racks', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull().references(() => rooms.id),
  code: text('code').notNull(),
  rows: integer('rows').notNull(),
  cols: integer('cols').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const albums = pgTable('albums', {
  id: text('id').primaryKey(),
  rackId: text('rack_id').notNull().references(() => racks.id),
  rowPos: integer('row_pos').notNull(),
  colPos: integer('col_pos').notNull(),
  code: text('code').notNull(),
  capacity: integer('capacity').notNull().default(100),
  currentFill: integer('current_fill').notNull().default(0),
  createdAt: timestamp('created_at').notNull(),
});

export const archives = pgTable('archives', {
  id: text('id').primaryKey(),
  archiveNumber: text('archive_number').notNull(),
  ownerName: text('owner_name'),
  status: text('status').notNull().default('Tersedia'),
  albumId: text('album_id').notNull().references(() => albums.id),
  regionCode: text('region_code'),
  docType: text('doc_type').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const loans = pgTable('loans', {
  id: text('id').primaryKey(),
  archiveId: text('archive_id').notNull().references(() => archives.id),
  initialUserId: text('initial_user_id').notNull().references(() => users.id),
  borrowerName: text('borrower_name').notNull(),
  notes: text('notes'),
  borrowDate: timestamp('borrow_date').notNull(),
  dueDate: timestamp('due_date').notNull(),
  status: text('status').notNull().default('Berjalan'),
  createdAt: timestamp('created_at').notNull(),
});

export const loanTransfers = pgTable('loan_transfers', {
  id: text('id').primaryKey(),
  loanId: text('loan_id').notNull().references(() => loans.id),
  fromUserId: text('from_user_id').notNull().references(() => users.id),
  toUserId: text('to_user_id').notNull().references(() => users.id),
  transferDate: timestamp('transfer_date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull(),
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  loanId: text('loan_id').references(() => loans.id),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull(),
});
