var restify = require('restify'); //web server restify
var builder = require('botbuilder');
var emoji = require('node-emoji');

//Crear servidor
var server = restify.createServer();

//se escucha en distintos puertos, particularmente en el 3978
server.listen(
    process.env.port || 
    process.env.PORT || 
    3978, function(){
        console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

var bot = new builder.UniversalBot(connector);
server.post('api/messages', connector.listen());

// Diálogos

bot.dialog('/',[// Primer dialogo o dialogo raìz, se crea dentro del bot
    function(session,results,next){// objeto llamado sesiòn
        
        //builder.Prompts.text(session, '¿Cómo te llamas?');
        if(!session.userData.nombre){ //preguntar si sabemos el nombre
            builder.Prompts.text(session, '¿Cómo te Llamas?');
        }else{
            next(); //Pasar al siguiente metodo de la cascada llamada next
        }
    },
    function (session,results){
        if(results.response){
            let msj = results.response;
            session.userData.nombre = msj;            
        }
        let icono = emoji.get('heart');
        
        session.send(`hola ${session.userData.nombre} ${icono}`);
        //session.send(`${icono}`);

        session.beginDialog('/preguntarLugar');
    }
]);

// Enable Conversation Data persistence
bot.set('persistConversationData', true);

bot.dialog('/preguntarLugar', [ //método preguntar lugar
    function(session,results,next){// objeto llamado sesiòn
        
        if(!session.conversationData.lugar){
            builder.Prompts.text(session, '¿Dónde estás?');
        }else{
            next();
        }
    },
    function (session,results){
        if(results.response){
            //let sitio = results.response;
            session.conversationData.lugar = results.response;
        }

        //session.send(`saludos por allá ${session.conversationData.lugar}`);
        session.endConversation(`${session.conversationData.lugar} es un agradable lugar`);
        session.beginDialog('/preguntarComida');
    }
]);

bot.dialog('/preguntarComida', [ //método preguntar lugar
    function(session){// objeto llamado sesiòn
        builder.Prompts.text(session, '¿Cuál es tu comida favorita?');
    },
    function (session, results){
        let comida = results.response;
        let icon = emoji.get('coffee');

        session.endConversation(`la ${comida} también es mi comida favorita ${icon}`);
        session.beginDialog('/preguntarClima');
    }
]);

bot.dialog('/preguntarClima', [ //método preguntar lugar
    function(session){// objeto llamado sesiòn
        builder.Prompts.text(session, `¿Cómo está el clima?` );
    },
    function (session, results){
        let clima = results.response;
        session.dialogData.climas = clima;

        session.endConversation(`el ${session.dialogData.climas} es agradable`);
        session.beginDialog('/preguntarDeporte');
    }
]);

bot.dialog('/preguntarDeporte', [ //método preguntar lugar
    function(session){// objeto llamado sesiòn
        builder.Prompts.text(session, '¿Cuál es tu deporte favorito?');
    },
    function (session, results){
        let deporte = results.response;
        session.endConversation(`tu deporte favorito es el ${deporte}?, a mi también me gusta`);
        session.beginDialog('/preguntarEstadocivil');
    }
]);

bot.dialog('/preguntarEstadocivil', [ //método preguntar lugar
    function(session){// objeto llamado sesiòn
        builder.Prompts.text(session, '¿Cuál es tu estado civil?');
    },
    function (session, results){
        let estado = results.response;

        if(estado == 'casado' || estado == 'CASADO'){
            session.endConversation(`Me Alegra que estés ${estado}`);
        }else{
            session.endConversation(`que bien por ti que estés ${estado}`);
        }
        
        session.replaceDialog('/preguntarNacion');
    }
]);

bot.dialog('/preguntarNacion', [ //método preguntar lugar
    function(session){// objeto llamado sesiòn
        builder.Prompts.text(session, '¿En Qué Pais Naciste?');
    },
    function (session, results){
        let nacion = results.response;

        if(nacion == 'colombia' || nacion == 'COLOMBIA' || nacion == 'Colombia'){
            session.endConversation(`${nacion} es el mejor país del mundo`);
        }else{
            session.endConversation(`${nacion} es un buen país`);
        }
        
        session.beginDialog('/preguntarTV');
    }
]);

bot.dialog('/preguntarTV', [ //método preguntar lugar
    function(session){// objeto llamado sesiòn
        builder.Prompts.text(session, '¿Cuál es tu programa de televisión favorito?');
    },
    function (session, results){
        let programa = results.response;

        session.endConversation(`tu programa favorito es ${programa}?, dejame decirte que no es entretenido`);
        session.beginDialog('/preguntarPelicula');
    }
]);

bot.dialog('/preguntarPelicula', [ //método preguntar lugar
    function(session){// objeto llamado sesiòn
        builder.Prompts.text(session, `Ahora bien, ya conozco tu programa favorito, pero ¿Cuál es tu película favorita?`);
    },
    function (session, results){
        let pelicula = results.response;

        session.endConversation(`tu pelicula favorita es ${pelicula}?, podría ser divertida`);
        session.beginDialog('/preguntarEstudio');
    }
]);

bot.dialog('/preguntarEstudio', [ //método preguntar lugar
    function(session){// objeto llamado sesiòn
        builder.Prompts.text(session, `estás estudiando?`);
    },
    function (session, results){
        let resp = results.response;

        if(resp == 'si' || resp == 'SI' || resp == 'Si'){
            session.endConversation();
            session.beginDialog('/preguntarQueEstudia');
        }else{
            session.endConversation(`Deberías pensar en estudiar`);
            session.beginDialog('/Despedir');
        }
    }
]);

bot.dialog('/preguntarQueEstudia', [ //método preguntar lugar
    function(session){// objeto llamado sesiòn
        builder.Prompts.text(session, `qué estás estudiando?`);
    },
    function (session, results){
        let estudio = results.response;

            session.endConversation(`${estudio} es una excelente carrera`);
            session.beginDialog('/Despedir');
        }
]);

bot.dialog('/Despedir', [ //método preguntar lugar
    function(session){// objeto llamado sesiòn
        builder.Prompts.text(session, `te ha gustado este bot?`);
    },
    function (session, results){
        let respuesta = results.response;

            if(respuesta == 'si' || respuesta == 'SI' || respuesta == 'Si'){
                builder.Prompts.text(session, `te ha gustado este bot?`);
                session.endConversation(`Gracias por participar ${session.userData.nombre}`);
            }else{
                session.endConversation(`De igual agradezco su tiempo`);
            }
        }
]);