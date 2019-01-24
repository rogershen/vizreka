export class NameOccurences {
    normalizedName : string;
    occurrences : number;
    wikiUrl : string;
    imageUrl : string;
    percentageOfTotal : number;

    constructor() {
        this.normalizedName = "";
        this.occurrences = 0;
        this.wikiUrl = "";
        this.imageUrl = "";
        this.percentageOfTotal = 0.0;
    }
}