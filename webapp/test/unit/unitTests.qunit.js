/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"SYNC/zcdmm_im4000/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
