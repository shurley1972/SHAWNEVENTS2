define([ 'text!master.css','text!./viewmodel.html'], function( css,htmlString) {
//define([], function() {
	function viewModel(params) {
		if( params.get) params.get( this, params.columns);
		// this._formReadOnly() - computed observable
		// +++ EDIT MODEL BELOW TO DESIGN YOUR CUSTOM SPA FORM
		var self = this;
		self.attachmentRequired = ko.observable(false);
		//self.Title = ko.observable(); // commented out because of params.get
		//Dependent Choices
		// Bug in code.  Have to set for variables
		self.mwp_OneDayEvent = ko.observable();		
		self.mwp_EventStartDate = ko.observable();		
		self.mwp_EventEndDate = ko.observable();				
		
		
		self.mwp_OneDayEventShow = ko.computed(function(){if(self.mwp_OneDayEvent() == "Yes"){return "none"}else{return "table-Cell"}}, self); 		
		self.SetOneDayEventDefault = ko.computed(function(){if(self.mwp_OneDayEvent() == ""){self.mwp_OneDayEvent('Yes')}}, self);
		self.SetEventEndDate = ko.computed(function(){if(self.mwp_OneDayEvent() == "Yes"){self.mwp_EventEndDate(self.mwp_EventStartDate());}else if(self.mwp_EventStartDate()==self.mwp_EventEndDate()){self.mwp_EventEndDate("");}});
		self.SetEventStartDateFormat = ko.computed(function(){if(self.mwp_EventStartDate() != undefined && self.mwp_EventStartDate().indexOf("T") > -1){var dt=self.mwp_EventStartDate().substring(0,10);dt=dt.substring(5,7)+"/"+dt.substring(8,10)+"/"+dt.substring(0,4) ;self.mwp_EventStartDate(dt);}})
		self.SetEventEndDateFormat = ko.computed(function(){if(self.mwp_EventEndDate() != undefined && self.mwp_EventEndDate().indexOf("T") > -1){var dt=self.mwp_EventEndDate().substring(0,10);dt=dt.substring(5,7)+"/"+dt.substring(8,10)+"/"+dt.substring(0,4) ;self.mwp_EventEndDate(dt);}})
		//Dynamic Required Fields   
		self.mwp_EventStartDateText = ko.computed(function(){if(self.mwp_OneDayEvent() == "Yes"){return "Event Date"}else{return "Event Start Date"}}, self); 

		
		self.nullbug = ko.computed(function(){
		if(self.mwp_CustomerNumber()== null){self.mwp_CustomerNumber('');}	
		})		
		
		requirejs(["jqueryui"], function() 
			{ 		
				$('#ui-datepicker-div').remove();
				$("#event-Start,#event-End").removeClass("hasDatepicker");
				$(function() {$(".datepicker").datepicker();}); 
				$('#s4-workspace').scroll(function(){$(".datepicker").datepicker('hide');$('#event-Start').blur();$('#event-End').blur()});			
				$('#event-Start').datepicker( 'option' , 'onClose', function() {$('#event-Start').change(self.mwp_EventStartDate($('#event-Start').val()))} );
				$('#event-Start').datepicker( 'option' , 'onClose', function() {} );

				$('#event-End').datepicker( 'option' , 'onClose', function() {$('#event-End').change(self.mwp_EventEndDate($('#event-End').val()))} );			
				$('#event-End').datepicker( 'option' , 'onClose', function() {} );				
			});		
	
	}
    // Use prototype to declare any public methods
    //viewModel.prototype.doSomething = function() { ... };
	//viewModel.prototype.MyButtonClick = function () {
	//	var model = this;
	//	debugger;
	//};

 
    // Return model definition
    //return viewModel;
	return { viewModel: viewModel, template: css + htmlString };
});
