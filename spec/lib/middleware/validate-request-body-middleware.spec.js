"use strict";

describe("validateRequestBodyMiddleware", () => {
    var chainMiddlewareMock, restifyPluginsMock, schemaMock, validateRequestBodyMiddleware;

    beforeEach(() => {
        chainMiddlewareMock = jasmine.createSpy("chainMiddlewareMock");
        restifyPluginsMock = jasmine.createSpyObj("restifyPlugins", [
            "bodyParser"
        ]);
        schemaMock = jasmine.createSpyObj("schema", [
            "validate"
        ]);
        schemaMock.validate.andReturn(null);
        validateRequestBodyMiddleware = require("../../../lib/middleware/validate-request-body-middleware")(chainMiddlewareMock, restifyPluginsMock, schemaMock);
    });
    it("parses the body", () => {
        validateRequestBodyMiddleware("schema");
        expect(restifyPluginsMock.bodyParser).toHaveBeenCalled();
    });
    describe("validation against schema", () => {
        var middlewareAsync, req, res;

        beforeEach(() => {
            var middleware;

            validateRequestBodyMiddleware("schema");
            middleware = chainMiddlewareMock.mostRecentCall.args[1];
            middlewareAsync = jasmine.middlewareToPromise(middleware);
            req = require("../../mock/request-mock")();
            res = require("../../mock/response-mock")();
        });
        it("calls schema.validate()", () => {
            req.body = {
                body: true
            };

            return middlewareAsync(req, res).then(() => {
                expect(schemaMock.validate).toHaveBeenCalledWith({
                    body: true
                }, "schema");
                expect(res.send).not.toHaveBeenCalled();
            });
        });
        it("errors when the schema does not validate", () => {
            req.body = {
                body: true
            };
            schemaMock.validate.andReturn({
                validation: "errors"
            });

            return middlewareAsync(req, res).then(jasmine.fail, () => {
                expect(schemaMock.validate).toHaveBeenCalledWith({
                    body: true
                }, "schema");
                expect(res.send).toHaveBeenCalledWith(400, jasmine.any(Error));
            });
        });
    });
});
