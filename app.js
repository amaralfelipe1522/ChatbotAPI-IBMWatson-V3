const prompt = require('prompt-sync')();
const watson = require('watson-developer-cloud/assistant/v1');
require('dotenv').config()
const chatbot = new watson({
    username: 'apikey',
    password: process.env.password,
    version: '2018-02-16',
});
const workspace_id = process.env.WORKSPACE_ID;

chatbot.message({
    workspace_id
}, trataResposta);

let fimDeConversa = false;

function trataResposta(err, resp) {
    if (err) {
        console.log(err);
        return;
    }
    //Detecta a intent
    if (resp.intents.length > 0) {
        console.log('Intenção: ' + resp.intents[0].intent);
        if (resp.intents[0].intent == 'tchau' || resp.intents[0].intent == 'desistencia'){
            fimDeConversa = true;
        }
    }
    //console.log(resp);
    //Exibe o Bem-vindo
    if (resp.output.text.length > 0) {
        console.log(resp.output.text[0]);
    }
    if (!fimDeConversa) {
        //Entrada do usuário
        const mensagemUsuario = prompt('>>');
        chatbot.message({
            workspace_id,
            input: {text: mensagemUsuario},
            context: resp.context
        }, trataResposta);
    }
    
}