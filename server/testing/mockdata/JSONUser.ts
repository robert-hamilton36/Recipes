import { IncomingUser } from "../../types/User"

export const AnakinRegisterData: IncomingUser = {
  firstName: "Anakin",
  lastName: "Skywalker",
  email: "AniSky@walker.com",
  password: "Padme"
}

export const AnakinLoginData = {
  email: "AniSky@walker.com",
  password: "Padme"
}

export const AnakinWrongEmailLoginData = {
  email: "Ani@Skywalker.com",
  password: "Padme"
}

export const AnakinWrongPasswordLoginData = {
  email: "Ani@Skywalker.com",
  password: "xXYounglingSlayerXx"
}

export const AnakinChangePasswordData = {
  email: "AniSky@walker.com",
  password: "Padme",
  newPassword:"xXYounglingSlayerXx"
}

export const AnakinWrongEmailChangePasswordData = {
  email: "Ani@Skywalker.com",
  password: "Padme",
  newPassword:"xXYounglingSlayerXx"
}

export const AnakinWrongPasswordChangePasswordData = {
  email: "Ani@Skywalker.com",
  password: "xXYounglingSlayerXx",
  newPassword: 'Padme'
}

export const AnakingUpdateInfoData = {
  email: "AniSky@walker.com",
  password: "Padme",
  user: {
    lastName: 'Skywalker-Amidala',
  }
}

export const HashedPasswordData = '$2b$10$fJXbx3HB1VPHm9IZJ9f63O.HCPlkwLvG39LHcMgQ1x9sEfVjZ.BL2'
export const HashedPasswordData2 = '$2b$10$/58Jkp7Fv2AznXyfs/lN/.aZ05KcC6u1MhaAdM4ZA9h/yTMB2U26q'

export const JWTData = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjZ9.bCPwFmwbYVzA4PtlemRl4blw9rsr8sTLryfspBTmcfc"