import { envs } from "../../../envs";
import { SESClient } from "@aws-sdk/client-ses";

export const sesClient = new SESClient({ region: envs.REGION_NAME });
