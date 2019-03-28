import "./polyfills";

import { ImporterCityVizor } from "./importers/importer-cityvizor";
import { ImporterGinis } from "./importers/importer-ginis";
import { Importer } from "./schema/importer";
import { ImportedData } from "app/shared/schema";

const importers: { [key: string]: any } = {
  "cityvizor": ImporterCityVizor,
  "ginis": ImporterGinis
}

onmessage = function (e) {

  var importer: Importer;

  switch (e.data.type) {

    case "import":

      switch (e.data.importer) {
        case "cityvizor":
          importer = new ImporterCityVizor()
          break;
        case "ginis":
          importer = new ImporterGinis();
          break;
        default:
          throw new Error("Invalid importer type")
      }

      break;

    default:
      throw new Error("Invalid event type")
  }

  importer
    .import(e.data.files)
    .then((data: ImportedData) => postMessage({ type: "data", data: data }));
}