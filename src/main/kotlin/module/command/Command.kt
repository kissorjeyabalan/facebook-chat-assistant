package module.command

interface Command {
    val command: String
    val valid: Boolean
    fun run()
}