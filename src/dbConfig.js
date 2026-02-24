const mongoose = require("mongoose");
const config = require("./config");

mongoose.set('strictQuery', true);//Si strictQuery se establece en true, Mongoose eliminará cualquier campo en una consulta que no esté definido en el esquema antes
//de enviar la consulta a MongoDB. Por ejemplo, si tienes un esquema con solo un campo name, y tratas de hacer una consulta con un campo age, Mongoose eliminará el campo
//age de la consulta.

const MONGODB_URI = `mongodb://${process.env.USERADMIN}:${process.env.USERPWD}@${process.env.SERVER}/sbc?authSource=admin`;
//const MONGODB_URI = `mongodb://localhost/${process.env.DATABASE}`;
//const MONGODB_URI = `mongodb://localhost/sbc`;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true
})
    .then((db) => console.log("Mongodb is connected to", db.connection.host))
    .catch((err) => console.error(err));  