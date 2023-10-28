#include <iostream>
#include <string>
#include <discord_rpc.h>

void handleDiscordReady(const DiscordUser* connectedUser) {
    std::cout << "Discord Rich Presence: Connected to Discord as " << connectedUser->username << std::endl;
}

void handleDiscordDisconnected(int errcode, const char* message) {
    std::cerr << "Discord Rich Presence: Disconnected from Discord (Error: " << errcode << ", Message: " << message << ")" << std::endl;
}

void initializeRichPresence() {
    DiscordEventHandlers handlers;
    memset(&handlers, 0, sizeof(handlers));
    handlers.ready = handleDiscordReady;
    handlers.disconnected = handleDiscordDisconnected;

    Discord_Initialize("YOUR_CLIENT_ID_HERE", &handlers, 1, NULL);
    
    DiscordRichPresence discordPresence;
    memset(&discordPresence, 0, sizeof(discordPresence));
    discordPresence.state = "Entra al link debajo!";
    discordPresence.details = "Buscas un discord para hacer amigos?";
    discordPresence.startTimestamp = 1507665886;
    discordPresence.endTimestamp = 1507665886;
    discordPresence.largeImageKey = "screenshot_31";
    discordPresence.largeImageText = "Numbani";
    discordPresence.smallImageKey = "screenshot_30";
    discordPresence.smallImageText = "Rogue - Level 100";
    discordPresence.partyId = "ae488379-351d-4a4f-ad32-2b9b01c91657";
    discordPresence.partySize = 1;
    discordPresence.partyMax = 5;
    discordPresence.joinSecret = "MTI4NzM0OjFpMmhuZToxMjMxMjM=";
    Discord_UpdatePresence(&discordPresence);
}

int main() {
    initializeRichPresence();

    // Tu código de la aplicación va aquí.

    // Asegúrate de mantener la aplicación en ejecución o llama a Discord_Shutdown() cuando hayas terminado.
    std::cout << "Presiona Enter para salir." << std::endl;
    std::cin.get();

    Discord_Shutdown();

    return 0;
}
