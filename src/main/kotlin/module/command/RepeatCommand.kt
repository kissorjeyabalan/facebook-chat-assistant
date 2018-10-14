package module.command

class SingleCommand : Command {
    override val command: String
        get() = "single"
    override val valid: Boolean
        get() = true
}