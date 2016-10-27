// Recommended AMD module pattern for a Knockout component that:
//  - Can be referenced with just a single 'require' declaration
//  - Can be included in a bundle using the r.js optimizer

define(['text!reviewcustom.html'], function( htmlString) {

	/**
	 * COMPONENT MODEL CONSTRUCTOR
	 */
	function reviewcustom( params) { 
	
		// Get parameters used in Approval workflow.
		this.ID = (params) ? params.ID : '';
		this.NextID = (params) ? params.NextID : '';
		this.StepName = (params) ? params.StepName : '';	
		this.ApproverType = (params) ? params.ApproverType : '';
		this.ApproverAccountID = (params) ? params.ApproverAccountID : '';		
		this.FirstStep = (params) ? params.FirstStep : '';		

		//Form comments textbox for reviewer input.
		this.commentsValue = ko.observable("");
		// Display form if user has design permissions.  Need check from Nikolay for permissions.
		this._formEnabled = ko.computed(function(){return true})			
		// Internal column name for workflow processing.
		this.WorkflowSteps = this.$column("mwp_ApprovalWorkflow");	

		//Sets WorkflowSteps initial parameters needed for workflow processing.  
		if (this.WorkflowSteps() == "")
		{
			var workflowStep = []
			var newWorkflowStep = {}
			newWorkflowStep.ID = this.ID
			newWorkflowStep.NextID = this.NextID
			newWorkflowStep.StepName = this.StepName	
			newWorkflowStep.ApproverType = this.ApproverType
			newWorkflowStep.ApproverAccountID = this.ApproverAccountID				
			newWorkflowStep.FirstStep = this.FirstStep	
			newWorkflowStep.Current = false
			newWorkflowStep.Processed = false	
			newWorkflowStep.ReviewerOutcome = ""
			newWorkflowStep.ReviewerComments = ""		
			workflowStep.push(newWorkflowStep)
			
			var workflowStepStr = JSON.stringify(workflowStep)
			//alert(workflowStepStr);
			this.WorkflowSteps(workflowStepStr);

		}

		//Sets WorkflowSteps initial parameters needed for workflow processing.
		this.WorkflowSteps.subscribe(function(newValue) {  
			var workflowStep = $.parseJSON(newValue)
			if (workflowStep == undefined) workflowStep = []
			for (var i=0; i<workflowStep.length; i++)
			{
				if (workflowStep[i].ID == this.ID)
				{
					//alert('Step has already been added.  Do Nothing');
					return;
				}
			}
			var newWorkflowStep = {}
			newWorkflowStep.ID = this.ID
			newWorkflowStep.NextID = this.NextID
			newWorkflowStep.StepName = this.StepName	
			newWorkflowStep.ApproverType = this.ApproverType
			newWorkflowStep.ApproverAccountID = this.ApproverAccountID				
			newWorkflowStep.FirstStep = this.FirstStep			
			newWorkflowStep.Current = false
			newWorkflowStep.Processed = false	
			newWorkflowStep.ReviewerOutcome = ""
			newWorkflowStep.ReviewerComments = ""		
			workflowStep.push(newWorkflowStep)
			var workflowStepStr = JSON.stringify(workflowStep)
			this.WorkflowSteps(workflowStepStr);
		},this);

		// Hides Approve/Reject if ReviewerOutcome has a value.  Workflow will reset the field.
		this._formReadOnly = ko.observable(true)
		//Used for Status field and section heading
		this.stepName = ko.observable((params) ? params.StepName : '');
	
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


