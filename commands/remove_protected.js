const fs = require('fs');
module.exports = {
	name: 'remove_protected',
    description: 'Removes a role from the list of protected roles.',
    args: true,
    mod: true,
    usage: "<role string>",
	execute(message, args) {
        var protectedFileName='protected_roles.json';
        var protectedRoles=JSON.parse(fs.readFileSync(protectedFileName));
        var guildID=message.channel.guild.id.toString();
        
        var serverProtectedRoles=protectedRoles[guildID]

        if (serverProtectedRoles==null){
            message.reply("You haven't protected any roles ")
            return
        }
        
        if (!(args[0]in serverProtectedRoles)){
            message.reply("Role is not currently protected")
            return
        }

        
        delete serverProtectedRoles[args[0]]
        protectedRoles[guildID]=serverProtectedRoles
        fs.writeFileSync(protectedFileName,JSON.stringify(protectedRoles,null,2),function (err){
            if (err){
                return console.log(err);
            }

        });
        message.reply("Unprotected the role")
		
		
	},
};