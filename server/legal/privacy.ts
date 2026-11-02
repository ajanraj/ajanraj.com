import { defineHandler } from "nitro";
import { legalResponse, privacyPage } from "../../src/lib/legal/pages";

export default defineHandler(() => legalResponse(privacyPage));
