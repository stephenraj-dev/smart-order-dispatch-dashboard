import { riders } from "../data/rider";

const nearestZones: Record<
  string,
  string[]
> = {
  "Anna Nagar": [
    "KK Nagar",
    "T Nagar"
  ],
  "KK Nagar": [
    "Anna Nagar",
    "T Nagar"
  ],
  "T Nagar": [
    "KK Nagar",
    "Anna Nagar"
  ]
};

export const assignRider = (
  pickupZone: string,
  priority: "normal" | "urgent"
) => {

  let candidates = riders.filter(
    rider =>
      rider.zone === pickupZone &&
      rider.status !== "offline"
  );

  if (candidates.length === 0) {

    const nearby =
      nearestZones[pickupZone];

    for (const zone of nearby) {

      candidates = riders.filter(
        rider =>
          rider.zone === zone &&
          rider.status !== "offline"
      );

      if (candidates.length) {
        break;
      }
    }
  }

  if (!candidates.length) {
    return null;
  }

  let selected;

  if (priority === "urgent") {

    selected = candidates.sort(
      (a, b) =>
        a.activeOrders -
        b.activeOrders
    )[0];

  } else {

    selected =
      candidates.find(
        rider =>
          rider.status ===
          "available"
      ) || candidates[0];
  }

  selected.activeOrders++;

  selected.status = "busy";

  return selected;
};