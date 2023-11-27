import { VeraxSdk } from "../../src/VeraxSdk";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

// This example relies on a complex Schema written by Clique
console.log(
  veraxSdk.utils.encode(
    "((string type, ((string name, uint256 count)[] GameGenres, (string name, uint256 count)[] GameSetting, (string name, uint256 count)[] PlayStyle) items, (string type, (string level, string hoursPlayedSteam) items) subHoursPlayedSteam, (string type, (string topTag, string hoursSteam) items) gameGenresTopTagByHoursSteam, (string type, (string playstyle, string hoursSteam) items) playstyleTopTagByHoursSteam, string sumHourByTop10GamesSteam) userGamingPieChartSteam)",
    [
      {
        userGamingPieChartSteam: {
          type: "RPG",
          items: {
            GameGenres: [
              {
                name: "gamegenre",
                count: 123,
              },
            ],
            GameSetting: [
              {
                name: "setting1",
                count: 124,
              },
            ],
            PlayStyle: [
              {
                name: "playStyle",
                count: 125,
              },
            ],
          },
          subHoursPlayedSteam: {
            type: "typeSubHoursPlayedSteam",
            items: {
              level: ">9999",
              hoursPlayedSteam: "125",
            },
          },
          gameGenresTopTagByHoursSteam: {
            type: "typegameGenresTopTagByHoursSteam",
            items: {
              topTag: "topTag",
              hoursSteam: "1268",
            },
          },
          playstyleTopTagByHoursSteam: {
            type: "typeplaystyleTopTagByHoursSteam",
            items: {
              playstyle: "playstyle",
              hoursSteam: "125874",
            },
          },
          sumHourByTop10GamesSteam: "125896541",
        },
      },
    ],
  ),
);
