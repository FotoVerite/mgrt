var Mgrt = require('../lib/mgrt'),
    chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    should = chai.should();

chai.use(sinonChai);

describe('Mgrt facade', function() {
	it('Should add middlewares', function() {
		var mgrt = new Mgrt({}),
		    mdl = function() {};

		mgrt.use(mdl);
		mgrt.use(mdl);

		mgrt.middleware.should.have.lengthOf(2);
	});

	it('Should yield middleware with env context', function() {
		var mgrt = new Mgrt({}),
		    mdl1 = sinon.spy(),
		    mdl2 = sinon.spy();

		mgrt.use(mdl1);
		mgrt.use(mdl2);
		mgrt.applyMiddleware();

		mdl1.should.have.been.calledOn(mgrt.env);
		mdl2.should.have.been.calledOn(mgrt.env);
	});

	it('Should apply middleware and call ward', function() {
		var mgrt = new Mgrt({}),
		    setupSpy = sinon.spy(),
		    wardSpy, md1;

		wardSpy = sinon.spy(function(next) {
			next();
		});

		mdl1 = sinon.spy(function(next) {
			this.wards.push(wardSpy);
		});

		mgrt.use(mdl1);
		mgrt.setup(setupSpy);

		wardSpy.should.have.been.calledOn(mgrt.env);
		setupSpy.should.have.been.calledOn(mgrt);
	});
});
