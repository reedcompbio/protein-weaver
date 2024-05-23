import { Router } from "express";
import { getDriver } from "../src/neo4j.js";
import bodyParser from "body-parser";
import MovieService from "../services/movie.service.js";
import NetworkService from "../services/network.service.js";
import EdgeDataService from "../services/edge.data.service.js";
import ProteinService from "../services/protein.service.js";
import GoTermService from "../services/go.term.service.js";
// import Txid7227Service from "../services/txid7227.service.js";
import QueryService from "../services/query.service.js";
import AncestorsService from "../services/ancestors.service.js";
import DescendantsService from "../services/descendants.service.js";
import NeighborService from "../services/neighbor.service.js";
import { neighborParser } from "../tools/data.parsing.js";
import GoNodeService from "../services/go.node.service.js";
import AllShortestPathsService from "../services/dijkstra.all.service.js";
import ProteinFinderService from "../services/protein.finder.service.js";
import GoFinderService from "../services/go.finder.service.js";
import AvgDegreeService from "../services/avg.degree.service.js";
import TopDegreeService from "../services/top.degree.service.js";

const router = new Router();
const jsonParser = bodyParser.json();

router.get("/test", (req, res) => {
  res.json({ message: "Successfully connected to the backend API" });
  console.log("successfully connected to the backend API");
});

//Example of API call in routes.js

router.post("/getAvgDegree", jsonParser, async (req, res, next) => {
  const data = req.body;
  const nodeList = data.nodeList;
  const species = data.species;

  try {
    const avgDegreeService = new AvgDegreeService(getDriver());

    const avgDegree = await avgDegreeService.getAvgDegree(species, nodeList);
    console.log("Average Degree:");
    console.log(avgDegree);

    res.json(avgDegree);
  } catch (e) {
    next(e);
  }
});

// Test this with {"k":10}
router.post("/getTopDegree", jsonParser, async (req, res, next) => {
  const data = req.body;
  const k = data.k;
  console.log("K");
  console.log(k)

  try {
    const topDegreeService = new TopDegreeService(getDriver());

    const topDegree = await topDegreeService.getTopDegree(k);
    console.log("Top Degree:");
    console.log(topDegree);

    res.json(topDegree);
  } catch (e) {
    next(e);
  }
});

router.get("/getMovie", async (res, next) => {
  try {
    const movieService = new MovieService(getDriver());

    const movies = await movieService.getMovie();

    res.json(movies);
  } catch (e) {
    next(e);
  }
});

router.get("/getNetwork", async (res, next) => {
  try {
    const networkService = new NetworkService(getDriver());

    const network = await networkService.getNetwork();

    res.json(network);
  } catch (e) {
    next(e);
  }
});

router.post("/getProteinOptions", jsonParser, async (req, res, next) => {
  const data = req.body;
  const species = data.species;

  try {
    const proteinService = new ProteinService(getDriver());

    const proteinOptions = await proteinService.getProtein(species);

    res.json(proteinOptions);
  } catch (e) {
    next(e);
  }
});

router.post("/getAncestors", jsonParser, async (req, res, next) => {
  const data = req.body;
  let species = data.species;
  let goTerm = data.goTerm.id || data.goTerm.name;

  try {
    const ancestorService = new AncestorsService(getDriver());

    const ancestors = await ancestorService.getAncestors(goTerm, species);

    res.json(ancestors);
  } catch (e) {
    next(e);
  }
});

router.post("/getDescendants", jsonParser, async (req, res, next) => {
  const data = req.body;
  let species = data.species;
  let goTerm = data.goTerm.id || data.goTerm.name;

  try {
    const descendantsService = new DescendantsService(getDriver());

    const descendants = await descendantsService.getDescendants(goTerm, species);

    res.json(descendants);
  } catch (e) {
    next(e);
  }
});

router.get("/getGoTermOptions", jsonParser, async (req, res, next) => {
  try {
    const goTermService = new GoTermService(getDriver());

    const goTermOptions = await goTermService.getGoTerm();

    res.json(goTermOptions);
  } catch (e) {
    next(e);
  }
});

router.post("/getEdgeData", jsonParser, async (req, res, next) => {
  const data = req.body;
  const nodeList = data.nodeList;

  try {
    const edgeDataService = new EdgeDataService(getDriver());

    const edgeData = await edgeDataService.getEdgeData(nodeList);

    res.json(edgeData);
  } catch (e) {
    next(e);
  }
});

// // get D. melanogaster data
// router.post("/getTxid7227", jsonParser, async (req, res, next) => {
//   const data = req.body;
//   const species = data.species;
//   const protein = data.protein;
//   const goTerm = data.goTerm;
//   const k = data.k;

//   console.log("Species:", species);
//   console.log("Protein:", protein);
//   console.log("GO Term:", goTerm);
//   console.log("k:", k);

//   try {
//     const queryService = new Txid7227Service(getDriver());
//     const queryResult = await queryService.getTxid7227(protein, goTerm, k);
//     // console.log(queryResult)

//     if (queryResult.length === 0) {
//       console.log("No data found.");
//       res.status(404).send({ error: "No data found." });
//     } else {
//       res.status(200).json(queryResult);
//     }
//   } catch (error) {
//     console.error("Error in /getFlyBase:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// });

// router.post("/postRequest", async (req, res, next) => {
//   const body = req.body;
//   res.json(body);
// });

// dynamic query
router.post("/getQuery", jsonParser, async (req, res, next) => {
  const data = req.body;
  const species = data.species;
  const protein = data.protein;
  const goTerm = data.goTerm;
  const k = data.k;

  console.log("Species:", species);
  console.log("Protein:", protein);
  console.log("GO Term:", goTerm);
  console.log("k:", k);

  try {
    const proteinFinderService = new ProteinFinderService(getDriver());
    var sourceProtein = await proteinFinderService.getProteinFinder(
      protein,
      species
    );

    if (sourceProtein == "") {
      console.log("Source protein not found.");
      res.status(404).send({ error: "Source protein not found." });
    } else {
      const goFinderService = new GoFinderService(getDriver());
      var goResult = await goFinderService.getGoFinder(goTerm);
      if (goResult == "") {
        console.log("GO term not found");
        res.status(404).send({ error: "GO term not found." });
      } else {
        //finds all specief GO terms

        const neighborService = new NeighborService(getDriver());

        var neighborData = await neighborService.getNeighbor(goTerm, species);
        neighborData = neighborParser(neighborData);

        console.log(neighborData.length);
        if (neighborData.length == 0) {
          console.log("No direct proteins connected to GO term for this species");
          res
            .status(404)
            .send({ error: "No direct proteins connected to GO term for this species" });
        } else {
          //DO this to all GOterm
          const queryService = new QueryService(getDriver());
          const queryResult = await queryService.getQuery(
            species,
            protein,
            goTerm,
            k
          );

          if (queryResult.length === 0) {
            console.log(
              "No paths connecting protein of interest to nearby proteins labeled with the GO term."
            );
            res.status(404).send({
              error:
                "No paths connecting protein of interest to nearby proteins labeled with the GO term.",
            });
          } else {
            res.status(200).json(queryResult);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in /getQuery:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/getQueryByNode", jsonParser, async (req, res, next) => {
  const data = req.body;
  const species = data.species;
  const protein = data.protein;
  const goTerm = data.goTerm;
  const k = data.k;

  console.log("Species:", species);
  console.log("Protein:", protein);
  console.log("GO Term:", goTerm);
  console.log("k:", k);
  console.log("getQueryByNode");

  try {
    const proteinFinderService = new ProteinFinderService(getDriver());
    var sourceProtein = await proteinFinderService.getProteinFinder(
      protein,
      species
    );

    if (sourceProtein == "") {
      console.log("Source protein not found.");
      res.status(404).send({ error: "Source protein not found." });
    } else {
      const goFinderService = new GoFinderService(getDriver());
      var goResult = await goFinderService.getGoFinder(goTerm);
      if (goResult == "") {
        console.log("GO term not found.");
        res.status(404).send({ error: "GO term not found." });
      } else {
        //find the neighbor of all the associated GO terms
        const neighborService = new NeighborService(getDriver());

        var neighborData = await neighborService.getNeighbor(goTerm, species);
        neighborData = neighborParser(neighborData);

        console.log(neighborData.length);
        if (neighborData.length == 0) {
          console.log("No direct proteins connected to GO term for this species");
          res
            .status(404)
            .send({ error: "No direct proteins connected to GO term for this species" });
        } else {
          const allShortestPathsService = new AllShortestPathsService(
            getDriver()
          );
          var allPaths = await allShortestPathsService.getAllShortestPaths(
            protein
          );
          let neighborFound = 0;
          var paths = [];
          for (let i = 0; i < allPaths.length; i++) {
            if (neighborData.includes(allPaths[i]._fields[2])) {
              neighborFound++;
              console.log("FOUND", allPaths[i]._fields[2]);
              paths.push(allPaths[i]._fields[3]);
            }
          }
          if (paths.length == 0) {
            console.log(
              "No paths connecting protein of interest to nearby proteins labeled with the GO term."
            );
            res.status(404).send({
              error:
                "No paths connecting protein of interest to nearby proteins labeled with the GO term.",
            });
          } else {
            console.log("Neighbors found: ", neighborFound);
            console.log("Neighbors total: ", neighborData.length);

            const goNodeService = new GoNodeService(getDriver());
            var goTermNode = await goNodeService.getGoNode(goTerm);
            paths.push(goTermNode);

            res.json(paths);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in /getQuery:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
