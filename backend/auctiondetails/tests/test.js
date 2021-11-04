const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server')

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Auction Details", function () {
    describe("GET /", () => {
        it("should suceed (dummy home page)", (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe("GET /api/auctiondetails", () => {
        it("should get all auction details", (done) => {
            chai.request(app)
                .get('/api/auctiondetails')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    const sampleAuctionDetail1 = {
        room_display_name: "sampleRoom1",
        auction_item_name: "sampleAuctionItem1",
        owner_id: "000011112222",
        start_time: "2022-01-05T16:01:20.807Z",
        end_time: "2022-10-05T16:01:20.807Z",
        description: "sampledescription",
        minbid: 100,
        increment: 20,
        category: 'samplecategory'
    }

    const invalidAuctionDetail1 = {
        room_display_name: "sampleRoom3",
        auction_item_name: "sampleAuctionItem2",
        owner_id: "000011112222",
    }

    let newAuctionDetailId;
    describe("POST /api/auctiondetails/", () => {
        it("should throw error when properties are missing", (done) => {
            chai.request(app)
                .post('/api/auctiondetails')
                .send(invalidAuctionDetail1)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message');
                    done();
                });
        });

        it("should create a new auction detail", (done) => {
            chai.request(app)
                .post('/api/auctiondetails')
                .send(sampleAuctionDetail1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('room_display_name')
                        .which.is.a('string').eq("sampleRoom1")
                    res.body.should.have.property('_id');
                    newAuctionDetailId = res.body._id;
                    done();
                });
        });
    });

    describe("GET /api/auctiondetails", () => {
        it("should get specified auction detail", (done) => {
            chai.request(app)
                .get(`/api/auctiondetails/${newAuctionDetailId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });
    });


    describe("GET /api/auctiondetails/user/:userid", () => {
        it("should return all auctions by specified user", (done) => {
            chai.request(app)
                .get('/api/auctiondetails/user/000011112222')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body[0].should.have.property('room_display_name')
                        .which.is.a('string').eq("sampleRoom1")
                    done();
                });
        });
    });

    describe("GET /api/auctiondetails/notover", () => {
        it("should return all auctions not over", (done) => {
            chai.request(app)
                .get('/api/auctiondetails/notover')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body[0].should.have.property('room_display_name')
                    done();
                });
        });
    });

    describe("GET /api/auctiondetails/pricerange?lowerbound=100&upperbound=200", () => {
        it("should return all auctions within a price range", (done) => {
            chai.request(app)
                .get('/api/auctiondetails/pricerange?lowerbound=100&upperbound=200')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body[0].should.have.property('room_display_name')
                    done();
                });
        });
    });

    describe("GET /api/auctiondetails/category/:category", () => {
        it("should return all auctions for a specified category", (done) => {
            chai.request(app)
                .get('/api/auctiondetails/category/samplecategory')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body[0].should.have.property('category')
                        .which.is.a('string').eq("samplecategory")
                    done();
                });
        });
    });

    describe("PATCH /api/auctiondetails/:id", () => {
        const sampleAuctionDetail2 = {
            room_display_name: "sampleRoom2"
        }

        it("should patch an existing auction detail", (done) => {
            chai.request(app)
                .patch(`/api/auctiondetails/${newAuctionDetailId}`)
                .send(sampleAuctionDetail2)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.have.property('room_display_name')
                        .which.is.a('string').eq("sampleRoom2")
                    done();
                });
        });

        it("should return an error when start time is in invalid format", (done) => {
            chai.request(app)
                .patch(`/api/auctiondetails/${newAuctionDetailId}`)
                .send({ start_time: "invalid format" })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });

    describe("DELETE /api/auctiondetails/:id", () => {
        it("should delete an existing auction detail", (done) => {
            chai.request(app)
                .delete(`/api/auctiondetails/${newAuctionDetailId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    done();
                });
        });

        it("should return 404 for a non-existant auction detail to delete", (done) => {
            chai.request(app)
                .delete(`/api/auctiondetails/${newAuctionDetailId}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

});


