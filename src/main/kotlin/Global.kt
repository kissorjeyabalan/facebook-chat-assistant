import externals.facebook.Api

class Global {
    companion object {
        val instance = Global()
    }
    var api: Api? = null
}