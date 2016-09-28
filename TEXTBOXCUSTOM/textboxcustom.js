// Recommended AMD module pattern for a Knockout component that:
//  - Can be referenced with just a single 'require' declaration
//  - Can be included in a bundle using the r.js optimizer
define(['text!textboxcustom.html'], function( htmlString) {

	/**
	 * COMPONENT MODEL CONSTRUCTOR
	 */
	function textboxcustom( params) { 
		
		this.internalName = (params) ? params.InternalName : '';
		
		/**
		 * TITLE
		 * observable bound to component's html UI template to show Sharepoint column's 'Title'
		 * Title value passed via params of component's html notation on calling form's (viewmodel) html template
		 * Title parameter additionally declared at component's metadata (schema), enabling dynamic param's value update on 
		 * form's (viewmodel) html temlate from Sharepoint source on design mode.
		 */
		this.title = ko.observable((params) ? params.Title : '');
		/**
		 * DESCRIPTION	
		 * observable bound to UI html template to show sharepoint column's 'Description' 
		 * Description value passed via params of component's html notation on calling form's (viewmodel) html template
		 * Description parameter additionally declared at component's metadata (schema), enabling dynamic param's value update on 
		 * form's (viewmodel) html temlate from Sharepoint source on design mode.
		 */
		this.description = ko.observable((params) ? params.Description : '');
		this.label = ko.observable((params) ? params.label : '');
		this.infotip = ko.observable((params) ? params.infotip : '');
		this.datatype = ko.observable((params) ? params.datatype : '');
		this._placeholder = ko.observable((params) ? params.placeholder : '');
		this.optionaltext = ko.observable(false);
		this.maxlength = ko.observable((params) ? params.maxlength : 255);
		this.width = ko.observable((params) ? params.width : "300px")
		if(params.required == undefined)
			this._inputRequired = ko.observable(false);
		else 
			this._inputRequired = params.required;	
		
		if(this._inputRequired == "false" || this._inputRequired == false)
		{this.optionaltext(true);}			

		/**
		 * VALUE	
		 * observable bound to UI html template to show sharepoint column's 'Value' 
		 */
		this.value = this.$column(this.internalName);
		// -- ENABLE VALUE EDIT MODE
		// observable bound to UI html template to enable sharepoint column's 'Value'editing
		this.enableValue = ko.pureComputed( function() { return this.$enabled(); }, this);
		
	};
	/**
	 * COMPONENT MODEL HELPER METHODS
	 */
	(function(){
		this.$enabled = function() {
			return (this.$readonly()) ? false : true;
		};		
	}).call(textboxcustom.prototype);
	/**
	 * OPTIONAL COMPONENT METADATA DECLARATIONS ENABLING VISUAL DESIGN MODE SUPPORT
	 */
	textboxcustom.prototype.schema = {
		"Params": {
			"InternalName": "",
			"Title": "",
			"Description": "",
			"width": "600px",
			"maxlength": 255,
			"required": true,
			"label":"",
			"infotip":"",  //Used for information icon text.
			"datatype":"", // For value:number for numeric.
			"placeholder":"" //Used for masking textbox display. Example mm/dd/yyyy or $
			
		},
		"Connections" : {
			"ListItem" : ['Text']
		}
	};
	 
    // Return component definition
    return { viewModel: textboxcustom, template: htmlString };
});

