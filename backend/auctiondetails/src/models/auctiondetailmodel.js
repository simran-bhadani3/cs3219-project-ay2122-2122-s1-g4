const mongoose = require('mongoose');
const uuid = require('mongoose-uuid');
const AuctionDetailSchema = mongoose.Schema({
    room_display_name: {type: String, required: [true, 'display name required']},
    //roomid: {type: String, index: true, unique: true},
    auction_item_name: {type: String, required: [true, 'item name required']},
    owner_id: {type: Number, required: [true, 'valid owner id required']},
    start_time: {type: Date, required: [true, 'valid date string required for end time']},
    end_time: {type: Date, required: [true, 'valid date string required for end time']},
}, {
    timestamps: true
});

AuctionDetailSchema.plugin(uuid.plugin, 'room_id');

module.exports = mongoose.model('Auctiondetail', AuctionDetailSchema);