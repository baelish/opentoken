"use strict";


/**
 * @param {opentoken~binaryBuffer} binaryBuffer
 * @param {opentoken~genericFormatter} genericFormatter
 * @return {Function}
 */
module.exports = (binaryBuffer, genericFormatter) => {
    return genericFormatter.formatWithFallback((req, res, body, done) => {
        body = binaryBuffer.toBuffer(body);

        done(null, body);
    });
};
