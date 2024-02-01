
const puppeteer = require('puppeteer');

async function joinJitsiMeeting() {
    const browser = await puppeteer.launch({
        headless: true, // Asegúrate de que esto debería ser 'true' para modo headless
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--ignore-certificate-errors',
            '--use-fake-ui-for-media-stream'

        ]
    });

    const page = await browser.newPage();

    const meetingURL = 'https://meet.jit.si/UnemployedSeasSinkDirectly';

    try {
        await page.goto(meetingURL, {
            waitUntil: 'networkidle2'
        });

        await page.waitForTimeout(1000);

        // Esperar a que el campo de nombre esté disponible y luego rellenarlo
        await page.waitForSelector("#premeeting-name-input", { visible: true });
        await page.type("#premeeting-name-input", "Camara2");


        await page.evaluate(() => {
            const videoSettingsButton = document.querySelector("#video-settings-button");
            if (videoSettingsButton) {
                videoSettingsButton.click();

            } else {
                console.error('Botón de ajustes de video no encontrado');
            }
        });

        await page.waitForTimeout(1000);

        await page.evaluate(() => {
            const videoElement = document.querySelector("#video-settings-dialog > div:nth-child(1) > div:nth-child(3) > video");
            if (videoElement) {
                videoElement.click();
            } else {
                console.error('Elemento de video no encontrado');
            }
        });

        await page.waitForTimeout(1000);

        // Hacer clic en el botón "Join meeting"
        await page.waitForSelector('.css-1hbmoh1-actionButton');
        await page.click('.css-1hbmoh1-actionButton');

        await page.waitForTimeout(3000);

        // Recargar la página
        await page.reload({ waitUntil: "networkidle2" });

        // Hacer clic en el botón "Join meeting"
        await page.waitForSelector('.css-1hbmoh1-actionButton');
        await page.click('.css-1hbmoh1-actionButton');

    } catch (error) {
        console.error("Error al navegar a la URL o interactuar con la página: ", error);
        await browser.close();
        return;
    }
    await page.waitForTimeout(100000);

    // Cerrar el navegador
    await browser.close();
}

joinJitsiMeeting();


/*
const puppeteer = require('puppeteer');

async function joinJitsiMeeting() {
    const browser = await puppeteer.launch({
        headless: false, // Asegúrate de que esto debería ser 'true' para modo headless
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--ignore-certificate-errors',
            '--use-fake-ui-for-media-stream',
            '--incognito'
            // Simular aceptación de permisos de cámara y micrófono
            //'--use-file-for-fake-video-capture=/home/video.webm' // Usar dispositivos multimedia ficticios
        ]
    });

    const page = await browser.newPage();

    const meetingURL = 'https://localhost:8443/ronny';

    try {
        await page.goto(meetingURL, {
            waitUntil: 'networkidle2'
        });

        await page.waitForTimeout(1000);

        // Esperar a que el campo de nombre esté disponible y luego rellenarlo
        await page.waitForSelector("#premeeting-name-input", { visible: true });
        await page.type("#premeeting-name-input", "Camara2");

        await page.evaluate(() => {
            const videoSettingsButton = document.querySelector("#video-settings-button");
            if (videoSettingsButton) {
                videoSettingsButton.click();

            } else {
                console.error('Botón de ajustes de video no encontrado');
            }
        });

        await page.waitForTimeout(1000);

        await page.evaluate(() => {
            const videoElement = document.querySelector("#video-settings-dialog > div:nth-child(1) > div:nth-child(3) > video");
            if (videoElement) {
                videoElement.click();
            } else {
                console.error('Elemento de video no encontrado');
            }
        });

        await page.waitForTimeout(1000);


        // Hacer clic en el botón "Join meeting"
        await page.waitForSelector('.css-1hbmoh1-actionButton');
        await page.click('.css-1hbmoh1-actionButton');

    } catch (error) {
        console.error("Error al navegar a la URL o interactuar con la página: ", error);
        await browser.close();
        return;
    }

    // Mantener la página abierta durante un tiempo (por ejemplo, 60 segundos)
    await page.waitForTimeout(100000);

    // Cerrar el navegador
    await browser.close();
}

joinJitsiMeeting();

*/