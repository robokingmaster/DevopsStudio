const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } =  require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Ritesh Kumar',
        email: 'singhipst@gmail.com',
        password: 'Welcome123'
    }).expect(201)
    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    
    // Assertions about the response body
    //expect(response.body.user.name).toBe('Ritesh Kumar')
    expect(response.body).toMatchObject({
        user:{
            name: 'Ritesh Kumar',
            email: 'singhipst@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(response.body.user.password).not.toBe('Welcome123')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login not existant user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'WrongCredentials'
    }).expect(400)
})

test('Should get profile for user', async () => {
    const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    const response = await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete for authenticated user', async () => {
    const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    //Assert that the database was changed correctly
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete for unauthenticated user', async () => {
    const response = await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess')
})

test('Should not update invalid valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Bengaluru'
        })
        .expect(400)
})

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated