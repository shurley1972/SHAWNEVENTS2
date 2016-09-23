// Recommended AMD module pattern for a Knockout component that:
//  - Can be referenced with just a single 'require' declaration
//  - Can be included in a bundle using the r.js optimizer
define([ 'text!viewmodel.html'], function( htmlString) {
	/**
	 * CONSTRUCTOR
	 */
	function viewModel(params) {
		/** 
		 * CODE BELOW FOR LEARNING PURPOSE AND SHOULD BE REMOVE FOR PRODUCTION TIME
		 */
		// 1. auto-injected observables controlled by form runtime 
	    console.log('Form is ReadOnly = ' + this.$formReadOnly());			// auto-injected: viewModel.prototype.$formReadOnly = ko.pureComputed(...);
	    console.log('Form is in Design Mode = ' + this.$formDesignMode());	// auto-injected: viewModel.prototype.$formDesignMode = ko.pureComputed(...);
		// 2. auto-injected observables linked to SharePoint item columns and controlled via components placed on your form 
		try {
	    console.log('SharePoint column "Title", value = ' + this.Title());	// auto-injected: viewModel.prototype.Title = ko.observable();		
		// ... check your model for more SharePoint-linked observables named as column's Internal Name, if there are more components placed on form. 
		}
		catch(e) {};
		
		/**
		 * EDIT MODEL BELOW TO DESIGN YOUR CUSTOM SPA FORM
		 */
		this.attachmentRequired = ko.observable(false);
				
	}
    // Use prototype to declare any public methods
    //viewModel.prototype.doSomething = function() { ... };
	//viewModel.prototype.MyButtonClick = function () {
	//	var model = this;
	//	debugger;
	//};

 
    // Return model definition
	return { viewModel: viewModel, template: htmlString };
});
