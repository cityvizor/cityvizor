import "./polyfills";

import { ImporterCityVizor } from "./importers/importer-cityvizor";
import { ImporterGinis } from "./importers/importer-ginis";
import { ImporterVera } from "./importers/importer-vera";
import { Importer } from "./schema/importer";
import { ImportedData } from "app/shared/schema";

onmessage = function (e) {



  switch (e.data.type) {

    case "import":

      var importer: Importer;

      switch (e.data.importer) {
        case "cityvizor":
          importer = new ImporterCityVizor()
          break;
        case "ginis":
          importer = new ImporterGinis();
          break;
        case "vera":
          importer = new ImporterVera();
          break;
        default:
          throw new Error("Invalid importer type")
      }

      importer
        .import(e.data.files, e.data.options)
        .then((data: ImportedData) => postMessage({ type: "data", data: data }));

      break;

    default:
      throw new Error("Invalid event type")
  }


}