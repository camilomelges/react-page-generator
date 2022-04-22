export const pageName = "Report1";

export const fields = [
  {
    value: "portfolio",
    label: "Portfolio:",
    defaultValue: "GLEA",
    inputType: "text",
  },
  {
    value: "businessUnit",
    label: "Business Unit:",
    defaultValue: "CVT",
    inputType: "select",
    listField: "businessUnitModel",
  },
  {
    value: "businessUnitModel",
    defaultValue: ["CVT", "XPTO", "NOT"],
  },
];

export const apiPath = "test/test";

export const tabs = [
  {
    value: "test0",
    label: "label of Test0",
    variableToConcatInLabel: "fromDate",
    subTabs: [
      {
        value: "test00",
        label: "label of Test00",
        subTabs: [
          {
            value: "test000",
            label: "label of Test000",
            headers: [
              {
                value: "test000Header0",
                label: "label of Test000Header0",
                variableToConcatInLabel: "fromDate",
              },
              {
                value: "test000Header1",
                label: "label of Test000Header1",
              },
            ],
            groupHeaders: ["test000Header0", "test000Header1"],
            sumHeaders: ["test000Header0", "test000Header1"],
            hiddenHeaders: ["test000Header0", "test000Header1"],
          },
          {
            value: "test001",
            label: "label of Test001",
            headers: [
              {
                value: "test001Header0",
                label: "label of Test001Header0",
              },
              {
                value: "test001Header1",
                label: "label of Test001Header1",
              },
            ],
            groupHeaders: ["test001Header0", "test001Header1"],
            sumHeaders: ["test001Header0", "test001Header1"],
            hiddenHeaders: ["test001Header0", "test001Header1"],
          },
        ],
      },
      {
        value: "test01",
        label: "label of Test01",
        subTabs: [
          {
            value: "test010",
            label: "label of Test010",
            headers: [
              {
                value: "test010Header0",
                label: "label of Test010Header0",
              },
              {
                value: "test010Header1",
                label: "label of Test010Header1",
              },
            ],
            groupHeaders: ["test010Header0", "test010Header1"],
            sumHeaders: ["test010Header0", "test010Header1"],
            hiddenHeaders: ["test010Header0", "test010Header1"],
          },
          {
            value: "test011",
            label: "label of Test011",
            headers: [
              {
                value: "test011Header0",
                label: "label of Test011Header0",
              },
              {
                value: "test011Header1",
                label: "label of Test011Header1",
              },
            ],
            groupHeaders: ["test011Header0", "test011Header1"],
            sumHeaders: ["test011Header0", "test011Header1"],
            hiddenHeaders: ["test011Header0", "test011Header1"],
          },
        ],
      },
    ],
  },
  {
    value: "test2",
    label: "label of Test2",
    subTabs: [
      {
        value: "test20",
        label: "label of Test20",
        subTabs: [
          {
            value: "test200",
            label: "label of Test200",
            headers: [
              {
                value: "test200Header0",
                label: "label of Test200Header0",
                variableToConcatInLabel: "fromDate",
              },
              {
                value: "test200Header1",
                label: "label of Test200Header1",
                variableToConcatInLabel: "fromDate",
              },
            ],
            groupHeaders: ["test200Header0", "test200Header1"],
            sumHeaders: ["test200Header0", "test200Header1"],
            hiddenHeaders: ["test200Header0", "test200Header1"],
          },
          {
            value: "test201",
            label: "label of Test201",
            headers: [
              {
                value: "test201Header0",
                label: "label of Test201Header0",
                variableToConcatInLabel: "fromDate",
              },
              {
                value: "test201Header1",
                label: "label of Test201Header1",
                variableToConcatInLabel: "toDate",
              },
            ],
            groupHeaders: ["test201Header0", "test201Header1"],
            sumHeaders: ["test201Header0", "test201Header1"],
            hiddenHeaders: ["test201Header0", "test201Header1"],
          },
        ],
      },
      {
        value: "test21",
        label: "label of Test21",
        subTabs: [
          {
            value: "test210",
            label: "label of Test210",
            headers: [
              {
                value: "test210Header0",
                label: "label of Test210Header0",
              },
              {
                value: "test210Header1",
                label: "label of Test210Header1",
              },
            ],
            groupHeaders: ["test210Header0", "test210Header1"],
            sumHeaders: ["test210Header0", "test210Header1"],
            hiddenHeaders: ["test210Header0", "test210Header1"],
          },
          {
            value: "test211",
            label: "label of Test211",
            headers: [
              {
                value: "test211Header0",
                label: "label of Test211Header0",
              },
              {
                value: "test211Header1",
                label: "label of Test211Header1",
              },
            ],
            groupHeaders: ["test211Header0", "test211Header1"],
            sumHeaders: ["test211Header0", "test211Header1"],
            hiddenHeaders: ["test211Header0", "test211Header1"],
          },
        ],
      },
    ],
  },
];
