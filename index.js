const { Client, GatewayIntentBits, GuildMember } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

// Configura la base de datos SQLite
const db = new sqlite3.Database('./experiencia.db');

// Crea una tabla para almacenar la experiencia si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS experiencia (
      usuario TEXT PRIMARY KEY,
      experiencia INTEGER DEFAULT 0,
      nivel INTEGER DEFAULT 1
    )
  `);
});

bot.once('ready', () => {
  console.log('🌟 Serena inició sesión! ¡Listo para servirte! 🌟');
  bot.application.commands.set([
    { name: 'ping', description: 'Responder con pong! 🏓' },
    { name: 'invite', description: 'Invitación al servidor 💌' },
    { name: 'ayuda', description: '¿Necesitas ayuda? ¡Estoy aquí para ti! 🤗' },
    { name: 'hola', description: '¡Hola! ¿En qué puedo ayudarte hoy? 👋' },
    { name: 'estado', description: 'Estoy feliz y lista para ayudarte. 😊' },
    { name: 'esmeralda', description: '¡No digas eso! Yo te quiero a ti. ❤️' },
    { name: 'clima', description: 'Obtener el pronóstico del clima 🌦️' },
    { name: 'noticias', description: 'Obtener noticias locales 📰' },
    { name: 'encuesta', description: 'Responder a una encuesta 📊' },
    { name: 'botinfo', description: 'Obtener información sobre la bot 🤖' },
    { name: 'aeryne', description: 'Descubre quién es la mejor Lissandra del servidor 👑' },
    { 
      name: 'deafen',
      description: '🔇 Silencia el chat de voz para evitar distracciones o interacciones no deseadas.' 
    },
    { 
      name: 'ban',
      description: 'Banear a un usuario.',
      options: [
        {
          name: 'usuario',
          description: 'Usuario a banear.',
          type: 6,
          required: true,
        },
      ],
    },
    {
      name: 'blacklist',
      description: 'Obtener una lista de usuarios en la blacklist.',
    },
    // Otros comandos aquí
  ]);
});

bot.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('¿No tienes nada mejor que hacer? 🙄');
  }

  if (commandName === 'ban') {
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply('¡No tienes permisos para banear a usuarios!');
    }
    const userToBan = options.getUser('usuario');
    if (!userToBan) {
      return interaction.reply('Debes mencionar al usuario que quieres banear.');
    }
    try {
      await interaction.guild.members.ban(userToBan, { reason: 'Razón opcional del ban' });
      interaction.reply(`¡${userToBan.tag} ha sido baneado con éxito!`);
    } catch (error) {
      console.error('Error al banear al usuario:', error);
      interaction.reply('No se pudo banear al usuario. Asegúrate de que el bot tenga los permisos adecuados.');
    }
  }

  if (commandName === 'blacklist') {
    const nombres = ['LLLLLA SUPP','Dhek', 'xJotape','Winder','benjitapro2010',];
    const enlaces = [
      'https://www.op.gg/summoners/las/LLLLLA%20SUPP',
      'https://www.op.gg/summoners/las/Dhek',
      'https://www.op.gg/summoners/las/xJotape',
      'https://www.op.gg/summoners/las/Winder',
      'https://www.op.gg/summoners/las/benjitapro2010',
    ];

    // Construye el mensaje de respuesta con nombres y enlaces
    let response = '';
    for (let i = 0; i < nombres.length; i++) {
      response += `${nombres[i]}\n${enlaces[i]}\n`;
    }

    await interaction.reply(response);
  }
  if (commandName === 'deafen') {
    // Verifica si el autor de la interacción está en un canal de voz
    if (interaction.member.voice.channel) {
      const voiceState = interaction.member.voice;
      try {
        if (voiceState.serverMute == false){
          // Ensordece al usuario
          await voiceState.setDeaf(true);
          // Silencia al usuario
          await voiceState.setMute(true);
          interaction.reply(`¡Has sido ensordecido y silenciado! 🔇🔈`);
        }
        else{
          // Ensordece al usuario
          await voiceState.setDeaf(false);
          // Silencia al usuario
          await voiceState.setMute(false);
          interaction.reply(`¡Has sido desensordecido y dessilenciado! 🔇🔈`);
        }
        
        
        // interaction.reply(`¡Has sido ensordecido y silenciado! 🔇🔈`);
      } catch (error) {
        console.error('Error al ensordecer y silenciar al usuario:', error);
        interaction.reply('No se pudo cambiar el estado de ensordecer y silenciar. Asegúrate de que el bot tenga los permisos adecuados.');
      }
    } else {
      interaction.reply('Debes estar en un canal de voz para usar este comando.');
    }
  };
    
  if (commandName === 'aeryne') {
    const response = `*La mejor Lissandra del servidor ❄️👑*.
**Su perfil aquí**: 
https://www.op.gg/summoners/las/Aeryne `;
    
    const iceQueenRole = interaction.guild.roles.cache.find(role => role.name === '『❄️』Reina del Hielo');
    
    if (iceQueenRole) {
      await interaction.reply(`${response} ${iceQueenRole}`);
    } else {
      await interaction.reply(response);
    }
  }
  
  if (commandName === 'feel') {
    const response = `Amigo de Lunari, famoso por ser random.`;
    await interaction.reply(response);
  };

  if (commandName === 'botinfo') {
    const botVersion = '1.0.9';
    const botCreator = 'LunariLight';
    await interaction.reply(`🤖 *¡Soy una bot de Discord! Mi versión es ${botVersion} y fui creada por* ***${botCreator}***. *Si tienes alguna pregunta o necesitas ayuda, no dudes en preguntar.*`);
  };

  if (commandName === 'ayuda') {
    const staffRole = interaction.guild.roles.cache.find(role => role.name === '『🤹‍♀️』Staff');
    
    if (staffRole) {
      await interaction.reply(`¡Por supuesto! Puedes llamar a ${staffRole} si necesitas ayuda. ¡Estoy aquí para hacer tu vida más fácil! 🌟`);
    } else {
      await interaction.reply('El rol "Staff" no fue encontrado en este servidor. Por favor, asegúrate de que el rol esté configurado correctamente.');
    }
  };
  

  if (commandName === 'invite') {
    await interaction.reply('¡Claro! Aquí tienes la invitación al servidor: https://discord.gg/2NwXcby89a 💌');
  };

  if (commandName === 'hola') {
    await interaction.reply('¡Hola! ¿En qué puedo ayudarte hoy? 👋 Estoy aquí para hacer tu día mejor. 😄');
  };

  if (commandName === 'estado') {
    await interaction.reply('¡Estoy feliz y lista para ayudarte! 😊 ¿En qué puedo servirte hoy?');
  };

  if (commandName === 'esmeralda') {
    await interaction.reply('¡Eres más que eso! Debes superarte para salir de ese elo, recuerda que yo te quiero a ti. ❤️ Siempre estoy aquí para ti, amigo.');
  };

  if (commandName === 'clima') {
    // Obtén el clima actual (Reemplaza con tu lógica para obtener la ubicación del usuario)
    const location = 'Ciudad, Pais'; // Reemplaza con la ubicación real
    const apiKey = 'TU_CLAVE_API_DE_CLIMA'; // Reemplaza con tu clave de API de OpenWeatherMap

    try {
      const weatherData = await getWeather(location, apiKey);
      const currentTime = new Date().toLocaleTimeString();
      await interaction.reply(`El clima en ${location} es ${weatherData.description}, ${weatherData.temperature}°C. Hora actual: ${currentTime} 🌦️ ¡El tiempo está hermoso!`);
    } catch (error) {
      console.error('Error al obtener el clima:', error);
      await interaction.reply('Lo siento, no pude obtener la información del clima en este momento. ☁️ ¡Espero que mejore pronto!');
    }
  }

  if (commandName === 'noticias') {
    // Obtén noticias locales (Reemplaza con tu lógica para obtener la ubicación del usuario)
    const location = 'Ciudad, Pais'; // Reemplaza con la ubicación real
    const apiKey = 'TU_CLAVE_API_DE_NOTICIAS'; // Reemplaza con tu clave de API de noticias

    try {
      const newsData = await getNews(location, apiKey);
      await interaction.reply(`¡Aquí tienes algunas noticias locales! 📰 \n${newsData.join('\n')}`);
    } catch (error) {
      console.error('Error al obtener noticias:', error);
      await interaction.reply('Lo siento, no pude obtener noticias en este momento. 🗞️ ¡Espero que pronto tengamos buenas noticias!');
    }
  }

  if (commandName === 'encuesta') {
    // Puedes crear una pregunta o tema para la encuesta
    const pregunta = '¿Cuál es tu color favorito?';

    // Puedes crear opciones de respuesta
    const opciones = ['Rojo', 'Verde', 'Azul'];

    // Puedes generar un mensaje con botones interactivos o reacciones de emoji para las opciones
    // Aquí necesitarás utilizar la funcionalidad de tu biblioteca específica
    const mensajeEncuesta = await interaction.reply({
      content: pregunta,
      components: [
        {
          type: 1, // Tipo 1 es para botones interactivos
          components: opciones.map((opcion, index) => ({
            type: 2, // Tipo 2 es para botones con etiquetas
            label: opcion,
            custom_id: `votar_${index}`, // Identificador único para cada opción
          })),
        },
      ],
    });
  }
});

async function getWeather(location, apiKey) {
  const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
  if (response.status !== 200) {
    throw new Error('Error en la solicitud al servidor del clima');
  }
  const data = response.data;
  const description = data.weather[0].description;
  const temperature = data.main.temp;
  return { description, temperature };
}

async function getNews(location, apiKey) {
  const response = await axios.get(`https://newsapi.org/v2/top-headlines?q=${location}&apiKey=${apiKey}`);
  if (response.status !== 200) {
    throw new Error('Error en la solicitud al servidor de noticias');
  }
  const data = response.data;
  if (data.articles && data.articles.length > 0) {
    const news = data.articles.map((article) => `- ${article.title}`);
    return news;
  }
  return ['No se encontraron noticias locales.'];
}

// Reemplaza 'TU_TOKEN_AQUI' con el token real de tu bot
const token = 'MTE0OTgzMjkzODI1NTU2OTAxOQ.GvB-KH.RfydMM5SLYpRVGhBgouImtYam-MPIRTqTPOsVM';

bot.login(token);
