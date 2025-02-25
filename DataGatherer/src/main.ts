import { Sender } from "./sender/Sender";
import { Mouse } from "./source/mouse/Mouse";
import { Gatherer } from "./gatherer/Gatherer";
import { Keyboard } from "./source/keyboard/Keyboard";
import { Screen } from "./source/screen/Screen";

declare var UPS_CONFIGS;

function main() {
    const humanGatherer: Gatherer = new Gatherer([
            new Screen('screen'),
            new Keyboard('keyboard', ['keydown']),
            new Mouse('mouse', ['click', 'mousemove'])
        ]);


    startPrediction(humanGatherer);
//    startGathering([humanGatherer, botGatherer]);
    startGathering([humanGatherer])
}

function getFlowName() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('flowName') === null ? 1 : urlParams.get('flowName');
}

function getAgentName() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('agentName') === null ? 1: urlParams.get('agentName');
}

function startPrediction(gatherer: Gatherer) {
    const sender: Sender = new Sender(() => gatherer.getData(), UPS_CONFIGS.predictor_ws_url,2000);
    sender.start('http')
        .subscribe(
            val => {
                if (val) {
                    const max = Math.max(...val);
                    const maxIndex = val.indexOf(max.toString());
                    document.getElementById("prediction_value").innerText = val + '\n Stato probabile: ' + maxIndex;
                }
            }
        );
}


function startGathering(gatherers: Array<Gatherer>) {
    for(const gatherer of gatherers ) {
        gatherer.start();

        const sender: Sender = new Sender(() => gatherer.getData(), UPS_CONFIGS.gatherer_ws_url+ '?agentName=bot_'+getAgentName()+'&flowName=flow'+getFlowName(), 1000);
        sender.start('ws')
            .subscribe(
                val => {
                }
            );
    }
}

main();
