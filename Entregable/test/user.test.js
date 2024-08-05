import mongoose from "mongoose";
import userModel from "../src/models/user.js";
import Assert from 'assert';

const assert = Assert.strict;

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://<usuario>:<contraseña>@cluster0.hkfjh1t.mongodb.net/test?retryWrites=true&w=majority');
});

describe('Test CRUD de usuarios en la ruta /api/users', function () {

    beforeAll(() => {
        console.log("Arrancando el test");
    });

    beforeEach(() => {
        console.log("Comienza el test");
    });

    it('Obtener todos los usuarios mediante el método GET', async () => {
        const users = await userModel.find();
        assert.strictEqual(Array.isArray(users), true);
    });

    it('Obtener un usuario dado su id mediante el método GET', async () => {
        const user = await userModel.findById('someUserId'); // Reemplaza 'someUserId' con un ID válido
        assert.ok(user._id);
    });

    it('Crear un usuario mediante el método POST', async () => {
        const newUser = {
            first_name: "Facundo",
            last_name: "Fernandez",
            email: "facu@facu.com",
            password: "1234",
            age: 30
        };

        const userCreated = await userModel.create(newUser);
        assert.ok(userCreated._id);
    });

    it('Actualizar un usuario dado un id como el parámetro mediante el método PUT', async () => {
        const updateUser = {
            first_name: "Facundo",
            last_name: "Fernandez",
            email: "facu@facu.com",
            password: "1234",
            age: 30
        };

        const userUpdated = await userModel.findByIdAndUpdate('someUserId', updateUser); // Reemplaza 'someUserId' con un ID válido
        assert.ok(userUpdated._id);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });
});
