'use strict';

tatool
  .factory('attentionSpeed', [ 'executableUtils', 'dbUtils', 'timerUtils', 'stimulusServiceFactory', 'inputServiceFactory',
    function (executableUtils, dbUtils, timerUtils, stimulusServiceFactory, inputServiceFactory) {

    // Create new instance of executable task
    var attentionSpeed = executableUtils.createExecutable();

    // Create defult timing settings in ms
    var FIXATION_DURATION_DEFAULT = 500; 
    var ENCODING_DURATION_DEFAULT = 50; 
    var INTERSTIMULUS_DURATION_DEFAULT = 50;
    var BLANK_DURATION_DEFAULT = 200;

    // Initalise task
    attentionSpeed.prototype.init = function() {
      var deferred = executableUtils.createPromise();

      if (!this.showKeys) {
        this.showKeys = { propertyValue: true };
      } else {
        this.showKeys.propertyValue = (this.showKeys.propertyValue === true) ? true : false;
      }

      if (!this.stimuliPath) {
        deferred.reject('Invalid property settings for Executable attentionSpeed. Expected property <b>stimuliPath</b> of type Path.');
      }

      // Set up stimulus and input services 
      this.stimulusService = stimulusServiceFactory.createService(this.stimuliPath);
      this.inputService = inputServiceFactory.createService(this.stimuliPath);

      // Set up timing properties/defaults
      this.fixationDuration = (this.fixationDuration ) ? this.fixationDuration : FIXATION_DURATION_DEFAULT;
      this.encodingDuration = (this.encodingDuration ) ? this.encodingDuration : ENCODING_DURATION_DEFAULT;
      this.interStimulusDuration = (this.interStimulusDuration ) ? this.interStimulusDuration : INTERSTIMULUS_DURATION_DEFAULT;
      this.blankDuration = (this.blankDuration ) ? this.blankDuration : BLANK_DURATION_DEFAULT;

      console.log("fixationDuration: "+this.fixationDuration);
      console.log("encodingDuration: "+this.encodingDuration);
      console.log("interStimulusDuration: "+this.interStimulusDuration);
      console.log("blankDuration: "+this.blankDuration);

      // Initlaise timers for task phases
      this.timerFixation = timerUtils.createTimer(this.fixationDuration, false, this);
      this.timerEncoding = timerUtils.createTimer(this.encodingDuration, false, this);
      this.timerInterStimulus = timerUtils.createTimer(this.interStimulusDuration, false, this);
      this.timerBlank = timerUtils.createTimer(this.blankDuration, false, this);

      this.counter = 0; // Trial counter
      this.phase = 1; // Task phase counter

      // Load stimuli list from csv
      if (this.stimuliFile) {
        var self = this;
        executableUtils.getCSVResource(this.stimuliFile, true, this.stimuliPath).then(function(list) {
            self.stimuliList = list;
            self.totalStimuli = list.length;
            deferred.resolve();
          }, function(error) {
            deferred.reject('Resource not found: ' + self.stimuliFile.resourceName);
          });
      } else {
        deferred.reject('Invalid property settings for Executable attentionSpeed. Expected property <b>stimuliFile</b> of type Resource.');
      }

      return deferred;
    };

    // Prepares next stimuli for presentation
    attentionSpeed.prototype.createStimulus = function() {
      this.startTime = 0; // Start time for RT
      this.endTime = 0; // End time for RT

      // Reset counter if all stimuli have been presented
      if (this.counter >= this.totalStimuli) {
        this.counter = 0;
      }

      // Initalise trial data
      this.trial = {};
      this.trial.givenResponse = null;
      this.trial.reactionTime = 0;
      this.trial.score = null;

      // Select next stimulus to display
      this.stimulus = executableUtils.getNext(this.stimuliList, this.counter);
      if (this.stimulus === null) {
        executableUtils.fail('Error creating stimulus in Executable attentionSpeed. No more stimuli available in current stimuliList.');
      } else {
        // Configure input keys
        this.setupInputKeys(this.stimulus);
        this.phase = this.stimulus.phase;
        this.trial.stimulusValue = this.stimulus.stimulusValue;
        this.trial.correctResponse = this.stimulus.correctResponse;
        this.trial.stimulusType = this.stimulus.stimulusType;
        this.stimulusService.set(this.stimulus);
        this.trial.distractorItem = this.stimulus.distractorItem;
      }

      this.counter++; // Move to next stimulus
    };

    // Configure input keys for current stimuli
    attentionSpeed.prototype.setupInputKeys = function(stimulus) {
      this.inputService.removeAllInputKeys();
      stimulus.keyCount = (stimulus.keyCount) ? stimulus.keyCount : 9;
      for (var i = 1; i <= stimulus.keyCount; i++) {
        this.inputService.addInputKey(
          stimulus['keyCode' + i], // KeyCode
          stimulus['response' + i], // Expected Response
          stimulus['keyLabel' + i], // KeyLabel
          stimulus['keyLabelType' + i], // Label type
          !this.showKeys.propertyValue); // Hide key label?
      }
    };
          
    // Get current task phase
    attentionSpeed.prototype.getPhase = function() {
      return this.phase;
    };

    // Set current task phase
    attentionSpeed.prototype.setPhase = function(phase) {
      this.phase = phase;
    };

    // Process user's response, RTs and scores
    attentionSpeed.prototype.processResponse = function(givenResponse) {
      console.log("processResponse "+ givenResponse + " correct: "+ this.trial.correctResponse);
      this.trial.reactionTime = this.endTime - this.startTime;
      this.trial.givenResponse = givenResponse;
      
      // 1 = Correct, 0 = Incorrect
      if (this.trial.correctResponse == this.trial.givenResponse) {
        this.trial.score = 1;
      } else {
        this.trial.score = 0;
      }

      return dbUtils.saveTrial(this.trial);
    };

    // Stop executable and end the task
    attentionSpeed.prototype.endTask = function() {
      executableUtils.stop();
    };

    return attentionSpeed;

  }]);