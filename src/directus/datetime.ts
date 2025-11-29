import dayjs from 'dayjs';

export function datetime(datetime: string | undefined | null): string {
    if (!datetime) {
        return ''
    }

    const d = dayjs(datetime)
    return d.format('YYYY-MM-DD HH:mm:ss')
}
