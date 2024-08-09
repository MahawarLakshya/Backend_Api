const csvtojson = require('csvtojson');
const mongoose = require('mongoose');
const path = require('path');

const url = "mongodb+srv://Task1:Qwerty@atlascluster.buxlu.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connected!");
    startCSVImport();
}).catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
});

const fileName = path.join(__dirname, 'KoinX Assignment CSV Sample.csv');

function startCSVImport() {
    csvtojson().fromFile(fileName).then(source => {
        const arrayToInsert = source.map(row => ({
            user_id: row["User_ID"],
            utc_timestamp: new Date(row["UTC_Time"]),
            operation: row["Operation"],
            market: row["Market"],
            quantity: parseFloat(row["Buy/Sell Amount"]),
            price: parseFloat(row["Price"]),
        }));

        const collectionName = "trades";
        const collection = mongoose.connection.collection(collectionName);

        collection.insertMany(arrayToInsert, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Import CSV into database successfully.");
            }
        });
    });
}