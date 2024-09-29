import {
  AoContractClient,
  createAoContractClient,
} from "./aoContractClient";

import { ChatMessageCreate, ChatMessageHistory } from "./model";
import { AoWallet } from "@/features/ao/lib/aoWallet";


import { createDataItemSigner, dryrun,connect } from "@permaweb/aoconnect";

const  MessageId='t6T5n-P4Na30i8g08M2dGOGFM2b7iqApkQJXgvl_fwk';
const result = await dryrun({
  process: 't6T5n-P4Na30i8g08M2dGOGFM2b7iqApkQJXgvl_fwk',
  data: '',
  tags: [{name: 'Action', value: 'Check-Health'}]
  });

console.log(result.Messages[0]);


type HistoryQuery = {
  idAfter?: number;
  idBefore?: number;
  timeStart?: Date;
  timeEnd?: Date;
  limit?: number;
};

export type ChatClient = {
  aoContractClient: AoContractClient;

  // Reads
  readCount(): Promise<number>;
  readHistory(query?: HistoryQuery): Promise<ChatMessageHistory>;

  // Writes
  postMessage(message: ChatMessageCreate): Promise<MessageId>;
};

// Placeholder
// TODO: Define these methods properly
export const createChatClient = (
  aoContractClient: AoContractClient,
): ChatClient => ({
  aoContractClient: aoContractClient,

  // Read
  readCount: () =>
    aoContractClient
      .dryrunReadReplyOne({
        tags: [{ name: "Action", value: "ChatCount" }],
      })
      .then((reply) => parseInt(reply.Data)),
  readHistory: (query?: HistoryQuery) => {
    const queryTagsMap = {
      "N": 10,

    };
    const filterTags = Object.entries(queryTagsMap)
      .filter(([, value]) => value !== undefined)
      .map(([name, value]) => ({ name, value: value! }));
    const tags = filterTags.concat({ name: "Action", value: "ChatHistory" });

    return aoContractClient.dryrunReadReplyOneJson<ChatMessageHistory>({
      tags,
    });
  },

  // Write
  postMessage: (chatMessage: ChatMessageCreate) =>
    aoContractClient.message({
      tags: [
        {
          name: "Action",
          value: "Send-Message",
        },
        {
          name: "Name",
          value: chatMessage.Name,
        },
      ],
      data: chatMessage.Content,
    }),
});

export const createChatClientForProcess =
  (wallet: AoWallet) => (processId: string) => {
    const aoContractClient = createAoContractClient(
      processId,
      connect(),
      wallet,
    );
    return createChatClient(aoContractClient);
  };

export type ChatClientForProcess = ReturnType<
  typeof createChatClientForProcess
>;
