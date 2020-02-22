const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Item = require('../models/Item')

const api = supertest(app)

const initialItems = [
    {
        'id': '36e12843-ca0f-41f6-9251-6a18e8523294',
        'reference': 'Mass Effect 1',
        'description': 'RPG third person shooter',
        'currency': 'COP',
        'vr_unit':  55000,
        'discount': 0,
    },
    {
        'id': '795b5bde-d443-4960-a959-6e1e197c3096',
        'reference': 'The Witcher 3',
        'description': 'RPG fantasy game',
        'currency': 'COP',
        'vr_unit':  24000,
        'discount': 0,
    },
    {
        'id': '296b24b1-a809-49a2-9342-9324b6ec4747',
        'reference': 'Monster Hunter World',
        'description': 'RPG Game',
        'currency': 'COP',
        'vr_unit':  55000,
        'discount': 0,
    },
    {
        'id': 'f165719d-726c-40c8-9acd-ac7d6d743967',
        'reference': 'Darks Souls 3',
        'description': 'Dark souls game',
        'currency': 'USD',
        'vr_unit':  19.99,
        'discount': 0,
    },
]

beforeEach(async () => {
    const itemObjects = initialItems.map(i => new Item(i))
    await Promise.all(itemObjects.map(i => i.save()))
})

test('it should get all items in the db (4 items)', async () => {
    const res = await api.get('/api/items')
    expect(res.body.length).toBe(initialItems.length)
})

test('it should get a single item', async () => {
    const res = await api.get('/api/items/795b5bde-d443-4960-a959-6e1e197c3096')
    expect(res.body.reference).toBe('The Witcher 3')
})

test('it should handle a request for a non existing id', async () => {
    const res = await api.get('/api/items/non-existing-id')

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('the id couldnt be found on the server')
})

test('it should add an item to the db', async () => {

    await api
            .post('/api/items')
            .send({
                'reference': 'Baldurs gate',
                'description': 'Classic isometric RPG game',
                'currency': 'COP',
                'discout': 0,
                'vr_unit': 15000
            })

    const res = await Item.find({})
    const references = res.map(i => i.reference)

    expect(references).toContain('Baldurs gate')
})

test('it shouldnt allow adding items with missing mandatories properties', async () => {
    const res = await api.post('/api/items').send({'reference': 'Incomplete stuff...'})

    expect(res.status).toBe(400)
    expect(res.body.message).toBeDefined()
})

test('It should update monster hunter world vr_unit', async () => {
    await api
            .patch('/api/items/296b24b1-a809-49a2-9342-9324b6ec4747')
            .send({'vr_unit': 130000})
    
    const res = await Item.findOne({'id': '296b24b1-a809-49a2-9342-9324b6ec4747'})

    expect(res.vr_unit).toBe(130000)
})

test('It should delete monster hunter world', async () => {
    await api
            .delete('/api/items/296b24b1-a809-49a2-9342-9324b6ec4747')
            .expect(204)
    
    const response = await Item.find({'id': '296b24b1-a809-49a2-9342-9324b6ec4747'})
    expect(response.body).toBe(undefined)
})

afterAll(async () => {
    await Item.deleteMany({})
    mongoose.connection.close()
})