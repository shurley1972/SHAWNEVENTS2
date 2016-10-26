// Recommended AMD module pattern for a Knockout component that:
//  - Can be referenced with just a single 'require' declaration
//  - Can be included in a bundle using the r.js optimizer

define(['text!reviewcustom.html'], function( htmlString) {

	/**
	 * COMPONENT MODEL CONSTRUCTOR
	 */
	function reviewcustom( params) { 
		//this.internalName = (params) ? params.InternalName : '';
		//this.reviewerOutcome = (params) ? params.ReviewerOutcome : '';	

		this.ID = (params) ? params.ID : '';
		this.NextID = (params) ? params.NextID : '';
		this.StepName = (params) ? params.StepName : '';	
		this.ApproverType = (params) ? params.ApproverType : '';
		this.FirstStep = (params) ? params.FirstStep : '';		
		/**
		 * TITLE
		 * observable bound to component's html UI template to show Sharepoint column's 'Title'
		 * Title value passed via params of component's html notation on calling form's (viewmodel) html template
		 * Title parameter additionally declared at component's metadata (schema), enabling dynamic param's value update on 
		 * form's (viewmodel) html temlate from Sharepo
		 int source on design mode.
		 */
		//this.title = ko.observable((params) ? params.Title : '');
		/**
		 * DESCRIPTION	
		 * observable bound to UI html template to show sharepoint column's 'Description' 
		 * Description value passed via params of component's html notation on calling form's (viewmodel) html template
		 * Description parameter additionally declared at component's metadata (schema), enabling dynamic param's value update on 
		 * form's (viewmodel) html temlate from Sharepoint source on design mode.
		 */
		//this.labelName = ko.observable((params) ? params.LabelName : '');		
		/**
		 * VALUE	
		 * observable bound to UI html template to show sharepoint column's 'Value' 
		 */
		// Sets reviewer comments field
		//this.value = this.$column(this.internalName);
		this.commentsValue = ko.observable("");
		//debugger;
		// Display form if user has design permissions.  Need check from Nikolay for permissions.
		this._formEnabled = ko.computed(function(){return true})	
		//var approvalOutcome = ""
		
		// Sets reviewer outcome Approve/Reject field
		//this.ReviewerOutcome = this.$column(this.reviewerOutcome);
		//this.ReviewerOutcome = ko.observable();		
		
		// Sets reviewer outcome Approve/Reject field
		this.WorkflowSteps = this.$column("mwp_ApprovalWorkflow");	

		//this.SetOneDayEventDefault = ko.computed(function(){if(this.WorkflowSteps != undefined){alert(this.WorkflowSteps())}}, this);	
		//this.WorkflowSteps("a")		
		if(this.WorkflowSteps()== ""){alert('dddddddddd');}
		//alert(this.WorkflowSteps());
		this.WorkflowSteps.subscribe(function(newValue) {     
			var workflowStep = $.parseJSON(newValue)
			if (workflowStep == undefined) workflowStep = []
			for (var i=0; i<workflowStep.length; i++)
			{
				if (workflowStep[i].ID == this.ID)
				{
					//alert('Step has already been added.  Do Nothing');
					return;
					//workflowStep[i].ReviewerOutcome = "Approved";
					//workflowStep[i].ReviewerComments = this.commentsValue();
				}
			}
			var newWorkflowStep = {}
			newWorkflowStep.ID = this.ID
			newWorkflowStep.NextID = this.NextID
			newWorkflowStep.StepName = this.StepName	
			newWorkflowStep.ApproverType = this.ApproverType	
			newWorkflowStep.FirstStep = this.FirstStep	
			newWorkflowStep.Current = false
			newWorkflowStep.Processed = false	
			newWorkflowStep.ReviewerOutcome = ""
			newWorkflowStep.ReviewerComments = ""		
			debugger;
			workflowStep.push(newWorkflowStep)
			
			var workflowStepStr = JSON.stringify(workflowStep)
			alert(workflowStepStr);
			this.WorkflowSteps(workflowStepStr);
						alert('SAVED!!2')
			//this.$form._formSave();


					

		},this);

		
		// Hides Approve/Reject if ReviewerOutcome has a value.  Workflow will reset the field.
		this._formReadOnly = ko.observable(true)
		this.stepName = ko.observable((params) ? params.StepName : '');
		
		// Sets reviewer comments field to read-only if ReviewerOutcome has a value.  
		//this.enableValue = ko.computed(function(){if(this.ReviewerOutcome() == "" || this.ReviewerOutcome() == undefined){return true}else{return true}}, this); 		
	
		// -- ENABLE VALUE EDIT MODE
		// observable bound to UI html template to enable sharepoint column's 'Value'editing
		//this.enableValue = ko.pureComputed( function() { return this.$enabled(); }, this);		
	};
	/**
	 * COMPONENT MODEL HELPER METHODS
	 */
	(function(){
		this.$enabled = function() {
			return (this.$readonly()) ? false : true;
		};		
	}).call(reviewcustom.prototype);
	/**
	 * OPTIONAL COMPONENT METADATA DECLARATIONS ENABLING VISUAL DESIGN MODE SUPPORT
ID:					{Unique ID of approval}  Used with NextID for processing.
NextID:  			Next step in approval process to run.  
StepName: 			Used for Status field and section heading
ApproverType: 		Value: (User, Manager, Group)
ApproverAccountID: 	Needed when User or Group
FirstStep: 			Which approval step to execute first.  Only 1 approval step should be set to true.
Current: 			*Populated by Workflow.  Boolean used to track approval step to execute.
Processed: 			*Populated by Workflow. Boolean used to track approval steps processed.
ReviewerOutcome: 	*Internal populated by system. Values: Approved, Rejected
ReviewerComments:	*Internal populated by system. Reviewer comments.	 
	 */
	reviewcustom.prototype.schema = {
		"Params": {			
			"ID": "ManagerApproval",
			"NextID": "",
			"StepName": "Manager Approval Needed",
			"ApproverType": "User",
			"ApproverAccountID": "sphurley",
			"FirstStep": "true"			
		}
	};
	
		self._formLoadClick = function() {

			this.$form._formSave();
			alert('DDDOONNEE')
		};		
		self._formButtonApproveClick = function() {
			var workflowStep = $.parseJSON(this.WorkflowSteps())
			for (var i=0; i<workflowStep.length; i++)
			{
				if (workflowStep[i].ID == this.ID)
				{
					workflowStep[i].ReviewerOutcome = "Approved";
					workflowStep[i].ReviewerComments = this.commentsValue();
				}
			}
			var workflowStepStr = JSON.stringify(workflowStep)
			this._formReadOnly(false);
			this.WorkflowSteps(workflowStepStr);
			this.$form._formSave();
		};		
		self._formButtonRejectClick = function() {
			if (this.commentsValue() == "")
			{
				$("#comments-Req-Msg").show();
			}
			else
			{
				$("#comments-Req-Msg").hide();
				this._formReadOnly(false);				
				var workflowStep = $.parseJSON(this.WorkflowSteps())
				for (var i=0; i<workflowStep.length; i++)
				{
					if (workflowStep[i].ID == this.ID)
					{
						workflowStep[i].ReviewerOutcome = "Rejected";
						workflowStep[i].ReviewerComments = this.commentsValue();
					}
			}
			var workflowStepStr = JSON.stringify(workflowStep)
			this._formReadOnly(false);
			this.WorkflowSteps(workflowStepStr);
			this.$form._formSave();
			}
		};	
		self._formButtonCloseClick = function() {
			this.$form._formRedirectToList();			
		};	
    // Return component definition
    return { viewModel: reviewcustom, template: htmlString };
});
//


