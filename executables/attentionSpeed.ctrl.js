'use strict';

tatool
  .controller('attentionSpeedCtrl', [ '$scope', 'service',
    function ($scope, service) {

    $scope.stimulusService = service.stimulusService;
    $scope.encodingService = service.encodingService;
    $scope.inputService = service.inputService;

    // start execution
    $scope.start = function() {
      startStimulus();
    };

    function startStimulus() {
      service.createStimulus();
      showStimulus();
    }

    function showStimulus() {
      if (service.getPhase() == 0) {      
        service.stimulusService.show();
        service.timerFixation.start(showInterstimulus);
      } 
      else if (service.getPhase() == 1) {
        service.stimulusService.show();
        service.timerEncoding.start(showInterstimulus);
      } 
      else if (service.getPhase() == 2) {
        service.timerBlank.start(showBlank);
      } 
      else if (service.getPhase() == 3) {
        service.stimulusService.show();
        service.startTime = service.inputService.enable();        
        if (service.showKeys.propertyValue === true) {
          service.inputService.show();
        }
      } 
    }

    function showInterstimulus() {
      service.stimulusService.hide();
      service.timerInterStimulus.start(startStimulus);
    }

    function showBlank() {
      service.timerBlank.start(startStimulus);
    }
    
    $scope.inputAction = function(input, timing, event) {
      service.inputService.disable(); 
      service.inputService.hide();
      service.stimulusService.hide();
      service.endTime = timing;
      service.processResponse(input.givenResponse);
      service.timerBlank.start(service.endTask());
    };

  }]);