// ==UserScript==
// @name         Mathletics Hax
// @namespace    https://github.com/YabaiNyan/MathleticsHax
// @version      0.2
// @description  Hack Mathletics!
// @author       YabaiNyan
// @match        http://live.mathletics.com/
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    var ochcount = 0;
    var ws = new WebSocket("ws://localhost:8080");
    var NaNCounter = 0;
    var debug = true;
    var gambleM = false;
    var operator;
    var HaxOn;

    function startHax(intervaltime){
        var randlow = intervaltime[0]
        var randhigh = intervaltime[1]
        var rand;
        HaxOn = true
        NaNCounter = 0;
        setTimeout(function(){
            HaxOn = false
        }, 60000)

        function loop() {
            if(HaxOn){
                rand = Math.round(Math.random() * (randhigh - randlow)) + randlow;
                setTimeout(function() {
                    Hax();
                    loop();
                }, rand);
            }
        }
        loop();
    }

    function onChangeHax(number){
        NaNCounter = 0;
        ochcount = 0;
        $(".questions-text-alignment").change(function(){
            if(ochcount < number-1 || number == -1){
                setTimeout(function(){
                    Hax()
                },0)
            }
            ochcount++;
        });
        Hax()
    }

    function Hax(){
        var question = document.getElementsByClassName("questions-text-alignment")[0].innerText.trim()
        var qarr = question.split(" ")
        if(question.startsWith("Half")){
            answer = qarr[2] / 2
        }else if(question.startsWith("How")){
            var number;
            var hms = [1, 60, 3600];
            var types = [];
            var position = [2, 5]

            qarr.forEach(function(element) {
                if(!isNaN(element) && element != ""){
                    number = element;
                }
            });

            position.forEach(function(position){
                switch(qarr[position]){
                    case "hours":
                        types.push(hms[0])
                        break
                    case "minutes":
                        types.push(hms[1])
                        break
                    case "seconds":
                        types.push(hms[2])
                        break
                }
            })

            if(types[0] < types[1]){
                answer = number*(types[0]/types[1])
            }else if(types[0] > types[1]){
                answer = number/(types[1]/types[0])
            }
        }else if(question.endsWith("m")){
            var dcnumber = 1;
            var dclr = "na";
            var distanceConversionArr=qarr.join("").split("=")
            var dcRef = [1, 100, 1000]
            var dcTypes = []
            distanceConversionArr.forEach(function(element){
                switch(element){
                    case "m":
                        dcTypes.push(dcRef[0])
                        break
                    case "cm":
                        dcTypes.push(dcRef[1])
                        break
                    case "mm":
                        dcTypes.push(dcRef[2])
                        break
                    default:
                        var azarr = [];
                        element.split("").forEach(function(character){
                            if(isNaN(character)){
                                azarr.push(character)
                            }
                        })
                        dcnumber = element.substring(0, element.length-azarr.join("").length);
                        if(dcTypes.length == 0){
                            dclr = "r"
                        }else{
                            dclr = "l"
                        }
                        switch(azarr.join("")){
                            case "m":
                                dcTypes.push(dcRef[0])
                                break
                            case "cm":
                                dcTypes.push(dcRef[1])
                                break
                            case "mm":
                                dcTypes.push(dcRef[2])
                                break
                        }
                        break
                }
            })

            var conversionfactor;
            if(dcTypes[0] < dcTypes[1]){
                conversionfactor = (dcTypes[1]/dcTypes[0])
            }else{
                conversionfactor = (dcTypes[0]/dcTypes[1])
            }

            if(dclr == "na"){
                var dcfsQuestion = document.getElementsByClassName("questions-text-alignment")[0].innerText.split("")
                if (dcfsQuestion[0] == " "){
                    dclr = "l"
                }
            }

            if(dclr == "l"){
                dcTypes.push(dcTypes[0])
                dcTypes.shift()
            }

            if(dcTypes[0] < dcTypes[1]){
                answer = dcnumber*conversionfactor
            }else if(dcTypes[0] > dcTypes[1]){
                answer = dcnumber/conversionfactor
            }
        }else{
            if(question.endsWith("=")){ //if it is a simple question
                switch (qarr.length){
                    case 4: //one operator
                        operator = qarr[1]
                        var answer;
                        switch(operator){
                            case "+":
                                answer = parseInt(qarr[0]) + parseInt(qarr[2])
                                break
                            case "-":
                                answer = parseInt(qarr[0]) - parseInt(qarr[2])
                                break
                            case "×":
                                answer = parseInt(qarr[0]) * parseInt(qarr[2])
                                break
                            case "÷":
                                answer = parseInt(qarr[0]) / parseInt(qarr[2])
                                break
                        }
                        break
                    case 5: //2 operators
                        //fix =
                        qarr[4] = qarr[4].substring(0, qarr[4].length-1);

                        answer = parseInt(qarr[0]) + parseInt(qarr[2]) + parseInt(qarr[4])
                        break
                    case 6:
                        answer = parseInt(qarr[0]) + parseInt(qarr[2]) + parseInt(qarr[4])
                        break
                }
            }else{ //if has fillin blank
                var fillblankarr = [];
                operator = qarr[1]
                qarr.forEach(function(element) {
                    if(!isNaN(element) && element != ""){
                        fillblankarr.push(element);
                    }
                });
                switch(operator){
                    case "+":
                        answer = fillblankarr[1] - fillblankarr[0]
                        break
                    case "×":
                        answer = fillblankarr[1] / fillblankarr[0]
                        break
                }
            }
        }
        if(!isNaN(answer)){
            sendKeystroke(answer)
        }else{
            if(NaNCounter < 2 && !debug){
                NaNCounter++;
                sendKeystroke(0);
            }
        }
    }

    function sendKeystroke(message) {
        ws.send(message);
    }

    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37:
                onChangeHax(150);
                break;
            case 38:
                Hax();
                break;
            case 39:
                onChangeHax(-1);
                break;
            case 40:
                startHax([400 ,500]);
                break;
        }
    };
})();