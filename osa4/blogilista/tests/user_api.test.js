const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const User = require("../models/user")
const bcrypt = require("bcrypt")

describe("one user already in database", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash("slaasnaa", 10)
    const user = new User({ username: "ensimmainen", name: "M. Meikäläinen", passwordHash })
    
    await user.save()
  })
    
  test("you can add unique username", async () => {
    const usersBeforeNew = (await api.get("/api/users")).body
    
    const newUser = {
      username: "toinen",
      name: "Medelsvensson",
      password: "salainensana",
    }
    
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)
    
    const usersAfterNew = (await api.get("/api/users")).body
    expect(usersAfterNew).toHaveLength(usersBeforeNew.length + 1)
    
    const usernames = usersAfterNew.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test("no duplicate usernames allowed", async () => {
    const usersBeforeNew = (await api.get("/api/users")).body
    
    const newUser = {
      username: "ensimmainen",
      name: "Medelsvensson",
      password: "salainensana",
    }
    
    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
    
    const usersAfterNew = (await api.get("/api/users")).body
    expect(usersAfterNew).toHaveLength(usersBeforeNew.length)
    
    const names = usersAfterNew.map(u => u.name)
    expect(names).not.toContain(newUser.name)

  })

  test("password needs to be atleast 3 charcater long", async () => {
    const usersBeforeNew = (await api.get("/api/users")).body
    
    const newUser = {
      username: "toinen",
      name: "Medelsvensson",
      password: "ka",
    }
    
    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
    
    const usersAfterNew = (await api.get("/api/users")).body
    expect(usersAfterNew).toHaveLength(usersBeforeNew.length)
    
    const usernames = usersAfterNew.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test("password needs to exist", async () => {
    const usersBeforeNew = (await api.get("/api/users")).body
    
    const newUser = {
      username: "toinen",
      name: "Medelsvensson",
    }
    
    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
    
    const usersAfterNew = (await api.get("/api/users")).body
    expect(usersAfterNew).toHaveLength(usersBeforeNew.length)
    
    const usernames = usersAfterNew.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })
})