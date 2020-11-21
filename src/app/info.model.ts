export class Info {
    name: string
    totalCases: number
    newCases: number
    totalRecovery: number
    newRecovery: number
    totalDeath: number
    newDeath: number
    activecases: number
    recoveryRate: number
    mortalityRate: number

    constructor(name, total, totalnew, rec, recnew, death, deathnew) {
        this.name = name;
        this.totalCases = total;
        this.newCases = totalnew;
        this.totalRecovery = rec;
        this.newRecovery = recnew;
        this.totalDeath = death;
        this.newDeath = deathnew;
        this.activecases = total - rec - death
        this.recoveryRate = rec / total * 100
        this.mortalityRate = death / total * 100
    }

    getName() {
        return this.name
    }
}

