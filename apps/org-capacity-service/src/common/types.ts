import { User } from './user';

export interface RequestContext { user: User & { auth: string } }

export type Doc<E = {}> = Pick<E, Exclude<keyof E, 'id'>> & { _id?: string }

export type New<E = {}, U = ''> = Pick<E, Exclude<keyof E, 'id' | U>>

export type Update<E = {}, U = ''> = Partial<Pick<E, Exclude<keyof E, 'id' | U>>>
