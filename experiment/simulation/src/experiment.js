/** Event handling functions starts here */

/** Function for starting the experiment */
function startExperiment(scope) {
    if (!start_flag) {
        /** Denote experiment is started */
        start_flag = true;
        scope.start_exp = _("Stop");
        scope.titrate_disable = true;
        scope.dropdown_disable = true;
        /** Interval for setting turner on */
        turner_timer = setInterval(function() {
            turner_count++;
            if (turner_count == 5) {
                clearInterval(turner_timer);
            }
            turnerRotate(scope, turner_count)
        }, 50);
        getChild(saponification_estimation_stage, "drop1").y = 448;
        /** Calling function for moving the drop */
        dropDown();
        /** Calls calculate function with in an interval */
        startTitration(scope);
    } else {
        /** Clears the interval for calling calculateFn */
        clearInterval(start_counter);
        start_flag = false;
        clearFn();
        scope.start_exp = _("Start");
    }
}

/** Function for making turner off and on */
turner_rect.on("click", function() {
	/** Making turner on */
	if(!turner_start_flag) {
		turner_start_flag = true;
	}
	/** Making turner off */
	else {
		turner_start_flag = false;
	}
	startExperiment(scope_temp);
	scope_temp.$apply();
}); 

/** Function for resetting the experiment */
function resetFn(scope) {
	turner_rect.mouseEnabled = true;
    initialisationOfImages(scope);
	initialisationOfVariables(scope);
	scope.titration_soln = titration_solution_Array[0]; 
	scope.test_type = select_Type_Array[0];
	mask_flask_rect.y=536;
	mask_burette_rect.y=161.5;
	clearInterval(start_counter);
}

/** Function for setting fat/oil */
function setFatOilFn(scope) {
    /** Set end point for selected type from the endpoint_Array */
    end_point_val = endpoint_Array[scope.test_type];
}

/** Function for selecting titrate */
function selectTitrationFn(scope) {
    /** Range of saponification value for [coconut oil(11),sunflower oil(13),butter(12.5),rice bran oil(13.5),castor oil(13.5)]
	we can randomly select endpoints for corresponding test solutions based on the range of iodine value */
    end_point_val = endpoint_Array[0];
    /** While selecting test solution enable dropdown for selecting fat/oil otherwise make it disable */
    if (scope.titration_soln == 1) {
        scope.dropdown_disable = false;
        /** Select type of fat/oil from an array */
        selected_type_var = Type_Array[0];
    } else {
        scope.dropdown_disable = true;
    }
}

/** Function for changing the speed of the drop */
function changeDropSpeedFn(scope) {
    var _current_speed = scope.speed;
    delay_counter = dalay_max / _current_speed;
    drop_speed_var = scope.speed;
    if(start_flag == true){
		startTitration(scope);
	}
}

/** Event handling functions ends here */

/** Calclation function starts here */
function calculateFn(scope) {
	/** Calculate the solution level in each interval */
	burette_sol = solution_vol + burette_soln_incr;
	flask_sol = solution_vol + flask_soln_incr;
	/** Adjust drop's y position according to the movement of solution in the conical flask */
	drop_y = drop_y - flask_soln_incr;
	/** Calculate the value for titrant used */
	titrant_sol = parseFloat((titrant_sol + titrant_incr).toFixed(1));
	/** Display the value for titrant used */
	scope.titrant_used = titrant_sol;
	if (start_flag == true) {
		/** After starting experiment fill and unfill the flask solution and burette solution respectively */
		mask_flask_rect.y -= flask_sol;
		mask_burette_rect.y += burette_sol;
		/** When titrant used reaches 38 a pale yellow colour is observed due to the formation of iodine in the solution */
		if (titrant_sol >= end_point_val) {
			getChild(saponification_estimation_stage, "colorless_solution").alpha = 1;
			getChild(saponification_estimation_stage, "phenolphthalein_solution").alpha = 0;
			if (titrant_sol >= final_titration_point) {
				scope.start_disable = true;
				clearFn(scope);
			}
		}
		/** Based on the water level , adjusting the water's reflecting movement */
		for (var i = 1; i <= 5; i++) {
			getChild(saponification_estimation_stage, "reflect" + i).y -= flask_sol;
			if (getChild(saponification_estimation_stage, "reflect" + i).y <= 519) {
				getChild(saponification_estimation_stage, "reflect" + i).x += flask_sol / 2;
				getChild(saponification_estimation_stage, "reflect" + i).scaleX -= flask_sol / 60.3;
				if (getChild(saponification_estimation_stage, "reflect" + i).y <= 465) {
					clearInterval(start_counter);
				}
			}
		}
	} else {
		clearInterval(start_counter);
	}
	scope.$apply();
}
/** Calclation function ends here */

/** Function for ending the experiment */
function clearFn(scope) {
    /** Deactivate start and add starch button */
    start_flag = false;
    getChild(saponification_estimation_stage, "drop1").alpha = 0;
    getChild(saponification_estimation_stage, "drop2").alpha = 0;
    getChild(saponification_estimation_stage, "drop3").alpha = 0;
    /** Timer for closing the burette lid */
    turner_timer = setInterval(function() {
        turner_count--;
        if (turner_count == 1) {
            clearInterval(turner_timer);
        }
        turnerRotate(scope, turner_count)
    }, 50);
    /** Clear the interval*/
    clearInterval(start_counter);
}

/** Function for setting the downward movement of the solution drop */
function dropDown() {
    if (start_flag == true) {
		/** After starting the experiment adjust the number of drops according to the speed of titrant slider value*/
        getChild(saponification_estimation_stage, "drop1").alpha = 1;
        if (drop_speed_var >= 0.1 && drop_speed_var <= 0.4) {
            var drop_tween = createjs.Tween.get(getChild(saponification_estimation_stage, "drop1")).to({
                y: drop_y
            }, 600).call(dropUp);
        } else if (drop_speed_var >= 0.4 && drop_speed_var <= 0.7) {
            var drop_tween = createjs.Tween.get(getChild(saponification_estimation_stage, "drop1")).to({
                y: 475
            }, 500);
            var drop_tween1 = createjs.Tween.get(getChild(saponification_estimation_stage, "drop2")).to({
                y: drop_y
            }, 500).call(dropUp);
        } else if (drop_speed_var >= 0.7 && drop_speed_var <= 1) {
            var drop_tween = createjs.Tween.get(getChild(saponification_estimation_stage, "drop1")).to({
                y: 475
            }, 500);
            var drop_tween1 = createjs.Tween.get(getChild(saponification_estimation_stage, "drop2")).to({
                y: 500
            }, 500);
            var drop_tween2 = createjs.Tween.get(getChild(saponification_estimation_stage, "drop3")).to({
                y: drop_y
            }, 500).call(dropUp);
        }
    } else {
        getChild(saponification_estimation_stage, "drop1").alpha = 0;
        getChild(saponification_estimation_stage, "drop2").alpha = 0;
        getChild(saponification_estimation_stage, "drop3").alpha = 0;
    }
}

/** Function for setting the upward movement of the solution drop */
function dropUp() {
    if (start_flag == true) {
		/** After completing tween set the initial point for each of the drop*/
        if (drop_speed_var >= 0.1 && drop_speed_var <= 0.4) {
            getChild(saponification_estimation_stage, "drop1").y = 446;
            getChild(saponification_estimation_stage, "drop2").alpha = 0;
			getChild(saponification_estimation_stage, "drop3").alpha = 0;
        } else if (drop_speed_var >= 0.4 && drop_speed_var <= 0.7) {
            getChild(saponification_estimation_stage, "drop1").y = 446;
            getChild(saponification_estimation_stage, "drop2").y = 475;
            getChild(saponification_estimation_stage, "drop2").alpha = 1;
			getChild(saponification_estimation_stage, "drop3").alpha = 0;
        } else if (drop_speed_var >= 0.7 && drop_speed_var <= 1) {
            getChild(saponification_estimation_stage, "drop1").y = 446;
            getChild(saponification_estimation_stage, "drop2").y = 475;
            getChild(saponification_estimation_stage, "drop3").y = 500;
            getChild(saponification_estimation_stage, "drop2").alpha = 1;
            if (drop_y >= 535) {
                getChild(saponification_estimation_stage, "drop3").alpha = 1;
            }
        }
    }
    dropDown();
}

/** Function for turning turner on and off */
function turnerRotate(scope, inr) {
    for (var i = 1; i <= 5; i++) {
        getChild(saponification_estimation_stage, "turner" + i).alpha = 0;
    }
    getChild(saponification_estimation_stage, "turner" + inr).alpha = 1;
}

/** Function for beginning the titration */
function startTitration(scope) {
    clearInterval(start_counter);
    start_counter = setInterval(function() {
        calculateFn(scope)
    }, delay_counter);
}

/** Function for adding child to the stage and return the result */
function getChild(stage,name) {
    return stage.getChildByName(name);
}
