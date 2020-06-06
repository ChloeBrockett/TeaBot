module.exports = {
	name: 'do_kick_unverified',
	description: 'Returns how many inactive members without rules will be pruned for (1-30) days. Functionally identicle to discords built in prune feature, but more granular',
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
        
        message.channel.guild.members.prune ({ days:numDays})
            .then(pruned => message.reply(`This has pruned ${pruned} people who have not been active in ${numDays} days`))
            .catch((e) => {
                console.log(e)
                message.reply(e.message)
            });
	},
};