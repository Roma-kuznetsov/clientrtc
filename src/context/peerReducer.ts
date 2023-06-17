import { ADD_PEER, REMOVE_PEER } from "./peerActions";

export type PeerState = Record<string, { stream: MediaStream }>;
type PeerActions =
  | {
      type: typeof ADD_PEER;
      payload: { peerId: string; stream: MediaStream };
    }
  | {
      type: typeof REMOVE_PEER;
      payload: { peerId: string };
    };

export const peersReducer = (state: PeerState, action: PeerActions) => {
  switch (action.type) {
    case ADD_PEER:
      console.log("ADD_PEER");
      return {
        ...state,
        [action.payload.peerId]: {
          stream: action.payload.stream,
        },
      };
    case REMOVE_PEER:
      console.log("REMOVE_PEER");
      const { [action.payload.peerId]: deleted, ...rest } = state;
      return rest;

    default:
      return { ...state };
  }
};
