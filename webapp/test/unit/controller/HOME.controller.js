/*global QUnit*/

sap.ui.define([
	"fiori2/controller/HOME.controller"
], function (Controller) {
	"use strict";

	QUnit.module("HOME Controller");

	QUnit.test("I should test the HOME controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
