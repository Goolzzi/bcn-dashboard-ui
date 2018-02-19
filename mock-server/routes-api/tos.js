'use strict';


var express = require('express');
var router = express.Router();


// Returns a random number of milliseconds
// to delay, to simulate the latency of a real
// system
function fakeLatency() {
	let minMS = 500;
	let maxMS = 3000;
	return Math.floor((Math.random() * (maxMS - minMS)) + minMS)
	// let min = Math.ceil(500);
	// let max = Math.floor(99999);
	// return Math.floor(Math.random() * (max - min)) + min;
}

// /v1//api/legal/legal/termsofservice
router.get('/termsofservice', function (req, res) {

	res.setHeader('Content-Type', 'application/html');
	var terms =
		'<html>' +
		'This End User Agreement is entered into by BlueCat Networks (USA) Inc., with respect to ' +
		'Customers located in the United States of America, and BlueCat Networks, Inc., with respect to ' +
		'Customers located outside the United States of America. ' +
		'<p>\n' +
		'Whereas BlueCat develops, owns and licenses certain software products and services in the ' +
		'DNS, DHCP and IPAM markets; and ' +
		'Whereas Customer desires to: (a) obtain from BlueCat certain licenses for BlueCat’s ' +
		'products; and (b) engage BlueCat to provide certain services, in each case as more fully described ' +
		'herein and in the applicable Purchase Order; ' +
		'<p>\n' +
		'<b>DEFINITIONS AND SCHEDULES</b> ' +
		'<p>\n' +
		'1.1. <b>Definitions.</b> In this Agreement, except where the context or subject matter is ' +
		'inconsistent therewith, the following terms shall have the following meanings, and such meanings ' +
		'shall apply to both singular and plural forms of any such terms: ' +
		'<p>\n' +
		'(a) <b>"Affiliate"</b> means a Party\'s direct or indirect parent or subsidiary corporation (or other entity), ' +
		'or any corporation (or other entity) with which the Party is under common control; ' +
		'<p>\n' +
		'(b) <b>"Agreement"</b> means this End User Agreement, all schedules annexed hereto, each Purchase ' +
		'Order and SOW and any other document incorporated by reference herein; ' +
		'<p>\n' +
		'(c) <b>"Appliance"</b> means any physical computer hardware component sold by BlueCat where the ' +
		'Software is resident or installed; ' +
		'<p>\n' +
		'(d) <b>"Confidential Information"</b> means any and all information disclosed by the disclosing Party ' +
		'to the recipient Party pursuant to this Agreement relating to its products, services, customers, ' +
		'marketing, research and development, business and finances, including all technical ' +
		'information, data, documentation, code, prototypes and copies thereof, which is either ' +
		'explicitly marked or noted at the time of disclosure as confidential or which a reasonable party ' +
		'would deem to be non-public and confidential having regard to the circumstances surrounding ' +
		'disclosure. Confidential Information shall not include information which a recipient Party can ' +
		'establish to have: (i) become publicly known through no action on the recipient\'s part; (ii) been ' +
		'lawfully known by the recipient prior to receipt; (iii) been independently developed by the ' +
		'recipient without reference to any information received from the disclosing Party; or (iv) been ' +
		'approved for public release by the written authorization of the disclosing Party. Specific ' +
		'information received shall not be deemed to fall within the exceptions to Confidential ' +
		'Information set forth above merely because it is embraced by general information within the ' +
		'exception; ' +
		'<p>\n' +
		'(e) <b>"Documentation"</b> means all standard user guides, operating manuals and release notes for ' +
		'the operation of the Product, available in hard copy or electronic format, from BlueCat ' +
		'including via the Customer Care portal at https://care.bluecatnetworks.com, and any revisions, ' +
		'updates and supplements thereto, as approved and amended by BlueCat from time to time; ' +
		'<p>\n' +
		'(f) <b>"e-Learning"</b> means BlueCat’s computer based training courses; ' +
		'<p>\n' +
		'(g) <b>"Intellectual Property Rights"</b> means all intellectual property and other proprietary rights, ' +
		'including all rights provided under trade secret law, patent law, copyright law, trade mark or  ' +
		'service mark law, design patent or industrial design law, semi-conductor chip or mask work ' +
		'law, and any other statutory provision or common law principle which may provide a right in ' +
		'either ideas, formulae, algorithms, concepts, inventions or know-how, whether registered or ' +
		'not and including all applications therefor; ' +
		'<p>\n' +
		'(h) <b>"Maintenance and Support"</b> means the maintenance services (including renewals) relating ' +
		'to updates, upgrades, patches, bug fixes and other improvements to the Software and the ' +
		'technical support services relating to the Products provided by BlueCat as described in the ' +
		'BlueCat Customer Care Support Handbook; ' +
		'<p>\n' +
		'(i) <b>"Party" means either BlueCat or Customer and "Parties"</b> should be interpreted accordingly; ' +
		'<p>\n' +
		'(j) <b>"Product"</b> means any and all software, hardware and related services available from BlueCat ' +
		'for purchase or license by Customer identified in a Purchase Order and may include, without ' +
		'limitation: (a) all Software licensed by BlueCat to Customer pursuant to this Agreement, ' +
		'whether embedded on an Appliance, or made available for download or use; (b) all related ' +
		'Documentation; (c) Maintenance and Support; (d) Professional Services; (e) e-Learning; and ' +
		'(f) Threat Protection. ' +
		'<p>\n' +
		'(k) <b>"Professional Services"</b> means professional services (and where appropriate, e-Learning) ' +
		'provided by BlueCat to its customers in connection with the purchase and implementation of ' +
		'Products; ' +
		'<p>\n' +
		'(l) <b>"Purchase Order"</b> means an order schedule issued by BlueCat or Customer, a quote issued ' +
		'by BlueCat, a SOW issued by BlueCat, an invoice issued by BlueCat or any other document ' +
		'confirming the Products to be purchased or licensed by Customer, in each case, as accepted ' +
		'by BlueCat and consistent with the terms and conditions of this Agreement; ' +
		'<p>\n' +
		'Bacon ipsum dolor amet bacon corned beef filet mignon, prosciutto shoulder turkey salami. Ground round ' +
		'shoulder kevin porchetta spare ribs strip steak venison flank, hamburger doner jowl pancetta pork belly brisket. ' +
		'Turducken drumstick tenderloin, tri-tip beef ribs frankfurter short ribs venison ball tip pastrami pork chop ' +
		'salami. Shankle sausage tail, strip steak andouille short ribs beef.' +
		'<p>\n' +
		'Bacon sirloin flank picanha pork filet mignon. Fatback pork loin t-bone alcatra, swine venison kielbasa ' +
		'pastrami meatball ham hock flank turkey cupim salami shank. Cupim hamburger prosciutto landjaeger. Ribeye ' +
		'ball tip prosciutto venison, kevin shankle pork chop pastrami rump leberkas short loin tongue boudin tri-tip ' +
		'meatloaf. Capicola beef bresaola, chuck jerky corned beef doner meatball swine turkey leberkas bacon. ' +
		'Sausage frankfurter ribeye jowl swine drumstick shank capicola sirloin kevin prosciutto.' +
		'<p>\n' +
		'T-bone landjaeger rump tongue doner ribeye ham hock. Ribeye spare ribs bresaola tri-tip pork belly cow pork ' +
		'pastrami kevin venison capicola pig. Doner filet mignon leberkas, ribeye bresaola brisket biltong sausage ' +
		'chuck picanha shankle prosciutto flank beef. Beef ribs venison bresaola andouille frankfurter. Tenderloin ' +
		'beef turkey meatball t-bone short ribs. Pork tenderloin bresaola filet mignon.' +
		'<p>\n' +
		'Sirloin salami shankle pork chop bacon turducken ribeye fatback pork loin capicola beef ribs tongue ' +
		'hamburger. Turducken turkey tri-tip, swine meatball salami bresaola cow sirloin frankfurter. Prosciutto ' +
		'kevin t-bone short loin tongue ball tip. T-bone sausage tenderloin bresaola pastrami, pork belly tail shoulder ' +
		'ball tip tri-tip. Prosciutto chuck pork chop turkey turducken ball tip bacon spare ribs ham pancetta shankle ' +
		'pastrami cow chicken. Leberkas drumstick brisket biltong turducken beef ribs kielbasa sirloin picanha burgdoggen ' +
		'ball tip venison cupim tenderloin. Strip steak jerky cow bacon meatball.' +
		'<p>\n' +
		'</html>';

	console.log('GET ' + req.url);
	setTimeout(function () {
			res.status(200)
				.send(terms)
		},
		fakeLatency()
	);
});


module.exports = {
	router: router,
};
