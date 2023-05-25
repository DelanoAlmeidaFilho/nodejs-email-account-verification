interface IDateProvider {
    addHours(hours: number): number;
    addSeconds(seconds: number): number;
    isAfter(unixDate: number): boolean;
}

export { IDateProvider };
