const supertest = require('supertest')
const app = require('../app')
const User = require('../models/User')
const { usersInDb } = require ('./helper')

const api = supertest(app)

describe('when there is initially 1 user at the db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const user = new User({
            'username': 'test',
            'first_name': 'john',
            'last_name': 'tester',
            'password': '12324'
        })
        await user.save()
    })

    test('Creation succeeds with a fresh username', async() => {

        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'ultraviolento',
            first_name: '1',
            last_name: '2',
            password: 'losv'
        }

        await api
                .post('/api/users')
                .send(newUser)
                .expect(200)
                .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = await usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken',  async () => {

        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'test',
            first_name: 'mary',
            last_name: 'ann',
            password: 'shadow'
        }

        const result = await api
                                .post('/api/users')
                                .send(newUser)
                                .expect(400)
                                .expect('Content-Type', /application\/json/)
                                    
        expect(result.body.message).toContain('`username` to be unique')

        const usersAtEnd = await usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
})