export class HelpDetails {
    private name: string;
    private cmd: string;
    private shortDescription: string;
    private description: string;
    private syntax: string;
    private example: string;
    private hidden: boolean;
    private adminOnly: boolean;

    public constructor(name: string, cmd: string, shortDescription: string,
        description: string, syntax: string, example: string, hidden: boolean,
        adminOnly: boolean) {

        this.name = name;
        this.cmd = cmd;
        this.shortDescription = shortDescription;
        this.description = description;
        this.syntax = syntax;
        this.example = example;
        this.hidden = hidden;
        this.adminOnly = adminOnly;
    }

    public getCmd(): string {
        return this.cmd;
    }
    public getName(): string {
        return this.name;
    }

    public getShortDescription(): string {
        return this.shortDescription;
    }

    public getDescription(): string {
        return this.description;
    }

    public getSyntax(): string {
        return this.syntax;
    }

    public getExample(): string {
        return this.example;
    }

    public isHidden(): boolean {
        return this.hidden;
    }

    public isAdminOnly(): boolean {
        return this.adminOnly;
    }
}
