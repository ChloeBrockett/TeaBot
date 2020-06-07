const fs = require('fs');
const { prefix, token } = require('./config.json');
// boilerpalate bot code
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const staffRoles = ["Admin","Staff","Moderator","Mod","Intern"];

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
//when bot starts, send message when ready
client.once('ready', () => {
	console.log('Ready!');
});
//await message, if command, and if command exists, execute
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) {
        message.reply('That command does not exist')
        return
    };
    const command = client.commands.get(commandName);
    //check if the command is a mod only command, and if so, check the user has an approprate role.
    if (command.modOnly){
        //iterates over the cached roles of the user until it finds a role name that exists in the staffRoles array and returns true, else returns false
        if (!(message.member.roles.cache.map (role => {
                if (role.name in staffRoles)
                    return true
                }))
            ){
            
            message.reply("You are not a staff member of this server >:c")
            return
        }
    }
    //check if the command requires arguments and if they have been given
    if (command.args && !args.length){
        		let reply = `You didn't provide any arguments, ${message.author}!`;
        
        		if (command.usage) {
        			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        		}
        
        		return message.channel.send(reply);
    }
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }

});

client.login(token);
