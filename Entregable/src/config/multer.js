    import multer from "multer";

    const storage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null, `${__dirname}/public/img`)
        },
        filename: (req, file, cb) =>{
            cb(null, `${Date.now()}${file.originalname}`)
        }
    })

    const upload = multer({storage: storage})

    export default upload