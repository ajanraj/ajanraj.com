import { defineHandler } from "nitro";
import { legalResponse, termsPage } from "../../src/lib/legal/pages";

export default defineHandler(() => legalResponse(termsPage));
