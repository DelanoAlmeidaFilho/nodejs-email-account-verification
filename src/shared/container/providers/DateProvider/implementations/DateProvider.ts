import dayjs from 'dayjs';

import { IDateProvider } from '../IDateProvider';

class DateProvider implements IDateProvider {
    addHours(hours: number): number {
        return dayjs().add(hours, 'hour').unix();
    }
    addSeconds(seconds: number): number {
        return dayjs().add(seconds, 'second').unix();
    }

    isAfter(unixDate: number): boolean {
        return dayjs().isAfter(dayjs.unix(unixDate));
    }
}

export { DateProvider };
