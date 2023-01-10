const mongoose = require("mongoose")
const supertest = require("supertest")
const { response } = require("../app")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")


describe("tests with initial blogs", () => {
  let token = ""

  const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    },
  ]

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)

    const user = {
      "username": "kayttaja5",
      "name": "M. Meikäläinen",
      "password": "salasana"
    }

    await api
        .post("/api/users")
        .send(user)

    const response = await api
                    .post("/api/login")
                    .send({
                          "username": "kayttaja5",
                          "password": "salasana"
                          })

    token = "bearer " + response._body.token

  })

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs")
  
    expect(response.body).toHaveLength(initialBlogs.length)
  })
  
  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs")

    const titles = response.body.map(r => r.title)

    expect(titles).toContain(
      "React patterns"
    )
  })

  test("blogs are identified by id", async () => {
    const response = await api.get("/api/blogs")

    expect(response.body[0].id).toBeDefined()

  })

  describe("adding blogs", () => {
    test("a valid blog can be added ", async () => {
      const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
      }
  
      await api
        .post("/api/blogs")
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)
  
      const response = await api.get("/api/blogs")
  
      const titles = response.body.map(b => b.title)
  
      expect(response.body).toHaveLength(initialBlogs.length + 1)
      expect(titles).toContain(
        "Canonical string reduction"
      )
    })

    test("a blog without likes can be added", async () =>{
      const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",        
      }

      const response = await api
        .post("/api/blogs")
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

      expect(response.body.likes).toEqual(0)

    })

    test("a blog without title and url cannot be added", async () =>{
      const newBlog = {
        author: "Edsger W. Dijkstra",
        likes: 13,        
      }

      await api
        .post("/api/blogs")
        .set('Authorization', token)
        .send(newBlog)
        .expect(400)

    })

    test("a blog cannot be added without token", async () =>{
      const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
      }

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)

    })


  })

  describe("delete blog", () => {
    test("a blog can be deleted with id", async () => {
      var blogsBeforeDeletion = (await api.get("/api/blogs")).body
      const blogToDelete = {
        title: "Go To Statement Considered Harmful part 2",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        user: "0",
      }

      blogsBeforeDeletion = blogsBeforeDeletion.concat(blogToDelete)

      const response = (await api
        .post("/api/blogs")
        .set('Authorization', token)
        .send(blogToDelete)).body

      await api
        .delete(`/api/blogs/${response.id}`)
        .set('Authorization', token)
        .expect(204)
    
      const blogsAfterDeletion = (await api.get("/api/blogs")).body

      expect(blogsAfterDeletion).toHaveLength(
        blogsBeforeDeletion.length - 1
      )

      const titles = blogsAfterDeletion.map(b => b.title)

      expect(titles).not.toContain(blogToDelete.title)

    })
  })

  describe("update blog", () => {
    test("likes can be updated", async () => {
      const blogsBeforeUpdate = (await api.get("/api/blogs")).body
      const blogToUpdate = blogsBeforeUpdate[0]

      const blog = {
        likes: blogToUpdate.likes + 1
      } 

      await api.put(`/api/blogs/${blogToUpdate.id}`).send(blog)

      const blogsAfterUpdate = (await api.get("/api/blogs")).body
      const updatedBlog = blogsAfterUpdate.filter(b => b.id === blogToUpdate.id)[0]

      expect(updatedBlog.likes).toEqual(blogToUpdate.likes + 1)

    })

  })

})

afterAll(() => {
  mongoose.connection.close()
})