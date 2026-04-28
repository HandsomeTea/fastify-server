export const waitForStartup = (callback: () => void | Promise<void>) => {
    const checkInterval = 1000; // 检查间隔，单位为毫秒
    let timer: NodeJS.Timeout | null = setInterval(async () => {
        if (global.isServerRunning) {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }

            await callback();
        }
    }, checkInterval);;
}
