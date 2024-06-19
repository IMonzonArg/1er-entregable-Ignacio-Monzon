import mongoose from "mongoose";
import userModel from "../src/models/user.js"
import Assert from 'assert'

const assert = Assert.strict
await mongoose.connect(`mongodb+srv://ignaciolmonzon:@cluster0.hkfjh1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)

describe('Test CRUD de usuarios en la ruta /api/users', function () {

    before(() => {
        console.log("Arrancando el test")
    })

    this.beforeEach(() => {
        console.log("Comienza el test")
    })


    it('Obtener todos los usuarios mediante el metodo GET', async () =>{
    const users = await userModel.find()

    assert.strictEqual(Array.isArray(users), true)
    })

    it('Obtener un usuario dado su id mediante el metodo GET', async () => {
        const user = await userModel.findById('ID')

        assert.ok(user._id)
    })

    it('Crear un usuario mediante el metodo POST', async() => {
        const newUser = {
            first_name: "Facundo",
            last_name: "Fernandez",
            email: "facu@facu.com",
            password: "1234",
            age: 30
        }

        const userCreated = await userModel.create(newUser)

        assert.ok(userCreated._id)
    })

    it('Actualizar un usuario dado un id como el parametro mediante el metodo PUT',async () => {
        const updateUser = {
            first_name: "Facundo",
            last_name: "Fernandez",
            email: "facu@facu.com",
            password: "1234",
            age: 30
        }

        const userUpdated = await userModel.findByIdAndUpdate('ID', updateUser)
        assert.ok(userUpdated._id)
    })
})

