"use strict";
const {test} = require("node:test");
const assert = require("node:assert/strict");
const {parseQuote, subjectRoute} = require("../parser.js");

test("finds two Canadian cities in the subject", () => {
  assert.deepEqual(subjectRoute("Kingston ON to London ON, machinery, reference # DEMO-101"), {
    origin: "Kingston ON", destination: "London ON"
  });
});

test("parses a synthetic quote email without private customer data", () => {
  const subject = "Kingston ON to London ON, reference # DEMO-101, BULK-LTL";
  const body = `New Quote Request
Equipment & Logistics
Load Type:
BULK-LTL
Trailer Type:
flatbedWithTarps
Pickup Date:
2026-11-04
Delivery Date:
2026-11-06
Route Details
ORIGIN
Kingston, ON
DESTINATION
London, ON
COMMENTS
2 units, 75 x 66 x 66 inches, 7000 lb each.
Requested by:
Sample customer`;
  const quote = parseQuote(subject, body);
  assert.equal(quote.valid, true);
  assert.equal(quote.reference, "DEMO-101");
  assert.equal(quote.origin, "Kingston, ON");
  assert.equal(quote.destination, "London, ON");
  assert.equal(quote.loadType, "BULK-LTL");
  assert.equal(quote.trailerType, "flatbedWithTarps");
  assert.equal(quote.pickupDate, "2026-11-04");
  assert.equal(quote.deliveryDate, "2026-11-06");
  assert.match(quote.comments, /2 units/);
  assert.doesNotMatch(quote.comments, /Sample customer/);
});

test("returns invalid when route not found", () => {
  const quote = parseQuote("No route yet", "Hello team");
  assert.equal(quote.valid, false);
  assert.equal(quote.origin, "");
  assert.equal(quote.destination, "");
});
