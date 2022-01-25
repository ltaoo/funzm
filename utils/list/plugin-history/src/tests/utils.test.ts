import dayjs from "dayjs";
import qs from "qs";

import { params2Search, search2Params } from "../utils";

describe("1. params transform before save to url", () => {
  it("only page and pageSize", () => {
    const curParams = {
      page: 1,
      pageSize: 10,
    };

    const queryString = params2Search(curParams);

    expect(queryString).toBe("?page=1&pageSize=10");
  });

  it("has extra query", () => {
    const curParams = {
      page: 1,
      pageSize: 10,
    };

    const queryString = params2Search(curParams, { sc: "baidu" });

    expect(queryString).toBe("?sc=baidu&page=1&pageSize=10");
  });

  it("include a simple search field", () => {
    const curParams = {
      page: 1,
      pageSize: 10,
      name: "test",
    };

    const queryString = params2Search(curParams);

    expect(queryString).toBe(
      "?page=1&pageSize=10&search=%257B%2522name%2522%253A%2522test%2522%257D"
    );
    expect(
      decodeURIComponent(
        qs.parse(queryString, { ignoreQueryPrefix: true }).search as string
      )
    ).toBe('{"name":"test"}');
  });

  it("include a search field that has the object value", () => {
    const curParams = {
      page: 1,
      pageSize: 10,
      name: "test",
      tags: {
        logic: "or",
        list: [
          {
            id: 2,
            name: "和田玉",
          },
        ],
      },
    };

    const queryString = params2Search(curParams);

    expect(queryString).toBe(
      "?page=1&pageSize=10&search=%257B%2522name%2522%253A%2522test%2522%252C%2522tags%2522%253A%257B%2522logic%2522%253A%2522or%2522%252C%2522list%2522%253A%255B%257B%2522id%2522%253A2%252C%2522name%2522%253A%2522%25E5%2592%258C%25E7%2594%25B0%25E7%258E%2589%2522%257D%255D%257D%257D"
    );
    expect(
      decodeURIComponent(
        qs.parse(queryString, { ignoreQueryPrefix: true }).search as string
      )
    ).toBe(
      '{"name":"test","tags":{"logic":"or","list":[{"id":2,"name":"和田玉"}]}}'
    );
  });

  it("include date range field", () => {
    const curParams = {
      page: 1,
      pageSize: 10,
      searchTime: [dayjs("2021/01/01"), dayjs("2021/01/02")],
    };

    const search = params2Search(curParams);

    expect(search).toBe(
      "?page=1&pageSize=10&search=%257B%2522searchTime%2522%253A%255B1609430400%252C1609516800%255D%257D"
    );
    expect(
      decodeURIComponent(
        qs.parse(search, { ignoreQueryPrefix: true }).search as string
      )
    ).toBe('{"searchTime":[1609430400,1609516800]}');
  });
});

describe("2. parse query", () => {
  it("only page and pageSize", () => {
    const search = "?page=1&pageSize=10";

    const query = search2Params(search);

    expect(query).toEqual({
      page: 1,
      pageSize: 10,
    });
  });

  it("include a simple search field", () => {
    const search =
      "?page=1&pageSize=10&search=%257B%2522name%2522%253A%2522test%2522%257D";

    const query = search2Params(search);

    expect(query).toEqual({
      page: 1,
      pageSize: 10,
      name: "test",
    });
  });

  it("include a search field that has the object value", () => {
    const search =
      "?page=1&pageSize=10&search=%257B%2522name%2522%253A%2522test%2522%252C%2522tags%2522%253A%257B%2522logic%2522%253A%2522or%2522%252C%2522list%2522%253A%255B%257B%2522id%2522%253A2%252C%2522name%2522%253A%2522%25E5%2592%258C%25E7%2594%25B0%25E7%258E%2589%2522%257D%255D%257D%257D";

    const query = search2Params(search);

    expect(query).toEqual({
      page: 1,
      pageSize: 10,
      name: "test",
      tags: {
        logic: "or",
        list: [
          {
            id: 2,
            name: "和田玉",
          },
        ],
      },
    });
  });

  it("include date range field", () => {
    const search =
      "?page=1&pageSize=10&search=%257B%2522searchTime%2522%253A%255B1609430400%252C1609516800%255D%257D";

    const query = search2Params(search);

    expect(query).toEqual({
      page: 1,
      pageSize: 10,
      searchTime: [dayjs("2021/01/01"), dayjs("2021/01/02")],
    });
  });
});
