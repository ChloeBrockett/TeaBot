const fs = require('fs');
module.exports = {
	name: 'protect_role',
    description: 'Protects a role from being pruned. Strongly recomend to protect all staff roles and bot roles',
    args: true,
    modOnly: true,
    usage: "<role string>",
	execute(message, args) {
        var rolesFileName = 'roles.json';
        var protectedFileName='protected_roles.json';
		var file = fs.readFileSync(rolesFileName);
        var roles = JSON.parse(file)
        var protectedRoles=JSON.parse(fs.readFileSync(protectedFileName));
        var guildID=message.channel.guild.id.toString();
        var serverRoles = roles[guildID]
        
        if (serverRoles==null){
            message.reply("There are no stored roles. Try running !get_roles")
            return
        }
        
        if (!(args[0]in serverRoles)){
            message.reply("Role does not exist in stored roles")
            return
        }

        var serverProtectedRoles=protectedRoles[guildID]
        if (serverProtectedRoles==null){
            serverProtectedRoles= new Map();
        }
        
        serverProtectedRoles[args[0]]=serverRoles[args[0]];
        protectedRoles[guildID]=serverProtectedRoles;
        fs.writeFileSync(protectedFileName,JSON.stringify(protectedRoles,null,2),function (err){
            if (err){
                return console.log(err);
            }

        });
        console.log("Protected Role Saved")
        message.reply("Protected the role")
		
		
	},
};