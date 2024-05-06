const { test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const { maxHeaderSize } = require('node:http')


const api = supertest(app)

let headers
let user

describe('when there is initially some notes saved', () => {
beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    user = new User({ username: 'root', passwordHash })
    await user.save()
})

test('a token is returned when logging in', async () => {
    const result = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        headers = {
            Authorization: `Bearer ${result.body.token}`
        }
        
        assert(result.body.token)
})

test('blogs are returned as JSON', async () => {
    const blogsAtStart = await Blog.find({})

    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
}) 
})

describe('viewing a specific blog', () => {
    test('a specific blog is within the returned blogs', async () => {
        const blogsAtStart = await Blog.find({})
        const result = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        headers = {
            Authorization: `Bearer ${result.body.token}`
        }
        
        assert(result.body.token)

        const newBlog = {
            title: 'Heat',
            author: 'Michael Mann',
            url: 'https://heat.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)


        
        const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
        const titles = response.body.map(blog => blog.title)
        assert(titles.includes('Heat'))

        const blogsAtEnd = await Blog.find({})
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
    })
    
    test('unique id propert of the blog posts is named id', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert(response.body[0].id)
    })

    test('if likes property is missing from the request, it will default to 0', async () => {
        const blogsAtStart = await Blog.find({})
        
        const result = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

        headers = {
            Authorization: `Bearer ${result.body.token}`
        }

        const newBlog = {
            title: 'test',
            author: 'tester',
            url: 'https://test.com',
        }

        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await Blog.find({})
        assert.strictEqual(blogsAtEnd[0].likes, 0)
    })

})

describe('adding a blog', () => {
    test('a blog can be added', async () => {
        const blogsAtStart = await Blog.find({})
        
        const newBlog = {
            title: 'test',
            author: 'tester',
            url: 'https://test.com',
            likes: 0
        }
    
        const result = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
            headers = {
                Authorization: `Bearer ${result.body.token}`
        }
    
        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await Blog.find({})
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
    })

    test('if title and url properties are missing from the request, the backend responds with status code 400', async () => {
        const blogsAtStart = await Blog.find({})

        const result = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

        headers = {
            Authorization: `Bearer ${result.body.token}`
        }

        const newBlog = {
            author: 'tester',
            likes: 0
        }
    
        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(400)
        
        const blogsAtEnd = await Blog.find({})
        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    })

    test('successfully add the blog', async () => {
        const blogsAtStart = await Blog.find({})
        
        const result = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

        headers = {
            Authorization: `Bearer ${result.body.token}`
        }

        const newBlog = {
            title: 'Heat',
            author: 'Michael Mann',
            url: 'https://heat.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await Blog.find({})
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
    })

    test('fails with status code 401 token is not provided', async () => {
        const blogsAtStart = await Blog.find({})
        const newBlog = {
            title: 'Heat',
            author: 'Michael Mann',
            url: 'https://heat.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await Blog.find({})
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('when create the user username, password and name are provided', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'testuser',
            name: 'Test User',
            password: 'testpassword',
        }

        await api 
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
        
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('when create the user username must be at least 3 characters long', async () => {
        const usersAtStart = await User.find({})
        const newUser = {
            username: 'te',
            name: 'Test User',
            password: 'testpassword',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await User.find({})
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('when create the user password must be at least 3 characters long', async () => {
        const usersAtStart = await User.find({})
        const newUser = {
            username: 'test',
            name: 'Test User',
            password: 'te',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await User.find({})
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('when create the user username must be unique', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'root',
            name: 'Test',
            password: 'testpassword',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    })
})


describe('deletion of a blog', () => {
    test('success with status code 204 if id is valid', async () => {
        const blogsAtStart = await Blog.find({})
        
        const result = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

        headers = {
            Authorization: `Bearer ${result.body.token}`
        }

        const newBlog = {
            title: 'Heat',
            author: 'Michael Mann',
            url: 'https://heat.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtMiddle = await Blog.find({})
        assert.strictEqual(blogsAtMiddle.length, blogsAtStart.length + 1)

        const blogToDelete = blogsAtMiddle[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set(headers)
            .expect(204)
        
        const blogsAtEnd = await Blog.find({})
        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    })

    test('fail to delete the blog because token is not provided', async () => {
        const blogsAtStart = await Blog.find({})
        
        const result = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

        headers = {
            Authorization: `Bearer ${result.body.token}`
        }

        const newBlog = {
            title: 'Heat',
            author: 'Michael Mann',
            url: 'https://heat.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtMiddle = await Blog.find({})
        assert.strictEqual(blogsAtMiddle.length, blogsAtStart.length + 1)
        const blogToDelete = blogsAtMiddle[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)
    })

    test('fails with status code 404, blog not found', async () => {
        const blogsAtStart = await Blog.find({})
        const notExistingId = await helper.notExistingId()

        const result = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

        headers = {
            Authorization: `Bearer ${result.body.token}`
        }
        
        await api   
            .delete(`/api/blogs/${notExistingId}`)
            .set(headers)
            .expect(404)
            
        const blogsAtEnd = await Blog.find({})
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
})

describe('updating a blog', () => {
    test('succeeds with a valid id', async () => {
        const blogsAtStart = await Blog.find({})
        
        const result = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

        headers = {
            Authorization: `Bearer ${result.body.token}`
        }

        const newBlog = {
            title: 'Heat',
            author: 'Michael Mann',
            url: 'https://heat.com',
            likes: 1
        }

        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtMiddle = await Blog.find({})
        assert.strictEqual(blogsAtMiddle.length, blogsAtStart.length + 1)

        const blogToUpdate = blogsAtMiddle[0]
        const updatedBlog = {
            title: 'Heat',
            author: 'Michael Mann',
            url: 'https://heat.com',
            likes: 2
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set(headers)
            .send(updatedBlog)
            .expect(200)
        
        const blogsAtEnd = await Blog.find({})
        assert.strictEqual(blogsAtEnd[0].likes, 2)

    })


    test('fails with status code 404 if id is invalid', async () => {
        await Blog.deleteMany({})
        const blogsAtStart = await Blog.find({})
        const notExistingId = await helper.notExistingId()

        const result = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

        headers = {
            Authorization: `Bearer ${result.body.token}`
        }

        const newBlog = {
            title: 'Heat',
            author: 'Michael Mann',
            url: 'https://heat.com',
            likes: 1
        }

        await api
            .post('/api/blogs')
            .set(headers)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtMiddle = await Blog.find({})
        assert.strictEqual(blogsAtMiddle.length, blogsAtStart.length + 1)

        const updatedBlog = {
            title: 'Heat',
            author: 'Michael Mann',
            url: 'https://heat.com',
            likes: 2
        }

        await api
            .put(`/api/blogs/${notExistingId}`)
            .set(headers)
            .send(updatedBlog)
            .expect(404)
        
        const blogsAtEnd = await Blog.find({})
        assert.strictEqual(blogsAtEnd[0].likes, 1)

    })

    test('fails with status code 401 if token is not provided', async () => {
        const blogsAtStart = await Blog.find({})

        const result = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'sekret'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const headers = {
            Authorization: `Bearer ${result.body.token}`
        }

        const newBlog = {
            title: 'Heat',
            author: 'Michael Mann',
            url: 'https://heat.com',
            likes: 1
        }
    await api
        .post('/api/blogs')
        .set(headers)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtMiddle = await Blog.find({})
    assert.strictEqual(blogsAtMiddle.length, blogsAtStart.length + 1)

    const blogToUpdate = blogsAtMiddle[0]
    const updatedBlog = {
        title: 'Heat',
        author: 'Michael Mann',
        url: 'https://heat.com',
        likes: 2
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    })

})

after(async () => {
    await mongoose.connection.close()
})


