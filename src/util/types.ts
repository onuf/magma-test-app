export enum USER_EVENTS {
  CREATION = 'user-created',
  DELETION = 'user-deleted',
}

export interface UserEventData {
  type: `${USER_EVENTS}`,
  data: {
    name: string,
    email: string,
    id: string,
  }
}
