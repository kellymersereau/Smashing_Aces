var handChecker = require("../server.js");
console.log(handChecker);
// describe ('handChecker',function () {

// 	describe('check for three of a kind', function() {
// 		it('should return false'),function () {
// 		expect(checkThreeKind([2,6,8])).toBe(false);
	
	
//   });
// });






describe("handChecker", function() {

  describe("check for three of a kind", function() {
    it("should return false", function () {
	expect(handChecker([2,6,8])).toBe(false);
//	expect(handChecker([2,2,2])).toBe({nameOfHand: 'Three of a kind', rankOfHand: 5, highToLow: 2});
    });
  });

  describe("check for three of a kind", function() {
    it("should return false", function () {
	expect(handChecker([2,6,8])).toBe(false);
//	expect(handChecker([2,2,2])).toBe({nameOfHand: 'Three of a kind', rankOfHand: 5, highToLow: 2});
    });
  });


});


