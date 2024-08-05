export const insertImg = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No se ha subido ninguna imagen");
        }
        res.status(200).send("Imagen cargada correctamente");
    } catch (e) {
        res.status(500).send("Error al cargar imagen");
    }
}
