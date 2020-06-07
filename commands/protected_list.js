const fs = require('fs');
module.exports = {
	name: 'protected_list',
    description: 'Lists the protected roles.',
    modOnly: true,
	execute(message, args) {
        var protectedFileName='protected_roles.json';
        var protectedRoles=JSON.parse(fs.readFileSync(protectedFileName));
        var guildID=message.channel.guild.id.toString();
        
        var serverProtectedRoles=protectedRoles[guildID]

        if (serverProtectedRoles==null){
            message.reply("You haven't protected any roles ")
            return
        }

        //get the string names of the prtoected roles and present them nicely
        let rolesString='';
        keys = Object.keys(serverProtectedRoles);
        for (index in keys){
            rolesString=rolesString.concat(keys[index]+"\n");
        }

        message.reply("Protected roles:\n"+rolesString);
	},
};