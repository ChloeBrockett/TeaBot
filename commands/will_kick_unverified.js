module.exports = {
    name: 'will_kick_unverified',
    modOnly: true,
	description: 'Returns how many members will be pruned from the server for (1-30)) number of days. Does not count people with any roles.',
	execute(message, args) {
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
        
        message.channel.guild.members.prune ({ dry: true ,days:numDays})
            .then(pruned => message.reply(`This will prune ${pruned} people who have not been active in ${numDays} days`))
            .catch((e) => {
                console.log(e)
                message.reply(e.message)
            });
	},
};