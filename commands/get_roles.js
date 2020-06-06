const fs = require('fs');
module.exports = {
	name: 'get_roles',
	description: 'Collects all the roles for the server. Modify this with !protect_Roles to protect these roles from being pruned. Run this if new roles may have been added since the last prune',
	execute(message, args) {
		let roleMap=new Map();
		var fileName = 'roles.json';
		var file = fs.readFileSync(fileName);
		var roles = JSON.parse(file)
		var guildID=message.channel.guild.id.toString();
		
		message.channel.guild.roles.fetch().then(
			message.channel.guild.roles.cache.each(role => roleMap[String(role.name)] = role.id)	
		).then((a) => {
			roles[guildID]=roleMap;
			fs.writeFileSync(fileName,JSON.stringify(roles,null,2),function (err){
				if (err){
					return console.log(err);
				}

			});
			console.log("Roles Saved")
			message.reply("Roles have been stored")
		})
		
	},
};