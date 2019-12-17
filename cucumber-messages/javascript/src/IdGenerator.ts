import uuidv4 from 'uuid/v4'

export type NewId = () => string

function uuid(): NewId {
  return () => uuidv4()
}

function incrementing(): NewId {
  let next = 0
  return () => (next++).toString()
}

export default {
  uuid,
  incrementing,
}
