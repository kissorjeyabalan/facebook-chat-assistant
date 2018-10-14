package handler

import config.Configuration
import externals.facebook.Event
import module.command.Command
import module.command.RepeatCommand
import module.command.SingleCommand

class CommandHandler : Handler {
    private val trigger = Configuration.instance.get("bot.trigger")
    private val commands: HashMap<String, Command> = HashMap()

    init {
        val instances = arrayListOf(
                RepeatCommand(), SingleCommand()
        )

        for (instance in instances) {
            val enabled = Configuration.instance
                    .isCmdEnabled(instance::class.js.name)
            println("cmd ${instance.command} is enabled: $enabled")
            if (enabled) {
                commands[instance.command] = instance
            }
        }
    }

    override fun handle(message: Event): Event {
        return message
    }
}