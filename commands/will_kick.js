const request = require('request');
const fs = require('fs');
const { prefix, token } = require('../config.json');

module.exports = {
  name: 'will_kick',
  modOnly: true,
	description: 'Kicks all the members of the server with a subset of unprotected roles who have not been active in (1-30) days. Requires the use of !get_roles before use.',
	execute(message, args) {

        var rolesFileName = 'roles.json';
        var protectedFileName='protected_roles.json';
        var file = fs.readFileSync(rolesFileName);
        var roles = JSON.parse(file)
        var protectedRoles=JSON.parse(fs.readFileSync(protectedFileName));
        var serverRoles = roles[message.channel.guild.id];
        var serverProtectedRoles= protectedRoles[message.channel.guild.id];
        
        //We want to protect certain roles from being kicked. If they exist in the saved protected roles, remove them. 

        var keys = Object.keys(serverProtectedRoles);
        for (key in keys){
          if (keys[key] in serverRoles){
            delete serverRoles[keys[key]];
          }
        };

        //we need to provide the api with the snowflakes (id) of the roles that should be kicked. 
        //convert the names of roles to their snowflakes
        snowflakeArray=[]
        keys = Object.keys(serverRoles);
        for (key in keys){
          snowflakeArray.push(serverRoles[keys[key]])
        }
        //according to the docs, the API needs an array of snowflakes. This isn't to be an array of strings however
        //it needs to be in the form "include_roles=SNOWFLAKE&include_roles=SNOWFLAKE&include_roles=SNOWFLAKE"
        //reference : https://github.com/discord/discord-api-docs/issues/1720
        //convert array into string
        let snowflakeString='';
        for (index in snowflakeArray){
          snowflakeString = snowflakeString.concat('&include_roles=',snowflakeArray[index]);
        }

        //by default, the number of days should be 7
        //also needs to be greater than 1 and less than 30
        let numDays = 7;
        if (args.length>0){
            numDays = parseInt(args[0]);
            console.log(numDays)
            if (  Number.isNaN(numDays) || numDays<1 ){
                numDays=7;
            }
            if (numDays>30 ){
              numDays=30;
            }
        }

        const options = {
          url: `https://discord.com/api/guilds/${message.channel.guild.id}/prune?days=${numDays}${snowflakeString}`,
          headers: {
              'Authorization': `Bot ${token}`,
          }
        }

        function callback(error, response, body) {
          if (!error) {
            console.log(error);
            const info = JSON.parse(body);
            console.log(info);
            console.log(response.statusCode);  
            message.reply("The do_kick command will kick "+JSON.stringify(info.pruned)+" users who have not been active in "+numDays+" days");
          }
        }

        request(options, callback);
        
	}
};