import { UserDatabase } from "../../types/DatabaseObjects"

export const IncomingAnakinDatabaseObject: Partial<UserDatabase> = {
  first_name:'Anakin',
  last_name: 'Skywalker',
  email: "AniSky@walker.com",
  password_hash: '$2b$10$fJXbx3HB1VPHm9IZJ9f63O.HCPlkwLvG39LHcMgQ1x9sEfVjZ.BL2'
}

export const IncomingAnakinNoPasswordDatabaseObject: Partial<UserDatabase> = {
  first_name:'Anakin',
  last_name: 'Skywalker',
  email: "AniSky@walker.com",
}

export const IncomingAnakinEditDatabaseObject: Partial<UserDatabase> = {
  last_name: 'Skywalker-Amidala',
}

export const OutgoingAnakinDatabaseObject: Partial<UserDatabase> = {
  id: 1,
  first_name:'Anakin',
  last_name: 'Skywalker',
  email: "AniSky@walker.com",
  password_hash: '$2b$10$fJXbx3HB1VPHm9IZJ9f63O.HCPlkwLvG39LHcMgQ1x9sEfVjZ.BL2'
}