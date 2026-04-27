const _protectedUrl = (url: string) => {
    try {
        const address = new URL(url);

        address.username = '***';
        address.password = '***';

        return address.toString();
    } catch (e) {
        // @ts-ignore
        console.warn(e);
        return url;
    }
};

export const protectedUrl = <T extends string | Array<string>>(url: T): T => {
    if (typeof url === 'string') {
        return _protectedUrl(url) as T;
    } else if (Array.isArray(url)) {
        return url.map((a) => _protectedUrl(a)) as T;
    }
    return url;
};
