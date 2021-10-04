const mongoose = require('mongoose');
const uuid = require('mongoose-uuid');
const AuctionDetailSchema = mongoose.Schema({
    room_display_name: {type: String, required: [true, 'display name required']},
    //roomid: {type: String, index: true, unique: true},
    auction_item_name: {type: String, required: [true, 'item name required']},
    owner_id: Number,
    start_time: Date,
    end_time: Date,
}, {
    timestamps: true
});

AuctionDetailSchema.plugin(uuid.plugin, 'room_id');

module.exports = mongoose.model('Auctiondetail', AuctionDetailSchema);