const puppeteer = require('puppeteer');

async function joinJitsiMeeting(participantName, cameraSelector) {
    const browser = await puppeteer.launch({
        headless: false, // Cambiar a 'false' para ver el navegador
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--ignore-certificate-errors',
            '--use-fake-ui-for-media-stream'
        ]
    });

    const page = await browser.newPage();
    const meetingURL = 'https://localhost:8443/ronny';

    try {
        await page.goto(meetingURL, {
            waitUntil: 'networkidle2'
        });

        await page.waitForTimeout(1000);

        // Rellenar el campo de nombre
        await page.waitForSelector("#premeeting-name-input", { visible: true });
        await page.type("#premeeting-name-input", participantName);

        // Ajustar la configuración de video
        await page.evaluate((cameraSelector) => {
            const videoSettingsButton = document.querySelector("#video-settings-button");
            if (videoSettingsButton) {
                videoSettingsButton.click();
            } else {
                console.error('Botón de ajustes de video no encontrado');
            }

            const videoElement = document.querySelector(cameraSelector);
            if (videoElement) {
                videoElement.click();
            } else {
                console.error('Elemento de video no encontrado');
            }
        }, cameraSelector);

        await page.waitForTimeout(1000);

        // Unirse a la reunión
        await page.waitForSelector('.css-1hbmoh1-actionButton');
        await page.click('.css-1hbmoh1-actionButton');

    } catch (error) {
        console.error("Error al navegar a la URL o interactuar con la página: ", error);
        await browser.close();
        return;
    }

    // Mantener la página abierta durante un tiempo
    await page.waitForTimeout(100000);

    // Cerrar el navegador
    await browser.close();
}

async function main() {
    joinJitsiMeeting("Camara1", "#video-settings-dialog > div:nth-child(1) > div:nth-child(2) > video");
    joinJitsiMeeting("Camara2", "#video-settings-dialog > div:nth-child(1) > div:nth-child(3) > video");
}

main();
