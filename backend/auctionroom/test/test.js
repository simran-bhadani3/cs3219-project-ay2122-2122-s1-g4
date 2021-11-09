const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("..");
const app = server.app;
// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

describe("AuctionRoom", function () {
	this.timeout(5000);
	describe("tests", () => {
		it("should create a room", (done) => {
			chai
				.request(app)
				.post(`/api/room/newroom`)
				.send({
					owner: "testowner",
					roomname: "test",
				})
				.end((err, res) => {
					res.should.have.status(200);
				});
			done();
		});

		it("should delete a room", (done) => {
			chai
				.request(app)
				.delete(`/api/room/deleteroom/test`)
				.end((err, res) => {
					res.should.have.status(200);
				});
		});
	});
});
