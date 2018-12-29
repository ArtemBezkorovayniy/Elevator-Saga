{
    init: function(elevators, floors) {
        var floorsNum = floors.length;
        var floorButton = [];
        var floorArriving = [];
        floorArriving.length = floorsNum;
        floorArriving.fill(0);

        elevators.forEach(function(elevator){
            elevator.on("idle", function() {
                floorArriving[0] = 0;
                for (var i = 0; i < floorsNum; i++){    //storing pressed button in array
                    floorButton[i] = [];
                    if (floors[i].buttonStates.up){
                        floorButton[i][0] = 1;    // floorButton[3][1] means 3-floor up button active
                    }
                    if (floors[i].buttonStates.down){
                        floorButton[i][1] = 1;     // floorButton[3][1] means 3-floor down button active
                    }
                }
                floorArriving[elevator.currentFloor()] = 0;
                if (elevator.goingUpIndicator()) {   // up
                    elevator.goingDownIndicator(false);
                    if (elevator.loadFactor() < 0.65){    //have empty space
                        for (var i = elevator.currentFloor(); i < floorsNum; i++){
                            if ( ( floorButton[i][0] == 1 && floorArriving[i] !== 1 ) || elevator.getPressedFloors().includes(i)){
                                floorArriving[elevator.currentFloor()] = 0;
                                floorArriving[i] = 1;
                                floorButton[i][0] = 0;
                                if (i == floorsNum-1){
                                    elevator.goingUpIndicator(false);    //change direction to down
                                    elevator.goingDownIndicator(true);
                                }
                                elevator.goToFloor(i);
                                return;
                            }
                            if (i == floorsNum-1){    //if no up needed
                                for (var j = floorsNum-1; j >= 0; j--){   
                                    if ( ( floorButton[j][1] == 1 && floorArriving[j] !== 1 ) || elevator.getPressedFloors().includes(j)){ 
                                        floorArriving[elevator.currentFloor()] = 0;  
                                        floorArriving[j] = 1;
                                        elevator.goingUpIndicator(false);    //change direction to down
                                        elevator.goingDownIndicator(true);
                                        floorButton[j][1] = 0;
                                        if (j == 0){
                                            elevator.goingUpIndicator(true);    //change direction to up
                                            elevator.goingDownIndicator(false);
                                        }
                                        elevator.goToFloor(j);
                                        return;
                                    }
                                    if (j == 0){    //direction up from 0-floor
                                        for (var n = 0; n <= elevator.currentFloor(); n++){
                                            if (floorButton[n][0] == 1 && floorArriving[n] !== 1){
                                                floorArriving[elevator.currentFloor()] = 0;
                                                floorArriving[n] = 1;
                                                floorButton[n][0] = 0;
                                                if (n == floorsNum-1){
                                                    elevator.goingUpIndicator(false);    //change direction to down
                                                    elevator.goingDownIndicator(true);
                                                }
                                                elevator.goToFloor(n);
                                                return;
                                            }
                                            if (n == elevator.currentFloor()){    //if no movement reinvoke func
                                                elevator.goToFloor(elevator.currentFloor());
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }else{    //full of people
                        for (var i = elevator.currentFloor(); i < floorsNum; i++){
                            if (elevator.getPressedFloors().includes(i)){
                                floorButton[i][0] = 0;
                                if (i == floorsNum-1){
                                    elevator.goingUpIndicator(false);    //change direction to down
                                    elevator.goingDownIndicator(true);
                                }
                                floorArriving[i] = 1;
                                elevator.goToFloor(i);
                                return;
                            }
                            if (i == floorsNum-1){    //if no up needed
                                for (var j = floorsNum-1; j >= 0; j--){
                                    if (elevator.getPressedFloors().includes(j)){    //change direction to down
                                        elevator.goingUpIndicator(false);
                                        elevator.goingDownIndicator(true);
                                        floorButton[j][1] = 0;
                                        if (j == 0){
                                            elevator.goingUpIndicator(true);    //change direction to up
                                            elevator.goingDownIndicator(false);
                                        }
                                        floorArriving[j] = 1;
                                        elevator.goToFloor(j);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }else{ // down
                    if (elevator.loadFactor() < 0.65){    //have empty space
                        for (var i = elevator.currentFloor(); i >= 0; i--){
                            if ( ( floorButton[i][1] == 1 && floorArriving[i] !== 1 ) || elevator.getPressedFloors().includes(i)){
                                floorArriving[elevator.currentFloor()] = 0;
                                floorArriving[i] = 1;
                                floorButton[i][1] = 0;
                                if (i == 0){
                                    elevator.goingUpIndicator(true);    //change direction to up
                                    elevator.goingDownIndicator(false);
                                }
                                elevator.goToFloor(i);
                                return;
                            }
                            if (i == 0){    //if no down needed
                                for (var j = 0; j < floorsNum; j++){
                                    if ( ( floorButton[j][0] == 1 && floorArriving[j] !== 1 ) || elevator.getPressedFloors().includes(j)){  
                                        floorArriving[elevator.currentFloor()] = 0;
                                        floorArriving[j] = 1;
                                        elevator.goingUpIndicator(true);    //change direction to up
                                        elevator.goingDownIndicator(false);
                                        floorButton[j][0] = 0;
                                        if (j == floorsNum-1){
                                            elevator.goingUpIndicator(false);    //change direction to down
                                            elevator.goingDownIndicator(true);
                                        }
                                        elevator.goToFloor(j);
                                        return;
                                    }
                                    if (j == floorsNum-1){    //direction down from last-floor
                                        for (var n = floorsNum-1; n >= elevator.currentFloor(); n--){
                                            if (floorButton[n][1] == 1 && floorArriving[n] !== 1){
                                                floorArriving[elevator.currentFloor()] = 0;
                                                floorArriving[n] = 1;
                                                floorButton[n][1] = 0;
                                                if (n == 0){
                                                    elevator.goingUpIndicator(true);    //change direction to up
                                                    elevator.goingDownIndicator(false);
                                                }
                                                elevator.goToFloor(n);
                                                return;
                                            }
                                            if (n == elevator.currentFloor()){    //if no movement reinvoke func
                                                elevator.goToFloor(elevator.currentFloor());
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }else{    //full of people
                        for (var i = elevator.currentFloor(); i >= 0; i--){
                            if (elevator.getPressedFloors().includes(i)){
                                floorButton[i][1] = 0;
                                floorArriving[i] = 1;
                                if (i == 0){
                                    elevator.goingUpIndicator(true);    //change direction to up
                                    elevator.goingDownIndicator(false);
                                }
                                elevator.goToFloor(i);
                                return;
                            }
                            if (i == 0){    //if no down needed
                                for (var j = 0; j < floorsNum; j++){
                                    if (elevator.getPressedFloors().includes(j)){    //change direction to up
                                        elevator.goingUpIndicator(true);
                                        elevator.goingDownIndicator(false);
                                        floorButton[j][0] = 0;
                                        floorArriving[j] = 1;
                                        if (j == floorsNum-1){
                                            elevator.goingUpIndicator(false);    //change direction to down
                                            elevator.goingDownIndicator(true);
                                        }
                                        elevator.goToFloor(j);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            })
        })
    },
        update: function(dt, elevators, floors) {
        }
}