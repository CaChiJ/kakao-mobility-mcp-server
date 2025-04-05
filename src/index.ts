import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
dotenv.config();

import { directionSearchByCoordinatesSchema, directionSearchByCoordinatesHandler } from "./tools/directionSearchByCoordinates.js";
import { directionSearchByAddressSchema, directionSearchByAddressHandler } from "./tools/directionSearchByAddress.js";
import { addressSearchByPlaceNameSchema, addressSearchByPlaceNameHandler } from "./tools/addressSearchByPlaceName.js";
import { geocodeSchema, geocodeHandler } from "./tools/geocode.js";
import { futureDirectionSearchByCoordinatesSchema, futureDirectionSearchByCoordinatesHandler } from "./tools/futureDirectionSearchByCoordinates.js";
import { multiDestinationDirectionSearchSchema, multiDestinationDirectionSearchHandler } from "./tools/multiDestinationDirectionSearch.js";

// Create an MCP server
const server = new McpServer({
  name: "Traffic Data MCP Server",
  version: "1.0.2",
});

// Register tools
server.tool(
  "direction_search_by_coordinates",
  "Search for directions between two points using their coordinates (longitude and latitude). This tool provides navigation information including distance, duration, and route details.",
  directionSearchByCoordinatesSchema,
  directionSearchByCoordinatesHandler
);

server.tool(
  "direction_search_by_address",
  "Search for directions between two locations using their addresses. The tool first geocodes the addresses to coordinates, then finds the optimal route between them.",
  directionSearchByAddressSchema,
  directionSearchByAddressHandler
);

server.tool(
  "address_search_by_place_name",
  "Search for addresses using a place name or keyword. Returns detailed location information including coordinates and address details.",
  addressSearchByPlaceNameSchema,
  addressSearchByPlaceNameHandler
);

server.tool(
  "geocode",
  "Convert an address into geographic coordinates (geocoding). Returns the exact location coordinates and address details for the given place name.",
  geocodeSchema,
  geocodeHandler
);

server.tool(
  "future_direction_search_by_coordinates",
  "Search for directions with future departure time. Provides navigation information considering traffic predictions for a specific future time. Supports various options like waypoints, route preferences, and vehicle details.",
  futureDirectionSearchByCoordinatesSchema,
  futureDirectionSearchByCoordinatesHandler
);

server.tool(
  "multi_destination_direction_search",
  "Search for directions between a starting point and multiple destinations with coordinates. Returns a summary of the route including distance, duration, and route details. For detailed route information, additional calls to the car navigation API are required.",
  multiDestinationDirectionSearchSchema,
  multiDestinationDirectionSearchHandler
);


(async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
