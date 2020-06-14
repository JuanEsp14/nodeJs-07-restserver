//Port for enviroment
process.env.PORT = process.env.PORT || 3000;

//Checking for enviroment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Selective database
let urlDb;

//Token configs
process.env.TOKEN_DATA_EXPIRED = 60 * 60 * 24 * 30;
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-es el-seed-desarrollo';

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe';
} else {
    urlDb = process.env.MONGO_URI;
}

process.env.URL_DB = urlDb;