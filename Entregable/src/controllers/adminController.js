import { userModel } from '../models/user.js';

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.render('admin', { users });
    } catch (error) {
        res.status(500).send('Error al obtener usuarios');
    }
};

export const deleteUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (error) {
        res.status(500).send('Error al eliminar usuario');
    }
};
