const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const url = "mongodb+srv://Task1:Qwerty@atlascluster.buxlu.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";

const tradeSchema = new mongoose.Schema({
    user_id: String,
    utc_timestamp: Date,
    operation: String,
    market: String,
    quantity: Number,
    price: Number
});

const Trade = mongoose.model('Trade', tradeSchema);

app.post('/balance', async(req, res) => {
    const { timestamp } = req.body;
    const date = new Date(timestamp);

    // Find trades before the specified timestamp
    const trades = await Trade.find({ utc_timestamp: { $lte: date } });

    // Calculate balance for each asset
    const balances = trades.reduce((acc, trade) => {
        const [baseCoin] = trade.market.split('/');
        if (!acc[baseCoin]) acc[baseCoin] = 0;
        acc[baseCoin] += trade.operation.toLowerCase() === 'buy' ? trade.quantity : -trade.quantity;
        return acc;
    }, {});

    res.json(balances);
});

mongoose.connect(url)
    .then(() => app.listen(3000, () => console.log('Server is running on port http://localhost:3000/balance')))
    .catch(err => console.error(err));